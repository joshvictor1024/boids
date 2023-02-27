const option = {
  findTarget: {
    separation: {
      active: true,
      weightBoid: 0.05,
      weightObstacle: 3
    },
    alignment: {
      active: true,
      weight: 0.5
    },
    cohesion: {
      active: true,
      weight: 0.75
    }
  },
  boid: {
    radius: 0.1, // In meters.
    speed: 2, // In meters per second.
    maxAcceleration: 1.5, // In meters per second squared.
    rotationSpeed: 3, // In radians per second.
    visionAngle: Math.PI * 1.7, // In radians.
    visionRadius: 1 // In meters.
  },
  simulation: {
    paused: false,
    speed: 1
  }
};
const optionUI = {
  findTarget: {
    title: 'Algorithm',
    items: {
      separationActive: {
        type: 'toggle',
        title: 'Separation Active',
        get: () => option.findTarget.separation.active,
        set: (v) => (option.findTarget.separation.active = v)
      },
      separationWeight: {
        type: 'slider',
        title: 'Separation Weight',
        min: 0,
        max: 0.1,
        step: 0.002,
        get: () => option.findTarget.separation.weightBoid,
        set: (v) => (option.findTarget.separation.weightBoid = v)
      },
      alignmentActive: {
        type: 'toggle',
        title: 'Alignment Active',
        get: () => option.findTarget.alignment.active,
        set: (v) => (option.findTarget.alignment.active = v)
      },
      alignmentWeight: {
        type: 'slider',
        title: 'Alignment Weight',
        min: 0,
        max: 1,
        step: 0.02,
        get: () => option.findTarget.alignment.weight,
        set: (v) => (option.findTarget.alignment.weight = v)
      },
      cohesionActive: {
        type: 'toggle',
        title: 'Cohesion Active',
        get: () => option.findTarget.cohesion.active,
        set: (v) => (option.findTarget.cohesion.active = v)
      },
      cohesionWeight: {
        type: 'slider',
        title: 'Cohesion Weight',
        min: 0,
        max: 1.5,
        step: 0.01,
        get: () => option.findTarget.cohesion.weight,
        set: (v) => (option.findTarget.cohesion.weight = v)
      }
    }
  },
  boid: {
    title: 'Boid',
    items: {
      speed: {
        type: 'slider',
        title: 'Speed',
        min: 0.5,
        max: 3.5,
        step: 0.1,
        get: () => option.boid.speed,
        set: (v) => (option.boid.speed = v)
      },
      acceleration: {
        type: 'slider',
        title: 'Linear Acceleration',
        min: 0.5,
        max: 2.5,
        step: 0.1,
        get: () => option.boid.maxAcceleration,
        set: (v) => (option.boid.maxAcceleration = v)
      },
      rotationSpeed: {
        type: 'slider',
        title: 'Rotation Speed',
        min: 1,
        max: 5,
        step: 0.2,
        get: () => option.boid.rotationSpeed,
        set: (v) => (option.boid.rotationSpeed = v)
      },
      visionAngle: {
        type: 'slider',
        title: 'Vision Angle',
        min: Math.PI * 1.4,
        max: Math.PI * 2,
        step: Math.PI * 0.05,
        get: () => option.boid.visionAngle,
        set: (v) => (option.boid.visionAngle = v)
      },
      visionRadius: {
        type: 'slider',
        title: 'Vision Radius',
        min: 0.6,
        max: 1.4,
        step: 0.1,
        get: () => option.boid.visionRadius,
        set: (v) => (option.boid.visionRadius = v)
      }
    }
  },
  simulation: {
    title: 'Simulation',
    items: {
      paused: {
        type: 'toggle',
        title: 'Paused',
        get: () => option.simulation.paused,
        set: (v) => (option.simulation.paused = v)
      },
      speed: {
        type: 'slider',
        title: 'Speed',
        min: 0.1,
        max: 1,
        step: 0.1,
        get: () => option.simulation.speed,
        set: (v) => (option.simulation.speed = v)
      }
    }
  }
};
