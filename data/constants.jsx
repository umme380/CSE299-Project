// FILE: src/data/constants.jsx  <-- Note the .jsx extension
import React from 'react';
import { Zap, BookOpen, Brain, Grid, Edit3, Volume2, Mic, EyeOff, Music } from 'lucide-react';

// --- FONTS DATABASE ---
export const FONTS_DB = [
  { id: 'sans', name: 'Modern Sans (Inter)', css: 'Inter, system-ui, sans-serif' },
  { id: 'dyslexic', name: 'Dyslexia Friendly (Comic)', css: '"Comic Sans MS", "Chalkboard SE", sans-serif' },
  { id: 'serif', name: 'Academic Serif (Georgia)', css: 'Georgia, serif' },
  { id: 'mono', name: 'Typewriter (Courier)', css: '"Courier New", monospace' },
  { id: 'verdana', name: 'Wide & Clear (Verdana)', css: 'Verdana, sans-serif' },
  { id: 'arial', name: 'Standard (Arial)', css: 'Arial, sans-serif' },
  { id: 'tahoma', name: 'Legible (Tahoma)', css: 'Tahoma, sans-serif' },
  { id: 'trebuchet', name: 'Humanist (Trebuchet)', css: '"Trebuchet MS", sans-serif' },
  { id: 'times', name: 'Traditional (Times)', css: '"Times New Roman", serif' },
  { id: 'cursive', name: 'Handwriting (Brush)', css: '"Brush Script MT", cursive' }
];

// --- ASSESSMENT QUESTIONS ---
export const ASSESSMENT_QUESTIONS = [
  { id: 1, category: 'Phonological Awareness', featureTarget: ['F1_Rhyme', 'F2_Alliteration'], type: 'choice', question: "Which word rhymes with 'CAT'?", options: ['Dog', 'Bat', 'Car', 'Fish'], correct: 'Bat', timeLimit: 10 },
  { id: 2, category: 'Visual Perception', featureTarget: ['F7_VisualPerception', 'F4_WordReadingSpeed'], type: 'choice', question: "Find the letter 'b' hidden in the group.", options: ['d', 'p', 'b', 'q'], correct: 'b', timeLimit: 5 },
  { id: 3, category: 'Working Memory', featureTarget: ['F8_MemorySpan'], type: 'memory', question: "Memorize this sequence: 5 - 9 - 2", sequence: "592", timeLimit: 5, inputPrompt: "Enter the sequence you just saw:" },
  { id: 4, category: 'Spelling & Decoding', featureTarget: ['F6_Spelling', 'F5_NonWordReading'], type: 'choice', question: "Which of these is a nonsense (fake) word?", options: ['Train', 'Blop', 'House', 'Jump'], correct: 'Blop', timeLimit: 10 },
  { id: 5, category: 'Rapid Naming', featureTarget: ['F9_RapidNaming'], type: 'reaction', question: "Click the button as fast as you can!", correct: true, timeLimit: 3 }
];

