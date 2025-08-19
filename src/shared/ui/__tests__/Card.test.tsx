import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../Card';

describe('Card Components', () => {
  describe('Card', () => {
    it('should render with default styles', () => {
      render(<Card>Card content</Card>);

      const card = screen.getByText('Card content');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('rounded-xl', 'border', 'bg-card', 'text-card-foreground', 'shadow-lg');
    });

    it('should apply custom className', () => {
      render(<Card className="custom-card">Custom Card</Card>);

      const card = screen.getByText('Custom Card');
      expect(card).toHaveClass('custom-card');
    });

    it('should forward ref correctly', () => {
      const ref = jest.fn();
      render(<Card ref={ref}>Ref Card</Card>);

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('CardHeader', () => {
    it('should render with default styles', () => {
      render(<CardHeader>Header content</CardHeader>);

      const header = screen.getByText('Header content');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6');
    });

    it('should apply custom className', () => {
      render(<CardHeader className="custom-header">Custom Header</CardHeader>);

      const header = screen.getByText('Custom Header');
      expect(header).toHaveClass('custom-header');
    });

    it('should forward ref correctly', () => {
      const ref = jest.fn();
      render(<CardHeader ref={ref}>Ref Header</CardHeader>);

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('CardTitle', () => {
    it('should render as h3 with default styles', () => {
      render(<CardTitle>Card Title</CardTitle>);

      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Card Title');
      expect(title).toHaveClass('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight');
    });

    it('should apply custom className', () => {
      render(<CardTitle className="custom-title">Custom Title</CardTitle>);

      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveClass('custom-title');
    });

    it('should forward ref correctly', () => {
      const ref = jest.fn();
      render(<CardTitle ref={ref}>Ref Title</CardTitle>);

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('CardDescription', () => {
    it('should render with default styles', () => {
      render(<CardDescription>Card description</CardDescription>);

      const description = screen.getByText('Card description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass('text-sm', 'text-muted-foreground');
    });

    it('should apply custom className', () => {
      render(<CardDescription className="custom-description">Custom Description</CardDescription>);

      const description = screen.getByText('Custom Description');
      expect(description).toHaveClass('custom-description');
    });

    it('should forward ref correctly', () => {
      const ref = jest.fn();
      render(<CardDescription ref={ref}>Ref Description</CardDescription>);

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('CardContent', () => {
    it('should render with default styles', () => {
      render(<CardContent>Content text</CardContent>);

      const content = screen.getByText('Content text');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('p-6', 'pt-0');
    });

    it('should apply custom className', () => {
      render(<CardContent className="custom-content">Custom Content</CardContent>);

      const content = screen.getByText('Custom Content');
      expect(content).toHaveClass('custom-content');
    });

    it('should forward ref correctly', () => {
      const ref = jest.fn();
      render(<CardContent ref={ref}>Ref Content</CardContent>);

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('CardFooter', () => {
    it('should render with default styles', () => {
      render(<CardFooter>Footer content</CardFooter>);

      const footer = screen.getByText('Footer content');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0');
    });

    it('should apply custom className', () => {
      render(<CardFooter className="custom-footer">Custom Footer</CardFooter>);

      const footer = screen.getByText('Custom Footer');
      expect(footer).toHaveClass('custom-footer');
    });

    it('should forward ref correctly', () => {
      const ref = jest.fn();
      render(<CardFooter ref={ref}>Ref Footer</CardFooter>);

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Card Composition', () => {
    it('should render complete card structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Complete Card</CardTitle>
            <CardDescription>This is a complete card</CardDescription>
          </CardHeader>
          <CardContent>Main content goes here</CardContent>
          <CardFooter>Footer actions</CardFooter>
        </Card>,
      );

      expect(screen.getByText('Complete Card')).toBeInTheDocument();
      expect(screen.getByText('This is a complete card')).toBeInTheDocument();
      expect(screen.getByText('Main content goes here')).toBeInTheDocument();
      expect(screen.getByText('Footer actions')).toBeInTheDocument();
    });
  });
});
