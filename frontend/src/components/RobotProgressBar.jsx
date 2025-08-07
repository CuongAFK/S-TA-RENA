// src/components/RobotProgressBar.jsx
import React from 'react';
import frameBorder from '../assets/ui/progress-frame.png';

const RobotProgressBar = ({ progress = 0, phase = 'HỆ THỐNG ĐANG KHỞI ĐỘNG' }) => {
    return (
        <div className="w-full max-w-2xl">
            {/* Phase Display */}
            <div className="text-center mb-2">
                <div className="inline-block bg-slate-700/50 px-6 py-2 rounded-full border border-amber-400/30">
                    <span className="text-amber-400 text-sm tracking-widest">
                        {phase}
                    </span>
                </div>
            </div>

            {/* Progress Bar Container with PNG border */}
            <div
                className="relative mb-auto px-18 py-10"
                style={{
                    backgroundImage: `url(${frameBorder})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100% 105%',
                }}
            >
                <div className="w-full h-5 bg-slate-700/50 rounded-full overflow-hidden border border-slate-600/50">
                    <div
                        className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                        <div className="absolute right-0 top-0 w-1 h-full bg-white/60 animate-pulse"></div>
                    </div>
                </div>

                {/* Circuit Pattern */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="flex space-x-2">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-1 h-1 rounded-full transition-all duration-300 ${progress > i * 12.5 ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'
                                        }`}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress % */}
            <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-lg">Loading Data...</span>
                <span className="text-amber-400 text-lg font-bold">
                    {Math.round(progress)}%
                </span>
            </div>
        </div>
    );
};

export default RobotProgressBar;
