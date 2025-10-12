// 🎮 GameCore.js (phiên bản tập trung vào chỉ số nhân vật)
// =========================================================
// Hệ thống cơ bản cho game đánh theo lượt (turn-based)
// Giữ lại phần dữ liệu nhân vật, bỏ logic chiến đấu tạm thời.
// =========================================================


// ===================================================================
// 🧱 ENTITY (LỚP CHA GỐC)
// ===================================================================
export class Entity {
  constructor({
    id,
    name,
    faction,
    hp,
    maxHp,
    speed,
    mana,
    maxMana,
  }) {
    if (!name || !faction || !hp || !maxHp || !speed || !mana || !maxMana) {
      throw new Error("❌ Thiếu dữ liệu khi tạo Entity. Cần đủ: name, faction, hp, maxHp, speed, mana, maxMana");
    }

    this.id = id || crypto.randomUUID?.() || Math.random().toString(36).slice(2);
    this.name = name;
    this.faction = faction;

    this.hp = hp;
    this.maxHp = maxHp;

    this.mana = mana;
    this.maxMana = maxMana;

    this.speed = speed;
  }

  // ❤️ Kiểm tra còn sống
  isAlive() {
    return this.hp > 0;
  }

  // 📊 Trả thông tin nhân vật
  info() {
    return {
      id: this.id,
      name: this.name,
      faction: this.faction,
      hp: `${this.hp}/${this.maxHp}`,
      mana: `${this.mana}/${this.maxMana}`,
      speed: this.speed,
    };
  }
}

/* 💡 Gợi ý mở rộng sau:
------------------------------------
✅ Thêm thuộc tính 'rarity' (độ hiếm)
✅ Thêm 'element' (Nguyên tố)
✅ Thêm 'status' (Buff / Debuff)
✅ Thêm 'sprite' hoặc 'avatarPath' (đường dẫn hình ảnh)
*/



// ===================================================================
// ⚔️ CHARACTER (NHÂN VẬT CÓ THỂ CHIẾN ĐẤU)
// ===================================================================
export class Character extends Entity {
  constructor({
    name,
    faction,
    role, // vai trò: Xạ thủ, Đấu sĩ, Trợ thủ, ...
    hp,
    maxHp,
    mana,
    maxMana,
    speed,
    physicalDamage,
    magicDamage,
    armor,
    magicResist,
  }) {
    // kiểm tra dữ liệu bắt buộc
    if (
      !name ||
      !faction ||
      !role ||
      hp === undefined ||
      !maxHp ||
      mana === undefined ||
      !maxMana ||
      !speed ||
      physicalDamage === undefined ||
      magicDamage === undefined ||
      armor === undefined ||
      magicResist === undefined
    ) {
      throw new Error(`❌ Thiếu thông tin khi tạo Character (${name || "Unknown"})`);
    }

    // gọi constructor cha
    super({ name, faction, hp, maxHp, speed, mana, maxMana });

    this.role = role; // Vai trò (Xạ thủ, Đấu sĩ, ...)
    this.physicalDamage = physicalDamage;
    this.magicDamage = magicDamage;
    this.armor = armor;
    this.magicResist = magicResist;
  }

  // 📊 Trả thông tin chi tiết
  info() {
    return {
      ...super.info(),
      role: this.role,
      stats: {
        physicalDamage: this.physicalDamage,
        magicDamage: this.magicDamage,
        armor: this.armor,
        magicResist: this.magicResist,
      },
    };
  }
}

/* 💡 Gợi ý mở rộng:
------------------------------------
✅ Thêm 'critRate', 'critDamage', 'penetration'
✅ Thêm 'growth' (tỉ lệ tăng chỉ số theo cấp)
✅ Thêm 'energyGainRate' (tốc độ hồi năng lượng)
✅ Thêm 'affinity' (liên kết đồng đội)
*/



// ===================================================================
// 🤝 ALLY (ĐỒNG MINH - NGƯỜI CHƠI)
// ===================================================================
export class Ally extends Character {
  constructor(options) {
    super(options);
    this.playerControlled = true;
    this.level = options.level || 1;
    this.exp = options.exp || 0;
  }

  // 🧩 Gợi ý sau này:
  // - Cơ chế lên cấp, trang bị
  // - Gắn kỹ năng theo vai trò
}



// ===================================================================
// 👿 ENEMY (KẺ ĐỊCH - DO AI ĐIỀU KHIỂN)
// ===================================================================
export class Enemy extends Character {
  constructor(options) {
    super(options);
    this.aiType = options.aiType || "aggressive"; // kiểu hành vi cơ bản
  }

  // Gợi ý mở rộng:
  // - AI theo vai trò
  // - Behavior tree
  // - Điều chỉnh chỉ số theo độ khó
}



// ===================================================================
// 🧩 TEAM MANAGER (QUẢN LÝ ĐỘI HÌNH)
// ===================================================================
export class TeamManager {
  constructor({ name, members = [] }) {
    this.name = name;
    this.members = members;
    this.skillPoints = 3;
    this.maxSkillPoints = 5;
  }

  addMember(character) {
    if (this.members.length >= 5) {
      throw new Error("⚠️ Đội đã đủ 5 thành viên!");
    }
    this.members.push(character);
  }

  info() {
    return {
      teamName: this.name,
      skillPoints: `${this.skillPoints}/${this.maxSkillPoints}`,
      members: this.members.map((m) => m.info()),
    };
  }
}



// ===================================================================
// 🧪 KHỞI TẠO NHÂN VẬT ĐẦU TIÊN: VALHEIN
// ===================================================================

// Valhein – Quân đoàn Thợ Diệt Quỷ
export const Valhein = new Ally({
  name: "Valhein",
  faction: "Quân đoàn Thợ Diệt Quỷ",
  role: "Xạ thủ",
  hp: 1200,
  maxHp: 1200,
  mana: 100,
  maxMana: 100,
  speed: 340,
  physicalDamage: 130,
  magicDamage: 50,
  armor: 25,
  magicResist: 20,
  level: 1,
  exp: 0,
});

// Tạo đội hình ban đầu
export const PlayerTeam = new TeamManager({
  name: "Đội Người Chơi",
  members: [Valhein],
});

// Hiển thị thông tin
console.log("📜 Thông tin đội hình:");
console.log(PlayerTeam.info());
