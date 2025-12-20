// src/data/charactersData.js

export const CHARACTERS_DATA = [
  // 1. VALHEIN
  {
    id: 1,
    key: "valhein",
    name: "Valhein",
    faction: "Quân đoàn Thợ Diệt Quỷ",
    roles: ["Xạ thủ", "Pháp sư"],
    
    // === CẤU TRÚC ASSETS MỚI ===
    assets: {
      portrait: {
        list: "images/charList/valhein/port_list.png",   // Ảnh đại diện trong danh sách (thay cho thumb cũ)
        play: "images/charList/valhein/port_play.png",   // Ảnh đại diện trong trận (thay cho thumbPlay cũ)
        banner: "images/charList/valhein/banner.jpg",    // Banner
      },
      action: {
        //Video chờ tấn công (Loop)
        ready: "images/charList/valhein/ready_loop.mp4",
        normalAttack: "images/charList/valhein/attack_normal.mp4",
        takeDamage: "images/charList/valhein/take_damage.png", // Ảnh khi chịu sát thương
      }
    },
    
    // Chỉ số cơ bản (Base Stats) - GIỮ NGUYÊN
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
    
    // Skill data
    skills: {
      passive: {
        title: "Ám khí",
        type: "Nội tại",
        tags: ["Đặc biệt"],
        visuals: { // Thay thế 'img' bằng 'visuals'
            icon: "images/charList/valhein/noi tai.png",
            skillGif: "images/charList/valhein/passive_animation.mp4",
        },
        desc: `Nội tại: Đòn đánh thường, Đòn đánh thường cường hóa và chiêu cuối sẽ nhận 1 dấu ấn Thợ săn. \nĐủ 3 dấu ấn sẽ cường hóa đòn đánh kế tiếp thành đòn cường hóa ngẫu nhiên đồng thời hồi 10 mana và ưu tiên hành động 20%.`,
      },
      normal: {
        title: "Chuyến săn mạo hiểm",
        type: "Đánh thường",
        tags: ["+1 Điểm chiến kỹ"],
        visuals: {
            icon: "images/charList/valhein/danh thuong.png",
            skillGif: "images/charList/valhein/normal_animation.gif",
        },
        desc: `Gây (stvl) lên 1 kẻ địch.\nđòn đánh thường cường hóa (nội tại) sẽ ngẫu nhiên có 1 trong 3 hiệu ứng:\nPhi tiêu xanh gây (stvl) và hồi 1 điểm chiến kỹ.\nPhi tiêu đỏ gây (stvl) cho 3 mục tiêu liền kề.\nPhi tiêu vàng gây (stvl) và làm choáng 1 lượt.`,
      },
      skill: {
        title: "Lời nguyền tử vong",
        type: "Chiến kỹ",
        tags: ["Đặc biệt", "-1 Điểm chiến kỹ"],
        visuals: {
            icon: "images/charList/valhein/chien ky.png",
            skillGif: "images/charList/valhein/skill_animation.gif",
        },
        desc: `Chiến kỹ: Thi triển 1 đòn đánh thường cường hóa ngẫu nhiên lên 1 kẻ địch.`,
      },
      ultimate: {
        title: "Bão đạn",
        type: "Chiêu cuối",
        tags: ["Diện rộng", "-50 Mana"],
        visuals: {
            icon: "images/charList/valhein/chieu cuoi.png",
            skillGif: "images/charList/valhein/ultimate_animation.gif",
            ultimateFull: "images/charList/valhein/ultimate_full.gif", // GIF full màn hình
        },
        desc: `Bắn ra loạt đạn ma pháp gây (stp) lên tất cả kẻ địch.`,
      },
    },
    story: `Valhein là thợ săn ma cà rồng huyền thoại của Quân đoàn Thợ Diệt Quỷ.\nAnh mang trong mình dòng máu nửa người nửa quỷ, dùng vũ khí kết hợp giữa phép thuật và công nghệ để tiêu diệt sinh vật bóng tối trong im lặng.`,
  },

  // 2. TRIỆU VÂN
  {
    id: 2,
    key: "trieuvan",
    name: "Triệu Vân",
    faction: "Tam Quốc",
    roles: ["Đấu sĩ"],
    
    // === CẤU TRÚC ASSETS MỚI ===
    assets: {
      portrait: {
        list: "images/charList/trieuvan/port_list.png",   // Ảnh đại diện trong danh sách (thay cho thumb cũ)
        play: "images/charList/trieuvan/port_list.png",   // Ảnh đại diện trong trận (placeholder)
        banner: "images/charList/trieuvan/banner.jpg",
      },
      action: {
        idle: "images/charList/trieuvan/idle.gif",        
        focus: "images/charList/trieuvan/focus.png",      
        normalAttack: "images/charList/valhein/attack_normal.mp4",
        takeDamage: "images/charList/trieuvan/take_damage.png", 
      }
    },
    
    // Chỉ số cơ bản (Base Stats) - GIỮ NGUYÊN
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
    
    // Skill data
    skills: {
      passive: {
        title: "Long Hồn",
        type: "Nội tại",
        tags: ["Tăng ST", "Giải khống chế"],
        visuals: {
            icon: "images/charList/trieuvan/noi tai.png",
            skillGif: "images/charList/trieuvan/passive_animation.gif",
        },
        desc: `Khi nhận hiệu ứng khống chế, Triệu Vân sẽ tự tiêu hao 1 điểm chiến kỹ để tự giải khống chế cho bản thân ngay lập tức đồng thời tăng (10 = stvl) cho đến khi kết thúc lượt tiếp theo và ưu tiên hành động 20%.\nTriệu Vân hồi mana theo sát thương gây ra.`
      },
      normal: {
        title: "Long Huyết",
        type: "Đòn đánh thường",
        tags: ["Hồi 1 điểm chiến kỹ"],
        visuals: {
            icon: "images/charList/trieuvan/danh thuong.png",
            skillGif: "images/charList/trieuvan/normal_animation.gif",
        },
        desc: `Gây (stvl) lên 1 kẻ địch.\nĐòn đánh thường cường hóa:\nGây (stvl) lên 3 kẻ địch liền kề.`
      },
      skill: {
        title: "Long Hống",
        type: "Chiến kỹ",
        tags: ["Cường hóa", "-1 Điểm chiến kỹ"],
        visuals: {
            icon: "images/charList/trieuvan/chien ky.png",
            skillGif: "images/charList/trieuvan/skill_animation.gif",
        },
        desc: "Gây (5 + stvl) lên 3 kẻ địch liền kề và cường hóa đòn đánh thường kế tiếp và nhận 10% hút máu."
      },
      ultimate: {
        title: "Long Kích",
        type: "Chiêu cuối",
        tags: ["Cường hóa", "-50 Mana"],
        visuals: {
            icon: "images/charList/trieuvan/chieu cuoi.png",
            skillGif: "images/charList/trieuvan/ultimate_animation.gif",
            ultimateFull: "images/charList/trieuvan/ultimate_full.gif",
        },
        desc: `Triệu Vân gây (20 = stc) lên 1 kẻ địch\nTrong 3 lượt tiếp theo sát thương cộng thêm từ nội tại và trang bị sẽ được chuyển hoá thành stc.`
      }
    },
    story: `“Thế thương tựa rồng bay, thế tấn tựa rồng cuộn, mỗi mũi thương như ngàn mũi tên xuyên thấu kẻ thù. Chỉ cần thấy ngọn thương của Triệu Vân cũng đủ làm kẻ địch phải ớn lạnh.” Không một ai dám ngông cuồng, coi thường sức mạnh của Triệu Vân.`,
  }
];