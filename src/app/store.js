import { configureStore } from "@reduxjs/toolkit";

// Placeholder for root reducer. We'll add slices here later.
const rootReducer = {};

export const store = configureStore({
  reducer: rootReducer,
  // DevTools are enabled by default in development
  devTools: process.env.NODE_ENV !== "production",
});
