import { cn } from '../cn';

describe('cn utility function', () => {
  it('should merge simple class strings', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  it('should handle conditional classes with objects', () => {
    const isActive = true;
    const isDisabled = false;

    const result = cn(
      'base-class',
      { 'active-class': isActive, 'disabled-class': isDisabled },
    );

    expect(result).toBe('base-class active-class');
  });

  it('should handle conditional classes with arrays', () => {
    const result = cn(
      'base-class',
      ['array-class-1', 'array-class-2'],
      { 'conditional-class': true },
    );

    expect(result).toBe('base-class array-class-1 array-class-2 conditional-class');
  });

  it('should deduplicate conflicting Tailwind classes', () => {
    const result = cn('text-red-500', 'text-blue-500');
    expect(result).toBe('text-blue-500');
  });

  it('should handle undefined and null values', () => {
    const result = cn('base-class', undefined, null, 'valid-class');
    expect(result).toBe('base-class valid-class');
  });

  it('should handle empty strings', () => {
    const result = cn('base-class', '', 'valid-class');
    expect(result).toBe('base-class valid-class');
  });

  it('should return empty string for no inputs', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle complex nested conditionals', () => {
    const isPrimary = true;
    const isLarge = false;
    const variant = 'success';

    const result = cn(
      'btn',
      {
        'btn-primary': isPrimary,
        'btn-secondary': !isPrimary,
        'btn-large': isLarge,
        'btn-small': !isLarge,
      },
      `btn-${variant}`,
    );

    expect(result).toBe('btn btn-primary btn-small btn-success');
  });
});
