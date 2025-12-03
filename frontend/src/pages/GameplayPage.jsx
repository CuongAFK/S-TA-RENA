import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    ArrowLeft, Lock, Swords, Skull, CheckCircle, 
    Zap, // Icon cho Độ Khó
    Trophy, // Icon cho Phần Thưởng
    Star // Icon phụ cho phần thưởng hiếm (ví dụ)
} from "lucide-react";
import Box8Nav from "../components/Box8Nav"; // Tái sử dụng Box8Nav để chỉnh đội hình

//-------- import image --------
import mapAov from "../assets/images/mapAov.jpg";

// Icons phần thưởng
import rubystarlightIcon from "../assets/icons/rubystarlight.png"; 
import creditIcon from "../assets/icons/credit.png";

// --------------------------------------------------------
// 🗺️ DATA MAPPING (Cho phần thưởng)
// --------------------------------------------------------
const REWARD_ICONS = {
  CREDIT: { img: creditIcon, name: "Tín Dụng" },
  RUBY_STARLIGHT: { img: rubystarlightIcon, name: "Ruby Ánh Sao" },
  ITEM_RARE: { img: null, name: "Vật Phẩm Hiếm", icon: <Star size={16} className="text-yellow-400" /> }, // Dùng icon Lucide
};


// --------------------------------------------------------
// 🗺️ DATA ẢI (HARDCODED JSON)
// --------------------------------------------------------
const STAGE_DATA = [
  {
    id: 1,
    name: "Trại Lính Tân Binh",
    desc: "Valhein đã gửi bạn đến đây để thử thách kỹ năng chiến đấu cơ bản.",
    img: "https://via.placeholder.com/300x150/1a2e1a/ffffff?text=Stage+1+Forest", // Thay ảnh ải
    top: 65, left: 18, // Tọa độ trên bản đồ (%)
    difficulty: 2, // ĐỘ KHÓ MỚI
    enemies: [
      { name: "Lính cận chiến", element: "Vật lý", power: 100, img: "https://via.placeholder.com/50" },
      { name: "Sói Quỷ", element: "Vật lý", power: 100, img: "https://via.placeholder.com/50" },
    ],
    rewards: [ // PHẦN THƯỞNG MỚI
        { type: "CREDIT", quantity: 500 },
        { type: "RUBY_STARLIGHT", quantity: 10 },
    ]
  },
  {
    id: 2,
    name: "Hang Bùa Xanh",
    desc: "Người Khổng Lồ Thuật Sĩ, đánh bại để nhận bùa phép.",
    img: "https://via.placeholder.com/300x150/2e2e2e/ffffff?text=Stage+2+Mist",
    top: 33, left: 33,
    difficulty: 3,
    enemies: [
      { name: "Cung Thủ", element: "Gió", power: 250, img: "https://via.placeholder.com/50" },
      { name: "Đấu Sĩ", element: "Đất", power: 300, img: "https://via.placeholder.com/50" },
    ],
    rewards: [
        { type: "CREDIT", quantity: 750 },
        { type: "RUBY_STARLIGHT", quantity: 15 },
    ]
  },
  {
    id: 3,
    name: "Hang bùa đỏ",
    desc: "Khu vực đầy bùn lầy và sinh vật nguy hiểm.",
    img: "https://via.placeholder.com/300x150/3e2f2f/ffffff?text=Stage+3+Swamp",
    top: 55, left: 53,
    difficulty: 4,
    enemies: [
      { name: "Quái Vật Bùn", element: "Nước", power: 400, img: "https://via.placeholder.com/50" },
      { name: "Côn Trùng Độc", element: "Độc", power: 350, img: "https://via.placeholder.com/50" },
    ],  
    rewards: [
        { type: "CREDIT", quantity: 1000 },
        { type: "RUBY_STARLIGHT", quantity: 20 },
    ]
  },
  {
    id: 4,
    name: "Thung Lũng Gió Lốc",
    desc: "Gió mạnh làm mất thăng bằng. Hãy cẩn thận.",
    img: "https://via.placeholder.com/300x150/2f3e4f/ffffff?text=Stage+4+Valley",
    top: 65, left: 85,
    difficulty: 5,
    enemies: [
      { name: "Chiến Binh Gió", element: "Gió", power: 500, img: "https://via.placeholder.com/50" },
      { name: "Pháp Sư Bão Tố", element: "Gió", power: 550, img: "https://via.placeholder.com/50" },
    ],
    rewards: [
        { type: "CREDIT", quantity: 1250 },
        { type: "RUBY_STARLIGHT", quantity: 25 },
    ]
  },
  {
    id: 5,
    name: "Thung Lũng Gió Lốc",
    desc: "Gió mạnh làm mất thăng bằng. Hãy cẩn thận.",
    img: "https://via.placeholder.com/300x150/2f3e4f/ffffff?text=Stage+4+Valley",
    top: 46, left: 68,
    difficulty: 5,
    enemies: [
      { name: "Chiến Binh Gió", element: "Gió", power: 500, img: "https://via.placeholder.com/50" },
      { name: "Pháp Sư Bão Tố", element: "Gió", power: 550, img: "https://via.placeholder.com/50" },
    ],
    rewards: [
        { type: "CREDIT", quantity: 1250 },
        { type: "RUBY_STARLIGHT", quantity: 25 },
    ]
  },
  {
    id: 6,
    name: "Thung Lũng Gió Lốc",
    desc: "Gió mạnh làm mất thăng bằng. Hãy cẩn thận.",
    img: "https://via.placeholder.com/300x150/2f3e4f/ffffff?text=Stage+4+Valley",
    top: 36, left: 50,
    difficulty: 5,
    enemies: [
      { name: "Chiến Binh Gió", element: "Gió", power: 500, img: "https://via.placeholder.com/50" },
      { name: "Pháp Sư Bão Tố", element: "Gió", power: 550, img: "https://via.placeholder.com/50" },
    ],
    rewards: [
        { type: "CREDIT", quantity: 1250 },
        { type: "RUBY_STARLIGHT", quantity: 25 },
    ]
  },
  {
    id: 7,
    name: "Thung Lũng Gió Lốc",
    desc: "Gió mạnh làm mất thăng bằng. Hãy cẩn thận.",
    img: "https://via.placeholder.com/300x150/2f3e4f/ffffff?text=Stage+4+Valley",
    top: 25, left: 36,
    difficulty: 5,
    enemies: [
      { name: "Chiến Binh Gió", element: "Gió", power: 500, img: "https://via.placeholder.com/50" },
      { name: "Pháp Sư Bão Tố", element: "Gió", power: 550, img: "https://via.placeholder.com/50" },
    ],
    rewards: [
        { type: "CREDIT", quantity: 1250 },
        { type: "RUBY_STARLIGHT", quantity: 25 },
    ]
  },
  {
    id: 8,
    name: "Thung Lũng Gió Lốc",
    desc: "Gió mạnh làm mất thăng bằng. Hãy cẩn thận.",
    img: "https://via.placeholder.com/300x150/2f3e4f/ffffff?text=Stage+4+Valley",
    top: 16, left: 28,
    difficulty: 5,
    enemies: [
      { name: "Chiến Binh Gió", element: "Gió", power: 500, img: "https://via.placeholder.com/50" },
      { name: "Pháp Sư Bão Tố", element: "Gió", power: 550, img: "https://via.placeholder.com/50" },
    ],
    rewards: [
        { type: "CREDIT", quantity: 1250 },
        { type: "RUBY_STARLIGHT", quantity: 25 },
    ]
  },
  {
    id: 9,
    name: "Thung Lũng Gió Lốc",
    desc: "Gió mạnh làm mất thăng bằng. Hãy cẩn thận.",
    img: "https://via.placeholder.com/300x150/2f3e4f/ffffff?text=Stage+4+Valley",
    top: 20, left: 65,
    difficulty: 5,
    enemies: [
      { name: "Chiến Binh Gió", element: "Gió", power: 500, img: "https://via.placeholder.com/50" },
      { name: "Pháp Sư Bão Tố", element: "Gió", power: 550, img: "https://via.placeholder.com/50" },
    ],
    rewards: [
        { type: "CREDIT", quantity: 1250 },
        { type: "RUBY_STARLIGHT", quantity: 25 },
    ]
  },
  {
    id: 10,
    name: "Ngai Vàng Hắc Ám (BOSS)",
    desc: "Nơi ở của Chúa Tể Vực Sâu. Chuẩn bị cho trận chiến cuối cùng.",
    img: "https://via.placeholder.com/300x150/5a0000/ffffff?text=Stage+10+BOSS",
    top: 15, left: 73,
    difficulty: 10, // Boss stage
    isBoss: true,
    enemies: [
        { name: "CHÚA TỂ VỰC SÂU", power: 9999, img: "https://via.placeholder.com/80" }
    ],
    rewards: [
        { type: "CREDIT", quantity: 5000 },
        { type: "RUBY_STARLIGHT", quantity: 100 },
        { type: "ITEM_RARE", quantity: 1 }
    ]
  },
];

