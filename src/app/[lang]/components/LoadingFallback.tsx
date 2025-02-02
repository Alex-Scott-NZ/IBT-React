// components/LoadingFallback.tsx
type LoadingVariant = 'default' | 'compact' | 'article' | 'sidebar';

interface LoadingFallbackProps {
  variant?: LoadingVariant;
}

const LoadingFallback = ({ variant = 'default' }: LoadingFallbackProps) => {
  switch (variant) {
    case 'compact':
      return (
        <div className="animate-pulse p-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      );

    case 'article':
      return (
        <div className="animate-pulse space-y-4 p-4">
          <div className="h-8 bg-gray-200 rounded-md w-3/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        </div>
      );

    case 'sidebar':
      return (
        <div className="animate-pulse space-y-4 p-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          ))}
        </div>
      );

    default:
      return (
        <div className="animate-pulse space-y-4 p-4">
          <div className="h-8 bg-gray-200 rounded-md w-3/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      );
  }
};

export default LoadingFallback;
