function inVision(x, y, b) {
  const d = newVec2(x - b.x, y - b.y);
  return (
    Vec2.len(d) < option.boid.visionRadius &&
    Math.abs(Angle.clampPi(Vec2.angle(d) - b.yaw)) < option.boid.visionAngle / 2
  );
}

function inVisionObstacleLine(b, ol) {
  const {PC} = circleLineRelation(b.x, b.y, ol);
  const d = Vec2.mul(PC, -1);
  return (
    ObstacleLine.hasCollisionCircle(b.x, b.y, option.boid.visionRadius, ol) &&
    Math.abs(Angle.clampPi(Vec2.angle(d) - b.yaw)) < option.boid.visionAngle / 2
  );
}

/**
 * For more on boids and their rules, see:
 * https://en.wikipedia.org/wiki/Boids
 * @returns {Vec2|null}
 */
function findTarget(b, otherBoids, obstacles, obstacleLines) {
  if (otherBoids.length === 0 && obstacles.length === 0 && obstacleLines.length == 0) {
    return null;
  }

  let t = newVec2(0, 0);

  // Separation
  let vSep = newVec2(0, 0);
  if (option.findTarget.separation.active) {
    otherBoids.forEach((c) => {
      const d = newVec2(c.x - b.x, c.y - b.y);
      vSep = Vec2.add(
        vSep,
        Vec2.mul(Vec2.unit(d), option.findTarget.separation.weightBoid / Vec2.len(d) / Vec2.len(d))
      );
    });
  }
  obstacles.forEach((ob) => {
    const d = newVec2(ob.x - b.x, ob.y - b.y);
    vSep = Vec2.add(
      vSep,
      Vec2.mul(Vec2.unit(d), option.findTarget.separation.weightObstacle / Vec2.len(d))
    );
  });
  obstacleLines.forEach((ol) => {
    const {PC} = circleLineRelation(b.x, b.y, ol);
    const d = Vec2.mul(PC, -1);
    vSep = Vec2.add(
      vSep,
      Vec2.mul(Vec2.unit(d), option.findTarget.separation.weightObstacle / Vec2.len(d))
    );
  });
  // When entities have illegal positions, `NaN` may occur.
  if (Number.isNaN(vSep.x) || Number.isNaN(vSep.y)) {
    console.error('vSep has NaN');
    vSep.x = vSep.y = 0;
  }

  // Alignment
  let vAli = newVec2(0, 0);
  if (option.findTarget.alignment.active) {
    if (otherBoids.length > 0) {
      let vOther = newVec2(0, 0);
      otherBoids.forEach((c) => {
        vOther = Vec2.add(vOther, Vec2.mul(Angle.toVec2(c.yaw), c.speed));
      });
      vOther = Vec2.mul(vOther, 1 / otherBoids.length);
      const bVel = Vec2.mul(Angle.toVec2(b.yaw), b.speed);
      vAli = Vec2.mul(Vec2.sub(vOther, bVel), option.findTarget.alignment.weight);
    }
  }

  // Cohesion
  let vCoh = newVec2(0, 0);
  if (option.findTarget.cohesion.active) {
    if (otherBoids.length > 0) {
      let vOther = newVec2(0, 0);
      otherBoids.forEach((c) => {
        vOther = Vec2.add(vOther, newVec2(c.x, c.y));
      });
      vOther = Vec2.mul(vOther, 1 / otherBoids.length);
      vCoh = Vec2.mul(Vec2.sub(vOther, newVec2(b.x, b.y)), option.findTarget.cohesion.weight);
    }
  }

  t = Vec2.sub(t, vSep);
  t = Vec2.add(t, vAli);
  t = Vec2.add(t, vCoh);
  return t;
}

const hysteresisEnterThresholdMagnitude = 4;
const hysteresisEnterThresholdAngle = Math.PI * 0.9; // In radians, in either direction.
const hysteresisExitThresholdAngle = Math.PI * 0.45; // In radians, in either direction.
const accelerationWeightRecover = 3;

