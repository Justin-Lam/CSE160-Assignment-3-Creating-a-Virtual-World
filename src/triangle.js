let vertexBuffer = null;
function initVertexBuffer() {
	vertexBuffer = gl.createBuffer();
	if (!vertexBuffer) throw new Error("Failed to create vertexBuffer.");

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(a_Position);
}

/** @param {Float32Array} vertexCoords */
function drawTriangles(vertexCoords) {
	if (!vertexBuffer) initVertexBuffer();

	gl.bufferData(gl.ARRAY_BUFFER, vertexCoords, gl.DYNAMIC_DRAW)

	const numVertices = vertexCoords.length/3;
	gl.drawArrays(gl.TRIANGLES, 0, numVertices);
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