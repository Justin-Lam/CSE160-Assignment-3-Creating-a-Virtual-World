class Cube {
	constructor() {
		this.color = [1,1,1,1];	// white
		/** -1: debug, 0: color, 1: texture */this.textureType = 1;
		this.matrix = new Matrix4();
	}

	render() {
		const rgba = this.color;

		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
		gl.uniform1i(u_TextureType, this.textureType);
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

		// front
		drawTriangle3DUV([0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0]);
		drawTriangle3DUV([0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1]);

		// back
		drawTriangle3DUV([0,0,1, 1,1,1, 1,0,1], [0,0, 1,1, 1,0]);
		drawTriangle3DUV([0,0,1, 0,1,1, 1,1,1], [0,0, 0,1, 1,1]);

		gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

		// left
		drawTriangle3DUV([0,0,0, 0,1,1, 0,0,1], [0,0, 1,1, 1,0]);
		drawTriangle3DUV([0,0,0, 0,1,0, 0,1,1], [0,0, 0,1, 1,1]);

		// right
		drawTriangle3DUV([1,0,0, 1,1,1, 1,0,1], [0,0, 1,1, 1,0]);
		drawTriangle3DUV([1,0,0, 1,1,0, 1,1,1], [0,0, 0,1, 1,1]);

		gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);

		// top
		drawTriangle3DUV([0,1,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0]);
		drawTriangle3DUV([0,1,0, 0,1,1, 1,1,1], [0,0, 0,1, 1,1]);

		// bottom
		drawTriangle3DUV([0,0,0, 1,0,1, 1,0,0], [0,0, 1,1, 1,0]);
		drawTriangle3DUV([0,0,0, 0,0,1, 1,0,1], [0,0, 0,1, 1,1]);
	}
}

function drawTriangle3D(vertices) {
	const vertexBuffer = gl.createBuffer();
	if (!vertexBuffer) throw new Error("Failed to create the buffer object");

	// Bind buffer obj to target
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	// Write data into buffer obj
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW)

	// Assign buffer obj to a_Position
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

	// Enable the assignment to a_Position
	gl.enableVertexAttribArray(a_Position);

	gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function drawTriangle3DUV(vertices, uv) {
	/*
		Positions
	*/
	const vertexBuffer = gl.createBuffer();
	if (!vertexBuffer) throw new Error("Failed to create vertexBuffer.");

	// Bind buffer obj to target
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	// Write data into buffer obj
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW)

	// Assign buffer obj to a_Position
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

	// Enable the assignment to a_Position
	gl.enableVertexAttribArray(a_Position);

	/*
		UV
	*/
	const uvBuffer = gl.createBuffer();
	if (!uvBuffer) throw new Error("Failed to create uvBuffer.");

	// Bind buffer obj to target
	gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

	// Write data into buffer obj
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW)

	// Assign buffer obj to a_UV
	gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

	// Enable the assignment to a_UV
	gl.enableVertexAttribArray(a_UV);

	/*
		Draw
	*/
	gl.drawArrays(gl.TRIANGLES, 0, 3);
}