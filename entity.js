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

const ObstacleLine = {
  /**
   * ObstacleLine is an directioned infinite line in the direction of (dx, dy) = (x2-x1, y2-y1).
   * Boids attempt to stay on the (-dy, dx) side,
   * i.e. toward the counter-clockwise (negative angle) of the line.
   * */
  isDirectionAllowed: function (a, ol) {
    return Angle.clampPi(a - ol.direction) < 0;
  },
  hasCollisionCircle(cx, cy, r, ol) {
    const {PC} = circleLineRelation(cx, cy, ol);
    return Vec2.len(PC) < r || ObstacleLine.isDirectionAllowed(Vec2.angle(PC), ol) === false;
  }
};

/**
 * An directioned infinite line in the direction of (dx, dy) = (x2-x1, y2-y1).
 * Boids attempt to stay on the (-dy, dx) side,
 * i.e. toward the counter-clockwise (negative angle) of the line.
 * @typedef {Object} ObstacleLine
 * @property {Line} origin In meters.
 * @property {number} direction In radians.
 * @property {boolean} show
 */

function newObstacleLine(origin, direction, show) {
  return {
    origin: origin,
    direction: direction,
    show: show
  };
}
