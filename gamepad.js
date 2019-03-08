var haveEvents = 'GamepadEvent' in window;
var haveWebkitEvents = 'WebKitGamepadEvent' in window;
var controllers = {};
var buttons = [];

// var rAF = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.requestAnimationFrame;
var rAF = window.requestAnimationFrame;

function connecthandler(e) {
  addgamepad(e.gamepad);
}

function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad;
  buttons[gamepad.index] = [];

  if(gamepad.buttons.length > 2 && buttons[gamepad.index].length < gamepad.buttons.length ){

    for(var j=0; j<gamepad.buttons.length; j++){
      buttons[gamepad.index].push(gamepad.buttons[j].pressed);
    }
  }
  console.log(buttons);

  rAF(updateStatus);
}

function disconnecthandler(e) {
  removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
  delete controllers[gamepad.index];
}

function updateStatus() {

  scangamepads();

  for (var j in controllers) {
    var controller = controllers[j];
    
    for (var i=0; i<controller.buttons.length; i++) {
      
      var val = controller.buttons[i];
      var pressed = false;
      
      if (typeof(val) == "object") {
        pressed = val.pressed;
        val = val.value;

        if(buttons[j][i] !== pressed){
          console.log("Button " + i + " change status: " + pressed);
          buttons[j][i] = pressed;

          // Fire event only for the button 0
          if(i === 0){
            var event = new CustomEvent('keypress', {detail: {
              buttonPress: pressed,
            }});
            window.dispatchEvent(event);
          }
        }
      }
    }
  }

  rAF(updateStatus);
}

function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      
      if (!(gamepads[i].index in controllers)) {        
        addgamepad(gamepads[i]);
      } else {
        controllers[gamepads[i].index] = gamepads[i];
      }
    }
  }
}

if (haveEvents) {
  window.addEventListener("gamepadconnected", connecthandler);
  window.addEventListener("gamepaddisconnected", disconnecthandler);
} else if (haveWebkitEvents) {
  window.addEventListener("webkitgamepadconnected", connecthandler);
  window.addEventListener("webkitgamepaddisconnected", disconnecthandler);
} else {
  setInterval(scangamepads, 500);
}