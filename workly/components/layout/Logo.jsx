import Link from 'next/link';
import { CheckCircle, Briefcase } from 'lucide-react';

const Logo = ({ size = 'md', withText = true }) => {
  const sizes = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <Link href="/" className="flex items-center">
      <div className="relative">
        <Briefcase 
          className={`${sizes[size]} text-pro`} 
          strokeWidth={2.5} 
        />
        <CheckCircle 
          className={`absolute -bottom-1 -right-1 ${
            size === 'sm' ? 'h-3' : size === 'md' ? 'h-4' : 'h-5'
          } text-pro-light fill-white`} 
          strokeWidth={2.5} 
        />
      </div>
      {withText && (
        <span className={`${textSizes[size]} font-bold ml-2 text-pro`}>
          Workly
        </span>
      )}
    </Link>
  );
};

export default Logo;