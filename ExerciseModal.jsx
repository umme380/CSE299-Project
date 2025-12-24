import React, { useState, useEffect, useRef } from 'react';
import { Mic, Edit3, X, CheckCircle, Pause, Play, StopCircle } from 'lucide-react';
import { HighlightedText } from './UIComponents'; 

const ExerciseModal = ({ activeExercise, close, user, apiCall, completedLevels, setCompletedLevels, prediction, settings }) => {
    const [gameState, setGameState] = useState('levelSelect'); 
    const [taskMode, setTaskMode] = useState('reading'); 
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [showError, setShowError] = useState(false);
    
    //States
    const [gridItems, setGridItems] = useState([]);
    const [readingStartTime, setReadingStartTime] = useState(null);
    const [wpm, setWpm] = useState(0);
    const [ttsSpeed, setTtsSpeed] = useState(1.0); //Default speed
    const [isSpeaking, setIsSpeaking] = useState(false);
    
    //LISTENING STATES
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const recognitionRef = useRef(null); 

    const [writingInput, setWritingInput] = useState(""); 
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const handleLevelComplete = () => {
      const currentMax = completedLevels[activeExercise.id] || 0;
      if (currentLevelIndex >= currentMax) setCompletedLevels(prev => ({ ...prev, [activeExercise.id]: currentLevelIndex + 1 }));
      setGameState('result');
    };

    useEffect(() => {
        if (gameState !== 'playing') return;
        const levelData = activeExercise.levels[currentLevelIndex].data;
        if (activeExercise.gameType === 'gridHunt') {
            const items = Array(levelData.gridSize).fill(null).map((_, i) => {
                const isTarget = Math.random() < 0.25;
                return { id: i, char: isTarget ? levelData.target : levelData.distractors[Math.floor(Math.random() * levelData.distractors.length)], isTarget };
            });
            setGridItems(items);
        }
        //Cleanup speech/recognition on unmount
        return () => {
            window.speechSynthesis.cancel();
            if(recognitionRef.current) recognitionRef.current.stop();
        };
    }, [gameState, currentLevelIndex, activeExercise]);

    //SPEED HANDLER 
    const handleSpeedChange = (e) => {
        const newSpeed = parseFloat(e.target.value);
        setTtsSpeed(newSpeed);

        //If currently speaking, restart with new speed
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            const levelData = activeExercise.levels[currentLevelIndex].data;
            const u = new SpeechSynthesisUtterance(levelData.text);
            u.rate = newSpeed;
            u.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(u);
        }
    };

    const toggleSpeech = () => {
        const levelData = activeExercise.levels[currentLevelIndex].data;
        if (isSpeaking) { 
            window.speechSynthesis.cancel(); 
            setIsSpeaking(false); 
        } else { 
            const u = new SpeechSynthesisUtterance(levelData.text); 
            u.rate = ttsSpeed; //Use current state
            u.onend = () => setIsSpeaking(false); 
            window.speechSynthesis.speak(u); 
            setIsSpeaking(true); 
        }
    };

    //READING LOGIC
    const toggleListening = () => {
        if (isListening) {
            // STOP LISTENING & SUBMIT
            if (recognitionRef.current) {
                recognitionRef.current.stop();
                setIsListening(false);
                
                const levelData = activeExercise.levels[currentLevelIndex].data;
                const targetWords = levelData.text.toLowerCase().replace(/[.,]/g, '').split(' ');
                const spokenWords = transcript.toLowerCase().replace(/[.,]/g, '').split(' ');
                
                let matches = 0;
                targetWords.forEach(word => { if (spokenWords.includes(word)) matches++; });
                
                let finalAcc = Math.round((matches / targetWords.length) * 100);
                if (finalAcc > 100) finalAcc = 100;
                if (spokenWords.length === 1 && spokenWords[0] === "") finalAcc = 0;

                if (activeExercise.isDbAssignment) {
                    apiCall('/submit_result', 'POST', { 
                        student_name: user.username, 
                        assignment_id: levelData.dbId, 
                        accuracy: finalAcc, 
                        transcript: transcript, 
                        mode: 'reading' 
                    });
                    handleLevelComplete(); 
                } else { 
                    if (finalAcc >= 50) handleLevelComplete(); 
                    else setShowError(true); 
                }
            }
        } else {
            //START LISTENING
            if (!('webkitSpeechRecognition' in window)) return alert("Browser not supported. Use Chrome.");
            
            const recognition = new window.webkitSpeechRecognition();
            recognition.lang = 'en-US';
            recognition.continuous = true;
            recognition.interimResults = true;
            
            recognition.onresult = (event) => {
                const current = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');
                setTranscript(current);
            };

            recognition.start();
            recognitionRef.current = recognition;
            setIsListening(true);
            setTranscript(""); 
        }
    };

    // 3. WRITING LOGIC (ACCURACY CALCULATION)
    const submitWriting = () => {
        const levelData = activeExercise.levels[currentLevelIndex].data;
        
        if (activeExercise.isDbAssignment) {
            const targetWords = levelData.text.toLowerCase().replace(/[.,!?;:()]/g, '').split(/\s+/);
            const writtenWords = writingInput.toLowerCase().replace(/[.,!?;:()]/g, '').split(/\s+/);
            
            let matches = 0;
            const writtenSet = new Set(writtenWords);
            
            targetWords.forEach(word => { 
                if (writtenSet.has(word)) matches++; 
            });

            let finalAcc = 0;
            if (targetWords.length > 0) {
                finalAcc = Math.round((matches / targetWords.length) * 100);
            }
            
            if (finalAcc > 100) finalAcc = 100;
            if (!writingInput.trim()) finalAcc = 0;

            apiCall('/submit_result', 'POST', { 
                student_name: user.username, 
                assignment_id: levelData.dbId, 
                accuracy: finalAcc, 
                submission_text: writingInput, 
                mode: 'writing' 
            });
            handleLevelComplete();
        } else {
             handleLevelComplete(); 
        }
    };

    //HELPERS
    const handleGridClick = (item) => {
        if (item.isTarget) {
            const newItems = gridItems.map(i => i.id === item.id ? { ...i, found: true } : i);
            setGridItems(newItems);
            if (newItems.filter(i => i.isTarget && !i.found).length === 0) handleLevelComplete();
        } else setShowError(true);
    };
    const handleReadFinish = () => {
        const levelData = activeExercise.levels[currentLevelIndex].data;
        const timeSec = (Date.now() - readingStartTime) / 1000;
        const words = levelData.text.split(' ').length;
        setWpm(Math.round((words / timeSec) * 60));
        setGameState('question');
    };
    const startDrawing = (e) => { const canvas = canvasRef.current; if(!canvas) return; const ctx = canvas.getContext('2d'); const rect = canvas.getBoundingClientRect(); const x = (e.clientX || e.touches[0].clientX) - rect.left; const y = (e.clientY || e.touches[0].clientY) - rect.top; ctx.beginPath(); ctx.moveTo(x, y); setIsDrawing(true); };
    const draw = (e) => { if (!isDrawing) return; const canvas = canvasRef.current; if(!canvas) return; const ctx = canvas.getContext('2d'); const rect = canvas.getBoundingClientRect(); const x = (e.clientX || e.touches[0].clientX) - rect.left; const y = (e.clientY || e.touches[0].clientY) - rect.top; ctx.lineTo(x, y); ctx.strokeStyle = '#4f46e5'; ctx.lineWidth = 15; ctx.lineCap = 'round'; ctx.stroke(); };
    const stopDrawing = () => setIsDrawing(false);
    const clearCanvas = () => { const canvas = canvasRef.current; if(canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height); };

    //RENDERERS
    const renderLevelSelect = () => {
      if(activeExercise.isDbAssignment) return (
          <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Reading Assignment</h2>
              <div className="flex gap-4 justify-center mb-6">
                  <button onClick={() => { setTaskMode('reading'); setCurrentLevelIndex(0); setGameState('start'); }} className="px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:scale-105 transition-transform"><Mic className="inline mr-2"/> Read Aloud</button>
                  <button onClick={() => { setTaskMode('writing'); setCurrentLevelIndex(0); setGameState('start'); }} className="px-6 py-4 bg-pink-600 text-white rounded-xl font-bold hover:scale-105 transition-transform"><Edit3 className="inline mr-2"/> Write Response</button>
              </div>
          </div>
      );
      return (
        <div className="text-center"><h2 className="text-2xl font-bold mb-6">Select Difficulty</h2><div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">{activeExercise.levels.map((lvl, idx) => (<button key={idx} disabled={idx > (completedLevels[activeExercise.id] || 0)} onClick={() => { setCurrentLevelIndex(idx); setGameState('start'); }} className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center ${idx > (completedLevels[activeExercise.id] || 0) ? 'bg-gray-100 text-gray-400' : 'bg-white text-indigo-600'}`}><span className="font-bold">Level {lvl.level}</span></button>))}</div></div>
      )
    };

    const renderGameContent = () => {
        const data = activeExercise.levels[currentLevelIndex].data;
        const isHighRisk = prediction?.riskLevel === 'High Risk';

        if (activeExercise.isDbAssignment) {
            if (taskMode === 'writing') return (
                <div className="max-w-xl mx-auto">
                    <div className="bg-gray-50 p-4 rounded-xl mb-4 max-h-40 overflow-y-auto">
                        <HighlightedText text={data.text} isDyslexic={isHighRisk} />
                    </div>
                    <textarea className="w-full h-48 p-4 rounded-xl border-2 mb-4 text-black focus:border-indigo-500 outline-none" placeholder="Write your summary here..." value={writingInput} onChange={e => setWritingInput(e.target.value)}/>
                    <button onClick={submitWriting} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold w-full hover:bg-indigo-700">Submit Writing</button>
                </div>
            );
            return (
                <div className="max-w-xl mx-auto text-center">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border-2 mb-8 max-h-64 overflow-y-auto text-left">
                        <HighlightedText text={data.text} isDyslexic={isHighRisk} />
                    </div>
                    
                    {/* LIVE TRANSCRIPT VIEW */}
                    <div className="mb-4 min-h-[40px] text-gray-500 italic text-sm p-2 bg-gray-50 rounded-lg">
                        {transcript || "Your speech will appear here..."}
                    </div>

                    <button 
                        onClick={toggleListening} 
                        className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto transition-all shadow-xl ${isListening ? 'bg-red-500 text-white animate-pulse border-4 border-red-200' : 'bg-indigo-600 text-white hover:scale-110'}`}
                    >
                        {isListening ? <StopCircle size={40} /> : <Mic size={40} />}
                    </button>
                    <p className="mt-4 font-bold">
                        {isListening ? "Listening... Click to Stop" : "Tap Mic to Start Reading"}
                    </p>
                </div>
            );
        }

        // Standard Games
        if (activeExercise.gameType === 'writing') return (<div className="max-w-xl mx-auto"><p className="text-gray-500 mb-4">{data.prompt}</p><textarea className="w-full h-48 p-4 rounded-xl border-2 mb-4 text-black" value={writingInput} onChange={e => setWritingInput(e.target.value)}/><button onClick={submitWriting} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold w-full">Save</button></div>);
        if (activeExercise.gameType === 'readAloud') return (<div className="max-w-xl mx-auto text-center"><div className="bg-white p-8 rounded-2xl shadow-sm border-2 mb-8"><p className="text-2xl font-bold leading-normal text-black">{data.text}</p></div><button onClick={toggleListening} className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-indigo-600 text-white'}`}><Mic size={40} /></button></div>);
        if (activeExercise.gameType === 'gridHunt') return (<div className="text-center"><p className="mb-4 text-xl">Find <span className="font-bold text-3xl mx-2">{data.target}</span></p><div className={`grid gap-4 max-w-sm mx-auto`} style={{ gridTemplateColumns: `repeat(${Math.sqrt(data.gridSize)}, 1fr)`}}>{gridItems.map(item => (<button key={item.id} disabled={item.found} onClick={() => handleGridClick(item)} className={`h-16 text-3xl font-bold rounded-xl ${item.found ? 'bg-green-500 scale-0' : 'bg-gray-100 text-black'}`}>{item.char}</button>))}</div></div>);
        if (activeExercise.gameType === 'tracing') return (<div className="flex flex-col items-center"><div className="relative border-4 rounded-3xl overflow-hidden bg-white shadow-inner cursor-crosshair touch-none" onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}><div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"><span className="text-[250px] font-bold text-gray-100 font-sans">{data.letter}</span></div><canvas ref={canvasRef} width={300} height={300} className="relative z-10"/></div><div className="flex gap-4 mt-6"><button onClick={clearCanvas} className="px-6 py-2 bg-gray-200 rounded-lg font-bold text-gray-800">Clear</button><button onClick={handleLevelComplete} className="px-6 py-2 bg-green-500 rounded-lg font-bold text-white">Done</button></div></div>);
        if (activeExercise.gameType === 'choice') return (<div className="text-center max-w-lg mx-auto"><h3 className="text-2xl font-bold mb-8">{data.question}</h3><div className="grid grid-cols-2 gap-4">{data.options.map(opt => (<button key={opt} onClick={() => opt === data.correct ? handleLevelComplete() : setShowError(true)} className="p-6 bg-white border-2 hover:border-indigo-500 rounded-xl font-bold text-black">{opt}</button>))}</div></div>);
        if (activeExercise.gameType === 'speedRead') { if (gameState === 'playing') { if (!readingStartTime) setReadingStartTime(Date.now()); return (<div className="max-w-xl mx-auto"><p className="text-lg leading-relaxed mb-8 p-6 bg-gray-50 rounded-xl text-left text-black">{data.text}</p><button onClick={handleReadFinish} className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold">Done Reading</button></div>); } return (<div className="max-w-md mx-auto"><div className="mb-6 text-2xl font-bold text-indigo-600">{wpm} WPM</div><h3 className="text-xl font-bold mb-4">{data.question}</h3><div className="grid gap-3">{data.options.map(opt => (<button key={opt} onClick={() => opt === data.correct ? handleLevelComplete() : setShowError(true)} className="p-4 bg-gray-100 rounded-xl text-left font-semibold text-black">{opt}</button>))}</div></div>); }
        if (activeExercise.gameType === 'vocab') return (<div className="perspective-1000 max-w-sm mx-auto h-64 relative group cursor-pointer" onClick={() => setGameState(gameState === 'flipped' ? 'playing' : 'flipped')}><div className={`w-full h-full transition-transform duration-500 transform-style-3d bg-white rounded-3xl shadow-xl border-2 flex items-center justify-center p-6 ${gameState === 'flipped' ? 'rotate-y-180' : ''}`}>{gameState !== 'flipped' ? (<h3 className="text-4xl font-bold text-indigo-600">{data.word}</h3>) : (<div className="text-center rotate-y-180"><p className="text-lg font-bold mb-2 text-black">{data.definition}</p><button onClick={handleLevelComplete} className="mt-4 text-xs bg-indigo-600 text-white px-3 py-1 rounded-full">Mark Learned</button></div>)}</div></div>);
        if (activeExercise.gameType === 'memoryGrid') return (<div className="text-center"><h3 className="text-xl font-bold mb-4">Find {data.target}</h3><div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">{data.items.map((item, i) => (<button key={i} onClick={() => item === data.target ? handleLevelComplete() : setShowError(true)} className="h-24 text-4xl bg-purple-50 rounded-xl border hover:bg-purple-100 text-black">{item}</button>))}</div></div>);

        //ASSISTED READ SECTION
        if (activeExercise.gameType === 'assistedRead') return (
            <div className="max-w-xl mx-auto text-left">
                <div className="bg-orange-50 p-6 rounded-xl border mb-6 text-lg leading-loose text-black">{data.text}</div>
                <div className="bg-gray-100 p-4 rounded-xl flex justify-between items-center">
                    <button onClick={toggleSpeech} className="p-4 rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition-colors">
                        {isSpeaking ? <Pause/> : <Play/>}
                    </button>
                    {/* UPDATED SPEED SLIDER */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500">Speed</span>
                        <input 
                            type="range" 
                            min="0.5" 
                            max="2" 
                            step="0.25" 
                            value={ttsSpeed} 
                            onChange={handleSpeedChange} 
                            className="accent-indigo-600"
                        />
                        <span className="text-xs font-mono font-bold w-8">{ttsSpeed}x</span>
                    </div>
                </div>
                <button onClick={handleLevelComplete} className="w-full mt-4 py-3 bg-green-500 text-white font-bold rounded-xl">Done</button>
            </div>
        );

        return <div>Loading...</div>;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in zoom-in duration-300">
            <div className={`relative w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden ${settings.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-bold text-xl">{activeExercise.title}</h3>
                    <button onClick={() => { window.speechSynthesis.cancel(); close(); }} className="p-2 hover:bg-red-100 rounded-full transition-colors"><X/></button>
                </div>
                <div className="p-8 min-h-[400px] flex flex-col justify-center">
                    {showError && <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowError(false)}><div className="bg-white p-6 rounded-xl text-black shadow-2xl animate-in zoom-in">Try Again!</div></div>}
                    {gameState === 'levelSelect' ? renderLevelSelect() : gameState === 'start' ? (
                        <div className="text-center"><p className="mb-8">{activeExercise.desc}</p><button onClick={() => setGameState('playing')} className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-indigo-200">Begin</button></div>
                    ) : gameState === 'result' ? (
                        <div className="text-center animate-in fade-in zoom-in duration-300">
                             <h2 className="text-3xl font-bold mb-2">Great Job!</h2>
                             {activeExercise.isDbAssignment && <p className="text-green-600 flex justify-center gap-2 mt-4 font-bold bg-green-50 py-2 px-4 rounded-full inline-flex"><CheckCircle/> Submitted to Teacher</p>}
                            <div className="flex gap-4 justify-center mt-6">
                                <button onClick={() => { window.speechSynthesis.cancel(); close(); }} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold">Close</button>
                            </div>
                        </div>
                    ) : renderGameContent()}
                </div>
            </div>
        </div>
    );
};

export default ExerciseModal;