// --- EXERCISES DB ---
export const EXERCISES_DB = {
  Normal: [
    { 
      id: 'n1', title: "Speed Reading Sprint", duration: "5 min", type: "Cognitive", icon: <Zap className="text-yellow-500"/>, desc: "Read a text and test your WPM.", gameType: 'speedRead', 
      levels: [
        { level: 1, data: { text: "Machine learning is a field of inquiry devoted to understanding and building methods that 'learn'.", question: "What does it build?", options: ["Biology", "Methods"], correct: "Methods" } },
        { level: 2, data: { text: "Artificial intelligence leverages computers and machines to mimic the problem-solving and decision-making capabilities of the human mind.", question: "What does AI mimic?", options: ["Human Mind", "Animals"], correct: "Human Mind" } },
        { level: 3, data: { text: "Deep learning eliminates some of data pre-processing that is typically involved with machine learning. These algorithms can ingest unstructured data.", question: "What data type?", options: ["Structured", "Unstructured"], correct: "Unstructured" } }
      ] 
    },
    { 
      id: 'n2', title: "Vocabulary Builder", duration: "10 min", type: "Language", icon: <BookOpen className="text-blue-500"/>, desc: "Master complex words.", gameType: 'vocab', 
      levels: [
        { level: 1, data: { word: "Ebullient", definition: "Cheerful and full of energy.", usage: "She sounded ebullient and happy." } },
        { level: 2, data: { word: "Ephemeral", definition: "Lasting for a very short time.", usage: "Fashions are ephemeral, changing with every season." } },
        { level: 3, data: { word: "Serendipity", definition: "The occurrence of events by chance in a happy way.", usage: "It was pure serendipity that we met." } }
      ] 
    },
    { 
      id: 'n3', title: "Memory Palace", duration: "15 min", type: "Memory", icon: <Brain className="text-purple-500"/>, desc: "Visual recall challenge.", gameType: 'memoryGrid', 
      levels: [
        { level: 1, data: { items: ['🌟', '🍎', '🚗'], target: '🍎' } },
        { level: 2, data: { items: ['🐶', '🐱', '🐭', '🐹'], target: '🐭' } },
        { level: 3, data: { items: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐'], target: '🏈' } }
      ] 
    },
    { 
        id: 'n4', title: "Logic Patterns", duration: "8 min", type: "Logic", icon: <Grid className="text-teal-500"/>, desc: "Complete the sequence.", gameType: 'choice', 
        levels: [
            { level: 1, data: { question: "2, 4, 8, ...", options: ["16", "20"], correct: "16" } },
            { level: 2, data: { question: "A, C, E, ...", options: ["F", "G"], correct: "G" } },
            { level: 3, data: { question: "100, 90, 80, ...", options: ["70", "60"], correct: "70" } }
        ] 
    },
    { 
        id: 'n5', title: "Creative Writing", duration: "20 min", type: "Creativity", icon: <Edit3 className="text-orange-500"/>, desc: "Write a short story.", gameType: 'writing', 
        levels: [
            { level: 1, data: { prompt: "Write about a flying turtle." } },
            { level: 2, data: { prompt: "Describe a city under the ocean." } }
        ] 
    }
  ],
  HighRisk: [
    { 
      id: 'h1', title: "Assisted Reading", duration: "10 min", type: "Auditory", icon: <Volume2 className="text-indigo-500"/>, desc: "Listen and follow along.", gameType: 'assistedRead', 
      levels: [
        { level: 1, data: { title: "The Cat", text: "The cat moves softly across the floor, silent and calm.Its eyes glow with curiosity in the quiet room.It loves warm corners and gentle naps.With a flick of its tail, it shows its mood.The cat is both playful and proud." } },
        { level: 2, data: { title: "The Dog", text: "The dog waits by the door, full of joy.Its tail wags at the sound of footsteps.Always loyal, it guards its home.It loves long walks and kind words.The dog is a true friend.." } },
        { level: 3, data: { title: "The Bird", text: "The bird sings as the morning begins.Its wings flutter lightly in the air.Bright feathers catch the sunlight.It hops from branch to branch happily.The bird fills the day with music." } }
      ] 
    },
    { 
      id: 'h2', title: "Read Aloud Challenge", duration: "15 min", type: "Speech", icon: <Mic className="text-pink-500"/>, desc: "Read accurately.", gameType: 'readAloud', 
      levels: [
        { level: 1, data: { text: "The sun rises with warm golden light.It fills the sky with brightness and hope.Everything wakes under its glow." } },
        { level: 2, data: { text: "The moon shines softly in the night sky.It watches over the quiet world.Its calm light brings peace." } },
        { level: 3, data: { text: "The mountain stands tall and strong.Its peak touches the clouds above.It guards the land in silence." } }
      ] 
    },
    { 
      id: 'h3', title: "Letter Discrimination", duration: "5 min", type: "Visual", icon: <EyeOff className="text-green-500"/>, desc: "Find the target letter.", gameType: 'gridHunt', 
      levels: [
        { level: 1, data: { target: 'b', distractors: ['d'], gridSize: 9 } },
        { level: 2, data: { target: 'p', distractors: ['q'], gridSize: 16 } },
        { level: 3, data: { target: 'm', distractors: ['w', 'n'], gridSize: 25 } }
      ] 
    },
    { 
      id: 'h4', title: "Letter Tracing", duration: "15 min", type: "Motor Skills", icon: <Edit3 className="text-orange-500"/>, desc: "Trace the letters.", gameType: 'tracing', 
      levels: [
        { level: 1, data: { letter: "a" } },
        { level: 2, data: { letter: "b" } },
        { level: 3, data: { letter: "e" } }
      ] 
    },
    { 
      id: 'h5', title: "Sound Matching", duration: "10 min", type: "Phonics", icon: <Music className="text-blue-400"/>, desc: "Match the sounds.", gameType: 'choice', 
      levels: [
        { level: 1, data: { question: "Rhymes with Tree?", options: ["Bee", "Car"], correct: "Bee" } },
        { level: 2, data: { question: "Starts with 'S'?", options: ["Sun", "Moon"], correct: "Sun" } },
        { level: 3, data: { question: "Rhymes with Frog?", options: ["Dog", "Cat"], correct: "Dog" } }
      ] 
    }
  ]
};