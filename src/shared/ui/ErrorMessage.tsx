import React from 'react';
import { Button } from './Button';
import { Alert, AlertDescription } from './Alert';
import { cn } from '../lib/cn';
import { ExclamationIcon } from '../../assets/icons/index';

type ErrorMessageProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
};

export function ErrorMessage({
  title = 'Something went wrong',
  message,
  onRetry,
  retryText = 'Try again',
  className = '',
}: ErrorMessageProps) {
  return (
    <section className={cn('text-center p-6', className)} role="alert" aria-live="assertive">
      <Alert variant="destructive" className="max-w-md mx-auto">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4" aria-hidden="true">
          <ExclamationIcon />
        </div>
        <AlertDescription>
          <h2 className="text-lg font-medium text-gray-900 mb-2">{title}</h2>
          <p className="text-sm text-gray-600 mb-4">{message}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="primary">
              {retryText}
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </section>
  );
}
