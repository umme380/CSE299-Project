import React, { useState, useEffect } from 'react';
import { RefreshCw, Settings } from 'lucide-react';

// Data & Config
import { FONTS_DB, ASSESSMENT_QUESTIONS } from './data/constants';

// Components
import { SplashScreen, SettingsModal } from './components/UIComponents';
import ExerciseModal from './components/ExerciseModal';

// Screens
import AuthScreen from './screens/AuthScreen';
import TeacherDashboard from './screens/TeacherDashboard';
import StudentDashboard from './screens/StudentDashboard';
import AssessmentScreen from './screens/AssessmentScreen';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(null);
  const [appMode, setAppMode] = useState('login');
  
  // Assessment State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [demographics, setDemographics] = useState({ Age: '', Gender: '', NativeLang_Code: '1' });
  const [quizScore, setQuizScore] = useState({}); 
  const [reactionTimes, setReactionTimes] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [memoryInput, setMemoryInput] = useState("");
  const [showMemorySequence, setShowMemorySequence] = useState(true);
  
  // Data State
  const [dbAssignments, setDbAssignments] = useState([]);
  const [teacherResults, setTeacherResults] = useState([]);
  const [newAssign, setNewAssign] = useState({ title: '', text: '' });
  
  // Modal State
  const [activeExercise, setActiveExercise] = useState(null); 
  const [completedLevels, setCompletedLevels] = useState({}); 
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({ theme: 'default', font: 'sans', textSize: 1, spacing: 1 });

  // --- STYLES HELPER ---
  const getAppStyles = () => {
    const selectedFont = FONTS_DB.find(f => f.id === settings.font)?.css || 'Inter, system-ui, sans-serif';
    let base = { fontSize: `${16 * settings.textSize}px`, lineHeight: settings.spacing * 1.5, fontFamily: selectedFont };
    let themeClasses = "min-h-screen transition-colors duration-300 ";
    if (settings.theme === 'warm') themeClasses += "bg-[#FDF6E3] text-[#5D4037]";
    else if (settings.theme === 'dark') themeClasses += "bg-gray-900 text-gray-100";
    else themeClasses += "bg-gray-50 text-gray-800";
    return { style: base, className: themeClasses };
  };
  const appStyles = getAppStyles();

  // --- EFFECTS ---
  useEffect(() => { const t = setTimeout(() => setShowSplash(false), 3000); return () => clearTimeout(t); }, []);
  useEffect(() => { if (appMode === 'assessment') startQuestionTimer(); }, [currentQuestionIndex, appMode]);

  // --- API HELPER ---
  // Inside App.jsx
