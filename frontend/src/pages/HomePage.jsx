import React from "react";
import bgVideo from "../assets/videos/home.mp4";

const Home = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* VIDEO NỀN */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={bgVideo}
        autoPlay
        loop
        muted
      />

      {/* LƯỚI 3x3 */}
      <div className="relative z-10 w-full h-full grid grid-rows-[2fr_8fr_2fr] grid-cols-[3fr_6fr_3fr] gap-1 p-2">
        {/* BOX 1: Góc trên trái (gradient từ trái & trên) */}
        <div className="box-1 bg-gradient-to-br from-black/60 to-transparent border border-white" />

        {/* BOX 2: Trên giữa (gradient từ trên) */}
        <div className="box-2 bg-gradient-to-b from-black/60 to-transparent border border-white" />

        {/* BOX 3: Góc trên phải (gradient từ phải & trên) */}
        <div className="box-3 bg-gradient-to-bl from-black/60 to-transparent border border-white" />

{/* BOX 4 */}
<div className="box-4 flex items-start justify-start">
  <div className="bg-gradient-to-r from-black/60 to-transparent border border-white h-full aspect-[1/4] relative">
    {/* PHẦN TRÊN - 1/4 chiều cao */}
    <div className="absolute top-0 left-0 h-1/4 w-full border border-yellow-400" />
  </div>
</div>


        {/* BOX 5: Giữa giữa (trống, không viền) */}
        <div className="box-5" />

         {/* BOX 6 → chứa 2 phần, mỗi phần = 1/3 chiều cao */}
        <div className="box-6 flex flex-col justify-start h-full">
          {/* 6.1 */}
          <div className="box-6-1 h-1/3 bg-gradient-to-l from-black/60 to-transparent border border-white mb-2 flex items-center justify-center text-white">
            6.1
          </div>
          {/* 6.2 */}
          <div className="box-6-2 h-1/3 bg-gradient-to-l from-black/60 to-transparent border border-white flex items-center justify-center text-white">
            6.2
          </div>
          {/* Bỏ phần 6.3 để tạo khoảng cách bằng 1/3 */}
        </div>

        {/* BOX 7: Góc dưới trái (gradient từ trái & dưới) */}
        <div className="box-7 bg-gradient-to-tr from-black/60 to-transparent border border-white" />

        {/* BOX 8: Dưới giữa (gradient từ dưới) */}
        <div className="box-8 bg-gradient-to-t from-black/60 to-transparent border border-white" />

        {/* BOX 9: Góc dưới phải (gradient từ phải & dưới) */}
        <div className="box-9 bg-gradient-to-tl from-black/60 to-transparent border border-white" />
      </div>
    </div>
  );
};

export default Home;
