import React, { useState } from "react";
import { X } from "lucide-react";

// ⚙️ Import hình ảnh
import valheinThumb from "../assets/images/charList/valhein.png";
import valheinBanner from "../assets/images/charBanner/valheinBanner.jpg";
import roleArcher from "../assets/images/roleImg/Xạ thủ.png";
import roleMage from "../assets/images/roleImg/Pháp sư.png";
import roleFighter from "../assets/images/roleImg/Đấu sĩ.png";
import roleAssassin from "../assets/images/roleImg/Sát thủ.png";
import roleSupport from "../assets/images/roleImg/Trợ thủ.png";
import roleTank from "../assets/images/roleImg/Đỡ đòn.png";
import skillOn from "../assets/icons/skillPointsOn.jpg";
import skillOff from "../assets/icons/skillPointsOff.jpg";
import weaponIcon from "../assets/images/weapons/Song Đao Bão Táp.png";

// ⚔️ Lớp Trang bị
class Equipment {
  constructor(name, img, desc, bonus = {}, roleBonus = {}, passive = "") {
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
    charRoles.forEach((r) => {
      if (this.roleBonus?.[r]) {
        Object.entries(this.roleBonus[r]).forEach(([stat, val]) => {
          total[stat] = (total[stat] || 0) + val;
        });
      }
    });
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
    .replace(/\(sát thương vật lý\)/g, `<span class='text-orange-400 font-semibold'>${c.stats.physicalDamage}</span>`)
    .replace(/\(sát thương phép\)/g, `<span class='text-purple-400 font-semibold'>${c.stats.magicDamage}</span>`)
    .replace(/hồi (\d+) điểm chiến kỹ/gi, `hồi <img src='${skillOn}' class='inline w-4 h-4 align-text-bottom'/> $1`)
    .replace(/tiêu hao (\d+) điểm chiến kỹ/gi, `tiêu hao <img src='${skillOff}' class='inline w-4 h-4 align-text-bottom'/> $1`);

  return desc;
}


// ----------------------------------------------
// 🎯 THÔNG TIN TRANG BỊ
// ----------------------------------------------

const SongDaoBaoTap = new Equipment(
  "Song Đao Bão Táp",
  weaponIcon,
  "Vũ khí kép của thợ săn, chứa năng lượng ma thuật gió xoáy.",
  { attackSpeed: 50, moveSpeed: 10 },
  { "Xạ thủ": { attackSpeed: 100 } },
  "Khi dùng đòn đánh thường cường hóa → nhận tăng tốc 1 lượt."
);

// ----------------------------------------------
// 🧩 DỮ LIỆU NHÂN VẬT
// ----------------------------------------------
export default function Box8Nav({ activeModal, closeModal }) {
  const characters = [
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
      thumb: valheinThumb,
      banner: valheinBanner,
      mainWeapon: SongDaoBaoTap,
      skills: {
        passive: {
          name: "Ám khí (Nội tại)(Đặc biệt)",
          desc: `Nội tại: Đòn đánh thường, Đòn cường hóa và chiêu cuối sẽ nhận 1 dấu ấn Thợ săn. 
          Đủ 3 dấu ấn sẽ cường hóa đòn đánh kế tiếp thành Đòn cường hóa ngẫu nhiên đồng thời hồi 10 mana và Tăng tốc 1.`,
        },
        normal: {
          name: "Đòn đánh thường (+1 Điểm chiến kỹ)",
          desc: `Gây (sát thương vật lý) lên 1 kẻ địch.
          Đòn cường hóa (nội tại) sẽ ngẫu nhiên có 1 trong 3 hiệu ứng:
          Phi tiêu xanh gây (sát thương vật lý) và hồi 1 điểm chiến kỹ.
          Phi tiêu đỏ gây (sát thương vật lý) cho 3 mục tiêu liền kề.
          Phi tiêu vàng gây (sát thương vật lý) và làm choáng 1 lượt.`,
        },
        skill: {
          name: "Lời nguyền tử vong (Chiến Kỹ)(Đặc biệt)(-1 Điểm chiến kỹ)",
          desc: `Chiến kỹ: Thi triển 1 đòn đánh thường cường hóa ngẫu nhiên lên 1 kẻ địch.`,
        },
        ultimate: {
          name: "Bão đạn (Chiêu cuối)(Diện rộng)(-50 Mana)",
          desc: `Bắn ra loạt đạn ma pháp gây (sát thương phép) lên tất cả kẻ địch.`,
        },
      },
      story: `Valhein là thợ săn ma cà rồng huyền thoại của Quân đoàn Thợ Diệt Quỷ.
      Anh mang trong mình dòng máu nửa người nửa quỷ, dùng vũ khí kết hợp giữa phép thuật và công nghệ
      để tiêu diệt sinh vật bóng tối trong im lặng.`,
    },
  ];

