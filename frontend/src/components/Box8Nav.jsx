import React, { useState } from "react";
import {
  Users,
  User,
  Backpack,
  BookOpen,
  ClipboardList,
  X,
} from "lucide-react";

export default function Box8Nav() {
  const [activeModal, setActiveModal] = useState(null);

  const navItems = [
    { key: "formation", name: "Đội hình", icon: Users },
    { key: "character", name: "Nhân vật", icon: User },
    { key: "inventory", name: "Túi đồ", icon: Backpack },
    { key: "encyclopedia", name: "Bách khoa", icon: BookOpen },
    { key: "quest", name: "Nhiệm vụ", icon: ClipboardList },
  ];

  const closeModal = () => setActiveModal(null);

  const renderModalContent = () => {
    switch (activeModal) {
      case "formation":
        return <p>Danh sách đội hình, sắp xếp nhân vật ra trận.</p>;
      case "character":
        return <p>Thông tin chi tiết nhân vật, chỉ số và kỹ năng.</p>;
      case "inventory":
        return <p>Túi đồ chứa vật phẩm, trang bị và nguyên liệu.</p>;
      case "encyclopedia":
        return <p>Bách khoa toàn thư — tra cứu quái vật, vật phẩm, câu chuyện.</p>;
      case "quest":
        return <p>Nhiệm vụ đang thực hiện và phần thưởng nhận được.</p>;
      default:
        return null;
    }
  };

  return (
    <div
      className="box-8 absolute bottom-0 left-1/2 -translate-x-1/2
      bg-gradient-to-t from-black/60 to-transparent border border-white 
      w-[80%] h-[100px] flex items-end justify-around px-4 py-3 rounded-t-2xl"
    >
      {navItems.map(({ key, name, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setActiveModal(key)}
          className="flex flex-col items-center gap-1 text-white hover:text-yellow-300 transition-transform hover:scale-110"
        >
          <Icon size={28} />
          <span className="text-xs font-medium">{name}</span>
        </button>
      ))}

      {/* Modal chung */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white rounded-2xl p-6 w-[500px] text-white relative shadow-xl">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 hover:text-red-400 transition"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">
              {navItems.find((i) => i.key === activeModal)?.name}
            </h2>
            <div className="text-sm leading-relaxed">{renderModalContent()}</div>
          </div>
        </div>
      )}
    </div>
  );
}