function resolve(b, target, dt) {
  if (target !== null) {
    const ang = Angle.clampPi(Vec2.angle(target) - b.yaw);
    if (
      b.rotationHysteresis === null &&
      Math.abs(ang) > hysteresisEnterThresholdAngle &&
      Vec2.len(target) > hysteresisEnterThresholdMagnitude
    ) {
      b.rotationHysteresis = ang > 0 ? 1 : -1;
    }
    if (Math.abs(ang) < hysteresisExitThresholdAngle) {
      b.rotationHysteresis = null;
    }
    if (b.rotationHysteresis !== null) {
      b.yaw += (b.rotationHysteresis * option.boid.rotationSpeed * dt) / 1000;
    } else {
      b.yaw += ((ang > 0 ? 1 : -1) * option.boid.rotationSpeed * dt) / 1000;
    }
  }

  const accResolve = target === null ? 0 : Vec2.dot(Angle.toVec2(b.yaw), target);
  const accRecover = (option.boid.speed - b.speed) * accelerationWeightRecover;
  let acc = accResolve + accRecover;
  if (Math.abs(acc) > option.boid.maxAcceleration) {
    acc = acc > 0 ? option.boid.maxAcceleration : -option.boid.maxAcceleration;
  }
  b.speed += (acc * dt) / 1000;
  if (b.speed < 0) {
    b.speed = 0;
  }
}

function move(b, dt) {
  const d = Vec2.mul(Angle.toVec2(b.yaw), dt * 0.001 * b.speed);
  b.x += d.x;
  b.y += d.y;
}

function collision(b, obstacleLines) {
  obstacleLines.forEach((ol) => {
    const {PC} = circleLineRelation(b.x, b.y, ol);
    if (ObstacleLine.hasCollisionCircle(b.x, b.y, option.boid.radius, ol)) {
      const r = option.boid.radius;
      const l = Vec2.len(PC);
      const m = ObstacleLine.isDirectionAllowed(Vec2.angle(PC), ol) ? (r - l) / l : -((r + l) / l);
      const d = Vec2.mul(Vec2.unit(PC), option.boid.radius * m);
      b.x += d.x;
      b.y += d.y;
    }
  });
}

function respawn(b, world) {
  if (b.x < world.x) {
    b.x = world.x + world.width;
  }
  if (b.x > world.x + world.width) {
    b.x = world.x;
  }
  if (b.y < world.y) {
    b.y = world.y + world.height;
  }
  if (b.y > world.y + world.height) {
    b.y = world.y;
  }
}

/**
 * @param {number} dt In milliseconds.
 */
function update(dt, world) {
  let velSum = newVec2(0, 0);
  let targetSum = newVec2(0, 0);
  world.boids.forEach((b) => {
    const otherBoidsVisible = world.boids.filter((c) => c !== b && inVision(c.x, c.y, b));
    const obstaclesVisible = world.obstacles.filter((ob) => inVision(ob.x, ob.y, b));
    const obstacleLinesVisible = world.obstacleLines.filter((ol) => inVisionObstacleLine(b, ol));
    const t = findTarget(b, otherBoidsVisible, obstaclesVisible, obstacleLinesVisible);
    b.target = t;
    resolve(b, t, dt);
    move(b, dt);
    collision(b, world.obstacleLines);
    respawn(b, world);
    velSum = Vec2.add(velSum, Vec2.mul(Angle.toVec2(b.yaw), b.speed));
    if (b.target !== null) {
      targetSum = Vec2.add(targetSum, b.target);
    }
  });
  // const velAvg = Vec2.mul(velSum, 1 / world.boids.length);
  // const targetAvg = Vec2.mul(targetSum, 1 / world.boids.length);
  // console.log(`velAvg: ${velAvg.x} ${velAvg.y}`);
  // console.log(`targetAvg: ${targetAvg.x} ${targetAvg.y}`);
}
