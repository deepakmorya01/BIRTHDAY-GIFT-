import { useState, useEffect } from 'react';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function SmartImage({ src, alt, className = '' }: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  if (error) {
    return <div className={`absolute inset-0 bg-void-800/40 ${className}`} aria-label={alt} role="img" />;
  }

  return (
    <>
      {!loaded && (
        <div className={`absolute inset-0 bg-void-800/40 ${className}`} />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700 ease-cinematic`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </>
  );
}
