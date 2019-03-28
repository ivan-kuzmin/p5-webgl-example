// определяем, поддерживается ли pointerLock
var havePointerLock = 'pointerLockElement' in document ||
		'mozPointerLockElement' in document ||
		'webkitPointerLockElement' in document;

// Элемент, для которого будем включать pointerLock
var requestedElement = document.getElementById('container');

// Танцы с префиксами для методов включения/выключения pointerLock
requestedElement.requestPointerLock = requestedElement.requestPointerLock || requestedElement.mozRequestPointerLock || requestedElement.webkitRequestPointerLock;
document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;

var isLocked = function(){
	return requestedElement === document.pointerLockElement || requestedElement === document.mozPointerLockElement || requestedElement === document.webkitPointerLockElement;
}

requestedElement.addEventListener('click', function(){
	if(!isLocked()){
		requestedElement.requestPointerLock();
	} else {
		// document.exitPointerLock();
	}
}, false);

var changeCallback = function() {
	if(!havePointerLock){
		alert('Ваш браузер не поддерживает pointer-lock');
		return;
	}
	if (isLocked()) {
		document.addEventListener("mousemove", moveCallback, false);
		document.body.classList.add('locked');
	} else {
		document.removeEventListener("mousemove", moveCallback, false);
		document.body.classList.remove('locked');
	}
}

document.addEventListener('pointerlockchange', changeCallback, false);
document.addEventListener('mozpointerlockchange', changeCallback, false);
document.addEventListener('webkitpointerlockchange', changeCallback, false);

var moveCallback = function(e) {
	x = e.movementX ||
					e.mozMovementX ||
					e.webkitMovementX ||
					0;
	camHorAngle -= x*camSpeed

	y = e.movementY ||
					e.mozMovementY ||
					e.webkitMovementY ||
					0;
	if (camVerAngle < 180 + y*2*camSpeed && camVerAngle > y*2*camSpeed) {
		camVerAngle -= y*camSpeed
	}

	bgPos = window.getComputedStyle(requestedElement)
					.getPropertyValue('background-position')
					.split(' ')
					.map(function(v){
						return parseInt(v,10);
					});

	requestedElement.style.backgroundPosition = (bgPos[0] - x) + 'px ' + (bgPos[1] - y) + 'px';
}




let moveSpeed = 3
let moveHeight = 45
let currentHeight = moveHeight
// let jumpHeight = 25
let jump = false
let jumpSpeed = 17.5
let startJump

let boxSize = 30
let fly = 1
let cloudAngle = 0

let floor
let floorSize = 10
let floorHalfWidth = 10
let floorHalfHeight = 10

let wall
let wallSize = 100
let wallHalfWidth = 10
let wallHalfHeight = 4

let camHorAngle = 0
let camVerAngle = 90
let camSpeed = 0.1

let camX = -floorHalfHeight*floorSize
let camZ = 0

function preload() {
  floor = loadImage('floor.jpg');
	wall = loadImage('wood.jpg');
	stone = loadImage('wall.jpg')
	stone1 = loadImage('parket1.jpg')
	stone2 = loadImage('stone.jpg')
	cloud = loadImage('cloud.png')
	sun = loadImage('sun2.png')
	asphalt = loadImage('asphalt1.jpg')
	bricks = loadImage('bricks2.jpg')
	// home = loadModel('cottage_obj.obj');
}

function setup(){
	var myCanvas = createCanvas(windowWidth, windowHeight, WEBGL);
  myCanvas.parent("container");
	myCanvas.style('position', 'relative')
	gun = createImg('gun.png')
	gun.id('gun')
	aim = createImg('aim.png')
	aim.id('aim')
}

function keyPressed() {
  if (keyCode === 32 && !jump) { // SPACE
		startJump = frameCount
		jump = true
		return false;
  }
}

