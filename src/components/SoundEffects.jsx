import { useRef, createContext, useContext } from 'react';

const SoundContext = createContext();

function SoundEffectsProvider({ children }) {
  const moveSoundRef = useRef(null);
  const winSoundRef = useRef(null);
  const drawSoundRef = useRef(null);

  const playXMoveSound = () => {
    // Create a sound for X move using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 600; // Lower frequency for X
      oscillator.type = 'square'; // Different waveform for X
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.15);
    } catch (error) {
      console.log('X move sound play failed:', error);
    }
  };

  const playOMoveSound = () => {
    // Create a different sound for O move using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 1000; // Higher frequency for O
      oscillator.type = 'sine'; // Different waveform for O
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.15);
    } catch (error) {
      console.log('O move sound play failed:', error);
    }
  };

  const playWinSound = () => {
    // Create a victory sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Victory fanfare with multiple notes
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
      oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime + 0.3); // C6
      oscillator.type = 'sine';
      gainNode.gain.value = 0.2;
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Win sound play failed:', error);
    }
  };

  const playDrawSound = () => {
    // Create a draw sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 300;
      oscillator.type = 'triangle';
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.log('Draw sound play failed:', error);
    }
  };

  return (
    <SoundContext.Provider value={{ 
      playXMoveSound, 
      playOMoveSound, 
      playWinSound, 
      playDrawSound 
    }}>
      {children}
    </SoundContext.Provider>
  );
}

function useSounds() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSounds must be used within SoundEffectsProvider');
  }
  return context;
}

export { SoundEffectsProvider, useSounds };
