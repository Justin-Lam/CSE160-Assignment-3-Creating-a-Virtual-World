const FSIZE = Float32Array.BYTES_PER_ELEMENT;

/** Contains vertex and uv data for 1+ triangles. */
let arrayBuffer = null;

function initArrayBuffer() {
	arrayBuffer = gl.createBuffer();
	if (!arrayBuffer) throw new Error("Failed to create arrayBuffer.");

	gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuffer);

	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE*5, 0);
	gl.enableVertexAttribArray(a_Position);

	gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, FSIZE*5, FSIZE*3);
	gl.enableVertexAttribArray(a_UV);
}

/** @param {Float32Array} data vertex and uv data for the triangle(s) */
function drawTriangles(data) {
	if (!arrayBuffer) initArrayBuffer();

	gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW)

	const numVertices = data.length/5;  // x, y, z, u, v = 5 components
	gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}