  const [selectedChar, setSelectedChar] = useState(null);
  const [activeTab, setActiveTab] = useState("stats");
  const [selectedEquip, setSelectedEquip] = useState(null);

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

  // ----------------------------------------------
  // 🧱 DANH SÁCH NHÂN VẬT
  // ----------------------------------------------
  const renderCharacterList = () => (
    <div className="grid grid-cols-5 gap-4">
      {characters.map((char) => (
        <div
          key={char.id}
          onClick={() => setSelectedChar(char)}
          className="cursor-pointer bg-gray-800 border border-white/30 rounded-xl overflow-hidden hover:scale-105 transition-transform"
        >
          <div className="relative flex items-center justify-center bg-black/50">
            <img src={char.thumb} alt={char.name} className="w-auto h-85 object-cover" />
            {/* Icon vai trò / hệ */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              {char.roles.map((r, i) => (
                <img
                  key={i}
                  src={roleIcons[r]}
                  alt={r}
                  title={r}
                  className="w-12 h-12 rounded-full border border-white/70"
                />
              ))}
            </div>
          </div>
          <div className="p-3 text-center">
            <h3 className="font-bold text-lg">{char.name}</h3>
            <p className="text-sm text-gray-300">{char.role}</p>
            <p className="text-xs text-gray-400 italic">{char.faction}</p>
          </div>
        </div>
      ))}
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
      // Thay đổi các từ khóa đặc biệt bằng màu + giá trị thật
      return text
        .replace(/\(sát thương vật lý\)/g, `<span class='text-orange-400 font-bold'>${c.stats.physicalDamage} sát thương vật lý</span>`)
        .replace(/\(sát thương phép\)/g, `<span class='text-blue-400 font-bold'>${c.stats.magicDamage} sát thương phép</span>`)
        .replace(/điểm chiến kỹ/gi, `<span class='text-yellow-400 font-semibold'>điểm chiến kỹ</span>`);
    };

    return (
      <div
        className="relative text-white rounded-xl overflow-hidden border border-white/10 min-h-[650px]"
        style={{
          backgroundImage: `url(${c.banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <div className="relative z-10 grid grid-cols-2 gap-6 p-6 h-150">
          {/* CỘT TRÁI */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <img
                src={c.thumb}
                alt={c.name}
                className="w-auto max-h-[350px] object-contain rounded-xl border border-white/20 shadow-lg"
              />
              {/* Icon vai trò */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                {c.roles?.map((r, i) => (
                  <img
                    key={i}
                    src={roleIcons[r]}
                    alt={r}
                    title={r}
                    className="w-12 h-12 rounded-full border border-white/70 shadow-md"
                  />
                ))}
              </div>

              {/* Trang bị góc phải */}
              {c.mainWeapon ? (
                <img
                  src={c.mainWeapon.img}
                  alt={c.mainWeapon.name}
                  className="absolute top-2 right-2 w-14 h-14 rounded-full border border-yellow-400 cursor-pointer"
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
            <h3 className="text-2xl font-bold mt-4">{c.name}</h3>
            <p className="text-sm italic text-gray-300">
              {c.roles?.join(" • ")}
            </p>
            <p className="text-sm italic text-blue-800">
              {c.faction}
            </p>

          </div>

          {/* CỘT PHẢI */}
          <div className="bg-black/60 rounded-xl p-4 font-['Roboto'] text-sm overflow-y-auto max-h-[500px] scroll-smooth">

            {/* TAB MENU */}
            <div className="flex justify-center gap-2 mb-6 bg-gray-800/50 backdrop-blur-sm p-1.5 rounded-xl border border-gray-700/50">
              {["stats", "skills", "story", "equip"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === tab
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
              <div className="text-sm space-y-1 overflow-y-auto max-h-[350px]">
                <div className="grid grid-cols-3 font-bold border-b border-gray-600 pb-1 mb-1">
                  <span>Chỉ số</span>
                  <span className="text-gray-400">Gốc (+Bonus)</span>
                  <span className="text-white">Tổng</span>
                </div>

                {Object.keys(statLabels).map((key) => (
                  <div key={key} className="grid grid-cols-3 gap-2 border-b border-gray-700 py-1">
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
                  <div key={idx} className="border border-gray-700 rounded-lg p-2 bg-gray-800/40">
                    <p className="font-semibold text-yellow-300">{s.name}</p>
                    <div
                      className="text-gray-300 whitespace-pre-line leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: getSkillDesc(s.desc, c) }}
                    />

                    <div className="flex justify-end gap-1 mt-1">
                      {s.name.includes("+1") && (
                        <img src={skillOn} className="w-10 h-10" title="Hồi 1 điểm Chiến Kỹ" />
                      )}
                      {s.name.includes("-1") && (
                        <img src={skillOff} className="w-10 h-10" title="Tiêu hao 1 điểm Chiến Kỹ" />
                      )}
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
                {c.mainWeapon ? (
                  <div
                    className="flex items-center gap-3 bg-gray-800/40 p-3 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-700/60"
                    onClick={() => setSelectedEquip(c.mainWeapon)}
                  >
                    <img src={c.mainWeapon.img} className="w-12 h-12 rounded-full" />
                    <div>
                      <p className="font-bold text-white">{c.mainWeapon.name}</p>
                      <p className="text-gray-300 text-xs">{c.mainWeapon.desc}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 italic">Chưa gắn trang bị chính</p>
                )}
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
          className="absolute top-3 left-3 bg-black/70 px-3 py-1 rounded-lg hover:bg-black/90 text-sm z-20"
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
    const e = selectedEquip;
    if (!e) return null;
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
        <div className="bg-gray-900/95 p-6 rounded-xl border border-white/30 w-[400px] text-white relative font-['Roboto']">
          <button
            onClick={() => setSelectedEquip(null)}
            className="absolute top-2 right-2 hover:text-red-400"
          >
            <X size={22} />
          </button>

          {/* Header: ảnh + tên */}
          <div className="flex items-center gap-3 mb-3">
            <img src={e.img} className="w-16 h-16 rounded-full border border-white/50" />
            <div>
              <h3 className="text-xl font-bold">{e.name}</h3>
              <p className="text-sm text-gray-400">{e.desc}</p>
            </div>
          </div>

          {/* Bonus cơ bản */}
          <div className="space-y-1 text-sm">
            {Object.entries(e.bonus).map(([key, val]) => (
              <p key={key} className={`${statColor[key] || "text-gray-300"}`}>
                +{val} {statLabels[key] || key}
              </p>
            ))}
          </div>

          {/* Bonus theo vai trò */}
          {e.roleBonus && (
            <div className="mt-2 space-y-1 text-xs">
              {Object.entries(e.roleBonus).map(([role, bonus]) => (
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
          {e.passive && (
            <p className="text-blue-300 text-xs italic mt-3">{e.passive}</p>
          )}

          {/* Nút hành động */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => {
                setSelectedChar((prev) => ({ ...prev, mainWeapon: e }));
                setSelectedEquip(null);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg text-sm"
            >
              Gắn trang bị
            </button>
            <button
              onClick={() => {
                setSelectedChar((prev) => ({ ...prev, mainWeapon: null }));
                setSelectedEquip(null);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg text-sm"
            >
              Tháo
            </button>
          </div>
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
        return <p>Danh sách đội hình.</p>;
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
      <div className="relative bg-gray-900/95 border border-white rounded-2xl p-6 w-[90%] text-white shadow-2xl h-[90%] overflow-y-auto">
        <button onClick={closeModal} className="absolute top-3 right-3 hover:text-red-400 transition">
          <X size={40} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">
          {selectedChar ? selectedChar.name : "Nhân vật"}
        </h2>

        <div className="text-sm leading-relaxed">{renderContent()}</div>

        {selectedEquip && renderEquipDetail()}
      </div>
    </div>
  );
}
