/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface AdProps {
  slot?: string;
  format?: 'auto' | 'rectangle' | 'leaderboard';
  className?: string;
}

export default function AdPlaceholder({ slot = "default-slot", format = "auto", className = "" }: AdProps) {
  return (
    <div className={`my-6 flex flex-col items-center justify-center p-4 border border-dashed rounded-lg bg-gray-50 dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 transition-colors ${className}`}>
      <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase mb-2">Advertisements (AdSense Approved Slot: #{slot})</span>
      <div className={`w-full flex items-center justify-center bg-gray-100 dark:bg-zinc-800 text-gray-500 rounded min-h-[90px] ${
        format === 'rectangle' ? 'aspect-square max-w-[250px]' : 
        format === 'leaderboard' ? 'h-24 w-full' : 'h-32 w-full'
      }`}>
        <div className="text-center p-3">
          <p className="text-xs font-semibold text-gray-600 dark:text-zinc-300">Google AdSense responsive ad unit</p>
          <p className="text-[10px] text-gray-400 mt-1">Status: Ready | Safe Contrast Content Layout</p>
        </div>
      </div>
    </div>
  );
}
