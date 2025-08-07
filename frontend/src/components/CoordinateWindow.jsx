import React from 'react';

const CoordinateWindow = () => {
  return (
      <div className="absolute w-full h-full border-4 border-yellow-500">
        {/* Hệ trục tọa độ */}
        <div className=" w-full h-full">
          {/* Trục X (kéo dài toàn khung viền trong) */}
          <div className="absolute top-1/2 w-full h-0.5 bg-white transform -translate-y-1/2"></div>
          {/* Trục Y (kéo dài toàn khung viền trong) */}
          <div className="absolute left-1/2 h-full w-0.5 bg-white transform -translate-x-1/2"></div>
          {/* Điểm gốc (0,0) */}
          <div className="absolute left-1/2 top-1/2 w-3 h-3 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
  );
};

export default CoordinateWindow;