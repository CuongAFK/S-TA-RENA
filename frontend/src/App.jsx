import { useState } from 'react';
import CoordinateWindow from './components/CoordinateWindow';
import OrientationLock from './components/OrientationLock';
import FullscreenModal from './components/FullscreenModal';
import { useFullscreen } from './hooks/useFullscreen';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import GameStoryPage from "./pages/GameStoryPage";
import './App.css';

function App() {
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const [isModalOpen, setIsModalOpen] = useState(true); // mở modal khi vào app

  const handleEnterFullscreen = () => {
    toggleFullscreen();     // chuyển fullscreen
    setIsModalOpen(false);  // đóng modal
  };

  return (
    <div className="cursor-custom1 fixed inset-0 items-center justify-center">


      <OrientationLock>
        {/* Modal nút vào fullscreen */}
        <FullscreenModal
          isOpen={!isFullscreen && isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onEnterFullscreen={handleEnterFullscreen}
        />
      </OrientationLock>

      <div className='h-full w-full flex items-center justify-center'>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/game/story" element={<GameStoryPage />} />
        </Routes>
      </div>

      {/* Hiển thị cửa sổ tọa độ */}
      {/* <div className='absolute inset-0 flex items-center justify-center'>
        
        <CoordinateWindow />
  
      </div> */}
    </div>
  );
}

export default App;
