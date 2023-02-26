const boidRadius = 0.1;
const boidHeadAngle = 0.5;

function drawBoids(gBoids, boids) {
  // Debug features

  // Show Vision
  function toVision(b) {
    const c = {...b};
    (c.innerRadius = 0), (c.outerRadius = option.boid.visionRadius);
    c.startAngle = b.yaw - option.boid.visionAngle / 2;
    c.endAngle = b.yaw + option.boid.visionAngle / 2;
    return c;
  }

  gBoids
    .selectAll('.vision')
    .data(boids.filter((b) => b.showVision).map(toVision))
    .join('path')
    .classed('vision', true)
    .attr('transform', (b) => `translate(${b.x},${b.y})`)
    .attr('d', d3.arc());

  // Show Target
  gBoids
    .selectAll('.target')
    .data(boids.filter((b) => b.showTarget && b.target !== null))
    .join('line')
    .classed('target', true)
    .classed('target--hysteresis', (b) => b.rotationHysteresis !== null)
    .attr('x1', (b) => b.x)
    .attr('y1', (b) => b.y)
    .attr('x2', (b) => b.x + b.target.x)
    .attr('y2', (b) => b.y + b.target.y);

  function attrPointsBoid(b) {
    return `\
      ${b.x + Angle.toVec2(b.yaw).x * boidRadius} \
      ${b.y + Angle.toVec2(b.yaw).y * boidRadius} \
      ${b.x + Angle.toVec2(b.yaw + Math.PI - boidHeadAngle).x * boidRadius} \
      ${b.y + Angle.toVec2(b.yaw + Math.PI - boidHeadAngle).y * boidRadius} \
      ${b.x + Angle.toVec2(b.yaw + Math.PI + boidHeadAngle).x * boidRadius} \
      ${b.y + Angle.toVec2(b.yaw + Math.PI + boidHeadAngle).y * boidRadius}`;
  }

  // Boid body
  gBoids
    .selectAll('polygon')
    .data(boids)
    .join('polygon')
    .classed('boid', true)
    .attr('points', attrPointsBoid);
}

const obstacleRadius = 0.1;

function drawObstacles(gObstacles, obstacles) {
  gObstacles
    .selectAll('.obstacle')
    .data(obstacles.filter((ob) => ob.show))
    .join('circle')
    .classed('obstacle', true)
    .attr('cx', (ob) => ob.x)
    .attr('cy', (ob) => ob.y)
    .attr('r', obstacleRadius);
}

function drawWorld(svgWorld, world) {
  drawBoids(svgWorld.select('#gBoids'), world.boids);
  drawObstacles(svgWorld.select('#gObstacles'), world.obstacles);
}
