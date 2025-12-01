// =============== ✅ GAMESTORYPAGE.JSX HOÀN CHỈNH VỚI CHOICE SYSTEM DATA-DRIVEN ===============


import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, SkipForward, Volume2, VolumeX, Play, Pause } from "lucide-react";

import scene1 from "../assets/images/story/scene1.jpg";
import scene2 from "../assets/images/story/scene2.jpg";
import scene3 from "../assets/images/story/scene3.jpg";
import scene4 from "../assets/images/story/scene4.jpg";
import scene5 from "../assets/images/story/scene5.jpg";
import scene6 from "../assets/images/story/scene6.jpg";
import scene7 from "../assets/images/story/scene7.jpg";
import scene8 from "../assets/images/story/scene8.jpg";


import typeSoundFile from "../assets/sounds/type-ui.mp3";
import bgmStory from "../assets/sounds/bgm-story.mp3";        //nhạc nền cảm xúc
import sceneChangeSound from "../assets/sounds/scene-change.mp3"; // Âm thanh chuyển cảnh

// =============== 🎮 DATA CỐT TRUYỆN - DATA-DRIVEN CHOICE (BẠN TỰ DO SÁNG TẠO) ===============
const storyData = [
  // 🟢 SCENE 1: Pom-Pom hoảng loạn
  {
    bg: scene1,
    camera: "pan-1",
    dialogues: [
      {
        speaker: "Pom-Pom",
        text: "Á á á! Mọi người ơi, Pom-Pom phát hiện! Phía trước đường ray Star Rail... đột nhiên xuất hiện một đoàn tàu lạ hoắc đang lao vun vút ngang đường của đội tàu Astral chúng ta!!"
      },
      {
        speaker: "Pom-Pom",
        text: "Ôi không! Va chạm không tránh khỏi nữa rồi! Nguy hiểm khủng khiếp! Mọi người mau bảo vệ bản thân ngay lập tức đi!!! Cầm chặt tay vịn, ôm đầu, nằm sấp xuống sàn!!! AAAaaa!!!"
      },
    ],
  },
  // 🟢 SCENE 2: Stelle nhìn cửa sổ
  {
    bg: scene2,
    camera: "pan-2",
    dialogues: [
      {
        speaker: "Stelle",
        text: "Mọi người nhìn ra cửa sổ kìa! Một vùng đất bay lơ lửng siêu lạ hoắc! Pháo đài khổng lồ, công trình cổ đại, cỏ xanh mênh mông với quái vật lảng vảng... Ba con đường dẫn vào chiến trường! Chỗ này giống hệt con game tôi hay chơi cùng Sói Bạc!"
      },
      {
        speaker: "Stelle",
        text: "Dan Heng, anh nghĩ đây là đâu? Tôi muốn lao ra nhặt rác ngay! À nhầm, khám phá ngay! Tôi cá là tôi sẽ 'Bốp' vào  Trụ Đỏ đầu tiên để xem chuyện gì xảy ra!"
      },
    ],
  },
  // 🟢 SCENE 3: Dan Heng phân tích
  {
    bg: scene3,
    camera: "pan-3",
    dialogues: [
      {
        speaker: "Dan Heng",
        text: "…(Màn hình máy tính bảng nhấp nháy, dữ liệu tốc độ cao)..."
      },
      {
        speaker: "Dan Heng",
        text: "Phân tích dữ liệu lịch sử và quỹ đạo... Khu vực này được định danh là 'Bình Nguyên Vô Tận' – đấu trường sinh tử không hồi kết giữa vô số phe phái. Nơi đây không an toàn. Chúng ta nên tìm cách rời khỏi ngay."
      },
    ],
  },
  // 🟢 SCENE 4: Pom-Pom hống hách
  {
    bg: scene4,
    camera: "pan-4",
    dialogues: [
      { speaker: "Pom-Pom", text: "(chống hông, tai vểnh) Hừm! Đội tàu Astral hỏng nặng sau cú tông, không đi ngay được. Sửa chữa mất nhiều thời gian. Các cậu bảo vệ tàu trước mọi nguy hiểm, Pom-Pom mà thấy dù chỉ một vết trầy trên lớp sơn mới, các cậu sẽ phải lau dọn hết mọi toilet trên tàu suốt một tháng!" },
    ],
  },
  // 🔴 SCENE 5: CHOICE + SEQUENCE (DATA-DRIVEN - BẠN SÁNG TẠO TỰ DO!)
  {
    bg: scene5,
    camera: "pan-5",
    dialogues: [
      // Valhein xuất hiện + đe dọa
      { speaker: "???", text: "(Bóng đen lướt qua boong tàu, đáp nhẹ xuống sàn kim loại, Khẩu súng Thánh Quang chĩa thẳng)" },
      { speaker: "???", text: "Dừng lại! Các ngươi đã xâm nhập Vùng Cấm Vô Tận mà không được phép. Đoàn tàu này từ đâu tới? Nói ngay... trước khi ta quyết định xử lý 'vị khách' bất ngờ này." },

      // 🔥 CHOICE: MỖI CHOICE CÓ nextSequence[] RIÊNG (Dan Heng → Valhein)
      {
        speaker: "Stelle",
        type: "choice",  // ← ĐẶC BIỆT: Component nhận ra đây là choice
        text: "(Suy nghĩ... Mình nên trả lời hắn thế nào đây?)",
        choices: [
          {
            id: 0,
            text: "Giơ tay đầu hàng, cười gượng: 'Bình tĩnh nào anh đẹp trai, tụi tôi lạc đường thôi!'",
            nextSequence: [  // ← MẢNG: Dan Heng chen ngang → Valhein phản ứng
              {
                speaker: "Dan Heng",
                text: "(bước lên, giọng trầm lạnh): Stelle, đừng nói linh tinh. Chúng tôi là khách vô danh, không có ý định xấu."
              },
              {
                speaker: "???",
                text: "(hạ súng một chút, cau mày): Ồ? Khách vô danh hả? Chưa từng nghe tới. Tiểu đội của ngươi định làm gì ở đây?"
              }
            ]
          },
          {
            id: 1,
            text: "Rút gậy bóng chày, tư thế sẵn sàng: 'Muốn thử cây gậy này trước khi bóp cò không?'",
            nextSequence: [
              {
                speaker: "Dan Heng",
                text: "(thở dài, đặt tay lên vai Stelle): Bình tĩnh. Anh ta chỉ đang làm nhiệm vụ. Stelle, hạ gậy xuống."
              },
              {
                speaker: "???",
                text: "Nhìn các ngươi cũng chiến đấy, hay đăng ký gia nhập đội ta đi. Ở đây cần thêm người chống Vực Hỗn Mang mà."
              }
            ]
          },
          {
            id: 2,
            text: "Ngơ ngác nhìn quanh: 'Ơ… đây không phải trạm xe buýt à?'",
            nextSequence: [
              {
                speaker: "Dan Heng",
                text: "(che mặt, giọng bất lực): Stelle… Tôi đã bảo cô đọc kỹ dữ liệu mà. Đây là Bình Nguyên Vô Tận, không phải bến xe."
              },
              {
                speaker: "???",
                text: "(cạn lời, thở dài, hạ súng): Giả ngốc à? Mà thôi trong các người cũng không giống có âm mưu xấu gì. Nhưng ta vẫn cần phải biết lý do các ngươi đến đây."
              }
            ]
          },
        ]
      },
      {
        speaker: "Dan Heng",
        text: "Chúng tôi là khách vô danh, không có ý định xấu. trong lúc di chuyển thì tàu bị tai nạn trục trặc, lạc vào đây. Khi sửa chữa xong sẽ rời đi ngay. tôi là Dan Heng, đây là Stelle và Pom-Pom."
      }
    ],
  },
  // 🟢 SCENE 6: Valhein thuyết phục
  {
    bg: scene6,
    camera: "pan-6",
    dialogues: [
      {
        speaker: "Valhein",
        text: "Ta là Valhein, đội trưởng quân đoàn thợ diệt quỷ! Dù các ngươi từ đâu tới, thì các ngươi cũng đang đứng trước cửa tử rồi."
      },
      {
        speaker: "Valhein",
        text: "Các ngươi nhìn bầu trời đen kịt và lũ quái vật ngoài kia chứ? Đó là ảnh hưởng của 'Vực Hỗn Mang' nguồn gốc của mọi tai ương, nơi bóng tối không ngừng nuốt chửng ánh sáng ở thế giới này."
      }
    ]
  },
  // 🟢 SCENE 7: Dan Heng liên tưởng
  {
    bg: scene7,
    camera: "pan-7",
    dialogues: [
      {
        speaker: "Dan Heng",
        text: "Hiện tượng không gian bị ăn mòn và sinh ra quái vật... Nghe rất giống với sự xâm nhập của Stellaron."
      }
    ]
  },
  {
    bg: scene7,
    camera: "pan-8",
    dialogues: [
      {
        speaker: "Valhein",
        text: "Ta không biết Stellaron là cái quái gì, Vực Hỗn Mang đang mở rộng nhanh chóng. Nếu không chặn lại, cả đoàn tàu của các ngươi cũng sẽ bị nghiền nát thôi. Đội của ta đang thiếu hỏa lực ở tuyến đầu. Có muốn hợp tác để sống sót không?"
      }
    ]
  },
  // Lựa chọn
  {
    bg: scene6,
    camera: "pan-9",
    dialogues: [
      {
        speaker: "Stelle",
        type: "choice",
        text: "(Cơ hội để đưa ra quyết định...)",
        choices: [
          {
            id: 0,
            text: "Nói ít thôi! Mọi thứ cứ để hiệp sĩ gậy bóng chày này cân team. Các cậu cứ trên tàu AFK đi!",
            nextSequence: [
              {
                speaker: "Dan Heng",
                text: "(Lắc đầu, che mặt) Stelle, cô không thấy chúng ta đang ở thế giới thật sao? Cô có E6S5 thì cũng đừng ảo tưởng thế chứ."
              },
            ]
          },
          {
            id: 1,
            text: "Chúng tôi đồng ý, nhưng anh phải chỉ chỗ có nhiều thùng rác để tôi kiểm tra tình trạng môi trường ở đây đã.",
            nextSequence: [
              {
                speaker: "Valhein",
                text: "Xem nào bãi rác gần đây có Alibu và Ayabu đang tranh giành nhau. Cứ theo tiếng ồn mà đi."
              }
            ]
          },
          {
            id: 2,
            text: "Chúng tôi từ chối. Tàu chúng tôi cần sửa chữa và rời đi ngay lập tức. Chúng tôi tự lo cho bản thân được.",
            nextSequence: [
              {
                speaker: "Valhein",
                text: "Ta tôn trọng quyết định của các ngươi. Tuy nhiên, Phần thưởng cho việc chiến đấu chống lại Vực Hỗn Mang rất phong phú. Tiếc là chưa có ai nhận"
              },
              {
                speaker: "Stelle",
                text: "Sao anh không nói sớm?! Chúng tôi đã chuẩn bị sẵn sàng tham gia chiến đấu rồi mà!"
              }
            ]
          },
        ]
      },
    ]
  },
  {
    bg: scene8,
    camera: "pan-10",
    dialogues: [
      {
        speaker: "Valhein",
        text: "Vậy nếu đã nhất trí thì cùng ta xuất phát thôi! Quyết không để Vực Hỗn Mang lan rộng thêm nữa!"
      }
    ]
  },
];

