class Cube {
	/** Vertex and uv data. */
	data = new Float32Array([
		// front
		0,0,0, 0,0,		1,1,0, 1,1,		1,0,0, 1,0,
		0,0,0, 0,0,		0,1,0, 0,1,		1,1,0, 1,1,
		// back
		0,0,1, 0,0,		1,1,1, 1,1,		1,0,1, 1,0,
		0,0,1, 0,0,		0,1,1, 0,1,		1,1,1, 1,1,
		// top
		0,1,0, 0,0,		1,1,1, 1,1,		1,1,0, 1,0,
		0,1,0, 0,0,		0,1,1, 0,1,		1,1,1, 1,1,
		// bottom
		0,0,0, 0,0,		1,0,1, 1,1,		1,0,0, 1,0,
		0,0,0, 0,0,		0,0,1, 0,1,		1,0,1, 1,1,
		// left
		0,0,0, 0,0,		0,1,1, 1,1,		0,0,1, 1,0,
		0,0,0, 0,0,		0,1,0, 0,1,		0,1,1, 1,1,
		// right
		1,0,0, 0,0,		1,1,1, 1,1,		1,0,1, 1,0,
		1,0,0, 0,0,		1,1,0, 0,1,		1,1,1, 1,1,
	]);

	modelMatrix = new Matrix4();
	renderType;
	color = [1,1,1,1];	// white

	/**
	 * Required to specify renderType.
	 * @param {number} renderType -1: debug, 0: color, 1: texture0, 2: texture1
	 */
	constructor(renderType, color) {
		this.renderType = renderType;
		if (color) this.color = color;
	}

	render() {
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.modelMatrix.elements);
		gl.uniform1i(u_RenderType, this.renderType);
		gl.uniform4f(u_FragColor, ...this.color);

		drawTriangles(this.data);
	}
}