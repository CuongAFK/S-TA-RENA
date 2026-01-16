// src/pages/CombatPage.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CHARACTERS_DATA } from '../data/charactersData';
import { ChevronLeft } from 'lucide-react';
import BackGroundCombat from '../assets/images/bgcombat/bgcombat.jpg';
import crosshairIcon from '../assets/icons/crosshair.png';

// --- IMPORT TỪ ENGINE ---
import { Character, TurnManager, executeAction, runEnemyAI } from '../game/CombatEngine';

// =========================================================================================
// ⚙️ CẤU HÌNH VISUAL
// =========================================================================================

// ... (Giữ nguyên phần cấu hình ENEMY_FORMATION, PLAYER_FORMATION như cũ) ...
// Kẻ địch (V-Shape)
const E_START_X = 25;
const E_GAP_X = 15;
const E_BASE_Y = 25;
const E_Y_STEP = 3;

// Phe Ta (Diagonal)
const P_START_X = 20;
const P_GAP_X = 15;
const P_START_Y = 70;
const P_Y_STEP = 0;
const P_SCALE = 1.2;

const TEAM_POSITIONS = {
    enemy: [
        { id: 0, left: E_START_X + 2, top: E_BASE_Y, scale: 0.75, zIndex: 1 },
        { id: 1, left: E_START_X + E_GAP_X, top: E_BASE_Y + E_Y_STEP, scale: 0.85, zIndex: 5 },
        { id: 2, left: E_START_X + (E_GAP_X * 2), top: E_BASE_Y + (E_Y_STEP * 2), scale: 1, zIndex: 10 },
        { id: 3, left: E_START_X + (E_GAP_X * 3), top: E_BASE_Y + E_Y_STEP, scale: 0.85, zIndex: 5 },
        { id: 4, left: E_START_X + (E_GAP_X * 4) - 2, top: E_BASE_Y, scale: 0.75, zIndex: 1 },
    ],
    player: [
        { id: 0, left: P_START_X, top: P_START_Y, scale: P_SCALE, zIndex: 20 },
        { id: 1, left: P_START_X + P_GAP_X, top: P_START_Y + P_Y_STEP, scale: P_SCALE, zIndex: 30 },
        { id: 2, left: P_START_X + P_GAP_X * 2, top: P_START_Y + P_Y_STEP, scale: P_SCALE, zIndex: 40 },
        { id: 3, left: P_START_X + P_GAP_X * 3, top: P_START_Y + P_Y_STEP, scale: P_SCALE, zIndex: 50 },
        { id: 4, left: P_START_X + P_GAP_X * 4, top: P_START_Y + P_Y_STEP, scale: P_SCALE, zIndex: 60 },
    ]
};

// src/pages/CombatPage.jsx

// =========================================================================================
// CẤU HÌNH CHROMA KEY (MÀU ĐEN & MÀU XANH)
// =========================================================================================
const KEY_CONFIGS = {
    // Cấu hình cho Video Chờ (Nền Đen)
    BLACK: {
        color: [0, 0, 0],
        tolerance: 30,
        correction: 1.0,
    },
    // Cấu hình cho Video Tấn Công (Nền Xanh Lá)
    GREEN: {
        color: [20, 255, 8], // Màu xanh lá chuẩn (hoặc [0, 255, 0] rgb(20, 255, 8))
        tolerance: 170,      // Dung sai lớn hơn vì màu xanh dễ tách
        correction: 1.0,     // Giữ nguyên độ sáng
    }
};

