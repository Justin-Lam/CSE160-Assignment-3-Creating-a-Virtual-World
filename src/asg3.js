const VSHADER_SOURCE = `
	precision mediump float;
	attribute vec4 a_Position;
	attribute vec2 a_UV;
	varying vec2 v_UV;
	uniform mat4 u_ModelMatrix;
	uniform mat4 u_GlobalRotationMatrix;
	void main() {
		gl_Position = u_GlobalRotationMatrix * u_ModelMatrix * a_Position;
		v_UV = a_UV;
	}
`;
const FSHADER_SOURCE = `
	precision mediump float;
	varying vec2 v_UV;
	uniform vec4 u_FragColor;
	uniform sampler2D u_Sampler0;
	void main() {
		gl_FragColor = u_FragColor;
		gl_FragColor = vec4(v_UV, 1, 1);
		gl_FragColor = texture2D(u_Sampler0, v_UV);
	}
`;

let canvas;
let gl;

let a_Position;
let a_UV;
let u_ModelMatrix;
let u_FragColor;
let u_Sampler0;
let u_GlobalRotationMatrix;

function getCanvasAndContext() {
	canvas = document.getElementById("webgl");
	gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
	if (!gl) throw new Error("Failed to get the rendering context for WebGL.");
	gl.enable(gl.DEPTH_TEST);
}

function compileShadersAndConnectVariables() {
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) throw new Error("Failed to intialize shaders.");

	const identityMatrix = new Matrix4();

	a_Position = gl.getAttribLocation(gl.program, "a_Position");
	if (a_Position < 0) throw new Error("Failed to get the storage location of a_Position.");

	a_UV = gl.getAttribLocation(gl.program, "a_UV");
	if (a_UV < 0) throw new Error("Failed to get the storage location of a_UV.");

	u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
	if (!u_ModelMatrix) throw new Error("Failed to get the storage location of u_ModelMatrix.");
	gl.uniformMatrix4fv(u_ModelMatrix, false, identityMatrix.elements);

	u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
	if (!u_FragColor) throw new Error("Failed to get the storage location of u_FragColor.");

	u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
	if (!u_Sampler0) throw new Error("Failed to get the storage location of u_Sampler0.");

	u_GlobalRotationMatrix = gl.getUniformLocation(gl.program, "u_GlobalRotationMatrix");
	if (!u_GlobalRotationMatrix) throw new Error("Failed to get the storage location of u_GlobalRotationMatrix.");
	gl.uniformMatrix4fv(u_GlobalRotationMatrix, false, identityMatrix.elements);
}

function initTextures() {
	const image = new Image();
	if (!image) throw new Error("Failed to create the image object.");
	image.onload = () => sendTextureToGLSL(image);
	image.src = "../assets/sky.jpg";
}

function sendTextureToGLSL(image) {
	const texture = gl.createTexture();
	if (!texture) throw new Error("Failed to create the texture object.");

	// Flip the image's y axis
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

	// Enable texture unit0
	gl.activeTexture(gl.TEXTURE0);

	// Bind the texture object to the target
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Set the texture parameters
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

	// Set the texture image
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

	// Set the texture unit0 to the sampler
	gl.uniform1i(u_Sampler, 0);

	console.log("finished loading texture");
}


let g_globalRotation_y = 0;	// y axis
let g_globalRotation_x = 0;	// x axis
let g_headRotation = 0;
let g_headScale = 1;
let g_animation_enabled_head = false;
let g_tongueBaseRotation = 0;
let g_animation_enabled_tongueBase = false;
let g_tongueTipRotation = 0;
let g_animation_enabled_tongueTip = false;
let g_leg_front_leftRotation = 0;
let g_leg_front_rightRotation = 0;
let g_leg_back_leftRotation = 0;
let g_leg_back_rightRotation = 0;
let g_animation_enabled_legs = false;
let g_interactiveAnimationPlaying = false;

