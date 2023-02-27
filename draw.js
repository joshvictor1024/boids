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
      ${b.x + Angle.toVec2(b.yaw).x * option.boid.radius} \
      ${b.y + Angle.toVec2(b.yaw).y * option.boid.radius} \
      ${b.x + Angle.toVec2(b.yaw + Math.PI - boidHeadAngle).x * option.boid.radius} \
      ${b.y + Angle.toVec2(b.yaw + Math.PI - boidHeadAngle).y * option.boid.radius} \
      ${b.x + Angle.toVec2(b.yaw + Math.PI + boidHeadAngle).x * option.boid.radius} \
      ${b.y + Angle.toVec2(b.yaw + Math.PI + boidHeadAngle).y * option.boid.radius}`;
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

function drawObstacleLines(gObstacles, obstacleLines) {
  const indicatorLength = 1;
  function getEnd(ol) {
    return Vec2.mul(Vec2.add(ol.origin, Angle.toVec2(ol.direction)), indicatorLength);
  }

  function attrPointsLineHead(ol) {
    const end = getEnd(ol);
    const arrowHeadAngle = 0.3 * Math.PI;
    const arrowHeadRadius = 0.05;
    return `\
      ${end.x + Angle.toVec2(ol.direction).x * arrowHeadRadius} \
      ${end.y + Angle.toVec2(ol.direction).y * arrowHeadRadius} \
      ${end.x + Angle.toVec2(ol.direction + Math.PI - arrowHeadAngle).x * arrowHeadRadius} \
      ${end.y + Angle.toVec2(ol.direction + Math.PI - arrowHeadAngle).y * arrowHeadRadius} \
      ${end.x + Angle.toVec2(ol.direction + Math.PI + arrowHeadAngle).x * arrowHeadRadius} \
      ${end.y + Angle.toVec2(ol.direction + Math.PI + arrowHeadAngle).y * arrowHeadRadius}`;
  }

  gObstacles
    .selectAll('.obstacleLine')
    .data(obstacleLines.filter((ol) => ol.show))
    .join('line')
    .classed('obstacleLine', true)
    .attr('x1', (ol) => ol.origin.x)
    .attr('y1', (ol) => ol.origin.y)
    .attr('x2', (ol) => getEnd(ol).x)
    .attr('y2', (ol) => getEnd(ol).y);
  gObstacles
    .selectAll('.obstacleLine__head')
    .data(obstacleLines.filter((ol) => ol.show))
    .join('polygon')
    .classed('obstacleLine__head', true)
    .attr('points', attrPointsLineHead);
}

function drawWorld(svgWorld, world) {
  drawBoids(svgWorld.select('#gBoids'), world.boids);
  drawObstacles(svgWorld.select('#gObstacles'), world.obstacles);
  drawObstacleLines(svgWorld.select('#gObstacles'), world.obstacleLines);
}
