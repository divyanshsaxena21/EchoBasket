// src/components/common/SkeletonLoader.tsx

import React from 'react';

interface SkeletonLoaderProps {
  count?: number;
  height?: string;
  width?: string;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count = 1,
  height = 'h-12',
  width = 'w-full',
  className = '',
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${width} ${height} bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse ${className}`}
        />
      ))}
    </>
  );
};
