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






export const SongDaoBaoTap = new Equipment(
  "Song Đao Bão Táp",
  "images/weapons/Song Đao Bão Táp.png",
  "Vũ khí kép của thợ săn, chứa năng lượng ma thuật gió xoáy.",
  { attackSpeed: 50, moveSpeed: 10 },
  { "Xạ thủ": { attackSpeed: 100 } },
  "Nội tại: Cuồng Phong – Khi dùng đòn đánh thường cường hóa → nhận tăng tốc 1 lượt."
);

const GiayHermes = new Equipment(
  "Giày Hermes",
  "images/weapons/Giày Hermes.png",
  "Đôi giày thần thoại giúp di chuyển nhanh hơn.",
  { moveSpeed: 30 },
  { "Trợ thủ": { moveSpeed: 10 } },
  "Nội tại: Gia tốc – Nếu người dùng không chịu hay gây sát thương ở lượt trước thì sau khi hành động sẽ nhận Tăng tốc 1."
);

const GiayKienCuong = new Equipment(
  "Giày Kiên Cường",
  "images/weapons/Giày kiên cường.png",
  "Đôi giày bền bỉ bảo vệ khỏi ma thuật.",
  { moveSpeed: 20 },
  { "Đỡ đòn": { magicResist: 10 } },
  "Nội tại: Kiên cường – Miễn nhiễm với hiệu ứng xấu đầu tiên dính phải và hồi lại Kiên cường khi tới lượt."
);

const NanhFenrir = new Equipment(
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