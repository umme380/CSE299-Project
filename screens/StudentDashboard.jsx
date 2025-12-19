import React from 'react';
import { Calendar, FileText, ChevronRight, LogOut } from 'lucide-react';
import { EXERCISES_DB } from '../data/constants';

const StudentDashboard = ({ user, prediction, dbAssignments, setActiveExercise, setAppMode, handleLogout, settings }) => {
    const apiExercises = dbAssignments.map(a => ({
        id: `db_${a.id}`,
        title: a.title,
        desc: "Read or Write about this topic.",
        type: "Classroom",
        icon: <FileText className="text-indigo-500"/>,
        gameType: 'hybrid', 
        isDbAssignment: true,
        levels: [{ level: 1, data: { text: a.text, dbId: a.id } }]
    }));
    
    const risk = prediction?.riskLevel || "Unknown";
    const relevantExercises = risk === "Normal" ? EXERCISES_DB.Normal : EXERCISES_DB.HighRisk;
    const cardClass = settings.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';

    return (
      <div className="max-w-6xl mx-auto p-6 space-y-8 pb-20 animate-in fade-in duration-700">
        <header className={`flex justify-between items-center p-6 rounded-2xl shadow-sm border ${cardClass}`}>
          <div><h1 className="text-3xl font-bold">Hello, {user.username}</h1><p className="opacity-60">Daily Tasks</p></div>
          <div className="flex items-center gap-4">
              <div className={`px-6 py-2 rounded-full font-bold text-lg ${risk === "Normal" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>Result: {risk}</div>
              <button onClick={handleLogout} className="p-3 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors" title="Logout"><LogOut size={20}/></button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`p-8 rounded-3xl ${cardClass} shadow-sm border`}>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Calendar className="text-indigo-600"/> Daily Exercises</h3>
                <div className="space-y-4">
                    {/* TEACHER ASSIGNMENTS */}
                    {apiExercises.length > 0 && (
                        <div className="mb-4 pb-4 border-b border-dashed">
                             <p className="text-xs font-bold text-pink-500 uppercase mb-2">Teacher's Homework</p>
                             {apiExercises.map((ex, idx) => (
                                <div key={idx} onClick={() => setActiveExercise(ex)} className={`flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer mb-2 bg-pink-50 hover:bg-pink-100 hover:scale-[1.02]`}>
                                    <div className="p-3 bg-white rounded-lg shadow-sm">{ex.icon}</div>
                                    <div className="flex-1 text-gray-800"><h4 className="font-bold text-lg">{ex.title}</h4><p className="text-sm opacity-70">Assigned by Teacher</p></div>
                                    <ChevronRight size={20} className="text-gray-400"/>
                                </div>
                             ))}
                        </div>
                    )}
                    {/* RECOMMENDED EXERCISES */}
                    <p className="text-xs font-bold text-gray-400 uppercase">AI Recommended</p>
                    {relevantExercises.map((ex, idx) => (
                        <div key={idx} onClick={() => setActiveExercise(ex)} className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.02] cursor-pointer ${settings.theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-indigo-50'}`}>
                            <div className={`p-3 rounded-lg ${settings.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>{ex.icon}</div>
                            <div className="flex-1"><h4 className="font-bold text-lg">{ex.title}</h4><p className="text-sm opacity-70">{ex.desc}</p></div>
                            <ChevronRight size={20} className="ml-auto text-gray-400"/>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-gray-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-6">Deep Analysis</h3>
                    <div className="space-y-6">{[{ label: 'Phonological Awareness', val: risk === "Normal" ? 92 : 45 }, { label: 'Working Memory', val: risk === "Normal" ? 88 : 62 }].map((stat, i) => (<div key={i}><div className="flex justify-between text-sm mb-2 text-gray-400"><span>{stat.label}</span><span>{stat.val}%</span></div><div className="w-full bg-gray-800 rounded-full h-2"><div className={`h-2 rounded-full transition-all duration-1000 ${risk === "Normal" ? "bg-green-500" : "bg-orange-500"}`} style={{width: `${stat.val}%`}}></div></div></div>))}</div>
                    <button onClick={() => setAppMode('welcome')} className="mt-8 w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-colors">Start New Assessment</button>
                </div>
            </div>
        </div>
      </div>
    );
};

export default StudentDashboard;