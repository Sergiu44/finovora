import { useCallback, useRef, useState } from 'react';

const ROWS = 6;
const COLS = 12;
const DEFAULT_FOCUS_POINT = { row: ROWS / 2, col: (COLS / 2) + 1 }; // slightly right of center
const MAX_DISTANCE = Math.hypot(ROWS, COLS);

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [focusPoint, setFocusPoint] = useState(DEFAULT_FOCUS_POINT);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
    const relativeY = Math.min(Math.max(event.clientY - rect.top, 0), rect.height);

    setFocusPoint({
      row: (relativeY / rect.height) * ROWS,
      col: (relativeX / rect.width) * COLS,
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    setFocusPoint(DEFAULT_FOCUS_POINT);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-[700px] p-12"
      onMouseOver={handlePointerMove}
      onMouseLeave={handlePointerLeave}
    >
      <div className="grid grid-cols-12 grid-rows-6 h-full bg-gradient-to-b from-primary-50/10 to-white">
        {Array.from({ length: ROWS }).map((_, rowIndex) =>
          Array.from({ length: COLS }).map((_, colIndex) => {
            const distance = Math.hypot(
              rowIndex - focusPoint.row,
              colIndex - focusPoint.col
            );
            const proximity = Math.max(0, 1 - (distance / MAX_DISTANCE)); // closer → 1, farther → 0
            const opacity = proximity * 0.5;
            const scale = 0.9 + proximity * 0.1;
            const borderAlpha = proximity * 0.1;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="flex items-center justify-center transition-all duration-500"
                style={{
                  border: `1px solid color-mix(in oklab, var(--muted-foreground) ${borderAlpha * 100}%, transparent)`,
                  opacity,
                  transform: `scale(${scale})`,
                  backgroundColor: `color-mix(in srgb, var(--primary) ${proximity *
                    20}%, transparent)`,
                }}
                aria-hidden="true"
              />
            );
          })
        )}
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[100%] lg:w-[75%] inset-x-0 mx-auto">
        <div className='grid grid-cols-2 gap-10'>
            <div className='flex flex-col gap-4'>
                <h1 className='text-4xl font-bold'>Monitor Earnings Spending Savings in real time</h1>
            </div>
        </div>
      </div>
    </div>
  );
}
