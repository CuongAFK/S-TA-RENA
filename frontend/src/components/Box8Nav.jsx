import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

import { CHARACTERS_DATA } from "../data/charactersData";
// ⚙️ API cấu hình
const API_URL = "https://api-proxy.bbao12345321c.workers.dev/api/submit";
const SECRET_TOKEN = "Hacker-Is-Gay";

// ⚙️ Import hình ảnh

// Icon vai trò
import roleArcher from "../assets/images/roleImg/Xạ thủ.png";
import roleMage from "../assets/images/roleImg/Pháp sư.png";
import roleFighter from "../assets/images/roleImg/Đấu sĩ.png";
import roleAssassin from "../assets/images/roleImg/Sát thủ.png";
import roleSupport from "../assets/images/roleImg/Trợ thủ.png";
import roleTank from "../assets/images/roleImg/Đỡ đòn.png";

// Icon điểm kỹ năng
import skillOn from "../assets/icons/skillPointsOn.jpg";
import skillOff from "../assets/icons/skillPointsOff.jpg";

// ----------------------------------------------
// 🧾 MẪU DỮ LIỆU

// ownership mẫu
//{
// uid: "4783706",              // id người chơi
// ownedChars: ["1", "2"],      // danh sách id tướng sở hữu
// ownedEquips: ["1", "2"],     // danh sách id trang bị sở hữu
// equipped: {                  // nhân vật nào đang mang trang bị nào
//   "1": 2,                    // Valhein mang Giày Hermes (id 2)
//   "2": null                  // Triệu Vân chưa có trang bị
// }
//}
// ----------------------------------------------
//----------------------------------------------
// Mẫu dữ liệu trả về từ API
//----------------------------------------------
// 📦 [API: getUser]
// ✅ Dữ liệu mẫu trả về:
// {
//   "success": true,
//   "uid": 4783706,
//   "name": "AFK",
//   "avatarKey": "avt-4.jpg",
//   "frameKey": "frame-16.png"
// }

//----------------------------------------------

// 📦 [API: getOwnership]
// ✅ Dữ liệu mẫu trả về:
// {
//   "success": true,
//   "uid": "4783706",
//   "ownedChars": ["1", "2"],
//   "ownedEquips": ["1", "2"],
//   "equipped": { "1": 2, "2": null }
// }
// ⚠️ Lưu ý: `uid` là chuỗi, `ownedChars` và `ownedEquips` là mảng chuỗi, không phải số.

// ⚔️ Lớp Trang bị
class Equipment {
  constructor(id, name, img, desc, bonus = {}, roleBonus = {}, passive = "") {
    this.id = id;
    this.name = name;
    this.img = img;
    this.desc = desc;
    this.bonus = bonus;
    this.roleBonus = roleBonus;
    this.passive = passive;
  }

  // 👉 Tính bonus dựa trên vai trò nhân vật
  getBonusFor(charRoles = []) {
    let total = { ...this.bonus };

    for (const [role, bonusStats] of Object.entries(this.roleBonus || {})) {
      const match = charRoles.find(r => r.trim() === role.trim());
      // console.log("Check role:", role, "Có match:", !!match);

      if (match) {
        for (const [stat, val] of Object.entries(bonusStats)) {
          total[stat] = (total[stat] || 0) + val;
        }
      }
    }

    return total;
  }
}

const roleIcons = {
  "Xạ thủ": roleArcher,
  "Pháp sư": roleMage,
  "Đấu sĩ": roleFighter,
  "Sát thủ": roleAssassin,
  "Trợ thủ": roleSupport,
  "Đỡ đòn": roleTank,
};

function getSkillDesc(desc, c) {
  if (!desc) return "";

  // Thay số thực của sát thương vào mô tả
  desc = desc
    .replace(/\(stvl\)/g, `<span class='text-orange-400 font-semibold'>${c.stats.physicalDamage}</span>`)
    .replace(/\(sát thương phép\)/g, `<span class='text-purple-400 font-semibold'>${c.stats.magicDamage}</span>`)
    .replace(/hồi (\d+) điểm chiến kỹ/gi, `hồi <img src='${skillOn}' class='inline w-4 h-4 align-text-bottom'/> $1`)
    .replace(/tiêu hao (\d+) điểm chiến kỹ/gi, `tiêu hao <img src='${skillOff}' class='inline w-4 h-4 align-text-bottom'/> $1`);

  return desc;
}

