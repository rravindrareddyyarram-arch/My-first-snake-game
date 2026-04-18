import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';
import { Network } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen crt bg-[#050505] text-cyan-glitch font-mono flex flex-col antialiased selection:bg-magenta-glitch selection:text-white relative z-0">
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10 opacity-30">
        <div className="absolute top-[20%] left-[10%] w-[40rem] h-[30rem] bg-cyan-glitch/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[10%] w-[30rem] h-[40rem] bg-magenta-glitch/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <header className="p-6 border-b border-magenta-glitch/30 bg-black/40 backdrop-blur-md relative">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Network className="w-8 h-8 text-magenta-glitch animate-pulse" />
            <h1 className="text-4xl tracking-tighter uppercase glitch-text" data-text="NEURO_LINK ADMIN">
              NEURO_LINK ADMIN
            </h1>
          </div>
          <div className="text-right flex flex-col items-end">
             <div className="bg-magenta-glitch text-black px-2 py-0.5 mt-1 text-sm inline-block font-bold">SYS: ACTIVE</div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-12 relative z-10">
        
        {/* Left Column - Audio Subsystem */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="mb-4 flex items-end justify-between border-b border-gray-800 pb-2">
            <h2 className="text-xl text-gray-400">MODULE // <span className="text-cyan-glitch">01</span></h2>
            <div className="text-xs text-gray-600 uppercase">Aural Injector</div>
          </div>
          <MusicPlayer />
          
          <div className="mt-8 border border-gray-800 p-4 font-mono text-sm text-gray-500 bg-black/50 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-glitch/30" />
            <p className="mb-2 text-cyan-glitch">&gt; WARNING:</p>
            <p className="text-gray-400 leading-relaxed mb-2">SYNTHETIC AUDIO STREAM MAY CAUSE UNPREDICTABLE NEURAL VIBRATIONS. KEEP SERPENT ENTROPY IN CHECK TO PREVENT DATA CORRUPTION.</p>
            <p className="animate-pulse text-magenta-glitch">&gt; SYSTEM STABLE.</p>
          </div>
        </div>

        {/* Right Column - Main Viewport (Snake Game) */}
        <div className="lg:col-span-8 flex flex-col relative">
          <div className="mb-4 flex items-end justify-between border-b border-gray-800 pb-2">
            <h2 className="text-xl text-gray-400">MODULE // <span className="text-magenta-glitch">02</span></h2>
            <div className="text-xs text-gray-600 uppercase">Kinetic Matrix</div>
          </div>
          
          {/* Interface wrapper for the game */}
          <div className="relative">
            {/* Decals */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-glitch z-20"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-glitch z-20"></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-glitch z-20"></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-glitch z-20"></div>
            
            <SnakeGame />
          </div>
        </div>

      </main>

      <footer className="p-4 border-t border-cyan-glitch/30 text-center text-xs text-gray-600 uppercase tracking-widest bg-black/60 relative z-10">
        &copy; 2099 // MEGALITHIC CONSTRUCTS // ALL RIGHTS RESERVED
      </footer>
    </div>
  );
}
