// API service for blog interactions
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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

// Like/Unlike a blog post
export const toggleBlogLike = async (
  postId: string,
  userId: string,
  isCurrentlyLiked: boolean
): Promise<BlogLikeResponse> => {
  try {
    const endpoint = isCurrentlyLiked ? 'DELETE' : 'POST';
    const response = await fetch(`${API_BASE_URL}/api/blog/${postId}/like`, {
      method: endpoint,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error toggling blog like:', error);
    throw error;
  }
};

// Get like status and count for a blog post
export const getBlogLikeStatus = async (
  postId: string,
  userId?: string
): Promise<{ likeCount: number; isLiked: boolean }> => {
  try {
    const params = userId ? `?userId=${userId}` : '';
    const response = await fetch(`${API_BASE_URL}/api/blog/${postId}/likes${params}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting blog like status:', error);
    // Return default values if API fails
    return { likeCount: 0, isLiked: false };
  }
};

// Get comments for a blog post
export const getBlogComments = async (
  postId: string,
  page: number = 1,
  limit: number = 10
): Promise<BlogCommentsResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/blog/${postId}/comments?page=${page}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting blog comments:', error);
    // Return empty response if API fails
    return {
      comments: [],
      pagination: {
        page,
        limit,
        total: 0,
        pages: 0
      }
    };
  }
};

// Add a comment to a blog post
export const addBlogComment = async (
  postId: string,
  userId: string,
  author: string,
  content: string,
  parentId?: string
): Promise<BlogComment> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blog/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        author,
        content,
        parentId
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding blog comment:', error);
    throw error;
  }
};

// Update a comment
export const updateBlogComment = async (
  commentId: string,
  userId: string,
  content: string
): Promise<BlogComment> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blog/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        content
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating blog comment:', error);
    throw error;
  }
};

// Delete a comment
export const deleteBlogComment = async (
  commentId: string,
  userId: string
): Promise<{ deleted: boolean }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blog/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting blog comment:', error);
    throw error;
  }
};