function createUIEvents() {
	document.getElementById("globalRotationSlider_y").addEventListener("mousemove", function() {
		g_globalRotation_y = this.value;
		renderAllShapes();
	});
	document.getElementById("globalRotationSlider_x").addEventListener("mousemove", function() {
		g_globalRotation_x = this.value;
		renderAllShapes();
	});

	document.getElementById("headRotationSlider").addEventListener("mousemove", function() {
		g_headRotation = this.value;
		renderAllShapes();
	});
	document.getElementById("toggleAnimationButton_Head").onclick = () => g_animation_enabled_head = !g_animation_enabled_head;
	document.getElementById("tongueBaseRotationSlider").addEventListener("mousemove", function() {
		g_tongueBaseRotation = this.value;
		renderAllShapes();
	});
	document.getElementById("toggleAnimationButton_TongueBase").onclick = () => g_animation_enabled_tongueBase = !g_animation_enabled_tongueBase;
	document.getElementById("tongueTipRotationSlider").addEventListener("mousemove", function() {
		g_tongueTipRotation = this.value;
		renderAllShapes();
	});
	document.getElementById("toggleAnimationButton_TongueTip").onclick = () => g_animation_enabled_tongueTip = !g_animation_enabled_tongueTip;

	document.getElementById("leg_front_leftRotationSlider").addEventListener("mousemove", function() {
		g_leg_front_leftRotation = this.value;
		renderAllShapes();
	});
	document.getElementById("leg_front_rightRotationSlider").addEventListener("mousemove", function() {
		g_leg_front_rightRotation = this.value;
		renderAllShapes();
	});
	document.getElementById("leg_back_leftRotationSlider").addEventListener("mousemove", function() {
		g_leg_back_leftRotation = this.value;
		renderAllShapes();
	});
	document.getElementById("leg_back_rightRotationSlider").addEventListener("mousemove", function() {
		g_leg_back_rightRotation = this.value;
		renderAllShapes();
	});
	document.getElementById("toggleAnimationButton_Legs").onclick = () => g_animation_enabled_legs = !g_animation_enabled_legs;
}

function main() {
	getCanvasAndContext();
	compileShadersAndConnectVariables();
	initTextures();
	createUIEvents();
	canvas.onmousemove = function(e) { if (e.buttons === 1) { rotateCamera(e) } };
	canvas.onmousedown = function(e) {
		if (e.shiftKey) {
			g_interactiveAnimationStartTime = g_elapsedTime;
			g_interactiveAnimationPlaying = true;
		}
	};
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	requestAnimationFrame(tick);
}


function rotateCamera(e) {
	const [x, y] = eCoordsToGL(e);
	g_globalRotation_y = 180 * x;
	g_globalRotation_x = 180 * y;
}
function eCoordsToGL(e) {
	let x = e.clientX;
	let y = e.clientY;
	const rect = e.target.getBoundingClientRect();
	x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
	y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
	return [x, y];
}

const g_startTime = currentTime();
let g_elapsedTime = 0;
const g_interactiveAnimationDuration = 1;
let g_interactiveAnimationStartTime = 0;
function currentTime() {
	return performance.now() / 1000.0;
}
function tick() {
	g_elapsedTime = currentTime() - g_startTime;

	if (g_interactiveAnimationPlaying) {
		updateInteractiveAnimation();
	}
	else {
		updateAnimationAngles();
	}

	renderAllShapes();
	requestAnimationFrame(tick);
}

function updateInteractiveAnimation() {
	g_headScale += 0.01;
	const counter = g_elapsedTime - g_interactiveAnimationStartTime;
	if (counter >= g_interactiveAnimationDuration) {
		g_headScale = 1;
		g_interactiveAnimationPlaying = false;
	}
}

function updateAnimationAngles() {
	if (g_animation_enabled_head) {
		g_headRotation = 45 * Math.sin(g_elapsedTime);
	}
	if (g_animation_enabled_tongueBase) {
		g_tongueBaseRotation = 15 * Math.sin(g_elapsedTime * 20);
	}
	if (g_animation_enabled_tongueTip) {
		g_tongueTipRotation = 30 * Math.sin(g_elapsedTime * 20);
	}
	if (g_animation_enabled_legs) {
		g_leg_front_leftRotation = 45 * Math.sin(g_elapsedTime * 4);
		g_leg_back_leftRotation = 45 * Math.sin(g_elapsedTime * 4);
		g_leg_front_rightRotation = 45 * Math.sin(g_elapsedTime * 4 + Math.PI);
		g_leg_back_rightRotation = 45 * Math.sin(g_elapsedTime * 4 + Math.PI);
	}
}