function draw() {
  background(167, 239, 255);
	angleMode(DEGREES);
	ambientLight(255);
  // directionalLight(255, 255, 255, 150, 400, 0);
  // pointLight(255, 255, 255, 50, 350, 250);

	push()
	texture(sun)
	translate(0, 2000, 0)
	rotateX(90)
	plane(300, 300)
	pop()

	push()
	texture(cloud)
	rotateY(cloudAngle)
	translate(0, 1000, 2000)
	rotateX(180)
	plane(1000, 1000)
	pop()

	push()
	texture(cloud)
	rotateY(cloudAngle)
	translate(0, 600, -2000)
	rotateX(180)
	plane(1000, 1000)
	pop()

	push()
	texture(cloud)
	rotateY(cloudAngle)
	translate(2000, 1000, 0)
	rotateX(180)
	rotateY(90)
	plane(1000, 1000)
	pop()

	push()
	texture(cloud)
	rotateY(cloudAngle)
	translate(-2000, 800, 0)
	rotateX(180)
	rotateY(90)
	plane(1000, 1000)
	pop()
	cloudAngle += 0.02

	if (keyIsDown(87)) { // W
		camZ += (keyIsDown(65) || keyIsDown(68) ? 1 : 1.4) * moveSpeed*sin(camHorAngle);
		camX += (keyIsDown(65) || keyIsDown(68) ? 1 : 1.4) * moveSpeed*cos(camHorAngle);
	}
	if (keyIsDown(83)) { // S
		camZ -= (keyIsDown(65) || keyIsDown(68) ? 1 : 1.4) * moveSpeed*sin(camHorAngle);
		camX -= (keyIsDown(65) || keyIsDown(68) ? 1 : 1.4) * moveSpeed*cos(camHorAngle);
	}
	if (keyIsDown(65)) { // A
		camZ += (keyIsDown(87) || keyIsDown(83) ? 1 : 1.4) * moveSpeed*sin(camHorAngle+90);
		camX += (keyIsDown(87) || keyIsDown(83) ? 1 : 1.4) * moveSpeed*cos(camHorAngle+90);
	}
	if (keyIsDown(68)) { // D
		camZ -= (keyIsDown(87) || keyIsDown(83) ? 1 : 1.4) * moveSpeed*sin(camHorAngle+90);
		camX -= (keyIsDown(87) || keyIsDown(83) ? 1 : 1.4) * moveSpeed*cos(camHorAngle+90);
	}

	if (jump) {
		let timeJump = frameCount-startJump
		let currentHeightDelta = currentHeight + jumpSpeed*timeJump/20 - 20*sq(timeJump/20)
		if (currentHeightDelta >= moveHeight) {
			currentHeight = currentHeightDelta
		} else {
			currentHeight = moveHeight
			jump = false
		}
	}
	// if (jump) {
	// 	let currentHeightDelta = currentHeight + jumpSpeed
	// 	if (currentHeightDelta <= jumpHeight) {
	// 		if (currentHeightDelta >= moveHeight) {
	// 			currentHeight = currentHeightDelta
	// 		} else {
	// 			jumpSpeed *= -1
	// 			jump = false
	// 		}
	// 	} else {
	// 		jumpSpeed *= -1
	// 	}
	// }

	var fov = 60;
	var cameraZ = height / 2.0 / tan(fov / 2.0);
	perspective(60, width / height, cameraZ * 0.01, cameraZ * 30);
	camera(camX, currentHeight, camZ, camX+sin(camVerAngle)*cos(camHorAngle), currentHeight-cos(camVerAngle), camZ+sin(camVerAngle)*sin(camHorAngle), 0, -1, 0)
  for (var i = -1; i < 2; i++) {
    for (var j = -2; j < 3; j++) {
      push();
      translate(i * boxSize*1.5, boxSize/2 + fly, j * boxSize*1.5);
			switch (i) {
				case -1:
					// fill(color(255,0,0))
					texture(stone)
					break;
				case 0:
					// fill(color(0,255,0))
					texture(stone1)
					break;
				default:
					// fill(color(0,0,255))
					texture(stone2)
			}
      box(boxSize);
      pop();
    }
  }

	push()
	translate(0, 50, 2*floorHalfWidth*floorSize)
	texture(wall)
	// rotateX(90)
	plane(4*floorHalfWidth*floorSize, 100)
	pop()

	push()
	translate(0, 50, -2*floorHalfWidth*floorSize)
	texture(wall)
	plane(4*floorHalfWidth*floorSize, 100)
	pop()

	push()
	translate(2*floorHalfHeight*floorSize, 50, 0)
	texture(wall)
	rotateY(90)
	plane(4*floorHalfHeight*floorSize, 100)
	pop()

	push()
	translate(-2*floorHalfHeight*floorSize, 50, 0)
	texture(wall)
	rotateY(90)
	plane(-4*floorHalfHeight*floorSize, 100)
	pop()

	push()
	translate(0, 0, 0)
	rotateX(90)
	// noStroke()
	// fill(255,0,255)
	texture(floor)
	plane(4*floorHalfWidth*floorSize, 4*floorHalfHeight*floorSize)
	pop()

	push()
	translate(0, -1, 0)
	rotateX(90)
	// noStroke()
	// fill(255,0,255)
	texture(asphalt)
	plane(1000, 1000)
	pop()

	push()
	translate(0, 24, 500)
	texture(bricks)
	// rotateX(90)
	plane(1000, 50)
	pop()

	push()
	translate(0, 24, -500)
	texture(bricks)
	plane(1000, 50)
	pop()

	push()
	translate(500, 24, 0)
	texture(bricks)
	rotateY(90)
	plane(1000, 50)
	pop()

	push()
	translate(-500, 24, 0)
	texture(bricks)
	rotateY(90)
	plane(-1000, 50)
	pop()

	// push()
	// translate(0, 40, 0)
	// // fill(255)
	// texture(wall)
	// strokeWeight(0.1)
	// model(home)
	// pop()

	// translate(300, 40, 300)
	// fill(255)
	// texture(wall)
	// strokeWeight(0.1)
	// model(tree)

	// for (let i = -floorHalfWidth; i < floorHalfWidth; i++) {
	// 	for (let j = -floorHalfHeight; j < floorHalfHeight; j++) {
	// 		push()
	// 		translate(floorSize*j, boxSize/2 + 1, floorSize*i)
	// 		rotateX(90)
	// 		// noStroke()
	// 		// fill(255,0,255)
	// 		texture(floor)
	// 		plane(floorSize)
	// 		pop()
	// 	}
	// }

	// for (let layer = -wallHalfHeight; layer < 2; layer++) {
	// 	let y = layer*wallSize/2 + 1
	// 	for (let i = -floorHalfHeight; i < floorHalfHeight; i++) {
	// 		push()
	// 		translate(floorSize/2*floorHalfHeight*2-wallSize/2, y, wallSize*i)
	// 		noStroke()
	// 		rotateY(90)
	// 		// fill(255,255,0)
	// 		rotateZ(90)
	// 		texture(wall)
	// 		plane(wallSize)
	// 		pop()
	//
	// 		push()
	// 		translate(-floorSize/2*floorHalfHeight*2-wallSize/2, y, wallSize*i)
	// 		noStroke()
	// 		rotateY(90)
	// 		// fill(255,255,0)
	// 		rotateZ(90)
	// 		texture(wall)
	// 		plane(wallSize)
	// 		pop()
	// 	}
	//
	// 	for (let j = -floorHalfHeight; j < floorHalfHeight; j++) {
	// 		push()
	// 		translate(wallSize*j, y, floorSize/2*floorHalfWidth*2-wallSize/2)
	// 		noStroke()
	// 		// fill(255,255,0)
	// 		rotateZ(90)
	// 		texture(wall)
	// 		plane(wallSize)
	// 		pop()
	//
	// 		push()
	// 		translate(wallSize*j, y, -floorSize/2*floorHalfWidth*2-wallSize/2)
	// 		noStroke()
	// 		// fill(255,255,0)
	// 		rotateZ(90)
	// 		texture(wall)
	// 		plane(wallSize)
	// 		pop()
	// 	}
	// }

	if (frameCount % 100 === 0) {
		console.log(frameRate())
	}
}
