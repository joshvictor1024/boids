const Vec2 = {
  add: function (v1, v2) {
    return newVec2(v1.x + v2.x, v1.y + v2.y);
  },
  sub: function (v1, v2) {
    return newVec2(v1.x - v2.x, v1.y - v2.y);
  },
  mul: function (v, c) {
    return newVec2(v.x * c, v.y * c);
  },
  dot: function (v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  },
  proj: function (v1, v2) {
    return Vec2.mul(v2, Vec2.dot(v1, v2) / Vec2.dot(v2, v2));
  },
  len: function (v) {
    return Math.sqrt(Vec2.dot(v, v));
  },
  /** @returns {Vec2} */
  unit: function (v) {
    return Vec2.mul(v, 1 / Vec2.len(v));
  },
  /** @returns {number} In radians. Up is 0, clockwise is positive. */
  angle: function (v) {
    return Math.atan2(v.x, -v.y);
  }
};

/**
 * @typedef {{x: number, y: number}} Vec2
 */

/**
 * @param {number} x
 * @param {number} y
 * @returns {Vec2}
 */
function newVec2(x, y) {
  return {x: x, y: y};
}

// In radians. Up is 0, clockwise is positive.
const Angle = {
  /** @returns {number} Clamps to [-pi, pi]. */
  clampPi: function (a) {
    while (a > Math.PI) {
      a -= 2 * Math.PI;
    }
    while (a < -Math.PI) {
      a += 2 * Math.PI;
    }
    return a;
  },
  /** @returns {number} Clamps to [0, 2pi). */
  clamp2Pi: function (a) {
    while (a >= 2 * Math.PI) {
      a -= 2 * Math.PI;
    }
    while (a < 0) {
      a += 2 * Math.PI;
    }
    return a;
  },
  /** @returns {Vec2} */
  toVec2: function (a) {
    return newVec2(Math.sin(a), -Math.cos(a));
  }
};

/**
 * An directioned infinite line in the direction of (dx, dy) = (x2-x1, y2-y1).
 * @typedef {Object} Line
 * @property {Vec2} origin In meters.
 * @property {number} direction In radians.
 */
function newLine(origin, direction) {
  return {
    origin: origin,
    direction: direction
  };
}

/**
 * @returns {{P: Vec2, PC: Vec2}} `P` is the nearest point on `ol` to `b`; `PC` is the vector from `P` to `b`.
 */
function circleLineRelation(cx, cy, l) {
  const C = newVec2(cx, cy);
  const AC = Vec2.sub(C, l.origin);
  const AB = Angle.toVec2(l.direction);
  const P = Vec2.add(Vec2.proj(AC, AB), l.origin);
  const PC = Vec2.sub(C, P);
  return {P: P, PC: PC};
}