const GameplayPage = () => {
  const navigate = useNavigate();
  
  // 🎮 State
  const [maxUnlockedStage, setMaxUnlockedStage] = useState(1); // Mặc định mở ải 1
  const [selectedStage, setSelectedStage] = useState(null); // Ải đang click vào xem
  const [showFormation, setShowFormation] = useState(false); // Hiện Box8Nav
  
  // Lấy đội hình từ localStorage để hiển thị preview
  const [previewTeam, setPreviewTeam] = useState([]);

  // Load progress & Team (Giả lập)
  useEffect(() => {
    // 1. Load tiến độ (sau này lấy từ API)
    const savedProgress = localStorage.getItem("gameProgress");
    if (savedProgress) setMaxUnlockedStage(parseInt(savedProgress));

    // 2. Load đội hình preview
    loadTeamPreview();
  }, [showFormation]); // Reload khi đóng Box8Nav

  const loadTeamPreview = () => {
    try {
      const formationData = JSON.parse(atob(localStorage.getItem("formation") || ""));
      // Mặc định lấy Team 1 (id 1) hoặc team đang chọn
      const currentTeam = formationData.teams?.find(t => t.id === 1) || formationData.teams[0];
      
      // Lấy ownership để map ra ảnh tướng
      const ownershipData = JSON.parse(atob(localStorage.getItem("ownership") || ""));
      // (Ở đây ta cần data characters đầy đủ để lấy ảnh, 
      // trong thực tế bạn nên export data characters ra file riêng để import vào đây dùng chung.
      // Tạm thời tôi sẽ giả lập hiển thị ID hoặc placeholder nếu không có data context)
      
      setPreviewTeam(currentTeam?.members || []);
    } catch (e) {
      console.log("Chưa có đội hình");
    }
  };

  // Xử lý khi click vào ải
  const handleStageClick = (stage) => {
    if (stage.id > maxUnlockedStage) return; // Bị khóa thì không làm gì
    setSelectedStage(stage);
  };

  // Bắt đầu chiến đấu (Placeholder)
  const handleStartBattle = () => {
    alert(`Bắt đầu chiến ải: ${selectedStage.name}`);
    // Navigate tới màn hình Combat
    // navigate("/game/combat", { state: { stageId: selectedStage.id } });
  };

  // Vẽ đường nối giữa các điểm (SVG Line)
  const renderPath = () => {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {STAGE_DATA.map((stage, index) => {
          if (index === STAGE_DATA.length - 1) return null;
          const nextStage = STAGE_DATA[index + 1];
          // Màu đường: Đã đi qua (vàng), Chưa đi (xám)
          const isUnlockedPath = stage.id < maxUnlockedStage;
          
          return (
            <line
              key={index}
              x1={`${stage.left}%`}
              y1={`${stage.top}%`}
              x2={`${nextStage.left}%`}
              y2={`${nextStage.top}%`}
              stroke={isUnlockedPath ? "#fbbf24" : "#4b5563"} // Amber-400 vs Gray-600
              strokeWidth="3"
              strokeDasharray="5,5"
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-['Roboto']">
      
      {/* 🖼️ BACKGROUND MAP */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{ 
            // Bạn thay link ảnh bản đồ world map của bạn vào đây
            backgroundImage: `url(${mapAov})` 
        }}
      />
      
      {/* Lớp phủ tối nhẹ */}
      <div className="absolute inset-0 bg-black/40" />

      {/* 🔙 BACK BUTTON */}
      <button
        onClick={() => navigate("/home")}
        className="absolute top-4 left-4 z-40 bg-black/60 px-4 py-2 rounded-lg border border-cyan-400 text-white flex items-center gap-2 hover:bg-cyan-900/50 transition"
      >
        <ArrowLeft size={20} /> Về thành
      </button>

      {/* 🗺️ MAP AREA */}
      <div className="relative w-full h-full">
        {renderPath()}

        {STAGE_DATA.map((stage) => {
          const isUnlocked = stage.id <= maxUnlockedStage;
          const isCompleted = stage.id < maxUnlockedStage;
          const isBoss = stage.isBoss;

          return (
            <div
              key={stage.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10
                ${isUnlocked ? "cursor-pointer hover:scale-110" : "opacity-50 grayscale"}
              `}
              style={{ top: `${stage.top}%`, left: `${stage.left}%` }}
              onClick={() => handleStageClick(stage)}
            >
              {/* NODE ICON */}
              <div className={`
                w-12 h-12 lg:w-16 lg:h-16 rounded-full border-2 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.8)] relative
                ${isBoss 
                    ? "bg-red-900 border-red-500 shadow-red-500/50" 
                    : isCompleted 
                        ? "bg-green-800 border-green-400" 
                        : isUnlocked 
                            ? "bg-yellow-600 border-yellow-300 animate-pulse" 
                            : "bg-gray-800 border-gray-600"
                }
              `}>
                {isCompleted ? <CheckCircle className="text-green-300" /> : 
                 !isUnlocked ? <Lock className="text-gray-400" /> :
                 isBoss ? <Skull className="text-red-300 w-8 h-8" /> : 
                 <Swords className="text-yellow-200" />
                }
                
                {/* Stage Number Badge */}
                <div className="absolute -top-2 -right-2 bg-black/80 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full border border-white/30">
                  {stage.id}
                </div>
              </div>

              {/* Tên ải (chỉ hiện khi unlock) */}
              {isUnlocked && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-32 text-center">
                    <span className="bg-black/70 text-white text-[10px] lg:text-xs px-2 py-1 rounded border border-white/20 block truncate">
                        {stage.name}
                    </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 📜 STAGE DETAIL MODAL */}
      {selectedStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-gray-900 border border-yellow-600/50 w-full max-w-4xl rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.2)] flex flex-col lg:flex-row max-h-[90vh]">
            
            {/* Cột Trái: Thông tin ải */}
            <div className="lg:w-1/2 p-6 border-b lg:border-b-0 lg:border-r border-gray-700 flex flex-col gap-4">
                
              {/* Ảnh và Tên ải */}
              <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-600">
                <img src={selectedStage.img} alt={selectedStage.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                  <h2 className="text-xl font-bold text-yellow-400">{selectedStage.id}. {selectedStage.name}</h2>
                </div>
              </div>
              
              {/* Độ Khó */}
              <div className="flex items-center gap-2 text-sm font-bold text-orange-400">
                <Zap size={18} /> 
                <span>Độ khó:</span>
                <span className="text-lg text-white">{selectedStage.difficulty} / 10</span>
                <div className="h-2 w-32 bg-gray-700 rounded-full overflow-hidden ml-2">
                    <div 
                        className="h-full bg-orange-500 transition-all duration-500" 
                        style={{ width: `${selectedStage.difficulty * 10}%` }}
                    />
                </div>
              </div>

              <p className="text-gray-300 italic text-sm border-l-2 border-yellow-500 pl-3">
                "{selectedStage.desc}"
              </p>

              {/* Phần Thưởng */}
              <div>
                <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                  <Trophy size={18} /> Phần thưởng
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {selectedStage.rewards.map((reward, idx) => {
                    const rewardInfo = REWARD_ICONS[reward.type] || { img: null, name: "Không rõ", icon: <Star size={16} className="text-gray-400" /> };
                    return (
                      <div key={idx} className="flex items-center bg-gray-700/50 p-2 rounded-lg border border-gray-600 min-w-[120px]">
                        
                        {/* ICON PHẦN THƯỞNG (Ưu tiên ảnh PNG) */}
                        <div className="w-8 h-8 mr-2 flex items-center justify-center">
                            {rewardInfo.img ? (
                                <img src={rewardInfo.img} alt={rewardInfo.name} className="w-full h-full object-contain" />
                            ) : (
                                // Icon Lucide nếu không có ảnh PNG
                                rewardInfo.icon 
                            )}
                        </div>
                        
                        {/* SỐ LƯỢNG */}
                        <div>
                          <span className="text-xs text-gray-400 block">{rewardInfo.name}</span>
                          <span className="text-sm font-bold text-white">x {reward.quantity.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                  <Skull size={18} /> Đội hình kẻ địch
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {selectedStage.enemies.map((enemy, idx) => (
                    <div key={idx} className="flex flex-col items-center min-w-[70px]">
                      <div className="w-14 h-14 bg-red-900/40 rounded border border-red-500/50 flex items-center justify-center">
                        {/* Placeholder Enemy Image */}
                        <img src={enemy.img} alt={enemy.name} className="w-10 h-10" />
                      </div>
                      <span className="text-xs text-center text-gray-300 mt-1">{enemy.name}</span>
                      <span className="text-[10px] text-red-300">CP: {enemy.power}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cột Phải: Chuẩn bị chiến đấu */}
            <div className="lg:w-1/2 p-6 flex flex-col justify-between bg-gray-800/30">
              <div>
                <h3 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                   Đội hình của bạn
                </h3>
                
                {/* Preview Team */}
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {[0, 1, 2, 3, 4].map((i) => {
                    const charId = previewTeam[i];
                    return (
                        <div key={i} className="aspect-square bg-gray-900 rounded border border-gray-600 flex items-center justify-center">
                            {charId ? (
                                // Ở đây nếu có object characters đầy đủ thì render ảnh
                                // Tạm thời render ID hoặc icon
                                <div className="w-full h-full bg-blue-900/50 flex items-center justify-center text-xs font-bold text-white">
                                   ID: {charId}
                                </div>
                            ) : (
                                <span className="text-gray-600 text-xs">Trống</span>
                            )}
                        </div>
                    )
                  })}
                </div>

                <button 
                  onClick={() => setShowFormation(true)}
                  className="w-full py-2 border border-blue-500 text-blue-300 rounded hover:bg-blue-900/30 transition text-sm mb-6"
                >
                  Chỉnh sửa đội hình
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-auto">
                <button 
                  onClick={() => setSelectedStage(null)}
                  className="flex-1 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-bold transition"
                >
                  Đóng
                </button>
                <button 
                  onClick={handleStartBattle}
                  className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-500 hover:to-yellow-500 text-white font-bold shadow-lg shadow-red-900/50 transition transform hover:scale-105"
                >
                  CHIẾN ĐẤU NGAY
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 🛠️ FORMATION MODAL (BOX 8 NAV) */}
      {showFormation && (
        <Box8Nav 
          activeModal="formation" 
          closeModal={() => setShowFormation(false)} 
        />
      )}

    </div>
  );
};

export default GameplayPage;