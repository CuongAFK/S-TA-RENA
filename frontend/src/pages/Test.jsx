const CombatUnit = ({ unit, position, isEnemy, isActive, isTarget, onClick, combatPhase }) => {
    if (!unit || unit.isDead) return null;

    const canvasRef = useRef(null);
    const videoRef = useRef(null);
    const frameIdRef = useRef(null);
    const lastTimeRef = useRef(0);
    const playPromiseRef = useRef(null);
    const keyTypeRef = useRef('BLACK');

    // --- 1. XÁC ĐỊNH LOGIC VIDEO ---
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
    keyTypeRef.current = keyType;

    // --- 2. LOGIC CANVAS DRAW (Giữ nguyên logic cũ) ---
    const drawVideoOnCanvas = useCallback((timestamp) => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || video.paused || video.ended) {
            frameIdRef.current = requestAnimationFrame(drawVideoOnCanvas);
            return;
        }
        const interval = 1000 / 30;
        const elapsed = timestamp - lastTimeRef.current;

        if (elapsed > interval) {
            lastTimeRef.current = timestamp - (elapsed % interval);
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            
            const scaleFactor = 0.5;
            const w = (video.videoWidth || 1280) * scaleFactor;
            const h = (video.videoHeight || 720) * scaleFactor;

            if (w && h && canvas.width !== Math.floor(w)) {
                canvas.width = Math.floor(w);
                canvas.height = Math.floor(h);
            }

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const len = data.length;
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
                const distSq = (r - keyR)*(r - keyR) + (g - keyG)*(g - keyG) + (b - keyB)*(b - keyB);

                if (distSq < tolSq) {
                    data[i + 3] = 0; 
                } else if (correction !== 1.0) {
                    data[i] = Math.min(255, r * correction);
                    data[i + 1] = Math.min(255, g * correction);
                    data[i + 2] = Math.min(255, b * correction);
                }
            }
            ctx.putImageData(imageData, 0, 0);
        }
        frameIdRef.current = requestAnimationFrame(drawVideoOnCanvas);
    }, []); 

    // --- 3. QUẢN LÝ VIDEO (Giữ nguyên) ---
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !shouldPlayVideo) return;
        let isCancelled = false;
        
        const startVideo = async () => {
            if (isCancelled) return;
            try {
                if (playPromiseRef.current) await playPromiseRef.current;
                playPromiseRef.current = video.play();
                await playPromiseRef.current;
                playPromiseRef.current = null;
            } catch (err) { /* ignore */ }
        };

        const onCanPlay = () => startVideo();
        video.addEventListener('canplay', onCanPlay);
        video.load();
        if (video.readyState >= 3) startVideo();

        if (!frameIdRef.current) {
            lastTimeRef.current = performance.now();
            frameIdRef.current = requestAnimationFrame(drawVideoOnCanvas);
        }
        return () => {
            isCancelled = true;
            video.removeEventListener('canplay', onCanPlay);
            if (playPromiseRef.current) playPromiseRef.current.then(() => video.pause()).catch(() => {});
            else video.pause();
        };
    }, [activeVideoSrc, shouldPlayVideo]);

  

    // Nếu đang Full Screen Anim thì tắt glow để đỡ rối
    if (isFullScreenAnim) dropShadowFilter = "none";

    // --- 5. RENDER CONTENT ---
    let mediaContent;
    if (shouldPlayVideo) {
        mediaContent = (
            <div className="w-full h-full relative">
                <video
                    ref={videoRef}
                    src={activeVideoSrc}
                    loop={isLoop}
                    muted playsInline
                    style={{ position: 'absolute', opacity: 0.01, pointerEvents: 'none', zIndex: -1 }}
                />
                <canvas
                    ref={canvasRef}
                    className="w-full h-full object-contain pointer-events-none transition-all duration-300"
                    style={{
                        transform: isFullScreenAnim ? 'scale(1)' : 'scale(1.2)',
                        // Áp dụng Drop Shadow trực tiếp vào Canvas để nó bo theo viền nhân vật (đã tách nền)
                        filter: dropShadowFilter 
                    }}
                />
            </div>
        );
    } else {
        const imgSrc = (combatPhase === 'EXECUTING' && (isActive || isTarget)) || combatPhase === 'SELECT_TARGET'
            ? unit.assets.portrait.play
            : unit.assets.portrait.list;
        mediaContent = (
            <img 
                src={imgSrc} 
                alt={unit.name} 
                className="w-full h-full object-contain transition-all duration-300"
            />
        );
    }

    // --- 6. STYLE VỊ TRÍ & CONTAINER ---
    let dynamicStyle = {
        top: `${position.top}%`,
        left: `${position.left}%`,
        transform: `translate(-50%, -50%) scale(${position.scale})`,
        zIndex: position.zIndex,
        width: '140px',
        opacity: 1,
        transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
    };

    if (combatPhase === 'SELECT_TARGET') {
        if (!isEnemy && isActive) {
            dynamicStyle.left = '20%'; dynamicStyle.top = '55%';
            dynamicStyle.transform = `translate(-50%, -50%) scale(2.2)`;
            dynamicStyle.zIndex = 100;
        } else if (!isEnemy && !isActive) {
            dynamicStyle.left = '-50%'; dynamicStyle.opacity = 0;
        }
    }

    if (combatPhase === 'EXECUTING') {
        if (isActive && isFullScreenAnim) {
            dynamicStyle = {
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                zIndex: 9999, opacity: 1, transform: 'none', transition: 'opacity 0.3s ease'
            };
        } else if (isTarget) {
            dynamicStyle.zIndex = 90; 
        } else {
            dynamicStyle.left = isEnemy ? '150%' : '-50%'; dynamicStyle.opacity = 0;
        }
    }

    // Ẩn UI khi chiếu phim
    const hideUI = isFullScreenAnim && isActive;

    return (
        <div onClick={onClick} className={`absolute flex flex-col items-center group ${isFullScreenAnim ? '' : 'transition-all'}`} style={dynamicStyle}>
            
            {/* CONTAINER MEDIA */}
            <div className={`relative w-full ${isFullScreenAnim ? 'h-full' : 'aspect-square'} transition-all duration-300`}>
                {mediaContent}
            </div>

            {/* UI HP/MANA CỦA KẺ ĐỊCH (Đã nâng cấp dùng StatBar) */}
            {!hideUI && isEnemy && (
                <div className="absolute top-0 -translate-y-full mb-4 w-[160%] bg-black/80 px-2 py-2 rounded-md backdrop-blur-sm border border-red-500/30 flex flex-col gap-1 items-center z-20 pointer-events-none shadow-xl">
                    {/* Tên Kẻ Địch */}
                    <div className="text-[10px] text-red-300 font-bold uppercase tracking-wide mb-0.5">{unit.name}</div>
                    
                    {/* Thanh Máu Enemy */}
                    <div className="h-3 w-full">
                        <StatBar 
                            current={unit.currentHp} 
                            max={unit.baseStats.maxHp} 
                            colorClass="bg-red-600"
                            showSeparators={true}
                        />
                    </div>
                    
                    {/* Thanh Mana Enemy (Nếu có) */}
                    {unit.baseStats.maxMana > 0 && (
                        <div className="h-2 w-full mt-0.5">
                            <StatBar 
                                current={unit.currentMana} 
                                max={unit.baseStats.maxMana} 
                                colorClass="bg-blue-500"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* CROSSHAIR */}
            {!hideUI && isTarget && (
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <img src={crosshairIcon} alt="Target" className="w-24 h-24 animate-spin-slow drop-shadow-[0_0_10px_rgba(255,0,0,1)]" />
                </div>
            )}
        </div>
    );
};