function setupDivOption(divOption) {
  // For `h3` ordering.
  function getAlphabet(i) {
    return 'ABCDEFG'[i];
  }

  // Option
  divOption.append('h2').text('Options');
  Object.keys(optionUI).forEach((s, index) => {
    // Option section
    const section = divOption.append('section').attr('id', s).classed('option__section', true);
    section.append('h3').text(`${getAlphabet(index)}. ${optionUI[s].title}`);
    Object.keys(optionUI[s].items).forEach((i) => {
      // Option item
      const item = section.append('div').attr('id', i).classed('option__item', true);
      const label = item.append('label').text(optionUI[s].items[i].title);
      switch (optionUI[s].items[i].type) {
        case 'toggle':
          item.classed('option__item--toggle', true);
          label
            .append('input')
            .attr('type', 'checkbox')
            .property('checked', optionUI[s].items[i].get())
            .on('change', function () {
              optionUI[s].items[i].set(d3.select(this).property('checked'));
              console.log(option);
            });
          break;
        case 'slider':
          item.classed('option__item--slider', true);
          label.style('display', 'flex').style('flex-direction', 'column');
          label
            .append('input')
            .attr('type', 'range')
            .attr('min', optionUI[s].items[i].min)
            .attr('max', optionUI[s].items[i].max)
            .attr('step', optionUI[s].items[i].step)
            .attr('value', optionUI[s].items[i].get())
            .on('change', function () {
              optionUI[s].items[i].set(d3.select(this).property('value'));
            });
          break;
      }
    });
  });
}

const meterPerPixel = 100;

/**
 * @typedef {Object} World
 * @property {number} x In meters.
 * @property {number} y In meters.
 * @property {number} width In meters.
 * @property {number} height In meters.
 * @property {Boid[]} boids
 * @property {Obstacle[]} obstacles
 */
const world = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  boids: [],
  obstacles: []
};

function setupSvgWorld(svgWorld) {
  svgWorld
    .attr('height', '100%')
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .attr('viewBox', `0 0 ${1} ${1}`); // Trigger flexbox reflow to calculate `clientWidth` `clientHeight`.

  const viewportWidth = document.getElementById('world').clientWidth;
  const viewportHeight = document.getElementById('world').clientHeight;
  world.width = viewportWidth / meterPerPixel;
  world.height = viewportHeight / meterPerPixel;
  svgWorld.attr('viewBox', `0 0 ${world.width} ${world.height}`);

  svgWorld
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', world.width)
    .attr('height', world.height)
    .attr('fill', '#fafafa')
    .attr('stroke', 'lightgray')
    .attr('stroke-width', 0.01);
  svgWorld.append('g').attr('id', 'gBoids');
  svgWorld.append('g').attr('id', 'gObstacles');
}

window.addEventListener('load', async () => {
  // Setup DOM
  const divOption = d3.select('#option');
  const svgWorld = d3.select('#world');
  setupDivOption(divOption);
  setupSvgWorld(svgWorld);

  // Setup boids
  for (let i = 0; i < 40; i++) {
    world.boids.push(
      newBoid(
        world.x + 1 + Math.random() * (world.width - 2),
        world.y + 1 + Math.random() * (world.height - 2)
      )
    );
  }
  // world.boids[0].showTarget = true;
  // world.boids[0].showVision = true;

  // Setup obstacles
  const obstacleMargin = 0.2;
  for (let i = 0; (i - 1) * obstacleMargin <= world.width; i++) {
    world.obstacles.push(newObstacle(i * obstacleMargin, 0, false));
    world.obstacles.push(newObstacle(i * obstacleMargin, world.height, false));
  }
  for (let i = 1; (i - 1) * obstacleMargin <= world.height; i++) {
    world.obstacles.push(newObstacle(0, i * 0.25, false));
    world.obstacles.push(newObstacle(world.width, i * 0.25, false));
  }

  // Main function
  let lastRAFTimestamp = null;
  function animation(rAFTimestamp) {
    if (lastRAFTimestamp === null) {
      lastRAFTimestamp = rAFTimestamp;
    } else {
      if (option.simulation.paused === false && document.hidden === false) {
        const dt = rAFTimestamp - lastRAFTimestamp;
        if (dt < 200) {
          update(dt * option.simulation.speed, world);
          drawWorld(svgWorld, world);
        }
      }
      lastRAFTimestamp = rAFTimestamp;
    }
    // Self recurrsion.
    window.requestAnimationFrame(animation);
  }
  // Start the recurrsion.
  window.requestAnimationFrame(animation);
});