export default function Box8Nav({ activeModal, closeModal }) {

  // 💾 Trạng thái đội hình
  const [showFormationModal, setShowFormationModal] = useState(false);
  const [formation, setFormation] = useState({ teams: [] });
  const [selectedTeam, setSelectedTeam] = useState(1);
  const [selectedFormationChar, setSelectedFormationChar] = useState(null); // Đổi tên từ selectedTeamChar để rõ ràng

  const [ownership, setOwnership] = useState({
    ownedChars: [],
    ownedEquips: [],
    equipped: {},
  });

  useEffect(() => {
    const loadFormation = () => {
      const encoded = localStorage.getItem("formation");

      // Nếu không có dữ liệu → dùng mặc định
      if (!encoded) {
        const defaultTeams = [
          { id: 1, name: "Team 1", members: [] },
          { id: 2, name: "Team 2", members: [] },
          { id: 3, name: "Team 3", members: [] },
        ];
        const defaultFormation = { teams: defaultTeams };
        setFormation(defaultFormation);
        localStorage.setItem("formation", btoa(JSON.stringify(defaultFormation)));
        return;
      }

      // Kiểm tra xem chuỗi có phải base64 hợp lệ không
      const isValidBase64 = (str) => {
        try {
          // atob sẽ throw nếu không hợp lệ
          const decoded = atob(str);
          // Kiểm tra thêm: phải decode ra được JSON hợp lệ
          JSON.parse(decoded);
          return true;
        } catch (e) {
          return false;
        }
      };

      if (isValidBase64(encoded)) {
        try {
          const decoded = JSON.parse(atob(encoded));
          setFormation(decoded);
        } catch (err) {
          console.error("Parse formation lỗi dù base64 hợp lệ:", err);
          resetToDefault();
        }
      } else {
        console.warn("Dữ liệu formation không phải base64 hợp lệ → reset về mặc định");
        resetToDefault();
      }
    };

    const resetToDefault = () => {
      const defaultTeams = [
        { id: 1, name: "Team 1", members: [] },
        { id: 2, name: "Team 2", members: [] },
        { id: 3, name: "Team 3", members: [] },
      ];
      const defaultFormation = { teams: defaultTeams };
      setFormation(defaultFormation);
      localStorage.setItem("formation", btoa(JSON.stringify(defaultFormation)));
    };

    loadFormation();
  }, []);



  async function getFormation() {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "getFormation",
          uid: ownership.uid,
        }),
      });
      const data = await res.json();
      console.log("✅ Formation loaded from API:", data);
      if (data.success) {
        const loadedFormation = { teams: data.teams || [] };
        setFormation(loadedFormation);
        localStorage.setItem("formation", btoa(JSON.stringify(loadedFormation)));
      }
    } catch (err) {
      console.error("Fetch formation lỗi:", err);
    }
  }

  useEffect(() => {
    const encoded = localStorage.getItem("ownership");
    if (encoded) {
      try {
        const decoded = JSON.parse(atob(encoded));
        setOwnership(decoded);
        console.log("✅ Ownership loaded:", decoded);

        // 🪄 GÁN TRANG BỊ CHO NHÂN VẬT DỰA THEO OWNERSHIP
        const mappedChars = characters.map(c => {
          // tìm id trang bị của nhân vật này (nếu có)
          const equipId = Number(decoded.equipped?.[c.id]);
          // tìm thông tin chi tiết trang bị đó
          const equip = allEquipments.find(e => e.id === equipId);
          // trả về nhân vật có thêm mainWeapon
          return { ...c, mainWeapon: equip || null };
        });
        setCharacters(mappedChars);
        console.log("✅ Characters updated with equipment:", mappedChars);

      } catch (err) {
        console.error("Decode ownership lỗi:", err);
      }
    }
  }, []);

  // ----------------------------------------------
  // 🧩 DỮ LIỆU NHÂN VẬT
  // ----------------------------------------------

  // Khởi tạo state bằng dữ liệu gốc import từ file
  const [characters, setCharacters] = useState(CHARACTERS_DATA);

  // ----------------------------------------------
  // 🎯 THÔNG TIN TRANG BỊ
  // ----------------------------------------------

  const SongDaoBaoTap = new Equipment(
    1,
    "Song Đao Bão Táp",
    "images/weapons/Song Đao Bão Táp.png",
    "Vũ khí kép của thợ săn, chứa năng lượng ma thuật gió xoáy.",
    { attackSpeed: 50, moveSpeed: 10 },
    { "Xạ thủ": { attackSpeed: 100 } },
    "Nội tại: Cuồng Phong – Khi dùng đòn đánh thường cường hóa → nhận tăng tốc 1 lượt."
  );

  const GiayHermes = new Equipment(
    2,
    "Giày Hermes",
    "images/weapons/Giày Hermes.png",
    "Đôi giày thần thoại giúp di chuyển nhanh hơn.",
    { moveSpeed: 30 },
    { "Trợ thủ": { moveSpeed: 10 } },
    "Nội tại: Gia tốc – Nếu người dùng không chịu hay gây sát thương ở lượt trước thì sau khi hành động sẽ nhận Tăng tốc 1."
  );

  const GiayKienCuong = new Equipment(
    3,
    "Giày Kiên Cường",
    "images/weapons/Giày kiên cường.png",
    "Đôi giày bền bỉ bảo vệ khỏi ma thuật.",
    { moveSpeed: 20 },
    { "Đỡ đòn": { magicResist: 10 } },
    "Nội tại: Kiên cường – Miễn nhiễm với hiệu ứng xấu đầu tiên dính phải và hồi lại Kiên cường khi tới lượt."
  );

  const NanhFenrir = new Equipment(
    4,
    "Nanh Fenrir",
    "images/weapons/Nanh Fenrir.png",
    "Chiếc nanh quái thú tăng cường stvl.",
    { physicalDamage: 5 },
    {
      "Xạ thủ": { physicalDamage: 5 },
      "Sát thủ": { physicalDamage: 5 },
      "Đấu sĩ": { physicalDamage: 5 },
    },
    "Nội tại: Chinh phạt – Sát thương gây cho mục tiêu dưới 50% máu thêm 10 stvl."
  );

  const ThanhKiem = new Equipment(
    5,
    "Thánh Kiếm",
    "images/weapons/Thánh kiếm.png",
    "Kiếm thánh tỏa sáng, tăng sức mạnh công kích.",
    { physicalDamage: 5 },
    {
      "Sát thủ": { physicalDamage: 5 },
      "Xạ thủ": { moveSpeed: 10 },
    },
    "Nội tại: Chí mạng – Đòn đánh thường cường hóa gây thêm +10 stvl."
  );

  // Danh sách tất cả trang bị
  const allEquipments = [SongDaoBaoTap, GiayHermes, GiayKienCuong, NanhFenrir, ThanhKiem];

  const [selectedChar, setSelectedChar] = useState(null);
  const [activeTab, setActiveTab] = useState("stats");
  const [selectedEquip, setSelectedEquip] = useState(null);
  const [equipFilterRole, setEquipFilterRole] = useState("Tất cả");

  // ----------------------------------------------
  // 🧾 TỪ ĐIỂN TÊN CHỈ SỐ
  // ----------------------------------------------
  const statLabels = {
    hp: "Máu hiện tại",
    maxHp: "Máu tối đa",
    mana: "Năng lượng hiện tại",
    maxMana: "Năng lượng tối đa",
    physicalDamage: "Sát thương vật lý",
    magicDamage: "Sát thương phép",
    moveSpeed: "Tốc chạy",
    attackSpeed: "Tốc đánh",
    lifesteal: "Hút máu",
    armor: "Giáp vật lý",
    magicResist: "Kháng phép",
    damageReduction: "Miễn thương",
    shield: "Lá chắn",
  };

  const statColor = {
    hp: "text-green-400",
    maxHp: "text-green-600",
    mana: "text-blue-300",
    maxMana: "text-blue-400",
    physicalDamage: "text-orange-400",
    magicDamage: "text-purple-400",
    armor: "text-yellow-300",
    magicResist: "text-indigo-300",
    moveSpeed: "text-cyan-300",
    attackSpeed: "text-green-300",
    lifesteal: "text-red-400",
    shield: "text-gray-200",
    damageReduction: "text-teal-400",
  };

  const updateOwnership = async (newOwnership, saveToApi = false) => {
    try {
      // Lưu local luôn
      localStorage.setItem("ownership", btoa(JSON.stringify(newOwnership)));
      setOwnership(newOwnership);

      // Chỉ lưu API nếu saveToApi = true (khi đóng chi tiết nhân vật)
      if (saveToApi) {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "updateOwnership",
            uid: newOwnership.uid,
            ownedChars: newOwnership.ownedChars,
            ownedEquips: newOwnership.ownedEquips,
            equipped: newOwnership.equipped,
          }),
        });
        console.log("✅ Ownership updated to API:", newOwnership);
      } else {
        console.log("✅ Ownership updated locally (API deferred):", newOwnership);
      }
    } catch (err) {
      console.error("❌ Lỗi update ownership:", err);
    }
  };

  async function updateFormation() {
    if (!ownership.uid) {
      console.log("Guest mode → không lưu formation vào DB");
      return;
    }

    console.log("Saving formation to API:", formation.teams);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateFormation",
          uid: ownership.uid,
          teams: formation.teams,
        }),
      });
      const result = await res.json();
      console.log("updateFormation result:", result);
    } catch (err) {
      console.error("Lỗi update formation:", err);
    }
  }

  const handleEquip = (charId, equipId) => {
    const newData = { ...ownership };
    newData.equipped[charId] = equipId;
    updateOwnership(newData); // Lưu local, defer API
  };

  const handleUnequip = (charId) => {
    const newData = { ...ownership };
    newData.equipped[charId] = null;
    updateOwnership(newData); // Lưu local, defer API
  };

  const handleUnlock = (type, id) => {
    const newData = { ...ownership };
    if (type === "char" && !newData.ownedChars.includes(String(id))) {
      newData.ownedChars.push(String(id));
    }
    if (type === "equip" && !newData.ownedEquips.includes(String(id))) {
      newData.ownedEquips.push(String(id));
    }
    updateOwnership(newData); // Lưu local, defer API
  };

  // ----------------------------------------------
  // 🧱 DANH SÁCH NHÂN VẬT
  // ----------------------------------------------
  const renderCharacterList = () => (
    <div className="grid grid-cols-5 gap-4">
      {characters.map((char) => {
        const isOwned = ownership.ownedChars.includes(String(char.id));
        return (
          <div
            key={char.id}
            onClick={() => isOwned && setSelectedChar(char)} // chỉ click được khi sở hữu
            className={`btn border border-white/30 rounded-xl overflow-hidden transition-transform 
            ${isOwned ? "bg-gray-800 hover:scale-105" : "bg-black/80 opacity-50 cursor-not-allowed"}`}
          >
            <div className="relative flex items-center justify-center">
              <img
                src={char.assets.portrait.list}
                alt={char.name}
                className="w-auto lg:h-85 object-cover"
              />
              {/* Icon vai trò */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                {char.roles.map((r, i) => (
                  <img
                    key={i}
                    src={roleIcons[r]}
                    alt={r}
                    title={r}
                    className="w-5 h-5 lg:w-12 lg:h-12 rounded-full border border-white/70"
                  />
                ))}
              </div>
              {!isOwned && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs lg:text-sm text-red-400 font-bold">
                  Chưa sở hữu
                </div>
              )}
            </div>
            <div className="p-1 lg:p-3 text-center">
              <h3 className="font-bold text-[15px] lg:text-lg">{char.name}</h3>
              <p className="font-[roboto] text-[10px] lg:text-xs text-gray-400 italic">{char.faction}</p>
            </div>
          </div>
        );
      })}
    </div>
  );

  // ----------------------------------------------
  // 🧩 CHI TIẾT NHÂN VẬT (dùng chung cho cả modal character và formation)
  // ----------------------------------------------
  const renderCharacterDetail = (c, onClose) => {
    if (!c) return null;

    // Gán bonus từ vũ khí
    // Vai trò chính là phần tử đầu tiên trong mảng roles
    const mainRole = c.roles[0];

    // 📊 Tính toán chỉ số
    const baseStats = c.stats;
    const weaponBonus = c.mainWeapon ? c.mainWeapon.getBonusFor(c.roles) : {};
    const totalStats = { ...baseStats };

    Object.entries(weaponBonus).forEach(([stat, val]) => {
      totalStats[stat] = (totalStats[stat] || 0) + val;
    });

    const getSkillDesc = (text) => {
      // Tính chỉ số thật (có bonus từ trang bị)
      const pd = totalStats.physicalDamage || 0;
      const md = totalStats.magicDamage || 0;

      return text
        // (X + st) → X + Damage
        .replace(/\((\d+)\s*\+\s*stvl\)/gi, (_, base) =>
          `<span class='text-orange-400 font-bold'>${base}(+${pd}) sát thương vật lý</span>`
        )
        .replace(/\((\d+)\s*\+\s*stp\)/gi, (_, base) =>
          `<span class='text-purple-400 font-bold'>${base}(+${md}) sát thương phép</span>`
        )
        .replace(/\((\d+)\s*\+\s*stc\)/gi, (_, base) =>
          `<span class='text-white font-bold'>${base}(+${md}) sát thương chuẩn</span>`
        )
        // (stvl) → số dmg
        .replace(/\(stvl\)/gi,
          `<span class='text-orange-300 font-semibold'>${pd} sát thương vật lý</span>`
        )
        .replace(/\(stp\)/gi,
          `<span class='text-purple-300 font-semibold'>${md} sát thương phép</span>`
        )
        // Công thức (X = st) → hiển thị X = chỉ số hiện tại
        .replace(/\((\d+)\s*=\s*stvl\)/gi, (_, base) =>
          `<span class='text-orange-400 font-bold'>${base} sát thương vật lý</span>`
        )
        .replace(/\((\d+)\s*=\s*stp\)/gi, (_, base) =>
          `<span class='text-purple-400 font-bold'>${base} sát thương phép</span>`
        )
        .replace(/\((\d+)\s*=\s*stc\)/gi, (_, base) =>
          `<span class='text-white font-bold'>${base} sát thương chuẩn</span>`
        )
        // Highlight keyword
        .replace(/stc/gi, `<span class='text-white font-bold'>Sát thương chuẩn</span>`)
        .replace(/đòn đánh thường cường hóa/gi, `<span class='text-orange-200 font-bold'>Đòn đánh thường cường hóa</span>`)
        .replace(/đòn chiến kỹ cường hóa/gi, `<span class='text-cyan-300 font-bold'>Đòn chiến kỹ cường hóa</span>`)
        // Điểm chiến kỹ (icon)
        .replace(/hồi (\d+) điểm chiến kỹ/gi, `<span class='text-green-300 font-bold'>Hồi $1 Điểm chiến kỹ </span><img src='${skillOn}' class='inline w-4 h-4 align-text-bottom'/> `)
        .replace(/tiêu hao (\d+) điểm chiến kỹ/gi, `<span class='text-red-300 font-bold'>Tiêu hao $1 Điểm chiến kỹ </span><img src='${skillOff}' class='inline w-4 h-4 align-text-bottom'/> `)
        //key
        .replace(/hiệu ứng khống chế/gi, `<span class='text-red-200 font-bold'>Hiệu ứng khống chế</span>`)
        .replace(/giải khống chế/gi, `<span class='text-green-200 font-bold'>Giải khống chế</span>`);
    };

    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
      >
        <div className="relative text-white rounded-xl overflow-hidden border-2 lg:border-15 border-white/1 min-h-[800px] lg:min-h-[650px] w-[100%] max-w-7xl bg-gray-900/95 p-4">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${c.assets.portrait.banner})` }}
          />
          <div className="absolute inset-0 bg-black/60" />

          <div className="relative z-10 grid grid-cols-2 gap-3 lg:gap-6 p-3 lg:p-6 lg:h-150">
            {/* CỘT TRÁI */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                <img
                  src={c.assets.portrait.list}
                  alt={c.name}
                  className="w-auto max-h-[150px] lg:max-h-[350px] object-contain rounded-xl border border-white/20 shadow-lg"
                />
                {/* Icon vai trò */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                  {c.roles?.map((r, i) => (
                    <img
                      key={i}
                      src={roleIcons[r]}
                      alt={r}
                      title={r}
                      className="w-5 h-5 lg:w-12 lg:h-12 rounded-full border border-white/70 shadow-md"
                    />
                  ))}
                </div>

                {/* Trang bị góc phải */}
                {c.mainWeapon ? (
                  <img
                    src={c.mainWeapon.img}
                    alt={c.mainWeapon.name}
                    className="absolute top-2 right-2 w-7 h-7 lg:w-14 lg:h-14 rounded-full border border-yellow-400 btn"
                    title={c.mainWeapon.name}
                    onClick={() => setSelectedEquip(c.mainWeapon)}
                  />
                ) : (
                  <div
                    className="absolute top-2 right-2 w-14 h-14 rounded-full border border-gray-500 flex items-center justify-center text-xs text-gray-400 bg-gray-800/70"
                    title="Chưa có trang bị"
                  >
                    Trống
                  </div>
                )}
              </div>
              <h3 className="text[10px] lg:text-2xl font-bold mt-4">{c.name}</h3>
              <p className="text[7px] lg:text-sm italic text-gray-300">
                {c.roles?.join(" • ")}
              </p>
              <p className="text-sm italic text-blue-600">
                {c.faction}
              </p>
            </div>

            {/* CỘT PHẢI */}
            <div className="bg-black/60 rounded-xl p-4 font-['Roboto'] text-sm overflow-y-auto max-h-[260px] lg:max-h-[600px] scroll-smooth">

              {/* TAB MENU */}
              <div className="flex justify-center gap-2 mb-1 lg:mb-6 bg-gray-800/50 backdrop-blur-sm p-1.5 rounded-xl border border-gray-700/50">
                {["stats", "skills", "story", "equip"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`p-1 lg:px-4 lg:py-2 rounded-lg text-[8px] lg:text-sm font-semibold transition ${activeTab === tab
                      ? "bg-white text-black"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      }`}
                  >
                    {tab === "stats"
                      ? "⚡ Chỉ số"
                      : tab === "skills"
                        ? "⚔️ Chiêu thức"
                        : tab === "story"
                          ? "📖 Cốt truyện"
                          : "🛡️ Trang bị"}
                  </button>
                ))}
              </div>

              {/* TAB NỘI DUNG */}
              {activeTab === "stats" && (
                <div className="text-sm space-y-1 overflow-y-auto lg:max-h-[350px]">
                  <div className="grid grid-cols-[50%_30%_20%] gap-0 font-bold border-b border-gray-600 pb-1 mb-1">
                    <span>Chỉ số</span>
                    <span className="text-gray-400">Gốc (+Bonus)</span>
                    <span className="text-white">Tổng</span>
                  </div>

                  {Object.keys(statLabels).map((key) => (
                    <div key={key} className="grid grid-cols-[50%_30%_20%]  gap-0 border-b border-gray-700 py-1">
                      <span className={`${statColor[key] || "text-gray-300"}`}>{statLabels[key]}</span>
                      <span className="text-gray-400">
                        {baseStats[key] || 0}
                        {weaponBonus[key] ? ` (+${weaponBonus[key]})` : ""}
                      </span>
                      <span className={`${statColor[key] || "text-gray-300"}`}>{totalStats[key] || 0}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "skills" && (
                <div className="space-y-3 text-sm">
                  {Object.entries(c.skills).map(([key, s], idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 border border-gray-700 rounded-lg p-3 bg-gray-800/40"
                    >
                      {/* Ảnh kỹ năng */}
                      <img
                        src={s.visuals.icon}
                        alt={s.title}
                        className="w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-white/30 object-cover"
                      />

                      {/* Nội dung */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-300 font-bold">{s.type}</span>
                          <span className="text-white font-semibold">{s.title}</span>
                          <div className="flex flex-wrap gap-1">
                            {s.tags?.map((tag, i) => {
                              const tagColors = {
                                "Cường hóa": "bg-orange-600 text-white",
                                "Đặc biệt": "bg-pink-600 text-white",
                                "-50 Mana": "bg-blue-600 text-white",
                                "+1 Điểm chiến kỹ": "bg-green-600 text-white",
                                "-1 Điểm chiến kỹ": "bg-red-600 text-white",
                                "Diện rộng": "bg-green-800 text-white",
                                "Hồi 1 điểm chiến kỹ": "bg-green-600 text-white",
                                "Tăng ST": "bg-yellow-500 text-black",
                                "Giải khống chế": "bg-purple-500 text-white",

                              };
                              return (
                                <span
                                  key={i}
                                  className={`px-2 py-0.5 text-xs rounded-full ${tagColors[tag] || "bg-gray-700 text-gray-300 border-gray-600"}`}
                                >
                                  {tag}
                                </span>
                              );
                            })}

                          </div>
                        </div>

                        <div
                          className="text-gray-300 whitespace-pre-line leading-relaxed mt-1"
                          dangerouslySetInnerHTML={{ __html: getSkillDesc(s.desc, c) }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "story" && (
                <div className="text-sm leading-relaxed text-gray-300 whitespace-pre-line">
                  {c.story}
                </div>
              )}

              {activeTab === "equip" && (
                <div className="text-sm space-y-2">
                  {/* Bộ lọc */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {["Tất cả", ...Object.keys(roleIcons)].map((role) => (
                      <button
                        key={role}
                        onClick={() => setEquipFilterRole(role)}
                        className={`px-2 py-1 rounded-lg text-xs font-semibold border transition
            ${equipFilterRole === role
                            ? "bg-yellow-400 text-black border-yellow-500"
                            : "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"}`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>

                  {/* Danh sách trang bị */}
                  {allEquipments
                    .filter(equip => {
                      if (equipFilterRole === "Tất cả") return true;
                      return equip.roleBonus && Object.keys(equip.roleBonus).includes(equipFilterRole);
                    })
                    .map((equip, idx) => {
                      const isOwned = ownership.ownedEquips.includes(String(equip.id));
                      const equippedChar = characters.find(ch => ch.mainWeapon?.id === equip.id);
                      const isEquippedHere = c.mainWeapon?.id === equip.id;
                      const isEquippedOther = equippedChar && equippedChar.id !== c.id;

                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition 
          ${isOwned ? "btn" : "bg-black/70 opacity-50 cursor-not-allowed"}
          ${isEquippedHere ? "border-green-400 bg-green-800/30" : ""}
          ${isEquippedOther ? "border-red-400 bg-red-800/30" : ""}
          ${!equippedChar && isOwned ? "border-gray-600 bg-gray-700/30 hover:bg-gray-600/50" : ""}`}
                          onClick={() => isOwned && setSelectedEquip(equip)}
                        >
                          <img src={equip.img} className="w-12 h-12 rounded-full border border-white/30" />
                          <div className="flex-1">
                            <p className="font-bold">{equip.name}</p>
                            <p className="text-xs text-gray-300">{equip.desc}</p>
                          </div>

                          {!isOwned ? (
                            <span className="text-red-400 text-xs font-bold">Chưa sở hữu</span>
                          ) : isEquippedHere ? (
                            <span className="text-green-400 font-bold text-xs">Đang dùng</span>
                          ) : isEquippedOther ? (
                            <div className="flex items-center gap-1 text-red-400 text-xs">
                              <img
                                src={equippedChar.thumb}
                                className="w-5 h-5 rounded-full border border-white/50"
                                alt={equippedChar.name}
                              />
                              <span>{equippedChar.name}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs italic">Chưa dùng</span>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          {/* Nút quay lại */}
          <button
            onClick={() => {
              // Lưu API khi đóng chi tiết nhân vật
              updateOwnership(ownership, true);
              onClose();
              setActiveTab("stats");
            }}
            className="font-[roboto] absolute top-4 left-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-xs lg:text-sm font-semibold z-20 flex items-center gap-2 border-2 border-red-400/30"
          >
            <svg
              className="w-4 h-4 lg:w-5 lg:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Quay lại</span>
          </button>
        </div>
      </div>
    );
  };

  // ----------------------------------------------
  // MODAL HIỂN THỊ TRANG BỊ CHI TIẾT
  // ----------------------------------------------
  const renderEquipDetail = (currentChar) => {
    const equip = selectedEquip;
    if (!equip) return null;

    // Tìm xem trang bị đang gắn cho ai (nếu có)
    const equippedChar = characters.find(ch => ch.mainWeapon?.name === equip.name);
    // Kiểm tra trang bị đang gắn cho nhân vật được chọn hay cho người khác
    const isEquippedHere = currentChar && currentChar.mainWeapon?.name === equip.name;
    const isEquippedOther = equippedChar && (!currentChar || equippedChar.id !== currentChar.id);

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50">
        <div className="bg-gray-900/95 p-6 rounded-xl border border-white/30 w-[420px] text-white relative font-['Roboto']">
          <button
            onClick={() => setSelectedEquip(null)}
            className="absolute top-2 right-2 hover:text-red-400"
          >
            <X size={22} />
          </button>

          {/* Header: ảnh + tên */}
          <div className="flex items-center gap-3 mb-3">
            <img src={equip.img} className="w-16 h-16 rounded-full border border-white/50" alt={equip.name} />
            <div className="flex-1">
              <h3 className="text-xl font-bold">{equip.name}</h3>
              <p className="text-sm text-gray-400">{equip.desc}</p>
            </div>
          </div>

          {/* Ai đang gắn */}
          <div className="mb-3 text-sm">
            {isEquippedHere && (
              <p className="text-green-300">Trang bị này đang được gắn cho <span className="font-semibold">{currentChar.name}</span>.</p>
            )}
            {isEquippedOther && (
              <div className="flex items-center gap-2 text-red-300">
                <img src={equippedChar.thumb} alt={equippedChar.name} className="w-6 h-6 rounded-full border" />
                <p>Đang gắn cho <span className="font-semibold">{equippedChar.name}</span>.</p>
              </div>
            )}
            {!equippedChar && (
              <p className="text-gray-300 italic">Chưa có nhân vật nào gắn trang bị này.</p>
            )}
          </div>

          {/* Bonus cơ bản */}
          <div className="space-y-1 text-sm mb-2">
            {Object.entries(equip.bonus).map(([key, val]) => (
              <p key={key} className={`${statColor[key] || "text-gray-300"}`}>
                +{val} {statLabels[key] || key}
              </p>
            ))}
          </div>

          {/* Bonus theo vai trò */}
          {equip.roleBonus && (
            <div className="mt-2 space-y-1 text-xs">
              {Object.entries(equip.roleBonus).map(([role, bonus]) => (
                <p key={role} className="text-yellow-300">
                  Nếu trang bị bởi <span className="font-bold">{role}</span>:{" "}
                  {Object.entries(bonus)
                    .map(([stat, val]) => `+${val} ${statLabels[stat] || stat}`)
                    .join(", ")}
                </p>
              ))}
            </div>
          )}

          {/* Passive */}
          {equip.passive && (
            <p className="text-blue-300 text-xs italic mt-3">{equip.passive}</p>
          )}

          {/* Nút hành động (logic: gắn / tháo) */}
          <div className="flex justify-end gap-3 mt-4">
            {/* Nếu không có currentChar (không mở từ trong chi tiết nhân vật) -> ẩn nút gắn/tháo */}
            {!currentChar && (
              <button
                onClick={() => setSelectedEquip(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded-lg text-sm"
              >
                Đóng
              </button>
            )}

            {currentChar && (
              <>
                {isEquippedHere ? (
                  // Nếu trang bị đang gắn cho nhân vật đang xem -> hiện THÁO
                  <button
                    onClick={() => {
                      const updatedCurrent = { ...currentChar, mainWeapon: null };  // Cập nhật currentChar mới
                      const updatedChars = characters.map(ch => ch.id === currentChar.id ? updatedCurrent : ch);
                      setCharacters(updatedChars);
                      handleUnequip(currentChar.id);
                      setSelectedEquip(null);

                      // Set lại state selected để modal refresh ngay
                      if (activeModal === 'character') {
                        setSelectedChar(updatedCurrent);
                      } else {
                        setSelectedFormationChar(updatedCurrent);
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg text-sm"
                  >
                    Tháo
                  </button>
                ) : isEquippedOther ? (
                  // Nếu trang bị đang gắn cho người khác -> chỉ hiện nút đóng
                  <button
                    onClick={() => setSelectedEquip(null)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded-lg text-sm"
                  >
                    Đóng
                  </button>
                ) : (
                  // Nếu chưa ai dùng -> hiện GẮN cho nhân vật đang chọn
                  <button
                    onClick={() => {
                      const updatedCurrent = { ...currentChar, mainWeapon: equip };  // Cập nhật currentChar mới
                      const updatedChars = characters.map(ch => ch.id === currentChar.id ? { ...ch, mainWeapon: equip } : ch);
                      setCharacters(updatedChars);
                      handleEquip(currentChar.id, equip.id);
                      setSelectedEquip(null);
                      // Set lại state selected để modal refresh ngay
                      if (activeModal === 'character') {
                        setSelectedChar(updatedCurrent);
                      } else {
                        setSelectedFormationChar(updatedCurrent);
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg text-sm"
                  >
                    Gắn cho {currentChar.name}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTeamFormation = () => {
    if (!formation?.teams?.length) return null;
    return (
      <div className="p-6 text-white font-['Roboto'] grid grid-cols-10 gap-6 h-full">
        {/* 🧭 CỘT TRÁI - DANH SÁCH TƯỚNG */}
        <div className="col-span-3 bg-gray-800/40 rounded-xl p-3 overflow-y-auto border border-white/10">
          <h3 className="text-lg font-bold mb-3 text-center">Danh sách tướng</h3>
          <div className="grid grid-cols-3 gap-2">
            {ownership?.ownedChars?.map((cid) => {
              const c = characters.find((cc) => cc.id === Number(cid));
              if (!c) return null;
              const team = formation.teams.find((t) => t.id === selectedTeam);
              const isPicked = team?.members.includes(c.id);

              return (
                <div
                  key={c.id}
                  onClick={() => {
                    // 1. Tạo mảng teams mới
                    const updatedTeams = formation.teams.map((t) => {
                      if (t.id === selectedTeam) {
                        let members = [...t.members];
                        if (isPicked) {
                          members = members.filter((m) => m !== c.id);
                        } else if (members.length < 5) {
                          members.push(c.id);
                        }
                        return { ...t, members };
                      }
                      return t;
                    });

                    // 2. Tạo object formation mới
                    const updatedFormation = { teams: updatedTeams };

                    // 3. Cập nhật state + localStorage
                    setFormation(updatedFormation);
                    localStorage.setItem("formation", btoa(JSON.stringify(updatedFormation)));
                  }}
                  className={`relative border rounded-lg overflow-hidden transition hover:scale-105 cursor-pointer ${isPicked ? "border-green-400" : "border-gray-700"
                    }`}
                >
                  {/* Ảnh tướng */}
                  <img src={c.assets.portrait.play} alt={c.name} className="w-full h-full object-cover btn" />

                  {/* Vũ khí góc phải */}
                  {c.mainWeapon && (
                    <img
                      src={c.mainWeapon.img}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full border border-yellow-400"
                      alt={c.mainWeapon.name}
                    />
                  )}

                  {/* Vai trò + phe (xếp dọc, căn giữa) */}
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center text-center">
                    <div className="flex gap-1 mb-0.5">
                      {c.roles.map((r, i) => (
                        <img
                          key={i}
                          src={roleIcons[r]}
                          title={r}
                          className="w-4 h-4 rounded-full border border-white/50"
                        />
                      ))}
                    </div>
                    <span className="text-[8px] bg-black/70 px-1 rounded text-gray-200 truncate">
                      {c.faction}
                    </span>
                  </div>

                </div>

              );
            })}
          </div>
        </div>

        {/* ⚙️ CỘT PHẢI - XẾP ĐỘI HÌNH */}
        <div className="col-span-7 bg-gray-900/50 rounded-xl p-5 border border-white/10">
          <div className="flex gap-4 mb-4">
            {/* Tabs chọn team */}
            <div className="flex flex-col gap-2">
              {formation.teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeam(team.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border ${selectedTeam === team.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    }`}
                >
                  {team.name}
                </button>
              ))}
            </div>

            {/* Vùng đội hình */}
            <div className="flex-1 flex items-center justify-around">
              {Array.from({ length: 5 }).map((_, i) => {
                const team = formation.teams.find((t) => t.id === selectedTeam);
                const charId = team?.members[i];
                const char = characters.find((c) => c.id === charId);
                return (
                  <div
                    key={i}
                    className="relative w-32 h-full bg-gray-700/60 border-2 border-white/20 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer hover:scale-105 transition"
                    onClick={() => char && setSelectedFormationChar(char)}
                  >
                    {char ? (
                      <>
                        <img src={char.assets.portrait.list} alt={char.name} className="object-cover w-full h-full btn" />

                        {/* Vũ khí góc phải */}
                        {char.mainWeapon && (
                          <img
                            src={char.mainWeapon.img}
                            className="absolute top-1 right-1 w-8 h-8 rounded-full border border-yellow-400"
                            alt={char.mainWeapon.name}
                          />
                        )}

                        {/* Vai trò + phe (căn giữa dọc) */}
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center text-center">
                          <div className="flex gap-1 mb-0.5">
                            {char.roles.map((r, i) => (
                              <img
                                key={i}
                                src={roleIcons[r]}
                                className="w-5 h-5 rounded-full border border-white/50"
                              />
                            ))}
                          </div>
                          <span className="text-[10px] bg-black/70 px-1 rounded text-gray-200 truncate">
                            {char.faction}
                          </span>
                        </div>

                      </>

                    ) : (
                      <span className="text-gray-500 text-sm">Trống</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Render chi tiết nhân vật như modal con trong formation */}
        {selectedFormationChar && renderCharacterDetail(selectedFormationChar, () => setSelectedFormationChar(null))}

        {/* Render equip detail nếu có (truyền currentChar là selectedFormationChar) */}
        {selectedEquip && selectedFormationChar && renderEquipDetail(selectedFormationChar)}

      </div>
    );
  };

  // ----------------------------------------------
  // RENDER CHUNG
  // ----------------------------------------------
  const renderContent = () => {
    switch (activeModal) {
      case "character":
        return selectedChar
          ? renderCharacterDetail(selectedChar, () => setSelectedChar(null))
          : renderCharacterList();
      case "inventory":
        return <p>Túi đồ chứa vật phẩm, trang bị và nguyên liệu.</p>;
      case "formation":
        return renderTeamFormation();
      case "encyclopedia":
        return <p>Bách khoa toàn thư.</p>;
      case "quest":
        return <p>Nhiệm vụ.</p>;
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (activeModal) {
      case "formation": return "Đội hình xuất trận";
      case "inventory": return "Túi đồ";
      case "character": return selectedChar ? selectedChar.name : "Danh sách nhân vật";
      case "encyclopedia": return "Bách khoa toàn thư";
      case "quest": return "Nhiệm vụ";
      default: return "Thông tin";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative bg-gray-900/95 border border-white rounded-2xl p-2 lg:p-6 w-[90%] text-white shadow-2xl h-[90%] overflow-y-auto">
        <button
          onClick={() => {
            // Khi đóng modal chính, lưu API nếu có thay đổi (nhưng chi tiết nhân vật đã lưu rồi)
            updateOwnership(ownership, true);
            if (activeModal === "formation") {
              updateFormation();
            }
            closeModal();
          }}
          className="absolute top-3 right-3 hover:text-red-400 transition"
        >
          <X size={40} />
        </button>

        <h2 className="text-xl font-bold mb-0 lg:mb-4 text-center">{getModalTitle()}</h2>

        <div className="text-sm leading-relaxed">{renderContent()}</div>

        {/* Render equip detail nếu ở modal character (truyền selectedChar) */}
        {selectedEquip && selectedChar && renderEquipDetail(selectedChar)}

      </div>
    </div>
  );
}