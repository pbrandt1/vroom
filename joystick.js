const events = require('events')
const raw_joystick = new (require('joystick'))(0, 3500, 350)

// Axis definitions
var MAX = [30000, 30000];
var MIN = [-30000, -30000];
var PITCH = 1;
var ROLL = 0;
var HAT_X = 3;
var HAT_Y = 4;

// button definitions
var BUTTON = ['trigger', 'panic', '', 'cruise.toggle']

class Joystick extends events {}

/**
 * Singleton
 */
const joystick = new Joystick();

console.log('yo! move your joystick around to calibrate it!')

raw_joystick.on('button', (data) => {
  // instantaneous buttons, doesn't matter if you press and hold, just when you press
  if (BUTTON[data.number] && data.value == 1) {
    joystick.emit(BUTTON[data.number])
  }
})

raw_joystick.on('axis', (data) => {
  const val = data.value;
  const axis = data.number;

  if (val >= MAX[axis]) MAX[axis] = val
  if (val <= MIN[axis]) MIN[axis] = val

  var relative_val = 20 * val / (MAX[axis] - MIN[axis])

  if (axis == PITCH && val >= 0) {
    joystick.emit('brake', relative_val)
  }

  // could emit both throttle = 0 and brake = 0 at same time
  if (axis == PITCH && relative_val <= 0) {
    joystick.emit('throttle', -1 * relative_val)
  }

  // leaving this as "steer" will probably want to have the steer actually be
  // some sort of acceleration factor, because obviously commanding instantaneous
  // angles is not possible
  if (axis == ROLL) {
    joystick.emit('steer', relative_val)
  }

  if (axis == HAT_Y && val < 0) {
    joystick.emit('cruise.up', 1)
  } else if (axis == HAT_Y && val > 0) {
    joystick.emit('cruise.down', 1)
  }
})

module.exports = joystick;
