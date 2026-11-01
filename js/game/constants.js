// Initialise Canvas and context
export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

// Constants
export const FRAME_TIME = 1000 / 8;                             // Set to 8 FPS
export const FRAME_SIZE = 32;
export const NEXT = { up: "idle", down: "empty", hit: "down" }; // Dictate next state after each state