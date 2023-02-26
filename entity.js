/**
 * @typedef {Object} Boid
 * @property {number} x In meters.
 * @property {number} y In meters.
 * @property {number} yaw In radians. Up is 0, clockwise is positive.
 * @property {number} speed In meters per second.
 * @property {number|null} rotationHysteresis `+1` for clockwise; `-1` for counter-clockwise; `null` for none.
 * @property {Vec2} target In meters.
 * @property {boolean} showVelocity
 * @property {boolean} showVision
 * @property {boolean} showTarget
 */

function newBoid(x, y) {
  return {
    // Status
    x: x,
    y: y,
    yaw: Math.random() * 2 * Math.PI,
    speed: 0,
    rotationHysteresis: null,
    target: null,
    // Debug
    showVelocity: false,
    showVision: false,
    showTarget: false
  };
}

/**
 * @typedef {Object} Obstacle
 * @property {number} x In meters.
 * @property {number} y In meters.
 * @property {boolean} show
 */

function newObstacle(x, y, show) {
  return {
    x: x,
    y: y,
    show: show
  };
}
