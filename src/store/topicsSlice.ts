import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TopicsState {
  topics: number[];
  score: number;
}

// Load topics from localStorage
const storedTopics = localStorage.getItem("topics");
const storedScore = localStorage.getItem("score");
const initialState: TopicsState = {
  topics: storedTopics ? JSON.parse(storedTopics) : [],
  score: storedScore ? parseFloat(JSON.parse(storedScore).toFixed(1)) : 100,
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
    addScore: (state, action: PayloadAction<number>) => {
      state.score = parseFloat((state.score + action.payload).toFixed(1));
      localStorage.setItem("score", JSON.stringify(state.score));
    },
    decreaseScore: (state, action: PayloadAction<number>) => {
      console.log("reaching here", action.payload);
      state.score = parseFloat((state.score - action.payload).toFixed(1));
      localStorage.setItem("score", JSON.stringify(state.score));
    },
  },
});

export const { addTopic, removeTopic, clearTopics, addScore, decreaseScore } = topicsSlice.actions;
export default topicsSlice.reducer;
