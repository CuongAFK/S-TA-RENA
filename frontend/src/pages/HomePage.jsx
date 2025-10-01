import React, { useState, useEffect } from "react";
import bgVideo from "../assets/videos/home.mp4";
import avatarFrame from "../assets/images/avatarFrame.png";
import avatar from "../assets/images/avatar.png";
import infoFrame from "../assets/images/infoFrame.png";
import rubystarlight from "../assets/icons/rubystarlight.png";
import credit from "../assets/icons/credit.png";
import borderFrame from "../assets/images/borderFrame.png";
import borderFrame2 from "../assets/images/borderFrame2.png";
import shopIcon from "../assets/icons/shop.png";
import mailIcon from "../assets/icons/mail.png";
import settingsIcon from "../assets/icons/settings.png";
import moreIcon from "../assets/icons/more.png";
import AccountModal from "../components/AccountModal";


const Home = () => {

  const [isModalOpen, setModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const encodedData = localStorage.getItem("userData");
    if (encodedData) {
      try {
        const decoded = JSON.parse(atob(encodedData));
        setUserData(decoded);
      } catch (e) {
        console.error("Lỗi giải mã user:", e);
      }
    }
  }, []);


  const handleAvatarClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  }

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
      <div className="relative z-10 w-full h-full grid grid-rows-[2fr_8fr_2fr] grid-cols-[3fr_6fr_3fr] gap-1 p-2 lg:p-5 lg:gap-10">

        {/* BOX 1: Góc trên trái (gradient từ trái & trên) */}
        <div className="box-1 flex bg-gradient-to-br from-black/60 to-transparent overflow-hidden max-w-full">
          {/* BOX-1A: AVATAR */}
          <div className="box-1a items-center justify-center w-[30%] h-full relative flex-shrink-0" onClick={handleAvatarClick}>
            <img
              src={avatarFrame}
              alt="Avatar Frame"
              className="absolute inset-0  w-full object-cover z-10 pointer-events-none"
            />
            <img
              src={avatar}
              alt="Avatar"
              className="absolute inset-0 w-full object-cover z-0 pointer-events-none"
            />
          </div>

          {/* BOX-1B: INFO */}
          <div className="box-1b relative flex-1 h-full w-full">
            <img
              src={infoFrame}
              alt="Info Frame"
              className="w-full h-full object-contain pointer-events-none"
            />
            <div className="absolute inset-0 flex flex-col justify-center px-2 text-white leading-tight overflow-hidden">

              <div className="sm:text-sm lg:text-xl font-bold truncate">
                {userData ? userData.name : "AFK"}
              </div>
              <div className="sm:text-[60%] lg:text-xl opacity-80 truncate">
                UID: {userData ? userData.uid : "12345678"}
              </div>
            </div>
          </div>
        </div>

        {/* BOX 2: Trên giữa (gradient từ trên, giảm 50% chiều cao, căn lên) */}
        <div className="box-2 self-start h-1/2 bg-gradient-to-b from-black/60 to-transparent flex items-center justify-center gap-2  text-black text-[80%] font-sans font-bold lg:text-base drop-shadow-[0_0_8px_rgba(0,200,255,0.8)]">
          {/* Ô 1: Tín dụng */}
          <div
            className="relative flex items-center justify-center gap-1"
            style={{
              width: "25%", // 1/4 chiều rộng box-2
              aspectRatio: "4 / 1", // giữ tỉ lệ ngang đẹp
            }}
          >
            {/* Viền PNG */}
            <img
              src={borderFrame} // hoặc file PNG viền riêng cho tiền
              alt="frame"
              className="absolute inset-0  w-full h-full z-0"
            />
            {/* Nội dung */}
            <img
              src={credit}
              alt="credit"
              className="h-full object-contain drop-shadow-[0_0_4px_rgba(0,190,255,0.8)] z-10"
            />
            <span className="z-10 drop-shadow-[0_0_10px_rgba(255,255,255,1)]">1000</span>
          </div>

          {/* Ô 2: Ruby */}
          <div
            className="relative flex items-center justify-center gap-1"
            style={{
              width: "25%",
              aspectRatio: "4 / 1",
            }}
          >
            {/* Viền PNG */}
            <img
              src={borderFrame2}
              alt="frame2"
              className="absolute inset-0 h-full w-full z-0"
            />
            {/* Nội dung */}
            <img
              src={rubystarlight}
              alt="rubystarlight"
              className="h-full object-contain drop-shadow-[0_0_6px_rgba(255,0,0,0.8)] z-10"
            />
            <span className="z-10">500</span>
          </div>
        </div>



        {/* BOX 3: Góc trên phải */}
        <div className="box-3 bg-gradient-to-bl from-black/60 to-transparent 
                flex items-center justify-center gap-5 px-[1rem] py-1 h-1/2 lg:px-[2rem] lg:gap-10">
          {/* Shop */}
          <img
            src={shopIcon}
            alt="Shop"
            className="h-full w-10  btn"
          />

          {/* Thư */}
          <img
            src={mailIcon}
            alt="Mail"
            className="h-auto w-5 lg:w-10 btn"
          />

          {/* Cài đặt */}
          <img
            src={settingsIcon}
            alt="Settings"
            className="h-auto w-5 lg:w-10 btn"
          />

          {/* More */}
          <img
            src={moreIcon}
            alt="More"
            className="h-auto w-5 lg:w-10 btn"
          />

        </div>



        {/* BOX 4 */}
        <div className="box-4 flex items-start justify-start">
          <div className="bg-gradient-to-r from-black/60 to-transparent border border-white h-full aspect-[1/4] relative">

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
      </div >

      {/* Hiển thị Modal */}
      <AccountModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onLoginSuccess={(user) => setUserData(user)}
      />


    </div >

  );
};


export default Home;
