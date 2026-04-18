import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, Disc3, Volume1, Volume2, HardDrive } from 'lucide-react';

const TRACKS = [
  { id: 0, title: "01 // SYNTHETIC_PULSE.wav", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { id: 1, title: "02 // NEURAL_FEEDBACK.wav", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
  { id: 2, title: "03 // VOID_ECHO.wav", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3" }
];

export function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          // Autoplay block bypass - handle gracefully
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack, volume]);

  const handleTrackEnd = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
  };

  const skipTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div className="border border-magenta-glitch p-4 bg-black/80 relative overflow-hidden backdrop-blur-sm screen-tear mb-6">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-magenta-glitch opacity-50"></div>
      
      <div className="flex flex-col gap-4 relative z-10 w-full uppercase">
        <div className="flex items-center justify-between border-b border-cyan-glitch/30 pb-2">
          <div className="flex items-center gap-2 text-cyan-glitch">
            <HardDrive className="w-5 h-5 animate-pulse" />
            <span className="text-xl tracking-widest">AUDIO.SYS</span>
          </div>
          <div className="text-magenta-glitch text-sm flex items-center gap-1">
            <span className="w-2 h-2 bg-magenta-glitch inline-block animate-ping"></span>
            ACTIVE
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div data-text={TRACKS[currentTrack].title} className="text-2xl text-white truncate glitch-text mb-1">
              {TRACKS[currentTrack].title}
            </div>
            <div className="text-cyan-glitch/60 text-sm">AI GENERATIVE STREAM // SECTOR 4</div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-magenta-glitch hover:text-white hover:bg-magenta-glitch/20 p-3 border border-magenta-glitch border-dashed transition-all active:scale-95"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button 
              onClick={skipTrack}
              className="text-cyan-glitch hover:text-white hover:bg-cyan-glitch/20 p-3 border border-cyan-glitch border-dashed transition-all active:scale-95"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Volume1 className="w-4 h-4 text-cyan-glitch/50" />
          <input 
            type="range" 
            min="0" max="1" step="0.05" 
            value={volume} 
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-900 appearance-none cursor-pointer border border-cyan-glitch/30 
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
              [&::-webkit-slider-thumb]:bg-magenta-glitch"
          />
          <Volume2 className="w-4 h-4 text-cyan-glitch/50" />
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={TRACKS[currentTrack].url}
        onEnded={handleTrackEnd}
      />
    </div>
  );
}
