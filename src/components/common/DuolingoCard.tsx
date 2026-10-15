/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface DuolingoCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'white' | 'cream' | 'green_light' | 'blue_light' | 'amber_light';
  highlightBorder?: boolean;
}

export const DuolingoCard: React.FC<DuolingoCardProps> = ({
  children,
  className = '',
  onClick,
  variant = 'white',
  highlightBorder = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'cream':
        return 'bg-[#FFFDF9] border-[#E8E2D6] shadow-[0_4px_0_0_#D8D0C0]';
      case 'green_light':
        return 'bg-[#F2FDE6] border-[#B6EAA0] shadow-[0_4px_0_0_#97DC7B]';
      case 'blue_light':
        return 'bg-[#EBF7FF] border-[#A8DEF8] shadow-[0_4px_0_0_#7DC7F0]';
      case 'amber_light':
        return 'bg-[#FFF9E6] border-[#FCE194] shadow-[0_4px_0_0_#E9C86A]';
      default:
        return 'bg-white border-[#E5E5E5] shadow-[0_4px_0_0_#D4D4D4]';
    }
  };

  const clickableStyles = onClick ? 'cursor-pointer hover:border-[#1CB0F6] transition-colors' : '';
  const borderEmphasis = highlightBorder ? 'border-[#58CC02]' : '';

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border-2 p-5 ${getVariantStyles()} ${borderEmphasis} ${clickableStyles} ${className}`}
    >
      {children}
    </div>
  );
};
