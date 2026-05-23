import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type LazyImageWithSkeletonProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  skeletonClassName?: string;
};

const LazyImageWithSkeleton: React.FC<LazyImageWithSkeletonProps> = ({
  className,
  skeletonClassName,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);

  return (
    <>
      {!isLoaded && (
        <Skeleton
          className={cn("absolute inset-0 h-full w-full rounded-none", skeletonClassName)}
        />
      )}
      <img
        {...props}
        className={cn(
          className,
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
        )}
        onLoad={(event) => {
          setIsLoaded(true);
          onLoad?.(event);
        }}
        onError={(event) => {
          setIsLoaded(true);
          onError?.(event);
        }}
      />
    </>
  );
};

export default LazyImageWithSkeleton;
