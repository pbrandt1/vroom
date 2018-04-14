var joystick = require('./joystick')

var events = ['steer', 'throttle', 'brake', 'panic', 'cruise.toggle', 'cruise.up', 'cruise.down']

events.map(e => joystick.on(e, x => console.log(e, x)))

