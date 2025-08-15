import React, { useState, useEffect } from 'react';
import avatarFrame from "../assets/images/avatarFrame.png";
import avatar from "../assets/images/avatar.png";
import { X, UserPlus, Edit3, Image, Frame, LogIn, Eye, EyeOff } from "lucide-react";
import { Turnstile } from '@marsidev/react-turnstile';

const API_URL = "https://api-proxy.bbao12345321c.workers.dev/";
const SECRET_TOKEN = 'Hacker-Is-Gay'; // Giữ để tương lai
const TURNSTILE_SITE_KEY = '0x4AAAAAABqyLJTkjeZ9mYrc'; // Giữ để test sau

const AccountModal = ({ isOpen, onClose }) => {
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("fake-token-123456"); // Token giả để test

  // Log trạng thái Turnstile
  useEffect(() => {
    console.log('Turnstile token updated:', turnstileToken);
  }, [turnstileToken]);

  if (!isOpen) return null;

  const menuItems = [
    { icon: Edit3, label: "Thay tên", color: "text-purple-600", bgColor: "hover:bg-purple-50" },
    { icon: Image, label: "Thay avatar", color: "text-pink-600", bgColor: "hover:bg-pink-50" },
    { icon: Frame, label: "Thay viền", color: "text-orange-600", bgColor: "hover:bg-orange-50" },
    { icon: LogIn, label: "Đăng nhập", color: "text-blue-600", bgColor: "hover:bg-blue-50" },
    { icon: UserPlus, label: "Tạo tài khoản mới", color: "text-green-600", bgColor: "hover:bg-green-50", action: () => setShowRegister(true) },
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
    if (!turnstileToken) {
      setMessage("Vui lòng xác thực CAPTCHA!");
      console.log('Validation failed: No Turnstile token');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    setMessage("");

    try {
      console.log('Sending request with body:', {
        action: "register",
        uid: null,
        name: username,
        password,
        captchaToken: turnstileToken
      });
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Tạm bỏ Authorization
        body: JSON.stringify({
          action: "register",
          uid: null,
          name: username,
          password,
          captchaToken: turnstileToken
        }),
      });
      const data = await res.json();
      console.log('Server response:', data);
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
                <h3 className="text-2xl font-bold mb-2">AFK</h3>
                <p className="text-white/80 text-sm mb-4">UID: 12345678</p>
              </div>
            </div>
          </div>

          {/* Cột phải */}
          <div className="flex-1 px-3 pl-3">
            {!showRegister ? (
              <div className="h-full flex flex-col">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Tùy chọn</h4>
                <div className="mb-4">
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.action || null}
                      className={`w-full flex items-center gap-3 p-1 rounded-lg ${item.bgColor} group`}
                    >
                      <div className={`p-2 rounded-lg bg-gray-50 group-hover:bg-white ${item.color}`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-200 group-hover:text-white">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="border-t border-amber-300">
                  <p className="text-xs text-gray-400 text-center mt-2">
                    v2.1.0 • {new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-70 text-white p-6 rounded-lg max-w-md mx-auto bg-gradient-to-r from-orange-400/50 via-red-500/50 to-pink-500">
                <h3 className="text-md font-semibold text-white mb-6">Đăng ký tài khoản</h3>

                <div className="w-full space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tên đăng nhập (3-12 ký tự)"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full p-3 pl-10 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
                    />
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mật khẩu (từ 8 ký tự, có chữ cái)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 pl-10 pr-10 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
                    />
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.1.9-2 2-2m-2 6v-2m0-2v-2m-6 4h12a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                    </svg>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-3 pl-10 pr-10 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
                    />
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.1.9-2 2-2m-2 6v-2m0-2v-2m-6 4h12a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                    </svg>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <Turnstile
                    siteKey={TURNSTILE_SITE_KEY}
                    onVerify={(token) => {
                      console.log('Turnstile verified, token:', token);
                      setTurnstileToken(token);
                    }}
                    onError={(error) => {
                      console.log('Turnstile error:', error);
                      setMessage("Lỗi CAPTCHA: Vui lòng thử lại!");
                    }}
                    onExpire={() => {
                      console.log('Turnstile token expired');
                      setTurnstileToken(null);
                      setMessage("CAPTCHA hết hạn, vui lòng thử lại!");
                    }}
                    retry="auto"
                    refreshExpired="auto"
                  />

                  {message && (
                    <p className="text-sm text-red-400 bg-red-900/20 p-2 rounded-lg text-center">{message}</p>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowRegister(false)}
                      className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
                    >
                      Quay lại
                    </button>
                    <button
                      onClick={handleRegister}
                      disabled={loading}
                      className={`flex-1 py-2 rounded-lg text-white transition duration-200 ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span className="ml-2">Đang tạo...</span>
                        </div>
                      ) : "Đăng ký"}
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