// src/components/OrientationLock.jsx
import React, { useEffect, useState } from 'react';

const OrientationLock = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobileDevice = /android|iphone|ipad|ipod/i.test(userAgent);
    setIsMobile(isMobileDevice);

    if (isMobileDevice) {
      const handleOrientationChange = () => {
        setIsPortrait(window.innerHeight > window.innerWidth);
      };

      handleOrientationChange(); // Kiểm tra lần đầu

      const tryLockLandscape = async () => {
        try {
          if (screen.orientation && screen.orientation.lock) {
            await screen.orientation.lock('landscape');
          }
        } catch (error) {
          console.error('Không thể khóa hướng màn hình:', error);
        }
      };

      tryLockLandscape();

      window.addEventListener('resize', handleOrientationChange);
      screen.orientation?.addEventListener('change', handleOrientationChange);


      return () => {
        window.removeEventListener('resize', handleOrientationChange);
        screen.orientation?.removeEventListener('change', handleOrientationChange);
      };
    }
  }, []);

  if (isMobile && isPortrait) {
    return (
      <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center text-center z-50">
        <svg className="w-16 h-16 mb-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5"></path></svg>
        <p className="text-xl">Vui lòng xoay ngang thiết bị của bạn để chơi game.</p>
      </div>
    );
  }

  return children;
};

export default OrientationLock;