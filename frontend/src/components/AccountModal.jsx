import React, { useState, useEffect } from 'react';
import avatarFrame from "../assets/images/avatarFrame.png";
import avatar from "../assets/images/avatar.png";
import { X, UserPlus, Edit3, Image, Frame, LogIn, Eye, EyeOff } from "lucide-react";
import { Turnstile } from '@marsidev/react-turnstile';

const API_URL = "https://api-proxy.bbao12345321c.workers.dev/api/submit";
const SECRET_TOKEN = 'Hacker-Is-Gay'; // Giữ để tương lai
const TURNSTILE_SITE_KEY = '0x4AAAAAABqyLJTkjeZ9mYrc'; // Thay bằng key mới

const AccountModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [showForm, setShowForm] = useState("menu"); // menu | register | login
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);

  // useEffect(() => {
  //   console.log('Turnstile token updated:', turnstileToken);
  // }, [turnstileToken]);

  useEffect(() => {
    const saved = localStorage.getItem("userData");
    if (saved) {
      try {
        const decoded = JSON.parse(atob(saved));
        setUser(decoded);
      } catch (e) {
        console.error("Decode lỗi:", e);
      }
    }
  }, [isOpen]); // chạy lại mỗi khi mở modal

  if (!isOpen) return null;

  const handleLogout = () => {
    localStorage.removeItem("userData");
    setUser(null);
  };

  const menuItems = [
    { icon: Edit3, label: "Thay tên", color: "text-purple-600", bgColor: "hover:bg-purple-50" },
    { icon: Image, label: "Thay avatar", color: "text-pink-600", bgColor: "hover:bg-pink-50" },
    { icon: Frame, label: "Thay viền", color: "text-orange-600", bgColor: "hover:bg-orange-50" },

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
    if (!username || !password) {
      setMessage("Vui lòng nhập TÊN và mật khẩu!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          name: username,
          password
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Tạo object để lưu
        const userData = { uid: data.uid, name: data.name };

        // Mã hóa Base64
        const encodedData = btoa(JSON.stringify(userData));

        // Lưu vào localStorage
        localStorage.setItem("userData", encodedData);

        setUser(userData);
        onLoginSuccess && onLoginSuccess(userData);
        setMessage("Đăng nhập thành công!");
        setShowForm("menu");
      }
      else {
        setMessage(data.message || "Sai thông tin đăng nhập!");
      }
    } catch {
      setMessage("Có lỗi xảy ra khi kết nối!");
    }

    setLoading(false);
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
                <div className="relative mb-4">
                  <div className="relative w-40 h-40">
                    <img src={avatarFrame} alt="Avatar Frame" className="absolute inset-0 w-full h-full object-cover z-10" />
                    <img src={avatar} alt="Avatar" className="absolute inset-0 w-full h-full object-cover z-0" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">{user ? user.name : "AFK"}</h3>
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

                <div className="w-full space-y-2 text-[8px] lg:text-lg ">
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

                <div className="w-full space-y-2 text-[8px] lg:text-lg">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;