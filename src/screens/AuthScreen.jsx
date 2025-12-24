import React, { useState } from 'react';
import { Brain, User, Key, RefreshCw } from 'lucide-react';

const AuthScreen = ({ handleLogin, handleRegister }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '', role: 'student' });
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        setLoading(true);
        if(isRegister) {
            const success = await handleRegister(formData);
            if (success) {
                setFormData({ username: '', password: '', role: 'student' });
                setIsRegister(false);
            }
        } else {
            await handleLogin(formData);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-indigo-50">
            <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
                <div className="text-center mb-8">
                    <Brain className="inline-block text-indigo-600 mb-4" size={60} />
                    <h1 className="text-3xl font-bold text-indigo-900">{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
                    <p className="text-gray-500 mt-2">{isRegister ? 'Start your learning journey' : 'Login to continue'}</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={18}/>
                            <input className="w-full pl-10 p-3 border rounded-xl text-black focus:ring-2 ring-indigo-200 outline-none" 
                                value={formData.username} 
                                onChange={e => setFormData({...formData, username: e.target.value})} 
                                placeholder="Enter username" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <Key className="absolute left-3 top-3 text-gray-400" size={18}/>
                            <input type="password" className="w-full pl-10 p-3 border rounded-xl text-black focus:ring-2 ring-indigo-200 outline-none" 
                                value={formData.password} 
                                onChange={e => setFormData({...formData, password: e.target.value})} 
                                placeholder="Enter password" />
                        </div>
                    </div>
                    
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                        {['student', 'teacher'].map(r => (
                            <button key={r} onClick={() => setFormData({...formData, role: r})} 
                                className={`flex-1 py-2 rounded-lg font-bold capitalize transition-all ${formData.role === r ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                {r}
                            </button>
                        ))}
                    </div>

                    <button onClick={onSubmit} disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl mt-4 shadow-lg transition-transform active:scale-95 flex justify-center">
                        {loading ? <RefreshCw className="animate-spin"/> : (isRegister ? 'Register' : 'Login')}
                    </button>

                    <div className="text-center mt-6">
                        <button onClick={() => { setIsRegister(!isRegister); setFormData({username:'', password:'', role:'student'}); }} className="text-sm font-bold text-indigo-500 hover:underline">
                            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;