const CombatUnit = ({ unit, position, isEnemy, isActive, isTarget, onClick, combatPhase }) => {
    if (!unit || unit.isDead) return null;

    const canvasRef = useRef(null);
    const videoRef = useRef(null);
    const frameIdRef = useRef(null);
    const lastTimeRef = useRef(0);
    const playPromiseRef = useRef(null); // Quản lý Promise play

    // --- 1. XÁC ĐỊNH LOGIC (GIỮ NGUYÊN) ---
    let activeVideoSrc = null;
    let isLoop = true;
    let keyType = 'BLACK'; 
    let isFullScreenAnim = false;

    if (isActive && !isEnemy) {
        if (combatPhase === 'EXECUTING') {
            activeVideoSrc = unit.assets?.action?.normalAttack; 
            isLoop = false;
            keyType = 'GREEN'; 
            isFullScreenAnim = true; 
        } else if (unit.assets?.action?.ready) {
            activeVideoSrc = unit.assets.action.ready;
            isLoop = true;
            keyType = 'BLACK';
        }
    }

    const shouldPlayVideo = !!activeVideoSrc;

    // 🔥 FIX 1: Dùng Ref để lưu keyType hiện tại
    // Giúp hàm draw không cần phụ thuộc vào biến keyType, tránh re-render loop
    const keyTypeRef = useRef(keyType);
    keyTypeRef.current = keyType; // Luôn cập nhật giá trị mới nhất mỗi lần render

    // --- 2. LOGIC CANVAS (ĐÃ TÁCH KHỎI DEPENDENCY) ---
    const drawVideoOnCanvas = useCallback((timestamp) => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas || video.paused || video.ended) {
            // Vẫn request frame để chờ video chạy lại
            frameIdRef.current = requestAnimationFrame(drawVideoOnCanvas);
            return;
        }

        const interval = 1000 / 30; // 30 FPS
        const elapsed = timestamp - lastTimeRef.current;

        if (elapsed > interval) {
            lastTimeRef.current = timestamp - (elapsed % interval);
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            
            // Render size (giảm scale để tối ưu)
            const scaleFactor = 0.5;
            const w = (video.videoWidth || 1280) * scaleFactor;
            const h = (video.videoHeight || 720) * scaleFactor;

            if (w && h && canvas.width !== Math.floor(w)) {
                canvas.width = Math.floor(w);
                canvas.height = Math.floor(h);
            }

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // XỬ LÝ CHROMA KEY
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const len = data.length;
            
            // 🔥 Lấy config từ Ref thay vì biến trực tiếp
            const currentKeyType = keyTypeRef.current;
            const config = KEY_CONFIGS[currentKeyType] || KEY_CONFIGS.BLACK;
            
            const keyR = config.color[0];
            const keyG = config.color[1];
            const keyB = config.color[2];
            const tolSq = config.tolerance * config.tolerance;
            const correction = config.correction;

            for (let i = 0; i < len; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                // Khoảng cách màu Euclid bình phương
                const distSq = (r - keyR)*(r - keyR) + (g - keyG)*(g - keyG) + (b - keyB)*(b - keyB);

                if (distSq < tolSq) {
                    data[i + 3] = 0; // Xóa nền
                } else if (correction !== 1.0) {
                    data[i] = Math.min(255, r * correction);
                    data[i + 1] = Math.min(255, g * correction);
                    data[i + 2] = Math.min(255, b * correction);
                }
            }
            ctx.putImageData(imageData, 0, 0);
        }
        
        frameIdRef.current = requestAnimationFrame(drawVideoOnCanvas);
    }, []); // 🔥 Dependency rỗng: Hàm này không bao giờ bị tạo lại!

    // --- 3. QUẢN LÝ VIDEO (FIX SPAM LOOP) ---
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !shouldPlayVideo) return;

        let isCancelled = false;
        console.log(`🎬 [SETUP] Load video: ${activeVideoSrc}`);

        const startVideo = async () => {
            if (isCancelled) return;
            try {
                // Nếu đang có lệnh play nào chưa xong thì đợi nó
                if (playPromiseRef.current) await playPromiseRef.current;
                
                console.log("▶️ [ACTION] Play video");
                playPromiseRef.current = video.play();
                await playPromiseRef.current;
                playPromiseRef.current = null; // Reset khi xong
            } catch (err) {
                if (err.name !== 'AbortError') console.warn("Video play error:", err);
            }
        };

        const onCanPlay = () => startVideo();

        // Setup event
        video.addEventListener('canplay', onCanPlay);
        
        // Load source mới
        video.load();
        
        // Check ngay lập tức nếu video đã sẵn sàng (do cache)
        if (video.readyState >= 3) {
            startVideo();
        }

        // Khởi động vòng lặp canvas (Chỉ 1 lần duy nhất)
        if (!frameIdRef.current) {
            lastTimeRef.current = performance.now();
            frameIdRef.current = requestAnimationFrame(drawVideoOnCanvas);
        }

        return () => {
            isCancelled = true;
            video.removeEventListener('canplay', onCanPlay);
            // Không cancel frameIdRef ở đây để tránh nhấp nháy đen khi đổi src, 
            // logic trong drawVideoOnCanvas sẽ tự handle khi video paused/changed
            if (playPromiseRef.current) {
                playPromiseRef.current.then(() => video.pause()).catch(() => {});
            } else {
                video.pause();
            }
        };
        // 🔥 QUAN TRỌNG: Bỏ drawVideoOnCanvas ra khỏi dependency
    }, [activeVideoSrc, shouldPlayVideo]);

    // --- 4. RENDER MEDIA ---
    let mediaContent;
    if (shouldPlayVideo) {
        mediaContent = (
            <div className="w-full h-full relative">
                {/* VIDEO ẨN: Thêm opacity 0.01 thay vì 0 để tránh trình duyệt "ngủ đông" video này */}
                <video
                    ref={videoRef}
                    src={activeVideoSrc}
                    loop={isLoop}
                    muted playsInline
                    // Quan trọng: width/height auto để lấy kích thước gốc
                    style={{ position: 'absolute', opacity: 0.01, pointerEvents: 'none', zIndex: -1 }}
                />

                {/* CANVAS HIỂN THỊ */}
                <canvas
                    ref={canvasRef}
                    className="w-full h-full object-contain drop-shadow-lg pointer-events-none"
                    // Nếu là Full Screen -> scale to ra, Nếu là Ready -> scale vừa
                    style={{
                        transform: isFullScreenAnim ? 'scale(1)' : 'scale(1.2)',
                    }}
                />
            </div>
        );
    } else {
        const imgSrc = (combatPhase === 'EXECUTING' && (isActive || isTarget)) || combatPhase === 'SELECT_TARGET'
            ? unit.assets.portrait.play
            : unit.assets.portrait.list;
        mediaContent = (
            <img src={imgSrc} alt={unit.name} className="w-full h-full object-contain drop-shadow-lg" />
        );
    }

    // --- 5. STYLE ĐỘNG (XỬ LÝ FULL MÀN HÌNH) ---
    // Mặc định
    let dynamicStyle = {
        top: `${position.top}%`,
        left: `${position.left}%`,
        transform: `translate(-50%, -50%) scale(${position.scale})`,
        zIndex: position.zIndex,
        width: '140px',
        opacity: 1,
        transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
    };

    // LOGIC CHUYỂN VỊ TRÍ
    if (combatPhase === 'SELECT_TARGET') {
        if (!isEnemy && isActive) {
            // Zoom nhân vật ta khi chọn skill
            dynamicStyle.left = '20%'; dynamicStyle.top = '55%';
            dynamicStyle.transform = `translate(-50%, -50%) scale(2.2)`;
            dynamicStyle.zIndex = 100;
        } else if (!isEnemy && !isActive) {
            dynamicStyle.left = '-50%'; dynamicStyle.opacity = 0;
        }
    }

    // LOGIC FULL MÀN HÌNH KHI TẤN CÔNG
    if (combatPhase === 'EXECUTING') {
        if (isActive && isFullScreenAnim) {
            // BIẾN THÀNH FULL MÀN HÌNH (CINEMATIC)
            // Ghi đè toàn bộ style cũ
            dynamicStyle = {
                position: 'fixed', // Thoát khỏi dòng chảy document
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 9999, // Lên trên cùng
                opacity: 1,
                transform: 'none', // Không scale/translate nữa
                transition: 'opacity 0.3s ease'
            };
        } else if (isTarget) {
            dynamicStyle.zIndex = 90; // Mục tiêu giữ nguyên
        } else {
            dynamicStyle.left = isEnemy ? '150%' : '-50%'; dynamicStyle.opacity = 0;
        }
    }

    let glowClass = "glow-hover";
    if (isActive) glowClass = "glow-active";
    else if (isTarget) glowClass = "glow-target";
    else if (isEnemy) glowClass = "glow-enemy";
    else glowClass = "glow-player";

    // Ẩn thanh máu/glow khi đang chiếu phim Full màn hình
    const hideUI = isFullScreenAnim && isActive;

    return (
        <div onClick={onClick} className={`absolute flex flex-col items-center group ${isFullScreenAnim ? '' : 'transition-all'}`} style={dynamicStyle}>
            {/* CONTAINER MEDIA */}
            {/* Nếu là Full screen thì bỏ aspect-square để nó tự do theo màn hình */}
            <div className={`relative w-full ${isFullScreenAnim ? 'h-full' : 'aspect-square'} transition-all duration-300 ${hideUI ? '' : glowClass}`}>
                {mediaContent}
            </div>

            {/* UI PHỤ (Thanh máu, Tâm ngắm) - Ẩn khi Full Screen */}
            {!hideUI && isEnemy && (
                <div className="absolute top-0 -translate-y-full mb-2 w-[140%] bg-black/80 px-1.5 py-1.5 rounded backdrop-blur-sm border border-red-500/30 flex flex-col gap-1 items-center z-20 pointer-events-none">
                    <div className="h-2 w-full bg-gray-800 rounded-sm overflow-hidden border border-white/10 relative">
                        <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${(unit.currentHp / unit.baseStats.maxHp) * 100}%` }} />
                    </div>
                    {unit.baseStats.maxMana > 0 && (
                        <div className="h-1.5 w-full bg-gray-800 rounded-sm overflow-hidden border border-white/10 relative">
                            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${(unit.currentMana / unit.baseStats.maxMana) * 100}%` }} />
                        </div>
                    )}
                </div>
            )}

            {!hideUI && isTarget && (
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <img src={crosshairIcon} alt="Target" className="w-24 h-24 animate-spin-slow drop-shadow-[0_0_10px_rgba(255,0,0,1)]" />
                </div>
            )}
        </div>
    );
};



