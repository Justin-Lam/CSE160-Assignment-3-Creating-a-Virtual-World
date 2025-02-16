const VSHADER_SOURCE = `
	precision mediump float;
	attribute vec4 a_Position;
	attribute vec2 a_UV;
	varying vec2 v_UV;
	uniform mat4 u_ModelMatrix;
	uniform mat4 u_ViewMatrix;
	uniform mat4 u_ProjectionMatrix;

	void main() {
		gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
		v_UV = a_UV;
	}
`;

const FSHADER_SOURCE = `
	precision mediump float;
	varying vec2 v_UV;
	uniform int u_RenderType;
	uniform vec4 u_FragColor;
	uniform sampler2D u_Sampler0;
	uniform sampler2D u_Sampler1;

	void main() {
		if 		(u_RenderType == -1) 	gl_FragColor = vec4(v_UV, 1, 1);				// use UV debug color
		else if (u_RenderType == 0) 	gl_FragColor = u_FragColor;						// use color
		else if (u_RenderType == 1) 	gl_FragColor = texture2D(u_Sampler0, v_UV);		// use TEXTURE0
		else if (u_RenderType == 2) 	gl_FragColor = texture2D(u_Sampler1, v_UV);		// use TEXTURE1
		else 							gl_FragColor = vec4(1, 0.2, 0.2, 1);			// error, make red
	}
`;

let canvas;
let gl;
let camera;

const map = [	// 32x32x4
	//                                            m  m
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],// m
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 4, 3, 4, 3, 4, 0, 4, 3, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],// m
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	/*
		---> x
		|
		V
		z
	*/
];

let a_Position;
let a_UV;
let u_ModelMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;

let u_RenderType;
let u_FragColor;
let u_Sampler0;

function main() {
	getGlobalVars();
	setupWebGL();
	initTextures();

	document.onmousemove = (e) => onMouseMove(e);
	document.onmousedown = (e) => onMouseDown(e);
	document.onkeydown = (e) => onKeydown(e);

	gl.clearColor(0,0,0,1);	// black

	initSky();
	initFloor();
	initWalls();
	initKing();

	requestAnimationFrame(tick);
}

/** Gets this.canvas, this.gl, and this.camera. */
function getGlobalVars() {
	canvas = document.getElementById("webgl");

	gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
	if (!gl) throw new Error("Failed to get the rendering context for WebGL.");
	gl.enable(gl.DEPTH_TEST);

	camera = new Camera();
	const translation = new Vector3([0,1,8]);
	camera.eye.add(translation);
	camera.at.add(translation);
}

/** Compiles shaders and links GLSL ES variables. */
function setupWebGL() {
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) throw new Error("Failed to intialize shaders.");

	a_Position = gl.getAttribLocation(gl.program, "a_Position");
	if (a_Position < 0) throw new Error("Failed to get the storage location of a_Position.");

	a_UV = gl.getAttribLocation(gl.program, "a_UV");
	if (a_UV < 0) throw new Error("Failed to get the storage location of a_UV.");

	u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
	if (!u_ModelMatrix) throw new Error("Failed to get the storage location of u_ModelMatrix.");
	gl.uniformMatrix4fv(u_ModelMatrix, false, new Matrix4().elements);	// identity matrix

	u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
	if (!u_ViewMatrix) throw new Error("Failed to get the storage location of u_ViewMatrix.");

	u_ProjectionMatrix = gl.getUniformLocation(gl.program, "u_ProjectionMatrix");
	if (!u_ProjectionMatrix) throw new Error("Failed to get the storage location of u_ProjectionMatrix.");

	u_RenderType = gl.getUniformLocation(gl.program, "u_RenderType");
	if (!u_RenderType) throw new Error("Failed to get the storage location of u_RenderType.");

	u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
	if (!u_FragColor) throw new Error("Failed to get the storage location of u_FragColor.");

	u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
	if (!u_Sampler0) throw new Error("Failed to get the storage location of u_Sampler0.");

	u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler1");
	if (!u_Sampler1) throw new Error("Failed to get the storage location of u_Sampler1.");
}

function initTextures() {
	const image0 = new Image();
	if (!image0) throw new Error("Failed to create the image object.");
	image0.onload = () => sendToTexture0(image0);
	image0.src = "assets/gigaGrass.jpg";

	const image1 = new Image();
	if (!image1) throw new Error("Failed to create the image object.");
	image1.onload = () => sendToTexture1(image1);
	image1.src = "assets/stone.jpg";
}

