import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TopicsState {
  topics: number[];
}

// Load topics from localStorage
const storedTopics = localStorage.getItem("topics");
const initialState: TopicsState = {
  topics: storedTopics ? JSON.parse(storedTopics) : [],
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
  },
});

export const { addTopic, removeTopic, clearTopics } = topicsSlice.actions;
export default topicsSlice.reducer;