// src/pages/CombatPage.jsx -> ActionBar

const ActionBar = ({ queue }) => {
    // Tính toán AV tiếp theo cho unit đang active (để hiển thị dự đoán)
    const activeUnit = queue[0];
    const nextAV = activeUnit ? Math.floor(activeUnit.actionValue + (10000 / (activeUnit.combatStats.moveSpeed || 1))) : 0;

    return (
        <div className="absolute top-15 left-4 flex flex-col gap-3 z-40">
            {/* Tiêu đề */}
            <div className="bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-r border-l-4 border-yellow-500 w-fit backdrop-blur-md">
                ACTION ORDER
            </div>

            <div className="flex flex-col gap-1">
                {queue.slice(0, 7).map((u, i) => {
                    const isFirst = i === 0;
                    // Style riêng cho người đầu hàng
                    const containerClass = isFirst
                        ? "w-28 h-16 border-l-4 border-yellow-400 translate-x-2 shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                        : "w-20 h-10 border-l-2 border-white/20 opacity-80 hover:scale-105 hover:opacity-100";

                    const factionColor = u.faction === 'AI' ? 'bg-red-600' : 'bg-blue-500';

                    return (
                        <div key={`${u.id}-${i}`} className={`relative  bg-gray-900/80 backdrop-blur transition-all duration-300 flex items-center overflow-hidden rounded-r-md ${containerClass}`}>
                            {/* Ảnh Cắt (Rectangular Crop) */}
                            <img
                                src={u.assets.portrait.list}
                                alt={u.name}
                                className="absolute inset-0 w-full h-full clip-rect-top opacity-80"
                            />

                            {/* Overlay Gradient để hiện chữ rõ hơn */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />

                            {/* Thông tin AV */}
                            <div className="relative z-10 ml-2 flex flex-col justify-center">
                                {isFirst && <span className="text-[9px] text-yellow-300 font-bold uppercase tracking-widest">Active</span>}
                                <span className="text-white font-bold text-xs leading-none drop-shadow-md">
                                    {Math.floor(u.actionValue)} AV
                                </span>
                            </div>

                            {/* Badge Số thứ tự */}
                            <div className={`absolute bottom-0 right-0 ${factionColor} text-white text-[9px] font-bold px-1.5 py-0.5 rounded-tl`}>
                                {i + 1}
                            </div>

                            {/* Dự đoán lượt sau (Chỉ hiện cho Active Unit) */}
                            {isFirst && (
                                <div className="absolute -right-24 top-1/2 -translate-y-1/2 bg-black/60 text-gray-300 text-[10px] px-2 py-1 rounded border border-gray-600">
                                    Next: <span className="text-white font-bold">{nextAV}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const PartyStatusPanel = ({ team, activeUnitId }) => (
    <div className="absolute bottom-6 left-6 flex gap-3 items-end">
        {team.map((char) => {
            const isSelected = char.id === activeUnitId;
            const hpPercent = (char.currentHp / char.baseStats.maxHp) * 100;
            const manaPercent = (char.currentMana / (char.baseStats.maxMana || 100)) * 100;
            return (
                <div key={char.id} className={`relative bg-gray-900/80 backdrop-blur-md border transition-all duration-300 p-1 ${isSelected ? 'border-yellow-400 scale-105 -translate-y-2' : 'border-gray-600'} ${char.isDead ? 'opacity-50 grayscale border-red-900' : ''}`} style={{ width: '80px', height: 'auto' }}>
                    <div className="flex h-[80px]">
                        <div className="flex-1 relative overflow-hidden bg-black">
                            <img src={char.assets.portrait.list} alt={char.name} className="w-full h-full object-cover opacity-90" />
                            {char.isDead && <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-red-500 font-bold text-xs">DEAD</div>}
                        </div>
                        <div className="w-2 h-full bg-gray-800 ml-0.5 relative flex flex-col justify-end">
                            <div className="w-full bg-blue-500 transition-all duration-500" style={{ height: `${manaPercent}%` }} />
                        </div>
                    </div>
                    <div className="mt-1 w-full h-2 bg-gray-800 relative">
                        <div className={`h-full transition-all duration-300 ${hpPercent < 30 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} style={{ width: `${hpPercent}%` }} />
                    </div>
                    <div className="absolute -bottom-4 left-0 w-full text-center text-[9px] text-gray-300 font-mono">{Math.ceil(char.currentHp)}/{char.baseStats.maxHp}</div>
                </div>
            );
        })}
    </div>
);

// 4. BẢNG ĐIỀU KHIỂN SKILL (Cập nhật hiển thị phím tắt)
// src/pages/CombatPage.jsx -> CommandPanel

const CommandPanel = ({ activeUnit, skillPoints, onSelectSkill, currentSelectedSkill }) => {
    if (!activeUnit) return null;

    // Dự đoán SP
    let predictedSP = skillPoints;
    if (currentSelectedSkill === 'skill') predictedSP = Math.max(0, skillPoints - 1);
    if (currentSelectedSkill === 'normal') predictedSP = Math.min(5, skillPoints + 1);

    return (
        <div className="absolute bottom-8 right-8 flex items-center gap-6 pointer-events-auto z-[999]">

            {/* 1. THANH SP (NẰM NGANG, BÊN TRÁI) */}
            <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-3 h-fit">
                <span className="text-yellow-400 text-xs font-bold tracking-widest border-r border-white/20 pr-3">SP</span>
                <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((idx) => {
                        const hasPoint = idx <= skillPoints;
                        const willHave = idx <= predictedSP;

                        let styleClass = "bg-gray-700 border-gray-600 opacity-30"; // Trống

                        if (hasPoint && willHave) {
                            // Có và Sẽ giữ -> Vàng
                            styleClass = "bg-yellow-400 border-yellow-200 shadow-[0_0_8px_#fbbf24]";
                        } else if (hasPoint && !willHave) {
                            // Có nhưng Sẽ mất -> Đỏ nháy
                            styleClass = "sp-ghost-loss";
                        } else if (!hasPoint && willHave) {
                            // Chưa có nhưng Sẽ nhận -> Xanh nháy
                            styleClass = "sp-ghost-gain";
                        }

                        return (
                            <div
                                key={idx}
                                className={`w-3 h-3 rotate-45 border transition-all duration-300 ${styleClass}`}
                            />
                        );
                    })}
                </div>
                <div className="text-xs text-white font-mono ml-1 w-6 text-right">{skillPoints}/5</div>
            </div>

            {/* 2. CÁC NÚT KỸ NĂNG */}
            <div className="flex items-end gap-4">

                {/* Q - Normal */}
                <SkillButton
                    unit={activeUnit} type="normal" hotkey="Q" label="Đánh thường"
                    isSelected={currentSelectedSkill === 'normal'}
                    isDimmed={currentSelectedSkill && currentSelectedSkill !== 'normal'}
                    onClick={() => onSelectSkill('normal')}
                />

                {/* E - Skill */}
                <SkillButton
                    unit={activeUnit} type="skill" hotkey="E" cost={1} label="Chiến kỹ"
                    isSelected={currentSelectedSkill === 'skill'}
                    isDimmed={currentSelectedSkill && currentSelectedSkill !== 'skill'}
                    onClick={() => onSelectSkill('skill')}
                    disabled={skillPoints < 1}
                />

                {/* R - Ultimate */}
                <SkillButton
                    unit={activeUnit} type="ultimate" hotkey="R" label="Tuyệt kỹ"
                    isSelected={currentSelectedSkill === 'ultimate'}
                    isDimmed={currentSelectedSkill && currentSelectedSkill !== 'ultimate'}
                    onClick={() => onSelectSkill('ultimate')}
                />
            </div>
        </div>
    );
};

// Component con: Nút Skill (Tinh chỉnh Visual)
const SkillButton = ({ unit, type, hotkey, cost, label, isSelected, isDimmed, onClick, disabled }) => {
    const icon = unit.skillsData[type].visuals.icon;

    // Kích thước cơ bản
    const baseSize = type === 'ultimate' ? 'w-24 h-24' : 'w-20 h-20';

    // Logic Style động
    let containerStyle = `rounded-full border-2 bg-gray-900 overflow-hidden transition-all duration-300 relative ${baseSize} `;

    if (disabled) {
        containerStyle += "border-gray-700 grayscale opacity-40 cursor-not-allowed";
    } else if (isSelected) {
        // ĐANG CHỌN: Sáng, To, Glow
        containerStyle += "border-white scale-110 shadow-[0_0_25px_rgba(255,255,255,0.4)] z-10 cursor-pointer";
    } else if (isDimmed) {
        // KHÔNG CHỌN (khi cái khác đang chọn): Tối, Nhỏ
        containerStyle += "border-gray-600 scale-90 opacity-60 grayscale-[50%] cursor-pointer hover:opacity-100 hover:scale-95";
    } else {
        // BÌNH THƯỜNG
        containerStyle += "border-gray-400 hover:border-white hover:scale-105 cursor-pointer";
    }

    return (
        <div className="flex flex-col items-center gap-2 group" onClick={!disabled ? onClick : undefined}>
            {/* Vòng tròn Icon */}
            <div className={containerStyle}>
                <img src={icon} className="w-full h-full object-cover" alt={type} />
                {/* Cost SP */}
                {cost && !disabled && (
                    <div className="absolute top-1 right-1 bg-black rounded-full w-5 h-5 flex items-center justify-center border border-white text-[10px] font-bold text-red-400 z-20">
                        -{cost}
                    </div>
                )}
            </div>

            {/* Label tên & Phím tắt */}
            <div className={`flex flex-col items-center transition-all duration-300 ${isSelected ? 'opacity-100 translate-y-0' : 'opacity-70 group-hover:opacity-100'}`}>
                <div className="text-[10px] font-bold text-white uppercase tracking-wider mb-0.5 text-shadow-sm">
                    {label}
                </div>
                <div className="bg-white/10 border border-white/20 text-white text-[9px] px-2 rounded-full font-mono">
                    [{hotkey}]
                </div>
            </div>
        </div>
    );
};

// =========================================================================================
// 🎬 MAIN CONTROLLER
// =========================================================================================

const CombatPage = () => {
    const navigate = useNavigate();

    const turnManagerRef = useRef(null);
    const playerTeamRef = useRef([]);
    const enemyTeamRef = useRef([]);

    const [playerTeam, setPlayerTeam] = useState([]);
    const [enemyTeam, setEnemyTeam] = useState([]);
    const [queue, setQueue] = useState([]);
    const [activeUnitId, setActiveUnitId] = useState(null);
    const [skillPoints, setSkillPoints] = useState(3);
    const [selectedSkillType, setSelectedSkillType] = useState(null);
    const [combatPhase, setCombatPhase] = useState('IDLE');

    // MỚI: State lưu ID mục tiêu đang được nhắm tới
    const [activeTargetId, setActiveTargetId] = useState(null);

    // --- INIT DATA ---
    useEffect(() => {
        const valheinData = CHARACTERS_DATA.find(c => c.key === "valhein");
        const trieuvanData = CHARACTERS_DATA.find(c => c.key === "trieuvan");

        const pTeam = Array.from({ length: 5 }).map((_, i) => {
            const c = new Character(valheinData, "PLAYER");
            c.id = `player-${i}`; c.name = `Valhein ${i + 1}`;
            return c;
        });
        const eTeam = Array.from({ length: 5 }).map((_, i) => {
            const c = new Character(trieuvanData, "AI");
            c.id = `enemy-${i}`; c.name = `Triệu Vân ${i + 1}`;
            c.currentHp = c.baseStats.maxHp * (0.5 + Math.random() * 0.5); // Random máu để test chọn yếu nhất
            return c;
        });

        playerTeamRef.current = pTeam;
        enemyTeamRef.current = eTeam;
        setPlayerTeam(pTeam);
        setEnemyTeam(eTeam);

        const allUnits = [...pTeam, ...eTeam];
        const tm = new TurnManager(allUnits);
        tm.initCombat();
        turnManagerRef.current = tm;

        processNextTurn(tm);
    }, []);

    const syncStateWithRef = () => {
        setPlayerTeam([...playerTeamRef.current]);
        setEnemyTeam([...enemyTeamRef.current]);
    };

    // --- LOGIC TỰ ĐỘNG CHỌN (AUTO-PICK) ---
    const autoPickTarget = () => {
        const enemies = enemyTeamRef.current.filter(e => !e.isDead);
        if (enemies.length === 0) return null;

        // Tìm kẻ địch máu thấp nhất
        const lowestHpEnemy = enemies.reduce((prev, curr) =>
            curr.currentHp < prev.currentHp ? curr : prev
        );
        return lowestHpEnemy.id;
    };

    // --- GAME LOOP ---
    const processNextTurn = (tmInstance) => {
        const tm = tmInstance || turnManagerRef.current;
        if (!tm) return;

        const unit = tm.startTurn();
        if (!unit) return;

        setActiveUnitId(unit.id);
        setQueue(tm.getQueuePreview());
        setSelectedSkillType(null);
        setActiveTargetId(null); // Reset target

        if (unit.isDead) {
            endCurrentTurn();
        } else if (unit.faction === "PLAYER") {
            // === LOGIC TỰ ĐỘNG CHO NGƯỜI CHƠI ===

            // 1. Tự chọn skill: Nếu có SP thì dùng Skill, ko thì Normal
            // Lưu ý: Đây chỉ là gợi ý ban đầu, người chơi có thể đổi
            // Ở đây bạn muốn mặc định là Skill nếu có điểm:
            const defaultSkill = skillPoints > 0 ? 'skill' : 'normal';
            setSelectedSkillType(defaultSkill);

            // 2. Tự chọn mục tiêu yếu nhất
            const targetId = autoPickTarget();
            setActiveTargetId(targetId);

            // 3. Vào thẳng Phase SELECT_TARGET để hiện giao diện Focus
            setCombatPhase('SELECT_TARGET');

        } else {
            setCombatPhase('IDLE');
            setTimeout(() => {
                runEnemyAI(unit, playerTeamRef, executeActionAndSync);
                endCurrentTurn();
            }, 1000);
        }
    };

    const endCurrentTurn = () => {
        const tm = turnManagerRef.current;
        if (!tm) return;
        const currentUnit = tm.getNextCharacter();
        tm.endTurn(currentUnit);
        processNextTurn(tm);
    };

    // --- EXECUTION ---
    const executeActionAndSync = (attacker, defender, type) => {
        const result = executeAction(attacker, defender, type);
        console.log(`💥 ${attacker.name} -> ${defender.name} (${result.actualDmg} dmg)`);
        syncStateWithRef();
    };

    // --- INPUT HANDLERS ---
    const handleSelectSkill = (type) => {
        // Kiểm tra điều kiện SP
        if (type === 'skill' && skillPoints < 1) {
            // Có thể thêm hiệu ứng rung UI hoặc âm thanh báo lỗi ở đây
            console.log("Không đủ SP!");
            return;
        }

        // Nếu click vào skill ĐANG CHỌN -> Xác nhận đánh luôn
        if (selectedSkillType === type) {
            confirmAttack();
        } else {
            // Nếu chưa chọn -> Chọn skill đó
            setSelectedSkillType(type);
        }
    };

    const confirmAttack = () => {
        if (!activeTargetId || !selectedSkillType) return;

        // Tìm đối tượng thật
        const allUnits = [...playerTeamRef.current, ...enemyTeamRef.current];
        const activeUnit = allUnits.find(u => u.id === activeUnitId);
        const targetUnit = allUnits.find(u => u.id === activeTargetId);

        if (!activeUnit || !targetUnit || targetUnit.isDead) return;

        // Validate lại SP
        if (selectedSkillType === 'skill' && skillPoints < 1) return;

        // BẮT ĐẦU DIỄN HOẠT
        setCombatPhase('EXECUTING');
        executeActionAndSync(activeUnit, targetUnit, selectedSkillType);

        if (selectedSkillType === 'skill') setSkillPoints(p => p - 1);
        if (selectedSkillType === 'normal') setSkillPoints(p => Math.min(p + 1, 5));

        setTimeout(() => {
            setCombatPhase('IDLE');
            endCurrentTurn();
        }, 2000); // 2s để xem animation
    };

    // --- KEYBOARD CONTROLS (PHÍM TẮT) ---
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Chỉ hoạt động khi đang ở Phase chọn mục tiêu
            if (combatPhase !== 'SELECT_TARGET') return;

            const enemies = enemyTeamRef.current.filter(u => !u.isDead);
            if (enemies.length === 0) return;

            // Tìm index hiện tại của target trong mảng enemies
            const currentIndex = enemies.findIndex(e => e.id === activeTargetId);

            const checkDoublePress = (type) => {
                // Nếu skill này ĐANG được chọn -> Gọi lệnh đánh luôn
                if (selectedSkillType === type) {
                    confirmAttack();
                } else {
                    // Nếu chưa chọn -> Chọn skill đó
                    handleSelectSkill(type);
                }
            };

            switch (e.key.toLowerCase()) {
                case 'a': // Qua trái (Lùi index)
                case 'arrowleft':
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : enemies.length - 1;
                    setActiveTargetId(enemies[prevIndex].id);
                    break;

                case 'd': // Qua phải (Tăng index)
                case 'arrowright':
                    const nextIndex = currentIndex < enemies.length - 1 ? currentIndex + 1 : 0;
                    setActiveTargetId(enemies[nextIndex].id);
                    break;

                case 'q': checkDoublePress('normal'); break;
                case 'e': checkDoublePress('skill'); break;
                case 'r': checkDoublePress('ultimate'); break;

                case 'enter':
                case ' ':
                    confirmAttack();
                    break;
                default: break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [combatPhase, activeTargetId, selectedSkillType, skillPoints]); // Dependency quan trọng

    // Click chuột vào unit
    const handleTargetClick = (unit) => {
        if (combatPhase !== 'SELECT_TARGET') return;
        if (!unit.isDead && unit.faction !== "PLAYER") {
            setActiveTargetId(unit.id);
            // Click lần nữa để confirm (hoặc click rồi bấm Attack, ở đây tôi cho click -> đổi target thôi)
        }
    };

    // --- RENDER ---
    const activeUnitUI = [...playerTeam, ...enemyTeam].find(u => u.id === activeUnitId);

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden select-none font-sans">
            <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url(${BackGroundCombat})`, filter: "brightness(0.6)" }} />

            <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
                {/* Render Địch */}
                {enemyTeam.map((unit, index) => (
                    <div key={unit.id} className="pointer-events-auto">
                        <CombatUnit
                            unit={unit}
                            position={TEAM_POSITIONS.enemy[index]}
                            isEnemy={true}
                            isActive={activeUnitId === unit.id}
                            isTarget={activeTargetId === unit.id} // Truyền prop isTarget
                            combatPhase={combatPhase} // Truyền Phase xuống để xử lý visual
                            onClick={() => handleTargetClick(unit)}
                        />
                    </div>
                ))}
                {/* Render Ta */}
                {playerTeam.map((unit, index) => (
                    <div key={unit.id} className="pointer-events-auto">
                        <CombatUnit
                            unit={unit}
                            position={TEAM_POSITIONS.player[index]}
                            isEnemy={false}
                            isActive={activeUnitId === unit.id}
                            isTarget={false} // Đồng minh không phải target (trừ skill buff, tính sau)
                            combatPhase={combatPhase}
                        />
                    </div>
                ))}
            </div>

            <div className="absolute inset-0 z-50 pointer-events-none">
                <div className="absolute top-4 left-4 pointer-events-auto">
                    <button onClick={() => navigate('/gameplay')} className="flex items-center gap-2 bg-black/40 text-gray-300 px-3 py-1.5 rounded border border-white/10 hover:bg-red-900 transition text-xs">
                        <ChevronLeft size={14} /> THOÁT
                    </button>
                </div>

                {combatPhase !== 'EXECUTING' && (
                    <>
                        <div className="pointer-events-auto"><ActionBar queue={queue} /></div>
                        <div className="pointer-events-auto"><PartyStatusPanel team={playerTeam} activeUnitId={activeUnitId} /></div>
                    </>
                )}

                <div className="pointer-events-auto">
                    {/* Command Panel chỉ hiện ở Phase Select Target */}
                    {activeUnitUI && activeUnitUI.faction === 'PLAYER' && combatPhase === 'SELECT_TARGET' && (
                        <CommandPanel
                            activeUnit={activeUnitUI}
                            skillPoints={skillPoints}
                            onSelectSkill={handleSelectSkill}
                            currentSelectedSkill={selectedSkillType}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CombatPage