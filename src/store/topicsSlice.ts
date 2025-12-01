import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TopicsState {
  topics: number[];
  score: number; // Polarization score following fixed module sequence
  currentModule: number; // 0-based index of current module
}

// Load topics from localStorage
const storedTopics = localStorage.getItem("topics");
const storedScore = localStorage.getItem("score");
// Fixed polarization trajectory per module (Module 1..6)
// Updated per user specification: 100 → 95 → 87 → 56 → 36 → 2
const POLARIZATION_SEQUENCE = [100, 95, 87, 56, 36, 2];

const initialState: TopicsState = {
  topics: storedTopics ? JSON.parse(storedTopics) : [],
  score: storedScore ? parseFloat(JSON.parse(storedScore).toFixed(1)) : POLARIZATION_SEQUENCE[0],
  currentModule: 0,
};

const topicsSlice = createSlice({
  name: "topics",
  initialState,
  reducers: {
    addTopic: (state, action: PayloadAction<number>) => {
      state.topics.push(action.payload);
      localStorage.setItem("topics", JSON.stringify(state.topics));
    },
    removeTopic: (state, action: PayloadAction<number>) => {
      state.topics = state.topics.filter((topic) => topic !== action.payload);
      localStorage.setItem("topics", JSON.stringify(state.topics));
    },
    clearTopics: (state) => {
      state.topics = [];
      localStorage.removeItem("topics");
    },
    // Deprecated dynamic score adjustments (now deterministic per module)
    addScore: (state, action: PayloadAction<number>) => {
      // No-op to preserve backward compatibility
      localStorage.setItem("score", JSON.stringify(state.score));
    },
    decreaseScore: (state, action: PayloadAction<number>) => {
      const newScore = state.score - action.payload;
    
      // Round to 2 decimal places
      state.score = Math.round(newScore * 100) / 100;
    
      localStorage.setItem("score", JSON.stringify(state.score));
    },
    
    nextModule: (state) => {
      if (state.currentModule < POLARIZATION_SEQUENCE.length - 1) {
        state.currentModule += 1;
        state.score = POLARIZATION_SEQUENCE[state.currentModule]<state.score?POLARIZATION_SEQUENCE[state.currentModule]:state.score;
        localStorage.setItem("score", JSON.stringify(state.score));
      }
    },
    resetModules: (state) => {
      state.currentModule = 0;
      state.score = POLARIZATION_SEQUENCE[0];
      localStorage.setItem("score", JSON.stringify(state.score));
    }
  },
});

export const { addTopic, removeTopic, clearTopics, addScore, decreaseScore, nextModule, resetModules } = topicsSlice.actions;
export default topicsSlice.reducer;
