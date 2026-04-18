import { useState, useEffect, useCallback, useRef } from 'react';
import { Terminal, RefreshCcw, Skull } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

type Point = { x: number, y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isActive, setIsActive] = useState(false);
  
  const directionRef = useRef<Direction>('RIGHT');
  const frameRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);
  const speedRef = useRef(INITIAL_SPEED);

  const resetSystem = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setFood({ 
      x: Math.floor(Math.random() * GRID_SIZE), 
      y: Math.floor(Math.random() * GRID_SIZE) 
    });
    setScore(0);
    setIsGameOver(false);
    setIsActive(true);
    speedRef.current = INITIAL_SPEED;
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (!isActive && !isGameOver && e.key === ' ') {
      setIsActive(true);
      return;
    }

    if (isGameOver && e.key === ' ') {
      resetSystem();
      return;
    }

    const currentDir = directionRef.current;
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        if (currentDir !== 'DOWN') directionRef.current = 'UP';
        break;
      case 'ArrowDown':
      case 's':
        if (currentDir !== 'UP') directionRef.current = 'DOWN';
        break;
      case 'ArrowLeft':
      case 'a':
        if (currentDir !== 'RIGHT') directionRef.current = 'LEFT';
        break;
      case 'ArrowRight':
      case 'd':
        if (currentDir !== 'LEFT') directionRef.current = 'RIGHT';
        break;
    }
  }, [isActive, isGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const updateGame = useCallback((timestamp: number) => {
    if (!isActive || isGameOver) return;

    if (timestamp - lastUpdateRef.current >= speedRef.current) {
      setSnake(currentSnake => {
        const head = currentSnake[0];
        const newHead = { ...head };

        switch (directionRef.current) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Check Wall Collision
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE || 
          newHead.y < 0 || newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return currentSnake;
        }

        // Check Self Collision
        if (currentSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return currentSnake;
        }

        const newSnake = [newHead, ...currentSnake];

        // Eat Food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          speedRef.current = Math.max(50, speedRef.current - 5);
          
          let nextFood;
          while (true) {
            nextFood = {
              x: Math.floor(Math.random() * GRID_SIZE),
              y: Math.floor(Math.random() * GRID_SIZE)
            };
            // Ensure food doesn't spawn on snake
            const isOnSnake = newSnake.some(s => s.x === nextFood.x && s.y === nextFood.y);
            if (!isOnSnake) break;
          }
          setFood(nextFood);
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
      
      setDirection(directionRef.current);
      lastUpdateRef.current = timestamp;
    }

    frameRef.current = requestAnimationFrame(updateGame);
  }, [isActive, isGameOver, food]);

  useEffect(() => {
    frameRef.current = requestAnimationFrame(updateGame);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [updateGame]);

  return (
    <div className="border-2 border-cyan-glitch bg-black/60 p-1 relative backdrop-blur-md shadow-[0_0_20px_rgba(0,255,255,0.2)] w-full max-w-2xl mx-auto flex flex-col mt-4">
      <div className="bg-gray-900 border-b border-cyan-glitch/50 px-4 py-2 flex justify-between items-center text-cyan-glitch uppercase tracking-widest text-lg">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-magenta-glitch" />
          <span>SERPENT_SIM</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex gap-2">
             <span>SCORE:</span>
             <span className="text-white text-xl">{score.toString().padStart(4, '0')}</span>
          </div>
        </div>
      </div>

      <div 
        className="relative bg-[#020202] overflow-hidden"
        style={{ 
          aspectRatio: '1/1',
          backgroundImage: 'linear-gradient(#00ffff0a 1px, transparent 1px), linear-gradient(90deg, #00ffff0a 1px, transparent 1px)',
          backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
        }}
      >
        {/* Render Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute transition-all duration-75 ${isHead ? 'bg-white z-10 scale-110 shadow-[0_0_10px_#fff]' : 'bg-cyan-glitch opacity-80'}`}
              style={{
                width: `${100/GRID_SIZE}%`,
                height: `${100/GRID_SIZE}%`,
                left: `${(segment.x * 100) / GRID_SIZE}%`,
                top: `${(segment.y * 100) / GRID_SIZE}%`,
                boxShadow: isHead ? undefined : '0 0 5px rgba(0, 255, 255, 0.5)'
              }}
            >
              {isHead && (
                <div className={`absolute w-full h-full flex justify-center items-center ${
                  direction === 'RIGHT' ? '' : 
                  direction === 'LEFT' ? 'rotate-180' : 
                  direction === 'DOWN' ? 'rotate-90' : '-rotate-90'
                }`}>
                  {/* Digital eyes */}
                  <div className="w-1/3 h-1/3 bg-magenta-glitch rounded-full mr-1 shadow-[0_0_5px_#ff00ff]"></div>
                </div>
              )}
            </div>
          )
        })}

        {/* Render Food */}
        <div
          className="absolute bg-magenta-glitch z-0 animate-pulse shadow-[0_0_15px_#ff00ff]"
          style={{
            width: `${100/GRID_SIZE}%`,
            height: `${100/GRID_SIZE}%`,
            left: `${(food.x * 100) / GRID_SIZE}%`,
            top: `${(food.y * 100) / GRID_SIZE}%`,
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' // Diamond shape
          }}
        />

        {/* Overlays */}
        {!isActive && !isGameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center isolate">
            <div className="text-center border border-cyan-glitch border-dashed p-8 bg-black/90 screen-tear">
              <h2 className="text-3xl text-cyan-glitch mb-4 glitch-text" data-text="AWAITING INPUT">AWAITING INPUT</h2>
              <p className="text-gray-400 text-lg mb-6">PRESS [SPACE] TO INITIALIZE</p>
              <div className="flex gap-4 justify-center text-magenta-glitch opacity-80">
                <span className="border border-magenta-glitch px-2">[W] UP</span>
                <span className="border border-magenta-glitch px-2">[S] DOWN</span>
                <span className="border border-magenta-glitch px-2">[A] LEFT</span>
                <span className="border border-magenta-glitch px-2">[D] RIGHT</span>
              </div>
            </div>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center backdrop-blur-sm z-20">
            <div className="text-center border-2 border-red-500 p-8 bg-black shadow-[0_0_30px_rgba(255,0,0,0.5)] screen-tear">
               <Skull className="w-16 h-16 text-red-500 mx-auto mb-4 animate-ping" />
               <h2 className="text-4xl text-red-500 font-bold mb-4">CRITICAL FAILURE</h2>
               <div className="text-2xl text-cyan-glitch mb-6">FINAL METRIC: <span className="text-white">{score}</span></div>
               <button 
                 onClick={resetSystem}
                 className="flex items-center gap-2 mx-auto justify-center w-full px-6 py-3 bg-red-900/30 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-colors uppercase font-bold tracking-wider"
               >
                 <RefreshCcw className="w-5 h-5" /> REBOOT SEQUENCE
               </button>
               <p className="mt-4 text-xs text-red-500/60 uppercase">OR PRESS [SPACE] TO REBOOT</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