const apiCall = async (endpoint, method = 'GET', body = null) => {
    try {
        const opts = { method, headers: { 'Content-Type': 'application/json' } };
        if (body) opts.body = JSON.stringify(body);
        const res = await fetch(`http://127.0.0.1:5000${endpoint}`, opts);
        return await res.json();
    } catch (e) { console.error("API Error", e); return null; }
  };

  // --- AUTH HANDLERS ---
  const handleRegister = async (formData) => {
      const res = await apiCall('/register', 'POST', formData);
      if(res.error) {
          alert(res.error);
          return false;
      } else {
          alert("Registration successful! Please login.");
          return true;
      }
  };

  const handleLogin = async (formData) => {
      if(!formData.username || !formData.password) return alert("Enter credentials");
      const res = await apiCall('/login', 'POST', formData);
      
      if(res && !res.error) {
          setUser(res);
          if(res.role === 'teacher') { 
              setAppMode('teacherDash'); 
              fetchTeacherData(); 
          } else { 
              if(res.risk_level) {
                  setPrediction({ riskLevel: res.risk_level });
                  fetchAssignments();
                  setAppMode('dashboard');
              } else {
                  fetchAssignments();
                  setAppMode('welcome');
              }
          }
      } else {
          alert("Invalid Login");
      }
  };

  const handleLogout = () => {
      setUser(null);
      setAppMode('login');
      setPrediction(null);
      // Optional: Clear other states if needed
  };

  // --- DATA FETCHING ---
  const fetchAssignments = async () => { const data = await apiCall('/assignments'); if(data) setDbAssignments(data); };
  const fetchTeacherData = async () => { const aData = await apiCall('/assignments'); if(aData) setDbAssignments(aData); const rData = await apiCall('/teacher/results'); if(rData) setTeacherResults(rData); };
  
  const publishAssignment = async () => {
    if(!newAssign.title || !newAssign.text) return alert("Fill all fields");
    await apiCall('/assignments', 'POST', newAssign);
    setNewAssign({ title: '', text: '' });
    alert("Published!");
    fetchTeacherData();
  };

  // --- ASSESSMENT LOGIC ---
  const startAssessment = () => {
    if (!demographics.Age || !demographics.Gender) { alert("Please complete demographics first."); return; }
    setAppMode('assessment'); setCurrentQuestionIndex(0); setQuizScore({}); setReactionTimes({}); startQuestionTimer();
  };
  
  const startQuestionTimer = () => {
    setStartTime(Date.now());
    const q = ASSESSMENT_QUESTIONS[currentQuestionIndex];
    if (q && q.type === 'memory') { setShowMemorySequence(true); setMemoryInput(""); setTimeout(() => setShowMemorySequence(false), 3000); }
  };

  const submitAnswer = (isCorrect, questionId) => {
    const timeTaken = Date.now() - startTime;
    setQuizScore(prev => ({ ...prev, [questionId]: isCorrect ? 10 : 0 })); 
    setReactionTimes(prev => ({ ...prev, [questionId]: timeTaken }));
    if (currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1) setCurrentQuestionIndex(prev => prev + 1);
    else finishAssessment();
  };

  const finishAssessment = async () => {
    setAppMode('analysis'); setErrorMsg(null);
    const s1 = quizScore[1] || 5; 
    const t_visual = reactionTimes[2] || 3000; const t_rapid = reactionTimes[5] || 3000;
    
    const payload = { 
        user_id: user.id, 
        Age: parseInt(demographics.Age), Gender: demographics.Gender, NativeLang_Code: parseInt(demographics.NativeLang_Code),
        F1_Rhyme: s1, F2_Alliteration: s1, F3_SoundSegmentation: s1, F4_WordReadingSpeed: t_visual < 2500 ? 10 : 5, 
        F5_NonWordReading: quizScore[4] || 5, F6_Spelling: quizScore[4] || 5, F7_VisualPerception: quizScore[2] || 5, F8_MemorySpan: quizScore[3] || 5, F9_RapidNaming: t_rapid < 1500 ? 10 : 5 
    };
    try {
        const result = await apiCall('/predict', 'POST', payload);
        setPrediction(result); 
        setAppMode('dashboard');
    } catch (err) { setErrorMsg(`Connection Failed: ${err.message}`); }
  };

  if (showSplash) return <SplashScreen />;

  return (
    <div style={appStyles.style} className={appStyles.className}>
      <button onClick={() => setShowSettings(true)} className="fixed top-6 right-6 z-40 p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all hover:rotate-90"><Settings size={24} /></button>
      
      {showSettings && <SettingsModal settings={settings} setSettings={setSettings} close={() => setShowSettings(false)} />}
      
      {activeExercise && (
        <ExerciseModal 
            activeExercise={activeExercise} 
            close={() => setActiveExercise(null)} 
            user={user}
            apiCall={apiCall}
            completedLevels={completedLevels}
            setCompletedLevels={setCompletedLevels}
            prediction={prediction}
            settings={settings}
        />
      )}
      
      {appMode === 'login' && <AuthScreen handleLogin={handleLogin} handleRegister={handleRegister} />}
      
      {appMode === 'teacherDash' && (
        <TeacherDashboard 
    newAssign={newAssign} 
    setNewAssign={setNewAssign} 
    publish={publishAssignment} 
    teacherResults={teacherResults} 
    setAppMode={setAppMode} 
    handleLogout={handleLogout}
    settings={settings}
    refreshData={fetchTeacherData}  
/>
      )}
      
      {appMode === 'welcome' && (
        <div className="max-w-4xl mx-auto pt-20 px-6 animate-in fade-in duration-500">
          <div className="text-center mb-16"><h1 className="text-5xl font-extrabold mb-6 tracking-tight">Dyslexia <span className="text-indigo-600">Screening AI</span></h1><p className="text-xl opacity-60 max-w-2xl mx-auto">A rapid, gamified assessment powered by Machine Learning.</p></div>
          <div className={`p-8 rounded-3xl shadow-xl border ${settings.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} max-w-lg mx-auto`}>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium opacity-70 mb-1">Age</label><input type="number" className="w-full p-3 rounded-xl border text-black focus:border-indigo-500 outline-none" value={demographics.Age} onChange={e => setDemographics({...demographics, Age: e.target.value})} placeholder="e.g. 10" /></div>
              <div><label className="block text-sm font-medium opacity-70 mb-1">Gender</label><select className="w-full p-3 rounded-xl border text-black focus:border-indigo-500 outline-none" value={demographics.Gender} onChange={e => setDemographics({...demographics, Gender: e.target.value})}><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option></select></div>
              <button onClick={startAssessment} className="w-full mt-6 bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-transform active:scale-95">Start Assessment</button>
            </div>
          </div>
        </div>
      )}
      
      {appMode === 'assessment' && (
        <AssessmentScreen 
            currentQuestionIndex={currentQuestionIndex}
            submitAnswer={submitAnswer}
            memoryInput={memoryInput}
            setMemoryInput={setMemoryInput}
            showMemorySequence={showMemorySequence}
        />
      )}
      
      {appMode === 'analysis' && <div className="text-center pt-40"><RefreshCw className="animate-spin mx-auto w-16 h-16 text-indigo-600"/> Analyzing...</div>}
      
      {appMode === 'dashboard' && (
        <StudentDashboard 
            user={user}
            prediction={prediction}
            dbAssignments={dbAssignments}
            setActiveExercise={setActiveExercise}
            setAppMode={setAppMode}
            handleLogout={handleLogout}
            settings={settings}
        />
      )}
    </div>
  );
  
};

export default App;