const fpsCounter = document.getElementById("fpsCounter");
function renderAllShapes() {
	const startTime = performance.now();

	const globalRotationMatrix = new Matrix4();
	globalRotationMatrix.rotate(g_globalRotation_x, 1, 0, 0);
	globalRotationMatrix.rotate(-g_globalRotation_y, 0, 1, 0);
	gl.uniformMatrix4fv(u_GlobalRotationMatrix, false, globalRotationMatrix.elements);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	const body = new Cube();
	body.color = [1, 0, 0.8, 1];	// pink
	body.matrix.translate(-0.25, -0.25, 0);
	body.matrix.scale(0.5, 0.5, 1);
	body.render();

	const leg_front_left = new Cube();
	leg_front_left.color = [1, 0.2, 0.8, 1];	// other pink
	leg_front_left.matrix.translate(0.15, -0.2, 0.2);
	leg_front_left.matrix.rotate(-g_leg_front_leftRotation, 1, 0, 0);
	leg_front_left.matrix.scale(0.2, 0.3, 0.2);
	leg_front_left.matrix.translate(-0.5, -1, -0.5);
	leg_front_left.render();

	const leg_front_right = new Cube();
	leg_front_right.color = [1, 0.2, 0.8, 1];	// other pink
	leg_front_right.matrix.translate(-0.15, -0.2, 0.2);
	leg_front_right.matrix.rotate(-g_leg_front_rightRotation, 1, 0, 0);
	leg_front_right.matrix.scale(0.2, 0.3, 0.2);
	leg_front_right.matrix.translate(-0.5, -1, -0.5);
	leg_front_right.render();

	const leg_back_left = new Cube();
	leg_back_left.color = [1, 0.2, 0.8, 1];	// other pink
	leg_back_left.matrix.translate(0.15, -0.2, 0.95);
	leg_back_left.matrix.rotate(-g_leg_back_leftRotation, 1, 0, 0);
	leg_back_left.matrix.scale(0.2, 0.3, 0.2);
	leg_back_left.matrix.translate(-0.5, -1, -0.5);
	leg_back_left.render();

	const leg_back_right = new Cube();
	leg_back_right.color = [1, 0.2, 0.8, 1];	// other pink
	leg_back_right.matrix.translate(-0.15, -0.2, 0.95);
	leg_back_right.matrix.rotate(-g_leg_back_rightRotation, 1, 0, 0);
	leg_back_right.matrix.scale(0.2, 0.3, 0.2);
	leg_back_right.matrix.translate(-0.5, -1, -0.5);
	leg_back_right.render();

	const head = new Cube();
	head.color = [1, 0.2, 0.8, 1];	// other pink
	head.matrix.translate(0, 0.15, -0.3);
	head.matrix.rotate(g_headRotation, 0, 0, 1);
	head.matrix.scale(g_headScale, g_headScale, g_headScale);
	const headCoordsMatrix = new Matrix4(head.matrix);
	head.matrix.scale(0.4, 0.4, 0.4);
	head.matrix.translate(-0.5, -0.5, 0);
	head.render();

	const eye_left = new Cube();
	eye_left.color = [0, 0, 0, 1];	// black
	eye_left.matrix = new Matrix4(headCoordsMatrix);
	eye_left.matrix.translate(0.05, 0, -0.025);
	eye_left.matrix.scale(0.1, 0.1, 0.1);
	eye_left.render();

	const eye_right = new Cube();
	eye_right.color = [0, 0, 0, 1];	// black
	eye_right.matrix = new Matrix4(headCoordsMatrix);
	eye_right.matrix.translate(-0.15, 0, -0.025);
	eye_right.matrix.scale(0.1, 0.1, 0.1);
	eye_right.render();

	const tongue_base = new Cube();
	tongue_base.color = [1, 0, 0, 1];	// red
	tongue_base.matrix = new Matrix4(headCoordsMatrix);
	tongue_base.matrix.translate(0, -0.15, 0.025);
	tongue_base.matrix.rotate(g_tongueBaseRotation, 1, 0, 0);
	tongue_base.matrix.rotate(60, 1, 0, 0);
	const tongueBaseCoordsMatrix = new Matrix4(tongue_base.matrix);
	tongue_base.matrix.scale(0.2, 0.1, 0.05);
	tongue_base.matrix.translate(-0.5, -1, -0.5);
	tongue_base.render();

	const tongue_tip = new Cube();
	tongue_tip.color = [1, 0, 0, 1];	// red
	tongue_tip.matrix = new Matrix4(tongueBaseCoordsMatrix);
	tongue_tip.matrix.translate(0, -0.1, 0);
	tongue_tip.matrix.rotate(g_tongueTipRotation, 1, 0, 0);
	tongue_tip.matrix.scale(0.2, 0.1, 0.05);
	tongue_tip.matrix.translate(-0.5, -1, -0.5);
	tongue_tip.render();

	const duration = performance.now() - startTime;
	fpsCounter.innerHTML = `ms: ${duration}, fps: ${Math.floor(1000 / duration)}`;	// got this formula for fps from ChatGPT
}