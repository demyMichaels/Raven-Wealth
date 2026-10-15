/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface DuolingoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'green' | 'blue' | 'amber' | 'white' | 'red' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const DuolingoButton: React.FC<DuolingoButtonProps> = ({
  variant = 'green',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'blue':
        return 'bg-[#1CB0F6] border-[#1899D6] shadow-[0_4px_0_0_#137CB0] text-white hover:bg-[#29B9FD]';
      case 'amber':
        return 'bg-[#FFC800] border-[#E0A800] shadow-[0_4px_0_0_#B88600] text-amber-950 hover:bg-[#FFD220]';
      case 'white':
        return 'bg-white border-[#E5E5E5] shadow-[0_4px_0_0_#D4D4D4] text-slate-700 hover:bg-slate-50';
      case 'red':
        return 'bg-[#FF4B4B] border-[#E03535] shadow-[0_4px_0_0_#B81E1E] text-white hover:bg-[#FF5A5A]';
      case 'purple':
        return 'bg-[#9333EA] border-[#7E22CE] shadow-[0_4px_0_0_#6B21A8] text-white hover:bg-[#A855F7]';
      default: // green
        return 'bg-[#58CC02] border-[#46A302] shadow-[0_4px_0_0_#388402] text-white hover:bg-[#61DE02]';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs font-bold rounded-xl';
      case 'lg':
        return 'px-6 py-3.5 text-base font-extrabold rounded-2xl';
      default: // md
        return 'px-4 py-2.5 text-sm font-bold rounded-xl';
    }
  };

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed hover:bg-auto shadow-none active:translate-y-0'
    : 'cursor-pointer active:translate-y-1 active:shadow-none transition-all duration-75';

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 border-2 uppercase tracking-wide select-none ${getVariantStyles()} ${getSizeStyles()} ${disabledStyles} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