// Component nhạc nền
const BackgroundMusic = ({ play, muted }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(bgmStory);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.35;
    }

    if (play && !muted) {
      audioRef.current.play().catch(e => console.log("BGM play blocked:", e));
    } else {
      audioRef.current.pause();
    }

    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, [play, muted]);

  return null;
};


const GameStoryPage = () => {
  const navigate = useNavigate();

  // =============== 🟢 STATE CHÍNH ===============
  const [sceneIndex, setSceneIndex] = useState(0);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [cameraDone, setCameraDone] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  // =============== 🔥 CHOICE SYSTEM STATES ===============
  const [choiceSequence, setChoiceSequence] = useState([]);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);

  // =============== Tính năng ================
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);

  // =============== 🔧 REFS ===============
  const imgRef = useRef(null);
  const typeSoundRef = useRef(null);
  const sceneChangeRef = useRef(null);
  const typingRef = useRef(null);
  const autoTimer = useRef(null);

  // =============== 🔊 ÂM THANH INIT ===============
  // Khởi tạo âm thanh
  useEffect(() => {
    typeSoundRef.current = new Audio(typeSoundFile);
    typeSoundRef.current.volume = 0.3;

    sceneChangeRef.current = new Audio(sceneChangeSound);
    sceneChangeRef.current.volume = 0.6;

    // Unlock audio context
    const unlock = () => {
      typeSoundRef.current?.play().catch(() => { });
      typeSoundRef.current?.pause();
      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
    };
    document.addEventListener("click", unlock);
    document.addEventListener("keydown", unlock);

    return () => {
      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, []);

  // =============== 🎬 MAIN RENDER EFFECT ===============
  useEffect(() => {
    if (typingRef.current) clearInterval(typingRef.current);

    // Reset state cho mỗi thoại mới (normal hoặc sequence)
    setDisplayedText("");
    setIsTyping(true);
    setTypingDone(false);
    setCameraDone(false);
    setCanNext(false);
    setShowOverlay(true);

    const currentScene = storyData[sceneIndex];

    // === LẤY DIALOGUE ĐÚNG (ƯU TIÊN SEQUENCE NẾU CÓ) ===
    const isInSequence = choiceSequence.length > 0;
    const currentDialogue = isInSequence
      ? choiceSequence[sequenceIndex]
      : currentScene.dialogues[dialogueIndex];
    const fullText = currentDialogue?.text || "";

    // 1. HIỂN ẢNH + CAMERA (CHỈ UPDATE KHI KHÔNG PHẢI SEQUENCE)
    if (!isInSequence) {
      const img = imgRef.current;
      if (img) {
        img.style.opacity = "1";
        img.className = img.className.replace(/camera-\S+/g, "").trim();
        if (currentScene.camera && currentScene.camera !== "none") {
          img.classList.add(`camera-${currentScene.camera}`);
        }
      }
      setTimeout(() => setShowOverlay(false), 800);
    } else {
      // Khi sequence, giữ nguyên overlay và camera, chỉ gõ chữ
      setShowOverlay(false);
      setCameraDone(true); // Sequence không cần camera pan
    }

    // 2. ÂM THANH + TYPING + CAMERA (SIÊU MƯỢT, ÂM THANH TRƯỚC CHỮ)
    const startTyping = () => {
      let i = 0;
      let lastCharWasSpace = true; // Bắt đầu như thể trước đó là khoảng trắng → từ đầu tiên sẽ phát âm thanh

      typingRef.current = setInterval(() => {
        if (isSkipping || i >= fullText.length) {
          setDisplayedText(fullText);
          clearInterval(typingRef.current);
          setIsTyping(false);
          setTypingDone(true);
          return;
        }

        const currentChar = fullText[i];

        // === PHÁT ÂM THANH KHI BẮT ĐẦU MỘT TỪ MỚI ===
        // (tức là ký tự hiện tại không phải khoảng trắng, và ký tự trước đó là khoảng trắng hoặc dấu câu)
        if (
          !isMuted &&
          typeSoundRef.current &&
          !currentChar.match(/[\s.,!?\u{3001}\u{3002}\u{FF0C}\u{FF01}\u{FF1F}]/u) && // không phải khoảng trắng/dấu câu
          lastCharWasSpace
        ) {
          typeSoundRef.current.currentTime = 0;
          typeSoundRef.current.play().catch(() => { });
        }

        // Cập nhật ký tự đã gõ
        setDisplayedText(fullText.slice(0, i + 1));
        i++;

        // Cập nhật trạng thái: ký tự vừa gõ có phải là khoảng trắng/dấu câu không?
        lastCharWasSpace = /\s|[.,!?\u{3001}\u{3002}\u{FF0C}\u{FF01}\u{FF1F}]/.test(currentChar);
      }, isSkipping ? 10 : 40); // 48ms → tốc độ nhanh, mượt, nghe cực kỳ tự nhiên
    };

    // Bắt đầu gõ sau 400ms
    const delayTimer = setTimeout(startTyping, 400);

    let cameraTimer = null; // ← THÊM DÒNG NÀY

    if (!isInSequence) {
      const duration = getComputedStyle(document.documentElement)
        .getPropertyValue(`--duration-${currentScene.camera || 'none'}`)
        .trim();
      const durationMs = duration ? parseInt(duration) : 5000;
      cameraTimer = setTimeout(() => setCameraDone(true), durationMs);
    }

    // Camera done (chỉ cho normal, sequence không cần)
    if (!isInSequence) {
      const duration = getComputedStyle(document.documentElement)
        .getPropertyValue(`--duration-${currentScene.camera || 'none'}`)
        .trim();
      const durationMs = duration ? parseInt(duration) : 5000;
      const cameraTimer = setTimeout(() => setCameraDone(true), durationMs);
    }

    // Âm thanh chuyển cảnh (chỉ khi đổi scene thật, không phải sequence)
    if (!isInSequence && dialogueIndex === 0 && choiceSequence.length === 0 && sceneIndex > 0) {
      sceneChangeRef.current.currentTime = 0;
      sceneChangeRef.current.play().catch(() => { });
    }

    // === CLEANUP DUY NHẤT ===
    return () => {
      clearTimeout(delayTimer);
      clearTimeout(cameraTimer);
      // Đảm bảo dừng typing loop dù nó đang ở trạng thái nào
      if (typingRef.current) {
        clearInterval(typingRef.current);
        typingRef.current = null; // Tùy chọn, nhưng giúp rõ ràng hơn
      }
    };
  }, [sceneIndex, dialogueIndex, choiceSequence, sequenceIndex, isSkipping, isMuted]);

  // =============== ✅ CAN NEXT ===============
  useEffect(() => {
    if (cameraDone && typingDone) setCanNext(true);
  }, [cameraDone, typingDone]);

  // =============== 🚀 HANDLE NEXT - CHOICE SYSTEM CORE ===============
  const handleNext = useCallback((skip = false) => {
    // Skip typing
    if (isTyping && skip) {
      clearInterval(typingRef.current);
      const text = choiceSequence.length > 0
        ? choiceSequence[sequenceIndex]?.text || ""
        : storyData[sceneIndex].dialogues[dialogueIndex]?.text || "";
      setDisplayedText(text);
      setIsTyping(false);
      setTypingDone(true);
      return;
    }

    if (!canNext) return;   // ← BỎ ĐIỆU KIỆN !selectedChoice Ở ĐÂY!!!

    const currentScene = storyData[sceneIndex];
    const currentDialogue = currentScene.dialogues[dialogueIndex];

    // Người chơi vừa chọn choice → chạy sequence ngay lập tức
    if (selectedChoice && currentDialogue?.type === "choice") {
      setChoiceSequence(selectedChoice.nextSequence || []);
      setSequenceIndex(0);
      setSelectedChoice(null);   // ← quan trọng: reset ngay để không hiện lại choice
      return;
    }

    // Đang chạy sequence
    // ✅ CHÉP ĐÈ ĐOẠN NÀY VÀO TRONG handleNext

    // Đang chạy sequence
    if (choiceSequence.length > 0) {
      if (sequenceIndex + 1 < choiceSequence.length) {
        // Còn thoại trong sequence → next tiếp
        setSequenceIndex(sequenceIndex + 1);
      } else {
        // === 🔴 SỬA ĐOẠN NÀY ===
        // Hết sequence → Reset sequence và TỰ TĂNG INDEX NGAY LẬP TỨC
        // Không dùng setTimeout(handleNext) nữa vì sẽ bị chặn bởi canNext=false
        
        setChoiceSequence([]);
        setSequenceIndex(0);

        // Logic nhảy sang thoại tiếp theo (copy logic từ đoạn dưới lên)
        const nextDlg = dialogueIndex + 1;
        
        if (nextDlg < currentScene.dialogues.length) {
          // Còn thoại trong cảnh này -> Next
          setDialogueIndex(nextDlg);
        } else if (sceneIndex + 1 < storyData.length) {
          // Hết thoại cảnh này -> Sang cảnh mới
          setSceneIndex(sceneIndex + 1);
          setDialogueIndex(0);
        } else {
          // Hết game
          navigate("/gameplay");
        }
      }
      return; 
    }

    // Next bình thường
    const nextDlg = dialogueIndex + 1;
    if (nextDlg < currentScene.dialogues.length) {
      setDialogueIndex(nextDlg);
    } else if (sceneIndex + 1 < storyData.length) {
      setSceneIndex(sceneIndex + 1);
      setDialogueIndex(0);
    } else {
      navigate("/gameplay");
    }
  }, [isTyping, canNext, selectedChoice, choiceSequence, sequenceIndex, sceneIndex, dialogueIndex, navigate]);

  // =============== 📱 SEQUENCE TYPING EFFECT ===============


  // =============== ⌨️ KEYBOARD ===============
  useEffect(() => {
    let holdTimer = null;
    const down = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (e.repeat) {
          holdTimer = setTimeout(() => setIsSkipping(true), 400);
        }
        handleNext(true);
      }
      if (e.code === "KeyA") setIsAutoPlay(a => !a);
      if (e.code === "KeyM") setIsMuted(m => !m);
      if (e.code === "KeyS") navigate("/gameplay");
    };
    const up = () => clearTimeout(holdTimer);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [handleNext, navigate]);

  // =============== AUTO PLAY LOGIC ===============
  useEffect(() => {
    // Điều kiện dừng Auto:
    // 1. Chưa bật Auto
    // 2. Đang gõ chữ (isTyping)
    // 3. Chưa hiện đủ chữ và ảnh (canNext = false)
    if (!isAutoPlay || isTyping || !canNext) return;

    const currentScene = storyData[sceneIndex];
    const normalDialogue = currentScene?.dialogues[dialogueIndex];

    // KIỂM TRA QUAN TRỌNG:
    // Nếu đang là type="choice" VÀ chưa chọn sequence nào (choiceSequence rỗng)
    // -> THÌ DỪNG LẠI, KHÔNG AUTO NEXT
    if (normalDialogue?.type === "choice" && choiceSequence.length === 0) {
      return;
    }

    const delay = choiceSequence.length > 0 ? 1600 : 2500; // Tăng delay xíu cho dễ đọc

    autoTimer.current = setTimeout(() => {
      handleNext();
    }, delay);

    return () => clearTimeout(autoTimer.current);
  }, [isAutoPlay, isTyping, canNext, sceneIndex, dialogueIndex, choiceSequence.length, handleNext]);

  // =============== 🎨 HELPER: Current dialogue ===============
  const currentScene = storyData[sceneIndex];
  const currentDialogue = currentScene?.dialogues[dialogueIndex];

  const handleChoiceSelect = (sequence) => {
    // 1. Dừng ngay hiệu ứng gõ cũ
    if (typingRef.current) clearInterval(typingRef.current);

    // 2. Reset text hiển thị ngay lập tức
    setDisplayedText("");

    // 3. Khóa nút Next tạm thời để tránh bấm nhầm
    setCanNext(false);

    // 4. Cập nhật dữ liệu sequence mới
    setChoiceSequence(sequence || []);
    setSequenceIndex(0);

    // 5. Reset trạng thái để Main Effect bắt đầu gõ lại
    setIsTyping(true);
    setTypingDone(false);
    setCameraDone(true); // Sequence không cần chờ camera

    // 6. Tắt Auto Play (nếu đang bật) để người chơi tự đọc
    clearTimeout(autoTimer.current);
  };

  return (
    <div
      className="relative w-full h-screen bg-black overflow-hidden"
      onClick={() => handleNext(isTyping)}
    >
      <BackgroundMusic play={true} muted={isMuted} />

      {/* 🖼️ SCENE IMAGE */}
      <img
        ref={imgRef}
        src={currentScene?.bg}
        alt="scene"
        className="story-scene-img absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-contain"
        style={{ opacity: 0 }}
      />

      {/* 🌓 OVERLAY */}
      <div className={`story-overlay ${!showOverlay ? 'fade-out' : ''}`} />

      {/* 👈 BACK BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(-1);
        }}
        className="absolute top-4 left-4 z-50 bg-black/60 px-4 py-2 rounded-lg border border-cyan-400 text-white flex items-center gap-2 text-sm"
      >
        <ArrowLeft size={18} /> Trở về
      </button>

      {/* 🔥 CHOICE UI - SIÊU ĐẸP */}
      {currentDialogue?.type === "choice" && choiceSequence.length === 0 && (
        <>
          <div className="absolute inset-0 z-40" onClick={e => e.stopPropagation()} />
          <div className="absolute bottom-80 left-[60%] right-[40%] w-[500px] z-50 flex flex-col gap-3">
            {currentDialogue.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleChoiceSelect(choice.nextSequence); // <--- GỌI HÀM MỚI
                }}
                className="bg-black/80 hover:bg-cyan-900/90 hover:text-amber-400 border border-cyan-500/50 text-cyan-100 p-4 rounded-xl backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-200 text-left font-['roboto'] text-[16px] group"
              >
                <span className="text-yellow-400 font-bold mr-2 group-hover:text-white">➤</span>
                {choice.text}
              </button>
            ))}
          </div>
        </>
      )}

      {/* 🛡️ DISABLE CLICK KHI CHOICE */}
      {currentDialogue?.type === "choice" && !selectedChoice && (
        <div
          className="absolute inset-0 z-40 bg-black/20"
          onClick={(e) => e.stopPropagation()}
        />
      )}

      {/* CONTROL PANEL */}
      <div className="absolute top-4 right-4 z-50 flex gap-3">
        <button onClick={(e) => { e.stopPropagation(); setIsAutoPlay(!isAutoPlay); }}
          className={`px-4 py-2 rounded-lg border text-sm ${isAutoPlay ? 'bg-green-600 border-green-400' : 'bg-black/70 border-gray-500'} text-white flex items-center gap-2`}>
          {isAutoPlay ? <Play size={16} /> : <Pause size={16} />} Auto
        </button>
        <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
          className="p-3 text-white hover:bg-green-600 bg-black/70 rounded-lg border border-gray-500">
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <button onClick={(e) => { e.stopPropagation(); navigate("/gameplay"); }}
          className="px-4 py-2 bg-red-800/90 border border-red-500 rounded-lg hover:bg-red-800 text-white flex items-center gap-2">
          <SkipForward size={16} /> Skip Story
        </button>
      </div>

      {/* 💬 DIALOGUE BOX */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-40">
        <div className="bg-black/85 backdrop-blur-md border border-cyan-400 rounded-2xl p-6 shadow-2xl text-white font-['roboto']">
          <div className="flex items-center gap-4 mb-3">
            <div className="text-yellow-300 font-bold text-lg">
              {/* 🔥 PRIORITY: sequence > normal */}
              {choiceSequence.length > 0
                ? choiceSequence[sequenceIndex]?.speaker
                : currentDialogue?.speaker}
            </div>
            <div className="flex-1 h-px bg-white/20" />
          </div>
          <p className="text-lg text-left leading-relaxed min-h-[3rem] pr-8">
            {displayedText}
            {isTyping && <span className="typing-cursor" />}
          </p>
          <div className="flex justify-between mt-4 text-sm text-gray-400">
            <div>
              {isTyping
                ? "Đang gõ..."
                : isAutoPlay
                  ? "Auto đang chạy..."
                  : "SPACE / Click để tiếp"}
            </div>
            <div>{sceneIndex + 1}/{storyData.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStoryPage;