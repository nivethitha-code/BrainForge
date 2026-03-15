import React from 'react';

export default function AuthLayout({ children }) {
  return (
    <div className="h-screen bg-white overflow-hidden">
      {children}
    </div>
  );
}
