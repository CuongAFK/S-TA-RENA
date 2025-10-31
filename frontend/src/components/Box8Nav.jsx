import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
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

  const [ownership, setOwnership] = useState({
    ownedChars: [],
    ownedEquips: [],
    equipped: {},
  });

  useEffect(() => {
    const saved = localStorage.getItem("formation");
    if (saved) {
      setFormation(JSON.parse(saved));
    } else {
      const defaultTeams = [
        { id: 1, name: "Team 1", members: [] },
        { id: 2, name: "Team 2", members: [] },
        { id: 3, name: "Team 3", members: [] },
      ];
      setFormation({ teams: defaultTeams });
      localStorage.setItem("formation", JSON.stringify({ teams: defaultTeams }));
    }
  }, []);

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

  const [characters, setCharacters] = useState([
    //valhein
    {
      id: 1,
      name: "Valhein",
      faction: "Quân đoàn Thợ Diệt Quỷ",
      roles: ["Xạ thủ", "Pháp sư"],
      stats: {
        hp: 100,
        maxHp: 100,
        mana: 0,
        maxMana: 50,
        physicalDamage: 10,
        magicDamage: 10,
        moveSpeed: 100,
        attackSpeed: 100,
        lifesteal: 0,
        armor: 0,
        magicResist: 0,
        damageReduction: 0,
        shield: 0,
      },
      thumb: "images/charList/valhein/avt.png",
      banner: "images/charList/valhein/banner.jpg",
      mainWeapon: null,
      skills: {
        passive: {
          title: "Ám khí",
          type: "Nội tại",
          tags: ["Đặc biệt"],
          img: "images/charList/valhein/noi tai.png",
          desc: `Nội tại: Đòn đánh thường, Đòn đánh thường cường hóa và chiêu cuối sẽ nhận 1 dấu ấn Thợ săn. 
          Đủ 3 dấu ấn sẽ cường hóa đòn đánh kế tiếp thành đòn cường hóa ngẫu nhiên đồng thời hồi 10 mana và Tăng tốc 1.`,
        },
        normal: {
          title: "Chuyến săn mạo hiểm",
          type: "Đánh thường",
          tags: ["+1 Điểm chiến kỹ"],
          img: "images/charList/valhein/danh thuong.png",
          desc: `Gây (stvl) lên 1 kẻ địch.
          đòn đánh thường cường hóa (nội tại) sẽ ngẫu nhiên có 1 trong 3 hiệu ứng:
          Phi tiêu xanh gây (stvl) và hồi 1 điểm chiến kỹ.
          Phi tiêu đỏ gây (stvl) cho 3 mục tiêu liền kề.
          Phi tiêu vàng gây (stvl) và làm choáng 1 lượt.`,
        },
        skill: {
          title: "Lời nguyền tử vong",
          type: "Chiến kỹ",
          tags: ["Đặc biệt", "-1 Điểm chiến kỹ"],
          img: "images/charList/valhein/chien ky.png",
          desc: `Chiến kỹ: Thi triển 1 đòn đánh thường cường hóa ngẫu nhiên lên 1 kẻ địch.`,
        },
        ultimate: {
          title: "Bão đạn",
          type: "Chiêu cuối",
          tags: ["Diện rộng", "-50 Mana"],
          img: "images/charList/valhein/chieu cuoi.png",
          desc: `Bắn ra loạt đạn ma pháp gây (stp) lên tất cả kẻ địch.`,
        },
      },
      story: `Valhein là thợ săn ma cà rồng huyền thoại của Quân đoàn Thợ Diệt Quỷ.
      Anh mang trong mình dòng máu nửa người nửa quỷ, dùng vũ khí kết hợp giữa phép thuật và công nghệ
      để tiêu diệt sinh vật bóng tối trong im lặng.`,
    },

    //trieuvan
    {
      id: 2,
      name: "Triệu Vân",
      faction: "Tam Quốc",
      roles: ["Đấu sĩ"],
      banner: "images/charList/trieuvan/banner.jpg",
      thumb: "images/charList/trieuvan/avt.png",
      stats: {
        hp: 200,
        maxHp: 200,
        mana: 0,
        maxMana: 300,
        physicalDamage: 10,
        magicDamage: 0,
        moveSpeed: 100,
        attackSpeed: 50,
        lifesteal: 0,
        armor: 0,
        magicResist: 0,
        damageReduction: 0,
        shield: 0,
      },
      mainWeapon: null,
      skills: {
        passive: {
          title: "Long Hồn",
          type: "Nội tại",
          tags: ["Tăng ST", "Giải khống chế"],
          img: "images/charList/trieuvan/noi tai.png",
          desc: `Khi nhận hiệu ứng khống chế, Triệu Vân sẽ tự tiêu hao 1 điểm chiến kỹ để tự giải khống chế cho bản thân ngay lập tức đồng thời tăng (10 = stvl) cho đến khi kết thúc lượt tiếp theo và tăng tốc 1.
          Triệu Vân hồi mana theo sát thương gây ra.`
        },
        normal: {
          title: "Long Huyết",
          type: "Đòn đánh thường",
          tags: ["Hồi 1 điểm chiến kỹ"],
          img: "images/charList/trieuvan/danh thuong.png",
          desc: `Gây (stvl) lên 1 kẻ địch.
          Đòn đánh thường cường hóa:
          Gây (stvl) lên 3 kẻ địch liền kề.`
        },
        skill: {
          title: "Long Hống",
          type: "Chiến kỹ",
          tags: ["Cường hóa", "-1 Điểm chiến kỹ"],
          img: "images/charList/trieuvan/chien ky.png",
          desc: "Gây (5 + stvl) lên 3 kẻ địch liền kề và cường hóa đòn đánh thường kế tiếp và nhận 10% hút máu."
        },
        ultimate: {
          title: "Long Kích",
          type: "Chiêu cuối",
          tags: ["Cường hóa", "-50 Mana"],
          img: "images/charList/trieuvan/chieu cuoi.png",
          desc: `Triệu Vân gây (20 = stc) lên 1 kẻ địch
          Trong 3 lượt tiếp theo sát thương cộng thêm từ nội tại và trang bị sẽ được chuyển hoá thành stc.`
        }
      },
      story: `“Thế thương tựa rồng bay, thế tấn tựa rồng cuộn, mỗi mũi thương như ngàn mũi tên xuyên thấu kẻ thù. Chỉ cần thấy ngọn thương của Triệu Vân cũng đủ làm kẻ địch phải ớn lạnh.” Không một ai dám ngông cuồng, coi thường sức mạnh của Triệu Vân.`,
    }


  ]);


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

  const updateOwnership = async (newOwnership) => {
    try {
      // lưu local
      localStorage.setItem("ownership", btoa(JSON.stringify(newOwnership)));
      setOwnership(newOwnership);

      // cập nhật DB
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
      console.log("✅ Ownership updated:", newOwnership);
    } catch (err) {
      console.error("❌ Lỗi update ownership:", err);
    }
  };

  const handleEquip = (charId, equipId) => {
    const newData = { ...ownership };
    newData.equipped[charId] = equipId;
    updateOwnership(newData);
  };

  const handleUnequip = (charId) => {
    const newData = { ...ownership };
    newData.equipped[charId] = null;
    updateOwnership(newData);
  };

  const handleUnlock = (type, id) => {
    const newData = { ...ownership };
    if (type === "char" && !newData.ownedChars.includes(String(id))) {
      newData.ownedChars.push(String(id));
    }
    if (type === "equip" && !newData.ownedEquips.includes(String(id))) {
      newData.ownedEquips.push(String(id));
    }
    updateOwnership(newData);
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
                src={char.thumb}
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
  // 🧩 CHI TIẾT NHÂN VẬT
  // ----------------------------------------------
  const renderCharacterDetail = () => {
    const c = selectedChar;
    if (!c) return null;

    // Gán bonus từ vũ khí
    // Vai trò chính là phần tử đầu tiên trong mảng roles
    const mainRole = c.roles[0];

    // Gộp bonus: nếu vũ khí có bonus riêng cho vai trò chính hoặc phụ thì cộng hết

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
        .replace(/giải khống chế/gi, `<span class='text-green-200 font-bold'>Giải khống chế</span>`)


    };





    return (
      <div
        className="relative text-white rounded-xl overflow-hidden border-5 lg:border-15 border-white/1 min-h-[300px] lg:min-h-[650px]"
        style={{
          backgroundImage: `url(${c.banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 grid grid-cols-2 gap-3 lg:gap-6 p-3 lg:p-6 lg:h-150">
          {/* CỘT TRÁI */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <img
                src={c.thumb}
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
                      src={s.img}
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
            setSelectedChar(null);
            setActiveTab("stats");
          }}
          className="font-[roboto] absolute top-3 left-3 bg-black/70 px-3 py-1 rounded-lg hover:bg-black/90 text-[10px] lg:text-sm z-20"
        >
          ← Quay lại
        </button>
      </div>
    );
  };









  // ----------------------------------------------
  // MODAL HIỂN THỊ TRANG BỊ CHI TIẾT
  // ----------------------------------------------
  const renderEquipDetail = () => {
    const equip = selectedEquip;
    if (!equip) return null;

    // Tìm xem trang bị đang gắn cho ai (nếu có)
    const equippedChar = characters.find(ch => ch.mainWeapon?.name === equip.name);
    // Kiểm tra trang bị đang gắn cho nhân vật được chọn hay cho người khác
    const isEquippedHere = selectedChar && selectedChar.mainWeapon?.name === equip.name;
    const isEquippedOther = equippedChar && (!selectedChar || equippedChar.id !== selectedChar.id);

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
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
              <p className="text-green-300">Trang bị này đang được gắn cho <span className="font-semibold">{selectedChar.name}</span>.</p>
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
            {/* Nếu không có selectedChar (không mở từ trong chi tiết nhân vật) -> ẩn nút gắn/tháo */}
            {!selectedChar && (
              <button
                onClick={() => setSelectedEquip(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded-lg text-sm"
              >
                Đóng
              </button>
            )}

            {selectedChar && (
              <>
                {isEquippedHere ? (
                  // Nếu trang bị đang gắn cho nhân vật đang xem -> hiện THÁO
                  <button
                    onClick={() => {
                      // Tháo trang bị khỏi selectedChar
                      setSelectedChar(prev => ({ ...prev, mainWeapon: null }));
                      const newData = { ...ownership };
                      newData.equipped[selectedChar.id] = null;
                      updateOwnership(newData);
                      setSelectedEquip(null);
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
                      setSelectedChar(prev => ({ ...prev, mainWeapon: equip }));
                      const newData = { ...ownership };
                      newData.equipped[selectedChar.id] = equip.id;
                      updateOwnership(newData);
                      setSelectedEquip(null);

                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg text-sm"
                  >
                    Gắn cho {selectedChar.name}
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
      <div className="p-6 text-white font-['Roboto']">
        {/* 🏷️ Tabs chọn team */}
        <div className="flex justify-center space-x-4 mb-6">
          {formation.teams.map((team) => (
            <button
              key={team.id}
              onClick={() => setSelectedTeam(team.id)}
              className={`px-4 py-2 rounded-lg border ${selectedTeam === team.id ? "bg-blue-500" : "bg-gray-700 hover:bg-gray-600"
                }`}
            >
              {team.name}
            </button>
          ))}
        </div>

        {/* 🔧 Đổi tên / Xóa tất cả */}
        <div className="flex justify-between mb-4">
          <div className="text-lg font-bold">
            {formation.teams.find((t) => t.id === selectedTeam)?.name}
          </div>
          <div className="space-x-2">
            <button
              onClick={() => {
                const newName = prompt("Nhập tên mới:");
                if (newName) {
                  const updated = formation.teams.map((t) =>
                    t.id === selectedTeam ? { ...t, name: newName } : t
                  );
                  setFormation({ teams: updated });
                  localStorage.setItem("formation", JSON.stringify({ teams: updated }));
                }
              }}
              className="text-yellow-400 hover:text-yellow-300"
            >
              Đổi tên
            </button>
            <button
              onClick={() => {
                const updated = formation.teams.map((t) =>
                  t.id === selectedTeam ? { ...t, members: [] } : t
                );
                setFormation({ teams: updated });
                localStorage.setItem("formation", JSON.stringify({ teams: updated }));
              }}
              className="text-red-400 hover:text-red-300"
            >
              Xóa tất cả
            </button>
          </div>
        </div>

        {/* 🧑‍🎨 Hiển thị đội hình */}
        <div className="flex justify-center items-center mb-6 space-x-4">
          {Array.from({ length: 5 }).map((_, i) => {
            const team = formation.teams.find((t) => t.id === selectedTeam);
            const charId = team?.members[i];
            const char = characters.find((c) => c.id === charId);
            return (
              <div
                key={i}
                onClick={() => {
                  if (char) {
                    setSelectedChar(char);
                    setActiveTab("characters"); // chuyển qua tab tướng để xem chi tiết
                  }
                }}
                className="w-24 h-24 bg-gray-700 border border-white/30 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer"
              >
                {char ? (
                  <img src={char.thumb} alt={char.name} className="object-cover w-full h-full" />
                ) : (
                  <span className="text-gray-500 text-sm">Trống</span>
                )}
              </div>
            );
          })}
        </div>

        {/* 🔽 Danh sách tướng sở hữu */}
        <div className="grid grid-cols-5 gap-3">
          {ownership?.ownedChars?.map((cid) => {
            const c = characters.find((cc) => cc.id === Number(cid));
            if (!c) return null;
            const team = formation.teams.find((t) => t.id === selectedTeam);
            const isPicked = team?.members.includes(c.id);

            return (
              <div
                key={c.id}
                onClick={() => {
                  const updated = formation.teams.map((t) => {
                    if (t.id === selectedTeam) {
                      let members = [...t.members];
                      if (isPicked) members = members.filter((m) => m !== c.id);
                      else if (members.length < 5) members.push(c.id);
                      return { ...t, members };
                    }
                    return t;
                  });
                  setFormation({ teams: updated });
                  localStorage.setItem("formation", JSON.stringify({ teams: updated }));
                }}
                className={`cursor-pointer border rounded-lg overflow-hidden ${isPicked ? "border-green-400" : "border-transparent"
                  }`}
              >
                <img src={c.thumb} alt={c.name} className="w-full h-20 object-cover" />
                <div className="text-center text-sm">{c.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };





  // ----------------------------------------------
  // RENDER CHUNG
  // ----------------------------------------------
  const renderContent = () => {
    if (activeModal === "character" && selectedChar) {
      return renderCharacterDetail();
    }

    switch (activeModal) {
      case "character":
        return renderCharacterList();
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

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative bg-gray-900/95 border border-white rounded-2xl p-2 lg:p-6 w-[90%] text-white shadow-2xl h-[90%] overflow-y-auto">
        <button
          onClick={() => {
            updateOwnership(ownership); // 🔄 lưu lại DB khi đóng
            closeModal();
          }}
          className="absolute top-3 right-3 hover:text-red-400 transition"
        >
          <X size={40} />
        </button>


        <h2 className="text-xl font-bold mb-0 lg:mb-4 text-center">
          {selectedChar ? selectedChar.name : "Nhân vật"}
        </h2>

        <div className="text-sm leading-relaxed">{renderContent()}</div>

        {selectedEquip && renderEquipDetail()}
      </div>
    </div>
  );
}
