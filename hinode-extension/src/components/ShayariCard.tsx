import React from 'react';
import type { Shayari } from '../types/api';

interface ShayariCardProps {
  shayari: Shayari;
}

export default function ShayariCard({ shayari }: ShayariCardProps) {
  return (
    <div className="p-4 bg-white bg-opacity-20 rounded-md backdrop-blur-sm text-black max-w-md">
      <p className="italic mb-2">\"{shayari.text}\"</p>
      {shayari.author && <p className="text-right">— {shayari.author}</p>}
    </div>
  );
}
