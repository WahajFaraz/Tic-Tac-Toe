import { SoundEffectsProvider, useSounds } from './SoundEffects.jsx';
import App from '../App.jsx';

function AppWithSounds() {
  const { playXMoveSound, playOMoveSound } = useSounds();

  return <App playXMoveSound={playXMoveSound} playOMoveSound={playOMoveSound} />;
}

function AppWithSoundsWrapper() {
  return (
    <SoundEffectsProvider>
      <AppWithSounds />
    </SoundEffectsProvider>
  );
}

export default AppWithSoundsWrapper;
