/**
 * Load spritesheet image and packages it with its layout metadata.
 */
function loadSprite(src, frames, cols) {
    const img = new Image();
    img.src = src;
    return { img, frames, cols };
}

export const SHEETS = {
    // bomb: loadSprite("../assets/sprites/bomb.png", 11, 3),
    down: loadSprite("../assets/sprites/down.png", 4, 2),
    hole: loadSprite("../assets/sprites/hole.png", 1, 1),
    idle: loadSprite("../assets/sprites/idle.png", 10, 3),
    up: loadSprite("../assets/sprites/up.png", 5, 2),
    hit: loadSprite("../assets/sprites/hit.png", 8, 3)
};

export const SOUNDS = {
    hit: new Audio("../assets/audio/hit_sound.mp3"),
    miss: new Audio("../assets/audio/miss.mp3"),
    roundClear: new Audio("../assets/audio/round_clear.mp3")
};

/**
 * Play sound cleanly from the beginning even when triggered rapidly
 */
export function playSound(sound) {
    sound.currentTime = 0;
    sound.play()
}