// src/game/CombatEngine.js

// =========================================================================================
// 1. CLASS CHARACTER (MODEL)
// Đại diện cho dữ liệu và logic nội tại của một nhân vật
// =========================================================================================
export class Character {
    constructor(data, faction = "NEUTRAL") {
        // --- DỮ LIỆU TĨNH (Không thay đổi) ---
        this.id = crypto.randomUUID(); // Tạo ID duy nhất cho mỗi unit trong trận
        this.key = data.key;           // ID gốc (ví dụ: 'valhein')
        this.name = data.name;
        this.faction = faction;        // 'PLAYER' hoặc 'AI'
        this.assets = data.assets;     // Ảnh (Idle, Attack, Portrait...)
        this.skillsData = data.skills; // Thông tin skill

        // --- CHỈ SỐ (Stats) ---
        // baseStats: Chỉ số gốc (Level 1 + Đồ đã mặc trước trận)
        this.baseStats = { ...data.stats };
        
        // combatStats: Chỉ số thực tế trong trận (Gốc + Buff/Debuff)
        this.combatStats = { ...this.baseStats };

        // --- TRẠNG THÁI BIẾN ĐỘNG (Dynamic State) ---
        this.currentHp = this.baseStats.maxHp;
        this.currentMana = this.baseStats.mana || 0;
        this.isDead = false;
        
        // Action Value: Dùng để tính lượt đi (Càng thấp càng đi trước)
        this.actionValue = 0; 


        // --- LOGIC RIÊNG (CUSTOM STATES) ---
        this.stacks = 0;          // Số tích lũy nội tại (Valhein: 0 -> 3)
        this.enhancedType = null; // Loại cường hóa hiện tại: 'RED', 'YELLOW', 'BLUE', hoặc null
    }

    // Tính toán lại chỉ số (Gọi khi hết lượt hoặc khi nhận Buff)
    recalculateStats() {
        this.combatStats = { ...this.baseStats };
        // TODO: Sau này cộng thêm chỉ số từ Buffs ở đây
        
        // Đảm bảo HP không vượt quá Max HP mới
        if (this.currentHp > this.combatStats.maxHp) this.currentHp = this.combatStats.maxHp;
    }

    // Hàm nhận sát thương (Logic lõi)
    takeDamage(amount) {
        if (this.isDead) return 0;

        // TODO: Tính toán giảm sát thương theo Giáp/Kháng phép tại đây
        let actualDamage = Math.floor(amount); 
        
        this.currentHp -= actualDamage;
        
        // Kiểm tra tử vong
        if (this.currentHp <= 0) {
            this.currentHp = 0;
            this.isDead = true;
        }
        return actualDamage; // Trả về số dmg thực tế để UI hiển thị (Floating Text)
    }
}

// =========================================================================================
// 2. CLASS TURN MANAGER (CONTROLLER)
// Quản lý thời gian, hàng chờ và thứ tự lượt đi
// =========================================================================================
export class TurnManager {
    constructor(characters) {
        this.characters = characters; // Danh sách tất cả nhân vật trong trận
        this.BASE_ACTION_POINT = 10000; // Hằng số AV (Speed càng cao -> AV càng thấp)
    }

    // Khởi tạo trận đấu
    initCombat() {
        this.characters.forEach(char => {
            char.recalculateStats();
            // Công thức: AV = 10000 / Tốc độ
            const speed = char.combatStats.moveSpeed > 0 ? char.combatStats.moveSpeed : 1; 
            char.actionValue = this.BASE_ACTION_POINT / speed;
        });
        // Sắp xếp hàng chờ ngay khi vào trận
        this.sortQueue();
    }

    // Sắp xếp hàng chờ (Queue)
    // Logic: Ai có AV thấp nhất sẽ lên đầu (Index 0)
    sortQueue() {
        this.characters.sort((a, b) => {
            // Ưu tiên 1: Action Value thấp hơn đi trước
            if (Math.abs(a.actionValue - b.actionValue) > 0.01) {
                return a.actionValue - b.actionValue;
            }
            // Ưu tiên 2: Nếu AV bằng nhau, ai Tốc độ gốc cao hơn đi trước
            if (a.combatStats.moveSpeed !== b.combatStats.moveSpeed) {
                return b.combatStats.moveSpeed - a.combatStats.moveSpeed; 
            }
            // Ưu tiên 3: Random ID (để không bị thiên vị phe nào)
            return a.id.localeCompare(b.id);
        });
    }

    // Lấy nhân vật đang đứng đầu hàng (Người sẽ đi lượt này)
    getNextCharacter() {
        // Chỉ lấy người còn sống
        return this.characters.find(u => !u.isDead) || null;
    }

    // Bắt đầu lượt mới (Advance Turn)
    // Logic: Trừ AV của tất cả mọi người bằng AV của người đi đầu
    startTurn() {
        this.sortQueue(); // Đảm bảo hàng chờ đúng thứ tự
        
        const activeChar = this.getNextCharacter();
        if (!activeChar) return null; // Game kết thúc hoặc lỗi

        const elapsedAV = activeChar.actionValue; // Thời gian trôi qua

        // Tua thời gian cho tất cả unit
        this.characters.forEach(char => {
            if (!char.isDead) {
                char.actionValue -= elapsedAV;
                if (char.actionValue < 0) char.actionValue = 0;
            }
        });

        return activeChar;
    }

