import React from 'react';
import { Zap, BookOpen, Brain, Grid, Edit3, Volume2, Mic, EyeOff, Music } from 'lucide-react';

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

export const ASSESSMENT_QUESTIONS = [
  { id: 1, category: 'Phonological Awareness', featureTarget: ['F1_Rhyme', 'F2_Alliteration'], type: 'choice', question: "Which word rhymes with 'CAT'?", options: ['Dog', 'Bat', 'Car', 'Fish'], correct: 'Bat', timeLimit: 10 },
  { id: 2, category: 'Visual Perception', featureTarget: ['F7_VisualPerception', 'F4_WordReadingSpeed'], type: 'choice', question: "Find the letter 'b' hidden in the group.", options: ['d', 'p', 'b', 'q'], correct: 'b', timeLimit: 5 },
  { id: 3, category: 'Working Memory', featureTarget: ['F8_MemorySpan'], type: 'memory', question: "Memorize this sequence: 5 - 9 - 2", sequence: "592", timeLimit: 5, inputPrompt: "Enter the sequence you just saw:" },
  { id: 4, category: 'Spelling & Decoding', featureTarget: ['F6_Spelling', 'F5_NonWordReading'], type: 'choice', question: "Which of these is a nonsense (fake) word?", options: ['Train', 'Blop', 'House', 'Jump'], correct: 'Blop', timeLimit: 10 },
  { id: 5, category: 'Rapid Naming', featureTarget: ['F9_RapidNaming'], type: 'reaction', question: "Click the button as fast as you can!", correct: true, timeLimit: 3 }
];

export const EXERCISES_DB = {
  Normal: [
    { 
      id: 'n1', title: "Speed Reading Sprint", duration: "5 min", type: "Cognitive", icon: <Zap className="text-yellow-500"/>, desc: "Read a text and test your WPM.",
      gameType: 'speedRead',
      levels: [
        { level: 1, data: { text: "Machine learning is a field of inquiry.", question: "What field is this?", options: ["Biology", "Inquiry", "Magic"], correct: "Inquiry" } },
        { level: 2, data: { text: "Machine learning leverages data to improve performance on tasks. It is part of AI.", question: "What improves performance?", options: ["Data", "Oil", "Time"], correct: "Data" } },
        { level: 3, data: { text: "Deep learning is a subset of machine learning based on artificial neural networks. It can learn unsupervised from unstructured data.", question: "What is it based on?", options: ["Neural Networks", "Trees", "Clouds"], correct: "Neural Networks" } }
      ]
    },
    { 
      id: 'n2', title: "Vocabulary Builder", duration: "10 min", type: "Language", icon: <BookOpen className="text-blue-500"/>, desc: "Master complex words.",
      gameType: 'vocab',
      levels: [
         { level: 1, data: { word: "Ebullient", definition: "Cheerful and full of energy.", usage: "She sounded ebullient." } },
         { level: 2, data: { word: "Cacophony", definition: "A harsh, discordant mixture of sounds.", usage: "A cacophony of alarms." } },
         { level: 3, data: { word: "Ephemeral", definition: "Lasting for a very short time.", usage: "Fashions are ephemeral." } }
      ]
    },
    { 
      id: 'n3', title: "Memory Palace", duration: "15 min", type: "Memory", icon: <Brain className="text-purple-500"/>, desc: "Visual recall challenge.",
      gameType: 'memoryGrid',
      levels: [
          { level: 1, data: { items: ['🌟', '🍎', '🚗'], target: '🍎' } },
          { level: 2, data: { items: ['🌟', '🍎', '🚗', '🐶', '🍕'], target: '🐶' } },
          { level: 3, data: { items: ['🌟', '🍎', '🚗', '🐶', '🍕', '✈️', '🏀', '🎸'], target: '✈️' } }
      ]
    },
    { 
      id: 'n4', title: "Logic Patterns", duration: "8 min", type: "Logic", icon: <Grid className="text-teal-500"/>, desc: "Complete the sequence.",
      gameType: 'choice',
      levels: [
          { level: 1, data: { question: "2, 4, 8, 16, ...", options: ["20", "24", "32", "64"], correct: "32" } },
          { level: 2, data: { question: "1, 1, 2, 3, 5, ...", options: ["7", "8", "9", "10"], correct: "8" } },
          { level: 3, data: { question: "J, F, M, A, M, ... (Months)", options: ["J", "A", "S", "O"], correct: "J" } }
      ]
    },
    { 
      id: 'n5', title: "Creative Writing", duration: "20 min", type: "Creativity", icon: <Edit3 className="text-orange-500"/>, desc: "Write a short story.",
      gameType: 'writing',
      levels: [
          { level: 1, data: { prompt: "Write about a flying turtle." } },
          { level: 2, data: { prompt: "Describe a color to someone who cannot see." } }
      ]
    }
  ],
  HighRisk: [
    { 
      id: 'h1', title: "Assisted Reading", duration: "10 min", type: "Auditory", icon: <Volume2 className="text-indigo-500"/>, desc: "Listen and follow along.",
      gameType: 'assistedRead',
      levels: [
          { level: 1, data: { title: "The Cat", text: "The cat sat on the mat. It was a fat cat." } },
          { level: 2, data: { title: "The Garden", text: "Whiskers loved to explore the green garden. He saw a blue butterfly." } },
          { level: 3, data: { title: "Space Trip", text: "The rocket zoomed to the moon. Stars shined bright in the dark sky." } }
      ]
    },
    { 
      id: 'h2', title: "Read Aloud Challenge", duration: "15 min", type: "Speech", icon: <Mic className="text-pink-500"/>, desc: "Read accurately.",
      gameType: 'readAloud',
      levels: [
          { level: 1, data: { text: "The sun is hot." } },
          { level: 2, data: { text: "I like to play in the park." } },
          { level: 3, data: { text: "The quick brown fox jumps over the dog." } }
      ]
    },
    { 
      id: 'h3', title: "Letter Discrimination", duration: "5 min", type: "Visual", icon: <EyeOff className="text-green-500"/>, desc: "Find the target letter.",
      gameType: 'gridHunt',
      levels: [
          { level: 1, data: { target: 'b', distractors: ['d'], gridSize: 9 } }, 
          { level: 2, data: { target: 'p', distractors: ['q', 'g'], gridSize: 16 } }, 
          { level: 3, data: { target: 'm', distractors: ['w', 'n'], gridSize: 25 } } 
      ]
    },
    {
      id: 'h4', title: "Letter Tracing", duration: "15 min", type: "Motor Skills", icon: <Edit3 className="text-orange-500"/>, desc: "Trace the letters.",
      gameType: 'tracing',
      levels: [
          { level: 1, data: { letter: "a" } },
          { level: 2, data: { letter: "b" } },
          { level: 3, data: { letter: "d" } },
          { level: 4, data: { letter: "q" } }
      ]
    },
    {
      id: 'h5', title: "Sound Matching", duration: "10 min", type: "Phonics", icon: <Music className="text-blue-400"/>, desc: "Match the sounds.",
      gameType: 'choice',
      levels: [
          { level: 1, data: { question: "Starts with 'M' sound?", options: ["Moon", "Sun", "Fish", "Cat"], correct: "Moon" } },
          { level: 2, data: { question: "Rhymes with 'Tree'?", options: ["Bee", "Car", "Dog", "Map"], correct: "Bee" } },
          { level: 3, data: { question: "Ends with 'T' sound?", options: ["Cat", "Dog", "Ball", "Sky"], correct: "Cat" } }
      ]
    }
  ]
};