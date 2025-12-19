import React from 'react';
import { ASSESSMENT_QUESTIONS } from '../data/constants';

const AssessmentScreen = ({ currentQuestionIndex, submitAnswer, memoryInput, setMemoryInput, showMemorySequence }) => {
    return (
        <div className="max-w-3xl mx-auto pt-20 px-6 animate-in fade-in duration-500">
          <div className="p-10 rounded-3xl shadow-xl border bg-white text-center text-black">
            <h2 className="text-3xl font-bold mb-8">{ASSESSMENT_QUESTIONS[currentQuestionIndex].question}</h2>
            {ASSESSMENT_QUESTIONS[currentQuestionIndex].type === 'memory' ? (
                showMemorySequence ? 
                <div className="text-6xl font-mono font-bold text-indigo-600 animate-pulse">{ASSESSMENT_QUESTIONS[currentQuestionIndex].sequence}</div> 
                : 
                <div className="flex flex-col gap-4">
                    <input type="text" className="text-center text-3xl p-4 border-2 rounded-xl text-black" value={memoryInput} onChange={(e) => setMemoryInput(e.target.value)} />
                    <button className="bg-indigo-600 text-white py-3 rounded-xl font-bold" onClick={() => submitAnswer(memoryInput === ASSESSMENT_QUESTIONS[currentQuestionIndex].sequence, ASSESSMENT_QUESTIONS[currentQuestionIndex].id)}>Submit</button>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {ASSESSMENT_QUESTIONS[currentQuestionIndex].options ? 
                        ASSESSMENT_QUESTIONS[currentQuestionIndex].options.map(opt => <button key={opt} onClick={() => submitAnswer(opt === ASSESSMENT_QUESTIONS[currentQuestionIndex].correct, ASSESSMENT_QUESTIONS[currentQuestionIndex].id)} className="border-2 p-6 rounded-xl text-xl font-bold hover:bg-indigo-50 text-black transition-colors">{opt}</button>) 
                        : 
                        <button className="w-32 h-32 bg-red-500 rounded-full text-white font-bold text-xl mx-auto" onClick={() => submitAnswer(true, ASSESSMENT_QUESTIONS[currentQuestionIndex].id)}>CLICK!</button>
                    }
                </div>
            )}
          </div>
        </div>
    );
};

export default AssessmentScreen;