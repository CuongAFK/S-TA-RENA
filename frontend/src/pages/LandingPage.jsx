import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import bgVideo from '../assets/videos/bg.mp4';
import bgAudio from '../assets/sounds/cyberpunk-tohican-141620.mp3';
import RobotProgressBar from '../components/RobotProgressBar';

const LandingPage = () => {
  const [progress, setProgress] = useState(0);
  const [loadingDone, setLoadingDone] = useState(false);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  // Thiết lập tốc độ phát chậm sau khi video load
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5; // 👈 Chậm gấp đôi
    }
    if (audioRef.current) {
      const audioEl = audioRef.current;
      audioEl.volume = 0.3; // Giảm âm lượng xuống
      audioEl.play().catch(err => {
        console.warn("Trình duyệt chặn tự động phát âm thanh:", err);
      });

      const handleEnded = () => {
        setTimeout(() => {
          audioEl.play().catch(err => {
            console.warn("Lặp lại âm thanh gặp lỗi:", err);
          });
        }, 10000); // Chờ 10 giây trước khi phát lại
      };

      audioEl.addEventListener('ended', handleEnded);
      return () => {
        audioEl.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  // Loading giả lập
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoadingDone(true);
          return 100;
        }

        // Tăng từ 1 đến 5 ngẫu nhiên
        const randomIncrement = Math.floor(Math.random() * 5) + 1;
        return Math.min(prev + randomIncrement, 100);
      });
    }, 200); // Tốc độ cập nhật mỗi 200ms

    return () => clearInterval(interval);
  }, []);



  const handleEnter = () => {
     console.log('[LandingPage] Người dùng đã click vào màn hình');
    if (loadingDone) {
      navigate('/home');
    }
  };

  return (
    <div
      onClick={handleEnter}
      className="relative w-full h-full overflow-hidden cursor-custom2"
    >
      {/* Video nền */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={bgVideo}
        autoPlay
        muted
        loop
      />

      {/* Âm thanh nền */}
      <audio ref={audioRef} src={bgAudio} />

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center drop-shadow-[0_0_8px_rgba(0,200,255,0.8)] ">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-br from-blue-500 via-sky-400 to-cyan-300 bg-clip-text text-transparent  text-gradient-fix">ST:A-RENA</h1>

        {/* Loading bar */}
        <RobotProgressBar progress={progress} />


        {/* Hướng dẫn */}
        {loadingDone && (
          <p className="text-lg animate-pulse">
            Tải xong! Nhấn vào màn hình để bắt đầu...
          </p>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
