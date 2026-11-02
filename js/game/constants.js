// Initialise Canvas and context
export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

// Constants
export const FRAME_TIME = 1000 / 10;                             // Set to 10 FPS
export const FRAME_SIZE = 32;
export const NEXT = { up: "idle", down: "empty", hit: "down" }; // Dictate next state after each state