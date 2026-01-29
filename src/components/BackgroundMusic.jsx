import { useState, useRef, useEffect } from 'react';
import './BackgroundMusic.css';

function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(true); // Default to playing
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.loop = true;
      // Auto-play when component mounts
      if (isPlaying) {
        audio.play().catch(error => {
          console.log('Background music play failed:', error);
        });
      }
    }
  }, [volume, isPlaying]);

  useEffect(() => {
    // Auto-play on mount
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch(error => {
        console.log('Auto-play failed:', error);
      });
    }
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.log('Background music play failed:', error);
        // Fallback: create a simple background tone using Web Audio API
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = 220;
          oscillator.type = 'sine';
          gainNode.gain.value = 0.05;
          
          oscillator.start();
          
          // Store reference to stop it later
          window.backgroundOscillator = oscillator;
        } catch (fallbackError) {
          console.log('Fallback background music failed:', fallbackError);
        }
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="music-controls">
      <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
      <button 
        onClick={togglePlayPause}
        className="music-toggle-btn"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? '🎵' : '🎶'}
      </button>
      <div className="volume-control">
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />
      </div>
    </div>
  );
}

export default BackgroundMusic;