    // Kết thúc lượt (End Turn)
    // Logic: Reset AV của người vừa đánh và đẩy xuống cuối hàng
    endTurn(char) {
        if (!char) return;
        
        char.recalculateStats();
        const speed = char.combatStats.moveSpeed > 0 ? char.combatStats.moveSpeed : 1;
        
        // Tính AV cho lượt tiếp theo của nhân vật này
        // (Cộng dồn vào hiện tại, thường là 0)
        char.actionValue += this.BASE_ACTION_POINT / speed;

        this.sortQueue();
    }

    // Lấy danh sách hàng chờ để hiển thị UI
    getQueuePreview() {
        return this.characters.filter(u => !u.isDead); 
    }
}

// =========================================================================================
// 3. HÀM THỰC THI HÀNH ĐỘNG (EXECUTION LOGIC)
// Xử lý logic combat: Damage, Heal, SP...
// =========================================================================================
// src/game/CombatEngine.js

export const executeAction = (attacker, defender, type) => {
    // 1. Logic riêng cho Valhein
    if (attacker.key === 'valhein') {
        return handleValheinAction(attacker, defender, type);
    }

    // ... (Logic mặc định cho các tướng khác giữ nguyên hoặc viết hàm riêng tương tự) ...
    // Fallback cơ bản cũ
    let damage = attacker.combatStats.physicalDamage;
    defender.takeDamage(damage);
    return { actualDmg: damage, isDead: defender.isDead, type };
};

// --- HÀM XỬ LÝ RIÊNG CHO VALHEIN ---
const handleValheinAction = (attacker, defender, type) => {
    let damage = attacker.combatStats.physicalDamage;
    let effectLog = "Normal";
    let glowColor = "YELLOW"; // Mặc định màu vàng (hoặc lấy từ enhancedType)

    // A. XỬ LÝ CHIẾN KỸ (SKILL) HOẶC ĐÁNH THƯỜNG ĐỦ STACK
    // Cơ chế: Random ra phi tiêu Đỏ/Vàng/Xanh
    const isEnhanced = (type === 'skill') || (attacker.stacks >= 3);

    if (isEnhanced) {
        // Nếu chưa có loại cường hóa (do chưa random), thì random ngay tại đây
        // (Hoặc logic game của bạn là random từ khi tích đủ stack, ở đây ta random lúc bắn)
        const randomType = ['RED', 'YELLOW', 'BLUE'][Math.floor(Math.random() * 3)];
        attacker.enhancedType = randomType;

        // Tính toán hiệu ứng
        switch (randomType) {
            case 'RED': // Lan damage (Ví dụ)
                damage *= 1.4; 
                effectLog = "Đạn Đỏ (AoE)";
                break;
            case 'YELLOW': // Choáng
                damage *= 1.0; 
                effectLog = "Đạn Vàng (Stun)";
                // TODO: Add stun logic here
                break;
            case 'BLUE': // Hồi SP/Mana
                damage *= 1.2; 
                effectLog = "Đạn Xanh (Hồi SP)";
                break;
        }

        // Reset stack sau khi bắn cường hóa
        attacker.stacks = 0; 
        
        // Chiến kỹ thì không tăng stack, nhưng Đánh thường cường hóa (Nội tại) thì CÓ tăng lại 1 stack (theo mô tả game gốc)
        // Nhưng ở đây tạm thời reset về 0 để dễ test.
    } 
    else {
        // B. ĐÁNH THƯỜNG CƠ BẢN
        attacker.stacks += 1;
        attacker.enhancedType = null; // Không có màu đặc biệt
        effectLog = `Tích stack: ${attacker.stacks}`;
    }

    // Ulti thì tăng dame cực to
    if (type === 'ultimate') damage *= 2.5;

    // Trừ máu
    const actualDmg = defender.takeDamage(damage);

    return {
        actualDmg,
        isDead: defender.isDead,
        type: type,
        // Trả về thêm thông tin visual để UI hiển thị
        visualExtras: {
            stacks: attacker.stacks,
            enhancedType: attacker.enhancedType, // Để Component biết màu mà Glow
            log: effectLog
        }
    };
};

// =========================================================================================
// 4. AI LOGIC (TRÍ TUỆ NHÂN TẠO ĐƠN GIẢN)
// =========================================================================================
export const runEnemyAI = (aiUnit, playerTeamRef, executeActionCallback) => {
    // Lấy danh sách phe người chơi MỚI NHẤT từ Ref (Tránh lỗi React Stale State)
    const currentPlayers = playerTeamRef.current;
    const alivePlayers = currentPlayers.filter(u => !u.isDead);
    
    // Nếu không còn ai sống -> Thắng/Thua
    if (alivePlayers.length === 0) return false;

    // A. Chọn mục tiêu: Random
    const target = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];

    // B. Chọn hành động: Tạm thời chỉ đánh thường
    // Gọi callback để thực thi hành động và đồng bộ UI bên React
    executeActionCallback(aiUnit, target, 'normal');

    return true;
};