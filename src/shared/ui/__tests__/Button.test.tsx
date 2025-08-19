import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with default props', () => {
    render(<Button onClick={mockOnClick}>Click me</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
    expect(button).toHaveClass('bg-blue-600', 'px-4', 'py-2');
  });

  it('should render with primary variant by default', () => {
    render(<Button onClick={mockOnClick}>Primary Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white');
  });

  it('should render with secondary variant', () => {
    render(
      <Button variant="secondary" onClick={mockOnClick}>
        Secondary Button
      </Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-200', 'hover:bg-gray-300', 'text-gray-900');
  });

  it('should render with danger variant', () => {
    render(
      <Button variant="danger" onClick={mockOnClick}>
        Danger Button
      </Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-600', 'hover:bg-red-700', 'text-white');
  });

  it('should render with small size', () => {
    render(
      <Button size="small" onClick={mockOnClick}>
        Small Button
      </Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
  });

  it('should render with medium size by default', () => {
    render(<Button onClick={mockOnClick}>Medium Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-4', 'py-2', 'text-base');
  });

  it('should render with large size', () => {
    render(
      <Button size="large" onClick={mockOnClick}>
        Large Button
      </Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('should handle click events', () => {
    render(<Button onClick={mockOnClick}>Click me</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <Button disabled onClick={mockOnClick}>
        Disabled Button
      </Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50', 'disabled:pointer-events-none');
  });

  it('should be disabled when isLoading is true', () => {
    render(
      <Button isLoading onClick={mockOnClick}>
        Loading Button
      </Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should show spinner when loading', () => {
    render(
      <Button isLoading onClick={mockOnClick}>
        Loading Button
      </Button>,
    );

    const spinner = document.querySelector('svg.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should not call onClick when disabled', () => {
    render(
      <Button disabled onClick={mockOnClick}>
        Disabled Button
      </Button>,
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('should not call onClick when loading', () => {
    render(
      <Button isLoading onClick={mockOnClick}>
        Loading Button
      </Button>,
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    render(
      <Button className="custom-class" onClick={mockOnClick}>
        Custom Button
      </Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should have correct focus styles', () => {
    render(<Button onClick={mockOnClick}>Focus Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2');
  });

  it('should have correct transition styles', () => {
    render(<Button onClick={mockOnClick}>Transition Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('transition-all', 'duration-200');
  });

  it('should forward ref correctly', () => {
    const ref = jest.fn();
    render(
      <Button ref={ref} onClick={mockOnClick}>
        Ref Button
      </Button>,
    );

    expect(ref).toHaveBeenCalled();
  });
});
