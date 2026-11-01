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