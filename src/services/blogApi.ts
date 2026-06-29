// API service for blog interactions
import { getToken } from "./gspApi";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://forestial-afocal-rex.ngrok-free.dev";
const LOCAL_LIKES_KEY = "kc_blog_likes_v2";
const LOCAL_COMMENTS_KEY = "kc_blog_comments_v2";

export interface BlogLike {
  postId: string;
  userId: string;
  created_at: string;
}

export interface BlogComment {
  _id: string;
  postId: string;
  userId: string;
  author: string;
  content: string;
  status?: "pending" | "approved" | "rejected";
  parentId?: string;
  likes: number;
  created_at: string;
  updated_at?: string;
  replies?: BlogComment[];
  replyCount?: number;
}

export interface BlogLikeResponse {
  liked: boolean;
  likeCount: number;
}

export interface BlogCommentsResponse {
  comments: BlogComment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

function readJson<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "") as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function normalizeComment(raw: any, postId: string): BlogComment {
  return {
    _id: String(
      raw?._id ||
        raw?.id ||
        `comment_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    ),
    postId: String(raw?.postId || raw?.post_id || raw?.blogId || postId),
    userId: String(raw?.userId || raw?.user_id || raw?.authorId || ""),
    author: String(raw?.author || raw?.authorName || raw?.name || "Guest"),
    content: String(raw?.content || raw?.comment || raw?.body || ""),
    status: raw?.status || (raw?.approved === false ? "pending" : "approved"),
    parentId: raw?.parentId || raw?.parent_id,
    likes: Number(raw?.likes || raw?.likeCount || 0),
    created_at: raw?.created_at || raw?.createdAt || new Date().toISOString(),
    updated_at: raw?.updated_at || raw?.updatedAt,
    replies: Array.isArray(raw?.replies)
      ? raw.replies.map((reply: any) => normalizeComment(reply, postId))
      : undefined,
    replyCount: Number(raw?.replyCount || raw?.reply_count || 0),
  };
}

function localLikeStatus(
  postId: string,
  userId?: string,
): { likeCount: number; isLiked: boolean } {
  const likes = readJson<Record<string, string[]>>(LOCAL_LIKES_KEY, {});
  const users = likes[postId] || [];
  return {
    likeCount: users.length,
    isLiked: Boolean(userId && users.includes(userId)),
  };
}

function localToggleLike(
  postId: string,
  userId: string,
  isCurrentlyLiked: boolean,
): BlogLikeResponse {
  const likes = readJson<Record<string, string[]>>(LOCAL_LIKES_KEY, {});
  const users = new Set(likes[postId] || []);
  if (isCurrentlyLiked) users.delete(userId);
  else users.add(userId);
  likes[postId] = Array.from(users);
  writeJson(LOCAL_LIKES_KEY, likes);
  return { liked: users.has(userId), likeCount: users.size };
}

function localComments(
  postId: string,
  page: number,
  limit: number,
  userId?: string,
): BlogCommentsResponse {
  const all = readJson<Record<string, BlogComment[]>>(LOCAL_COMMENTS_KEY, {});
  const visible = (all[postId] || []).filter(
    (comment) =>
      comment.status === "approved" || (userId && comment.userId === userId),
  );
  return {
    comments: visible.slice((page - 1) * limit, page * limit),
    pagination: {
      page,
      limit,
      total: visible.length,
      pages: Math.max(1, Math.ceil(visible.length / limit)),
    },
  };
}

// Like/Unlike a blog post
export const toggleBlogLike = async (
  postId: string,
  userId: string,
  isCurrentlyLiked: boolean,
): Promise<BlogLikeResponse> => {
  try {
    const endpoint = isCurrentlyLiked ? "DELETE" : "POST";
    const response = await fetch(`${API_BASE_URL}/api/blog/${postId}/like`, {
      method: endpoint,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error toggling blog like:", error);
    return localToggleLike(postId, userId, isCurrentlyLiked);
  }
};

// Get like status and count for a blog post
export const getBlogLikeStatus = async (
  postId: string,
  userId?: string,
): Promise<{ likeCount: number; isLiked: boolean }> => {
  try {
    const params = userId ? `?userId=${userId}` : "";
    const response = await fetch(
      `${API_BASE_URL}/api/blog/${postId}/likes${params}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting blog like status:", error);
    return localLikeStatus(postId, userId);
  }
};

// Get comments for a blog post
export const getBlogComments = async (
  postId: string,
  page: number = 1,
  limit: number = 10,
  userId?: string,
): Promise<BlogCommentsResponse> => {
  try {
    const userParam = userId ? `&userId=${encodeURIComponent(userId)}` : "";
    const response = await fetch(
      `${API_BASE_URL}/api/blog/${postId}/comments?page=${page}&limit=${limit}${userParam}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const rawComments = Array.isArray(data)
      ? data
      : data.comments || data.results || [];
    const comments = rawComments.map((comment: any) =>
      normalizeComment(comment, postId),
    );
    const total = data.pagination?.total ?? data.count ?? comments.length;
    return {
      comments,
      pagination: data.pagination || {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  } catch (error) {
    console.error("Error getting blog comments:", error);
    return localComments(postId, page, limit, userId);
  }
};

// Add a comment to a blog post
export const addBlogComment = async (
  postId: string,
  userId: string,
  author: string,
  content: string,
  parentId?: string,
): Promise<BlogComment> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/blog/${postId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          author,
          content,
          parentId,
          status: "pending",
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`,
      );
    }

    return normalizeComment(await response.json(), postId);
  } catch (error) {
    console.error("Error adding blog comment:", error);
    const all = readJson<Record<string, BlogComment[]>>(LOCAL_COMMENTS_KEY, {});
    const comment: BlogComment = {
      _id: `local_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      postId,
      userId,
      author,
      content,
      parentId,
      status: "pending",
      likes: 0,
      created_at: new Date().toISOString(),
    };
    all[postId] = [comment, ...(all[postId] || [])];
    writeJson(LOCAL_COMMENTS_KEY, all);
    return comment;
  }
};

// Update a comment
export const updateBlogComment = async (
  commentId: string,
  userId: string,
  content: string,
): Promise<BlogComment> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/blog/comments/${commentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          content,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating blog comment:", error);
    const all = readJson<Record<string, BlogComment[]>>(LOCAL_COMMENTS_KEY, {});
    for (const postId of Object.keys(all)) {
      const idx = all[postId].findIndex(
        (comment) => comment._id === commentId && comment.userId === userId,
      );
      if (idx !== -1) {
        all[postId][idx] = {
          ...all[postId][idx],
          content,
          status: "pending",
          updated_at: new Date().toISOString(),
        };
        writeJson(LOCAL_COMMENTS_KEY, all);
        return all[postId][idx];
      }
    }
    throw error;
  }
};

// Delete a comment
export const deleteBlogComment = async (
  commentId: string,
  userId: string,
): Promise<{ deleted: boolean }> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/blog/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting blog comment:", error);
    const all = readJson<Record<string, BlogComment[]>>(LOCAL_COMMENTS_KEY, {});
    for (const postId of Object.keys(all)) {
      const next = all[postId].filter(
        (comment) => !(comment._id === commentId && comment.userId === userId),
      );
      if (next.length !== all[postId].length) {
        all[postId] = next;
        writeJson(LOCAL_COMMENTS_KEY, all);
        return { deleted: true };
      }
    }
    throw error;
  }
};

export const adminGetBlogComments = async (
  status: "pending" | "approved" | "rejected" | "all" = "pending",
): Promise<{ comments: BlogComment[] }> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/blog/comments?status=${status}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const rawComments = Array.isArray(data)
      ? data
      : data.comments || data.results || [];
    return {
      comments: rawComments.map((comment: any) =>
        normalizeComment(comment, comment?.postId || comment?.post_id || ""),
      ),
    };
  } catch (error) {
    console.error("Error loading admin blog comments:", error);
    const all = readJson<Record<string, BlogComment[]>>(LOCAL_COMMENTS_KEY, {});
    const comments = Object.values(all)
      .flat()
      .filter((comment) => status === "all" || comment.status === status);
    return { comments };
  }
};

export const adminModerateBlogComment = async (
  commentId: string,
  status: "approved" | "rejected",
): Promise<BlogComment> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/blog/comments/${commentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({ status, approved: status === "approved" }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          errorData.message ||
          `HTTP error! status: ${response.status}`,
      );
    }

    const data = await response.json();
    return normalizeComment(
      data.comment || data,
      data.comment?.postId || data.postId || "",
    );
  } catch (error) {
    console.error("Error moderating blog comment:", error);
    const all = readJson<Record<string, BlogComment[]>>(LOCAL_COMMENTS_KEY, {});
    for (const postId of Object.keys(all)) {
      const idx = all[postId].findIndex((comment) => comment._id === commentId);
      if (idx !== -1) {
        all[postId][idx] = {
          ...all[postId][idx],
          status,
          updated_at: new Date().toISOString(),
        };
        writeJson(LOCAL_COMMENTS_KEY, all);
        return all[postId][idx];
      }
    }
    throw error;
  }
};

/* ====================================================================
 * ADMIN BLOG POST MANAGEMENT
 * ==================================================================== */

export interface AdminBlogPost {
  _id: string;
  id: string; // slug used in routing
  title: string;
  excerpt: string;
  content: string; // HTML from rich text editor
  date: string; // ISO string
  author: string;
  cover?: string;
  dp?: string;
  tags: string[];
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateBlogPostPayload = Omit<
  AdminBlogPost,
  "_id" | "createdAt" | "updatedAt"
>;

const LOCAL_BLOG_POSTS_KEY = "kc_admin_blog_posts_v1";

function readLocalBlogPosts(): AdminBlogPost[] {
  try {
    return JSON.parse(
      localStorage.getItem(LOCAL_BLOG_POSTS_KEY) || "[]",
    ) as AdminBlogPost[];
  } catch {
    return [];
  }
}

function writeLocalBlogPosts(posts: AdminBlogPost[]) {
  try {
    localStorage.setItem(LOCAL_BLOG_POSTS_KEY, JSON.stringify(posts));
  } catch {}
}

/** Fetch all blog posts (published + drafts for admin) */
export async function adminGetBlogPosts(): Promise<AdminBlogPost[]> {
  try {
    const resp = await fetch(`${API_BASE_URL}/api/admin/blog/posts`, {
      headers: { "Content-Type": "application/json", ...authHeaders() },
    });
    if (!resp.ok) throw new Error("Failed to load blog posts");
    const data = await resp.json();
    return Array.isArray(data) ? data : data.posts || [];
  } catch (error) {
    console.error("adminGetBlogPosts fallback to local:", error);
    return readLocalBlogPosts();
  }
}

/** Fetch published blog posts for the public blog page */
export async function getPublishedBlogPosts(): Promise<AdminBlogPost[]> {
  try {
    const resp = await fetch(`${API_BASE_URL}/api/blog-posts`);
    if (!resp.ok) throw new Error("Failed to load published blog posts");
    const data = await resp.json();
    return Array.isArray(data) ? data : data.posts || [];
  } catch (error) {
    console.error("getPublishedBlogPosts fallback to local:", error);
    return readLocalBlogPosts().filter((p) => p.published);
  }
}

/** Fetch a single blog post by slug */
export async function getBlogPostBySlug(
  slug: string,
): Promise<AdminBlogPost | null> {
  try {
    const resp = await fetch(`${API_BASE_URL}/api/blog-posts/${slug}`);
    if (!resp.ok) throw new Error("Failed to load blog post");
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("getBlogPostBySlug error:", error);
    return readLocalBlogPosts().find((p) => p.id === slug) || null;
  }
}

/** Admin: Create a blog post */
export async function adminCreateBlogPost(
  payload: CreateBlogPostPayload,
): Promise<AdminBlogPost> {
  try {
    const resp = await fetch(`${API_BASE_URL}/api/admin/blog/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      throw new Error(
        errData.error || errData.message || "Create blog post failed",
      );
    }
    const data = await resp.json();
    const post = data.post || data;
    const local = readLocalBlogPosts();
    local.push(post);
    writeLocalBlogPosts(local);
    return post;
  } catch (error) {
    console.error("adminCreateBlogPost fallback:", error);
    const post: AdminBlogPost = {
      _id: `local_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      ...payload,
      createdAt: new Date().toISOString(),
    };
    const local = readLocalBlogPosts();
    local.push(post);
    writeLocalBlogPosts(local);
    return post;
  }
}

/** Admin: Update a blog post */
export async function adminUpdateBlogPost(
  postId: string,
  payload: Partial<CreateBlogPostPayload>,
): Promise<AdminBlogPost> {
  try {
    const resp = await fetch(`${API_BASE_URL}/api/admin/blog/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      throw new Error(
        errData.error || errData.message || "Update blog post failed",
      );
    }
    const data = await resp.json();
    return data.post || data;
  } catch (error) {
    console.error("adminUpdateBlogPost fallback:", error);
    const local = readLocalBlogPosts();
    const idx = local.findIndex((p) => p._id === postId);
    if (idx !== -1) {
      local[idx] = {
        ...local[idx],
        ...payload,
        updatedAt: new Date().toISOString(),
      };
      writeLocalBlogPosts(local);
      return local[idx];
    }
    throw error;
  }
}

/** Admin: Delete a blog post */
export async function adminDeleteBlogPost(
  postId: string,
): Promise<{ deleted: boolean }> {
  try {
    const resp = await fetch(`${API_BASE_URL}/api/admin/blog/posts/${postId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", ...authHeaders() },
    });
    if (!resp.ok) throw new Error("Delete blog post failed");
    const local = readLocalBlogPosts().filter((p) => p._id !== postId);
    writeLocalBlogPosts(local);
    return { deleted: true };
  } catch (error) {
    console.error("adminDeleteBlogPost fallback:", error);
    const local = readLocalBlogPosts().filter((p) => p._id !== postId);
    writeLocalBlogPosts(local);
    return { deleted: true };
  }
}
