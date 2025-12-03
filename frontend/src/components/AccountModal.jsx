import React, { useState, useEffect } from 'react';
import avatarFrame from "../assets/images/avatarFrame.png";
import { X, UserPlus, Edit3, Image, Frame, LogIn, Eye, EyeOff } from "lucide-react";
import { Turnstile } from '@marsidev/react-turnstile';
import avatar from "../assets/images/avatar.png";

const avatarModules = import.meta.glob("../assets/images/avt/avt-*.jpg", {
  eager: true,
  import: "default",
});

const frameModules = import.meta.glob("../assets/images/frame/frame-*.png", {
  eager: true,
  import: "default",
});




const API_URL = "https://api-proxy.bbao12345321c.workers.dev/api/submit";
const SECRET_TOKEN = 'Hacker-Is-Gay';
const TURNSTILE_SITE_KEY = '0x4AAAAAABqyLJTkjeZ9mYrc';

const AccountModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [showForm, setShowForm] = useState("menu"); // menu | register | login
  const [selectedKey, setSelectedKey] = useState(null);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [avatarSrc, setAvatarSrc] = useState(avatar);
  const [activeTab, setActiveTab] = useState("HSR");
  const [newName, setNewName] = useState("");
  const [selectedFrameKey, setSelectedFrameKey] = useState(null);







  // Chuyển thành mảng {idx, key, url} rồi sort theo số
  const allAvatars = Object.entries(avatarModules)
    .map(([path, url]) => {
      const m = path.match(/avt-(\d+)\.jpg$/);
      if (!m) return null;
      const idx = Number(m[1]);
      return { idx, key: `avt-${idx}.jpg`, url };
    })
    .filter(Boolean)
    .sort((a, b) => a.idx - b.idx);

  // Chia HSR (1–20) và AOV (21–40)
  const avatarsHSR = allAvatars.filter(a => a.idx <= 20);
  const avatarsAOV = allAvatars.filter(a => a.idx > 20);


  const allFrames = Object.entries(frameModules)
    .map(([path, url]) => {
      const m = path.match(/frame-(\d+)\.png$/);
      if (!m) return null;
      const idx = Number(m[1]);
      return { idx, key: `frame-${idx}.png`, url };
    })
    .filter(Boolean)
    .sort((a, b) => a.idx - b.idx);





  useEffect(() => {
    const saved = localStorage.getItem("userData");
    if (saved) {
      try {
        const decoded = JSON.parse(atob(saved));
        setUser(decoded);
        setNewName(decoded.name || "");
        if (decoded.frameKey) {
          setSelectedFrameKey(decoded.frameKey);
        }

      } catch (e) {
        console.error("Decode lỗi:", e);
      }
    }
  }, [isOpen]); // chạy lại mỗi khi mở modal

  if (!isOpen) return null;

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("ownership");
    localStorage.removeItem("formation");
    setUser(null);
    onLoginSuccess && onLoginSuccess(null); // ✅ Reset bên HomePage
    setShowForm("menu");
  };




  const menuItems = [
    {
      icon: Edit3,
      label: "Thay tên",
      color: "text-purple-600",
      bgColor: "hover:bg-purple-50",
      action: () => setShowForm("rename")
    },
    {
      icon: Image,
      label: "Thay avatar",
      color: "text-pink-600",
      bgColor: "hover:bg-pink-50",
      action: () => setShowForm("avatar")
    },
    {
      icon: Frame,
      label: "Thay viền",
      color: "text-orange-600",
      bgColor: "hover:bg-orange-50",
      action: () => setShowForm("frame")
    },


    // ✅ Nhấn "Đăng nhập" => đăng xuất rồi mở form
    {
      icon: LogIn,
      label: "Đăng nhập",
      color: "text-blue-600",
      bgColor: "hover:bg-blue-50",
      action: () => {
        handleLogout();
        setShowForm("login");
      },
    },

    // ✅ Nhấn "Tạo tài khoản mới" => đăng xuất rồi mở form register
    {
      icon: UserPlus,
      label: "Tạo tài khoản mới",
      color: "text-green-600",
      bgColor: "hover:bg-green-50",
      action: () => {
        handleLogout();
        setShowForm("register");
      },
    },
  ];


  const validateInputs = () => {
    if (username.length < 3 || username.length > 12) {
      setMessage("Tên đăng nhập phải từ 3 đến 12 ký tự!");
      console.log('Validation failed: Invalid username length');
      return false;
    }
    if (password.length < 8 || !/[a-zA-Z]/.test(password)) {
      setMessage("Mật khẩu phải từ 8 ký tự và chứa ít nhất 1 chữ cái!");
      console.log('Validation failed: Invalid password');
      return false;
    }
    if (password !== confirmPassword) {
      setMessage("Mật khẩu nhập lại không khớp!");
      console.log('Validation failed: Passwords do not match');
      return false;
    }
    if (!turnstileToken || turnstileToken.length < 10) {
      setMessage("Vui lòng xác thực CAPTCHA!");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          uid: null,
          name: username,
          password,
          captchaToken: turnstileToken
        }),
      });
      const data = await res.json();
      // console.log('Server response:', data);
      setMessage(data.message || "Đăng ký thành công!");

      if (data.success) {
        const authToken = crypto.randomUUID();
        document.cookie = `authToken=${authToken}; max-age=86400; path=/; secure; samesite=strict`;
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setMessage("Có lỗi xảy ra khi kết nối!");
    }

    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      // 🔹 B1: Gửi yêu cầu đăng nhập
      const loginRes = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          name: username,
          password,
        }),
      });

      const data = await loginRes.json();
      if (!data.success) {
        setMessage(data.message || "Sai tài khoản hoặc mật khẩu!");
        setLoading(false);
        return;
      }




      // 🔹 B2: Lấy profile
      const profileRes = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "getUser",
          uid: data.uid,
        }),
      });
      const profile = await profileRes.json();

      // 🔹 B3: Lấy ownership
      const ownRes = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "getOwnership",
          uid: data.uid,
        }),
      });
      const ownership = await ownRes.json();
      console.log("Ownership response:", ownership);

      if (ownership.success) {
        localStorage.setItem(
          "ownership",
          btoa(JSON.stringify({
            uid: ownership.uid,
            ownedChars: ownership.ownedChars || [],
            ownedEquips: ownership.ownedEquips || [],
            equipped: ownership.equipped || {},
          }))
        );
        console.log("✅ Saved ownership (base64):", ownership);
      }

      // 🔹 B4: Lưu userData
      const userData = {
        uid: profile.uid,
        name: profile.name,
        avatarKey: profile.avatarKey || null,
        frameKey: profile.frameKey || null,
      };
      localStorage.setItem("userData", btoa(JSON.stringify(userData)));


      // B5: Lấy formation từ API 
      try {
        const formRes = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "getFormation",
            uid: data.uid,
          }),
        });
        const form = await formRes.json();
        console.log("Formation API response:", form);

        if (form.success && Array.isArray(form.teams)) {
          const formationData = { teams: form.teams };
          localStorage.setItem("formation", btoa(JSON.stringify(formationData)));
          console.log("Synced formation from API to local");
        } else {
          // Nếu không có data → giữ local hiện tại (hoặc default nếu chưa có)
          console.log("No formation in DB → keep local");
        }
      } catch (err) {
        console.error("Lỗi fetch formation:", err);
      }


      setUser(userData);
      onLoginSuccess && onLoginSuccess(userData);
      setShowForm("menu");
      setMessage("Đăng nhập thành công!");
    } catch (err) {
      console.error("❌ Lỗi đăng nhập:", err);
      setMessage("Có lỗi xảy ra khi kết nối!");
    } finally {
      setLoading(false);
    }
  };

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
  //----------------------------------------------
  // Mẫu dữ liệu trả về từ API
  //----------------------------------------------
  // 📦 [API: getUser]
  // ✅ Dữ liệu mẫu trả về:
  // {
  //   "success": true,
  //   "uid": 4783706,
  //   "name": "AFK",
  //   "avatarKey": "avt-4.jpg",
  //   "frameKey": "frame-16.png"
  // }

  //----------------------------------------------

  // 📦 [API: getOwnership]
  // ✅ Dữ liệu mẫu trả về:
  // {
  //   "success": true,
  //   "uid": "4783706",
  //   "ownedChars": ["1", "2"],
  //   "ownedEquips": ["1", "2"],
  //   "equipped": { "1": 2, "2": null }
  // }
  // ⚠️ Lưu ý: `uid` là chuỗi, `ownedChars` và `ownedEquips` là mảng chuỗi, không phải số.


  const updateProfile = async (updates) => {
    if (!user?.uid) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          uid: user.uid,
          ...updates
        }),
      });

      const result = await res.json();
      console.log("Update result:", result);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };




  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-2">
      <div className="bg-black/80 rounded-2xl shadow-2xl w-full max-w-2xl h-full lg:h-100 p-5">
        {/* Header */}
        <div className="flex items-center justify-between px-6">
          <h2 className="text-2xl font-bold text-white">Tài Khoản</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex h-80">
          {/* Cột trái */}
          <div className="flex-1 px-6 pr-3">
            <div className="bg-gradient-to-r h-70 from-blue-500/50 to-purple-600/50 rounded-xl p-2 text-white">
              <div className="flex flex-col items-center justify-center h-full">

                {/* Avatar + Frame */}
                <div className="relative w-40 h-40 mb-4 flex justify-center items-center">

                  {/* Avatar nằm dưới */}
                  <img
                    src={
                      selectedKey
                        ? avatarModules[`../assets/images/avt/${selectedKey}`]
                        : (user?.avatarKey ? avatarModules[`../assets/images/avt/${user.avatarKey}`] : avatar)
                    }
                    alt="Avatar"
                    className="
            absolute
            w-[75%] h-[75%]
            m-auto
            object-cover
            z-0
            rounded-lg
            pointer-events-none
          "
                  />

                  {/* Frame nằm đè lên */}
                  <img
                    src={
                      selectedFrameKey
                        ? frameModules[`../assets/images/frame/${selectedFrameKey}`]
                        : avatarFrame
                    }
                    alt="Avatar Frame"
                    className="
            absolute
            inset-0
            w-full h-full
            object-contain
            z-10
            pointer-events-none
          "
                  />
                </div>

                {/* Tên + UID */}
                <h3 className="text-2xl font-bold mb-2 font-['Roboto']">{newName || user?.name || "AFK"}</h3>
                <p className="text-white/80 text-sm mb-4">UID: {user ? user.uid : "12345678"}</p>
              </div>
            </div>
          </div>

          {/* Cột phải */}
          <div className="flex-1 px-3 pl-3">
            {showForm === "menu" && (
              <div className="h-full flex flex-col">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Tùy chọn</h4>
                <div className="mb-4">
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.action || null}
                      className={`w-full flex items-center gap-3 p-1 rounded-lg ${item.bgColor} group`}
                    >
                      <div className={`p-2 rounded-lg bg-gray-50 group-hover:bg-blue-300 ${item.color}`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-200 group-hover:text-black">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="border-t border-amber-300">
                  <p className="text-xs text-gray-400 text-center mt-1">
                    v2.1.0 • {new Date().toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            )}

            {showForm === "register" && (
              <div className="flex flex-col items-center justify-center h-70 text-white p-6 rounded-lg max-w-md mx-auto bg-gradient-to-r from-orange-400/50 via-red-500/50 to-pink-500">
                <h3 className="text-md font-semibold text-white mb-9">Đăng ký tài khoản</h3>

                <div className="w-full space-y-2 text-[8px] lg:text-lg font-['Roboto'] ">
                  <input
                    type="text"
                    placeholder="Tên đăng nhập (3-12 ký tự)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu (từ 8 ký tự, có chữ cái)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400"
                  />

                  <Turnstile
                    siteKey={TURNSTILE_SITE_KEY}
                    onSuccess={setTurnstileToken}
                    onExpire={() => setTurnstileToken(null)}
                    retry="auto"
                  />

                  {message && <p className="text-[9px] text-red-400">{message}</p>}

                  <div className="flex gap-3 text-sm">
                    <button onClick={() => setShowForm("menu")} className="flex-1 py-2 bg-gray-600 rounded-lg">Quay lại</button>
                    <button onClick={handleRegister} disabled={loading} className="flex-1 py-2 bg-blue-500 rounded-lg">
                      {loading ? "Đang tạo..." : "Đăng ký"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showForm === "login" && (
              <div className="flex flex-col items-center justify-center h-70 text-white p-6 rounded-lg max-w-md mx-auto bg-gradient-to-r from-green-400/50 via-blue-500/50 to-purple-500">
                <h3 className="text-md font-semibold text-white mb-9">Đăng nhập</h3>

                <div className="w-full space-y-2 text-[8px] lg:text-lg font-['Roboto']">
                  <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400"
                  />

                  {message && <p className="text-[9px] text-red-400">{message}</p>}

                  <div className="flex gap-3 text-sm">
                    <button onClick={() => setShowForm("menu")} className="flex-1 py-2 bg-gray-600 rounded-lg">Quay lại</button>
                    <button onClick={handleLogin} disabled={loading} className="flex-1 py-2 bg-blue-500 rounded-lg">
                      {loading ? "Đang vào..." : "Đăng nhập"}
                    </button>
                  </div>
                </div>
              </div>
            )}{showForm === "avatar" && (
              <div className="text-white p-4 h-[300px] flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowForm("menu")}
                      className="px-6 py-1 text-sm bg-gray-500 rounded"
                    >
                      Quay lại
                    </button>
                    <button
                      onClick={() => {
                        if (!selectedKey) return;
                        const encoded = localStorage.getItem("userData");
                        const data = encoded ? JSON.parse(atob(encoded)) : {};
                        updateProfile({ avatarKey: selectedKey });
                        data.avatarKey = selectedKey;
                        localStorage.setItem("userData", btoa(JSON.stringify(data)));
                        onLoginSuccess && onLoginSuccess(data);
                        setShowForm("menu");
                      }}
                      className="px-5 py-1 text-sm bg-green-500 rounded disabled:opacity-50"
                      disabled={!selectedKey}
                    >
                      Lưu
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-5 mb-3">
                  <button
                    onClick={() => setActiveTab("HSR")}
                    className={`px-4 py-0 rounded text-sm border-2 bg-blue-300/50 ${activeTab === "HSR"
                      ? "bg-green-400/50 ring-1 ring-white text-white"
                      : "text-gray-400 hover:bg-white/90"
                      }`}
                  >
                    HSR
                  </button>
                  <h1 className="text-[30px]">|</h1>
                  <button
                    onClick={() => setActiveTab("AOV")}
                    className={`px-4 py-0 rounded text-sm border-2 bg-blue-300/50 ${activeTab === "AOV"
                      ? "bg-green-400/50 ring-1 ring-white text-white"
                      : "text-gray-400 hover:bg-white/90"
                      }`}
                  >
                    AOV
                  </button>
                </div>

                {/* Scroll container */}
                <div className="flex-1 overflow-y-auto pr-2">
                  <div className="grid grid-cols-2 gap-1">
                    {(activeTab === "HSR" ? avatarsHSR : avatarsAOV).map(({ key, url }) => (
                      <button
                        key={key}
                        onClick={() => setSelectedKey(key)}
                        aria-pressed={selectedKey === key}
                        className={`relative bg-gradient-to-r from-blue-500 to-purple-600
              overflow-hidden transition-all duration-300 ease-in-out
              shadow-md shadow-blue-500/50 hover:shadow-lg hover:shadow-purple-500/70
              hover:scale-105 before:absolute before:top-0 before:left-[-100%]
              before:w-full before:h-full before:bg-white/20 before:skew-x-[-30deg]
              before:transition-all before:duration-500 hover:before:left-[100%]
              focus:outline-none p-1 rounded-lg border
              ${selectedKey === key ? "border-white/70" : "border-white/20"}`}
                      >
                        <img
                          src={url}
                          alt={key}
                          className="w-full h-24 object-cover rounded-md"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}


            {showForm === "rename" && (
              <div className="text-white p-4">
                <h3 className="text-lg font-bold mb-3">Đổi tên hiển thị</h3>

                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nhập tên mới..."
                  className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 focus:outline-none mb-4 font-['Roboto']"
                />

                <div className="flex justify-between">
                  <button
                    onClick={() => setShowForm("menu")}
                    className="px-4 py-2 bg-gray-600 rounded-lg"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => {
                      if (!newName.trim()) return;
                      const encoded = localStorage.getItem("userData");
                      const data = encoded ? JSON.parse(atob(encoded)) : {};
                      updateProfile({ name: newName.trim() });
                      data.name = newName.trim();
                      localStorage.setItem("userData", btoa(JSON.stringify(data)));
                      setUser(data);
                      onLoginSuccess && onLoginSuccess(data);
                      setShowForm("menu");
                    }}
                    className="px-4 py-2 bg-green-500 rounded-lg"
                  >
                    Lưu
                  </button>
                </div>
              </div>
            )}


            {showForm === "frame" && (
              <div className="text-white p-4 h-[300px] flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => setShowForm("menu")}
                    className="px-4 py-2 bg-gray-600 rounded-lg"
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={() => {
                      if (!selectedFrameKey) return;
                      const encoded = localStorage.getItem("userData");
                      const data = encoded ? JSON.parse(atob(encoded)) : {};
                      updateProfile({ frameKey: selectedFrameKey });
                      data.frameKey = selectedFrameKey;
                      localStorage.setItem("userData", btoa(JSON.stringify(data)));
                      onLoginSuccess && onLoginSuccess(data);
                      setUser(data);
                      setShowForm("menu");
                    }}
                    className="px-4 py-2 bg-green-500 rounded-lg disabled:opacity-50"
                    disabled={!selectedFrameKey}
                  >
                    Lưu
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2">
                  <div className="grid grid-cols-2 gap-3">
                    {allFrames.slice(0, 20).map(({ key, url }) => (
                      <button
                        key={key}
                        onClick={() => setSelectedFrameKey(key)}
                        aria-pressed={selectedFrameKey === key}
                        className={`border rounded-md p-2 ${selectedFrameKey === key ? "border-white" : "border-gray-600"
                          }`}
                      >
                        <img
                          src={url}
                          alt={key}
                          className="w-full h-20 object-cover rounded"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}








          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;