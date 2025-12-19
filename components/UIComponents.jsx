import React from 'react';
import { Brain, Sliders, X } from 'lucide-react';
import { FONTS_DB } from '../data/constants';

// --- HIGHLIGHTED TEXT ---
export const HighlightedText = ({ text, isDyslexic }) => {
    if (!isDyslexic || !text) return <span className="font-serif text-lg leading-loose">{text}</span>;
    return (
        <span className="font-serif text-lg leading-loose">
            {text.split('').map((char, index) => {
                const lower = char.toLowerCase();
                if (['b', 'd', 'p', 'q', 'r', 'n'].includes(lower)) {
                    return (
                        <span key={index} className="font-extrabold text-2xl text-indigo-700 mx-[1px] inline-block transform hover:scale-125 transition-transform cursor-crosshair border-b-2 border-indigo-200">
                            {char}
                        </span>
                    );
                }
                return <span key={index}>{char}</span>;
            })}
        </span>
    );
};

// --- SPLASH SCREEN ---
export const SplashScreen = () => (
    <div className="fixed inset-0 z-[100] bg-indigo-600 flex flex-col items-center justify-center text-white animate-in fade-in duration-700">
        <Brain size={120} className="mb-6 drop-shadow-2xl animate-pulse" />
        <h1 className="text-5xl font-extrabold tracking-tight mb-2">Dyslexia Support AI</h1>
        <p className="text-indigo-200 text-lg uppercase font-semibold">Empowering Every Mind</p>
    </div>
);

// --- SETTINGS MODAL ---
export const SettingsModal = ({ settings, setSettings, close }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`p-8 rounded-3xl shadow-2xl w-96 ${settings.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2"><Sliders size={20}/> Appearance</h3>
          <button onClick={close} className="p-2 hover:bg-gray-200 rounded-full text-gray-500"><X size={20}/></button>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Theme Mode</label>
          <div className="flex gap-2">
            {['default', 'warm', 'dark'].map(t => (
              <button key={t} onClick={() => setSettings({...settings, theme: t})} className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize border-2 transition-all ${settings.theme === t ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-400'}`}>{t}</button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Font Style</label>
          <select value={settings.font} onChange={(e) => setSettings({...settings, font: e.target.value})} className={`w-full p-2 rounded-lg border-2 ${settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
            {FONTS_DB.map(font => <option key={font.id} value={font.id}>{font.name}</option>)}
          </select>
        </div>
        <div className="space-y-4">
          <div><div className="flex justify-between text-sm mb-1"><span>Text Size</span><span>{Math.round(settings.textSize * 100)}%</span></div><input type="range" min="0.8" max="1.5" step="0.1" className="w-full accent-indigo-600" value={settings.textSize} onChange={(e) => setSettings({...settings, textSize: parseFloat(e.target.value)})}/></div>
          <div><div className="flex justify-between text-sm mb-1"><span>Letter Spacing</span><span>{settings.spacing}x</span></div><input type="range" min="1" max="2" step="0.1" value={settings.spacing} onChange={(e) => setSettings({...settings, spacing: parseFloat(e.target.value)})} className="w-full accent-indigo-600"/></div>
        </div>
      </div>
    </div>
);