import React, { useEffect } from 'react'; // Added useEffect
import { LogOut, Edit3, Upload, Trophy, RefreshCw } from 'lucide-react'; // Added RefreshCw icon

const TeacherDashboard = ({ newAssign, setNewAssign, publish, teacherResults, setAppMode, settings, handleLogout, refreshData }) => {
    
    // --- 1. AUTO-REFRESH ON LOAD ---
    useEffect(() => {
        if (refreshData) refreshData();
    }, []); // Empty brackets = runs once when dashboard opens

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setNewAssign(prev => ({ ...prev, text: e.target.result }));
            reader.readAsText(file);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-8 animate-in fade-in">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-indigo-700">Teacher Portal</h1>
                <div className="flex gap-4">
                    {/* --- 2. MANUAL REFRESH BUTTON --- */}
                    <button 
                        onClick={refreshData} 
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-bold transition-colors"
                    >
                        <RefreshCw size={20}/> Refresh Data
                    </button>
                    
                    <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-bold border-2 border-red-100 px-4 py-2 rounded-lg hover:bg-red-50">
                        <LogOut size={20}/> Logout
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* UPLOAD SECTION */}
                <div className={`p-8 rounded-3xl shadow-lg border ${settings.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-indigo-50'}`}>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-600"><Edit3/> Upload Reading Material</h3>
                    <input className="w-full p-4 mb-4 border rounded-xl bg-transparent" placeholder="Title (e.g., Chapter 1)" value={newAssign.title} onChange={e => setNewAssign({...newAssign, title: e.target.value})} />
                    
                    <div className="mb-4">
                        <label className="flex items-center gap-2 cursor-pointer bg-gray-100 p-3 rounded-xl hover:bg-gray-200 transition-colors text-black w-fit">
                            <Upload size={20}/> <span className="text-sm font-bold">Import .txt File</span>
                            <input type="file" accept=".txt" className="hidden" onChange={handleFileUpload} />
                        </label>
                    </div>

                    <textarea className="w-full p-4 h-40 border rounded-xl mb-4 bg-transparent focus:ring-2 ring-indigo-200" placeholder="Or type content here..." value={newAssign.text} onChange={e => setNewAssign({...newAssign, text: e.target.value})} />
                    <button onClick={publish} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg">Publish Assignment</button>
                </div>

                {/* RESULTS SECTION */}
                <div className={`p-8 rounded-3xl shadow-lg border h-[600px] overflow-y-auto ${settings.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-indigo-50'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold flex items-center gap-2 text-green-600"><Trophy/> Class Results</h3>
                        <span className="text-xs font-bold opacity-50">{teacherResults.length} Submissions</span>
                    </div>
                    
                    <table className="w-full text-left border-collapse">
                        <thead className="opacity-50 text-xs uppercase border-b bg-gray-50/10">
                            <tr>
                                <th className="p-3">Student</th>
                                <th className="p-3">Mode</th>
                                <th className="p-3">Accuracy</th>
                                <th className="p-3">Submitted Content</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {teacherResults.length === 0 ? (
                                <tr><td colSpan="4" className="p-8 text-center text-gray-400">No results yet.</td></tr>
                            ) : (
                                teacherResults.map((r,i) => (
                                    <tr key={i} className="hover:bg-gray-50/10 align-top">
                                        <td className="p-3 font-bold">{r.student}</td>
                                        
                                        <td className="p-3 capitalize">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${r.mode === 'writing' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                {r.mode}
                                            </span>
                                        </td>
                                        
                                        <td className="p-3">
                                            <span className={`font-bold ${r.accuracy >= 80 ? 'text-green-600' : r.accuracy >= 50 ? 'text-orange-500' : 'text-red-500'}`}>
                                                {r.accuracy}%
                                            </span>
                                        </td>
                                        
                                        <td className="p-3 text-sm">
                                            <div className="max-h-32 overflow-y-auto p-2 bg-gray-50/50 rounded-lg border border-gray-100 text-gray-700 whitespace-pre-wrap w-full min-w-[200px]">
                                                {r.mode === 'writing' ? r.submission_text : r.transcript}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;