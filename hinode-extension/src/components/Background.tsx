import React, { ReactNode } from 'react';

interface BackgroundProps {
  imageUrl: string;
  children: ReactNode;
}

export default function Background({ imageUrl, children }: BackgroundProps) {
  const style: React.CSSProperties = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
  };
  return <div style={style}>{children}</div>;
}
