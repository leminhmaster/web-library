import React from 'react';

export default function Logo() {
  return (
    <div className="flex">
      <img
        src="/favicon.ico"
        alt=""
        className="w-5 h-auto"
      />
      <div className="ml-3 text-lg text-white">LMS</div>
    </div>
  );
}