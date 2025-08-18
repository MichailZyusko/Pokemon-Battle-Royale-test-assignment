/* eslint-disable react/no-array-index-key */

import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { cn } from '../lib/cn';
import { Card, CardContent, CardHeader } from './Card';

type SkeletonLoaderProps = {
  width?: number | string;
  height?: number | string;
  className?: string;
  circle?: boolean;
  borderRadius?: number;
};

// Basic Skeleton component with fallback styling
export function SkeletonLoader({
  width,
  height,
  className = '',
  circle = false,
  borderRadius,
}: SkeletonLoaderProps) {
  return (
    <div className={cn('relative', className)}>
      <Skeleton
        width={width}
        height={height}
        circle={circle}
        borderRadius={borderRadius}
        baseColor="#f3f4f6"
        highlightColor="#e5e7eb"
      />
    </div>
  );
}

type PokemonCardSkeletonProps = {
  className?: string;
};

// Pokemon Card Skeleton
export function PokemonCardSkeleton({ className = '' }: PokemonCardSkeletonProps) {
  return (
    <Card className={cn('max-w-md', className)}>
      <CardContent className="text-center">
        <SkeletonLoader circle width={120} height={120} className="mx-auto mb-4" />
        <CardHeader className="p-0">
          <SkeletonLoader height={24} width={150} className="mx-auto mb-2" />
        </CardHeader>
        <SkeletonLoader height={16} width={100} className="mx-auto mb-4" />

        <div className="space-y-3">
          <SkeletonLoader height={16} width="100%" />
          <SkeletonLoader height={16} width="80%" />
          <SkeletonLoader height={16} width="90%" />
          <SkeletonLoader height={16} width="70%" />
        </div>

        <div className="mt-6">
          <SkeletonLoader height={40} width="100%" borderRadius={8} />
        </div>
      </CardContent>
    </Card>
  );
}

type BattleArenaSkeletonProps = {
  pokemonCount?: number;
  className?: string;
};

// Battle Arena Skeleton
export function BattleArenaSkeleton({ pokemonCount = 3, className = '' }: BattleArenaSkeletonProps) {
  return (
    <div className={cn('flex flex-col md:flex-row items-center justify-center gap-8', className)}>
      {Array.from({ length: pokemonCount }).map((_, index) => (
        <React.Fragment key={`pokemon-skeleton-${index}`}>
          <PokemonCardSkeleton />
          {index < pokemonCount - 1 && (
            <div className="flex items-center justify-center px-4">
              <SkeletonLoader height={60} width={60} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

type VotingResultsSkeletonProps = {
  rowCount?: number;
  className?: string;
};

// Voting Results Table Skeleton
export function VotingResultsSkeleton({ rowCount = 5, className = '' }: VotingResultsSkeletonProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="border-b border-gray-200">
        <SkeletonLoader height={24} width={200} />
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200">
          {Array.from({ length: rowCount }).map((_, index) => (
            <div key={`row-skeleton-${index}`} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <SkeletonLoader circle width={32} height={32} />
                  <SkeletonLoader height={20} width={120} />
                </div>
                <div className="flex items-center space-x-4">
                  <SkeletonLoader height={20} width={60} />
                  <SkeletonLoader height={20} width={80} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

type PageLoadingSkeletonProps = {
  className?: string;
};

// Page Loading Skeleton
export function PageLoadingSkeleton({ className = '' }: PageLoadingSkeletonProps) {
  return (
    <div className={cn('min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6', className)}>
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <div className="text-center mb-8">
          <SkeletonLoader height={48} width={400} className="mx-auto mb-2" />
          <SkeletonLoader height={24} width={300} className="mx-auto" />
        </div>

        {/* Battle Arena Skeleton */}
        <BattleArenaSkeleton pokemonCount={3} className="mb-8" />

        {/* Controls Skeleton */}
        <div className="text-center space-y-4">
          <SkeletonLoader height={48} width={200} className="mx-auto" />
          <SkeletonLoader height={48} width={150} className="mx-auto" />
        </div>
      </div>
    </div>
  );
}

// Button Skeleton
type ButtonSkeletonProps = {
  size?: 'small' | 'medium' | 'large';
  className?: string;
};

export function ButtonSkeleton({ size = 'medium', className = '' }: ButtonSkeletonProps) {
  const heightClasses = {
    small: 'h-8',
    medium: 'h-10',
    large: 'h-12',
  };

  const widthClasses = {
    small: 'w-20',
    medium: 'w-24',
    large: 'w-32',
  };

  return (
    <SkeletonLoader
      height={heightClasses[size]}
      width={widthClasses[size]}
      className={cn('rounded-lg', className)}
    />
  );
}

// Text Skeleton
type TextSkeletonProps = {
  lines?: number;
  className?: string;
};

export function TextSkeleton({ lines = 1, className = '' }: TextSkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonLoader
          key={`text-line-${index}`}
          height={16}
          width={index === lines - 1 ? '80%' : '100%'}
        />
      ))}
    </div>
  );
}