function sendToTexture0(image) {
	const texture = gl.createTexture();
	if (!texture) throw new Error("Failed to create the texture object.");

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);									// Flip the image's y axis
	gl.activeTexture(gl.TEXTURE0);												// Enable texture0
	gl.bindTexture(gl.TEXTURE_2D, texture);										// Bind the texture object to the target
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);			// Set the texture parameters
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);	// Set the texture image
	gl.uniform1i(u_Sampler0, 0);												// Set the texture0 to the sampler
}

function sendToTexture1(image) {
	const texture = gl.createTexture();
	if (!texture) throw new Error("Failed to create the texture object.");

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);									// Flip the image's y axis
	gl.activeTexture(gl.TEXTURE1);												// Enable texture1
	gl.bindTexture(gl.TEXTURE_2D, texture);										// Bind the texture object to the target
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);			// Set the texture parameters
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);	// Set the texture image
	gl.uniform1i(u_Sampler1, 1);												// Set the texture1 to the sampler
}

let prevCursorX;
function onMouseMove(e) {
	const x = e.clientX;

	if (!prevCursorX) prevCursorX = x;

	const dx = x - prevCursorX;
	camera.pan(dx);

	prevCursorX = x;
}

function onMouseDown(e) {
	const [x, y, z] = cameraToWorldCoords(camera.at.elements);

	if (z < 0 || z > map.length-1 || x < 0 || x > map[0].length-1) return;	// if there were a block, it'd be off the map so there can't be a block

	if (e.buttons === 1 && map[z][x] > 0) map[z][x]--;	// left click - remove block from stack (only if stack has blocks)
	else if (e.buttons === 2) map[z][x]++;				// right click - add block to stack
}

function cameraToWorldCoords(position) {
	const [x, y, z] = position;
	return [Math.floor(x+16), y, Math.floor(z+16)];
}

function onKeydown(e) {
	if (e.key === 'w') camera.moveForward();
	else if (e.key === 's') camera.moveBackward();
	else if (e.key === 'a') camera.moveLeft();
	else if (e.key === 'd') camera.moveRight();
	else if (e.key === 'q') camera.panLeft();
	else if (e.key === 'e') camera.panRight();
	render();
}

let sky;
function initSky() {
	const skyBlue = [135/255, 206/255, 235/255, 1];
	sky = new Cube(0, skyBlue);
	sky.modelMatrix.setIdentity();
	sky.modelMatrix.scale(64, 64, 64);
	sky.modelMatrix.translate(-0.5, -0.5, -0.5);
}

let floor;
function initFloor() {
	floor = new Cube(1);
	floor.modelMatrix.setIdentity();
	floor.modelMatrix.scale(32, 0, 32);	// scale y to 0 makes a plane
	floor.modelMatrix.translate(-0.5, -0.5, -0.5);
}

const walls = [];
function initWalls() {
	/*
		Use a single cube to draw all the triangles
		Once you draw the triangles, they stay
		So we can then move the cube and draw more
	*/
	for (let y = 0; y < map.length; y++) {
	for (let x = 0; x < map[0].length; x++) {
		const wallHeight = map[y][x];
		for (h = 0; h < wallHeight; h++) {
			const wall = new Cube(2);
			wall.modelMatrix.setIdentity();
			wall.modelMatrix.translate(x-16, h, y-16);
			walls.push(wall);
		}
	}
	}
}

let king;
function initKing() {
	const modelMatrix = new Matrix4();
	modelMatrix.translate(-1, 0, 2);
	king = new King(modelMatrix);
}

function tick() {
	render();
	updateFPSCounter();
	requestAnimationFrame(tick);
}

/** Renders the sky, floor, and map. */
function render() {
	gl.uniformMatrix4fv(u_ViewMatrix, false, camera.viewMatrix.elements);
	gl.uniformMatrix4fv(u_ProjectionMatrix, false, camera.projectionMatrix.elements);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	sky.render();
	floor.render();
	for (const wall of walls) wall.render();
	king.render();
}

let start = performance.now();
const fpsCounter = document.getElementById("fpsCounter");
function updateFPSCounter() {
	const ms = performance.now() - start;	// time in-between this frame and the last
	const fps = Math.floor(1000/ms);
	fpsCounter.innerHTML = `ms: ${ms}, fps: ${fps}`;
	start = performance.now();
}