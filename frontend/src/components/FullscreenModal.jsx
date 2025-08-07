// src/components/FullscreenModal.jsx
import React from 'react';

export default function FullscreenModal({ isOpen, onClose, onEnterFullscreen }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-white text-center max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Bắt đầu trò chơi</h2>
        <p className="mb-6">Chuyển sang chế độ toàn màn hình</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onEnterFullscreen}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
          >
            Vào toàn màn hình
          </button>
        </div>
      </div>
    </div>
  );
}
