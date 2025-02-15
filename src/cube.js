class Cube {
	vertexCoords = new Float32Array([
		0,0,0, 1,1,0, 1,0,0,	0,0,0, 0,1,0, 1,1,0,	// front
		0,0,1, 1,1,1, 1,0,1,	0,0,1, 0,1,1, 1,1,1,	// back
		0,1,0, 1,1,1, 1,1,0,	0,1,0, 0,1,1, 1,1,1,	// top
		0,0,0, 1,0,1, 1,0,0,	0,0,0, 0,0,1, 1,0,1,	// bottom
		0,0,0, 0,1,1, 0,0,1,	0,0,0, 0,1,0, 0,1,1,	// left
		1,0,0, 1,1,1, 1,0,1,	1,0,0, 1,1,0, 1,1,1		// right
	]);

	modelMatrix = new Matrix4();
	renderType;	// -1: debug, 0: color, 1: texture
	color = [1,1,1,1];	// white

	/** Required to specify renderType (-1: debug, 0: color, 1: texture). */
	constructor(renderType, color) {
		this.renderType = renderType;
		if (color) this.color = color;
	}

	render() {
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.modelMatrix.elements);
		gl.uniform1i(u_RenderType, 0);	// force it to be color
		gl.uniform4f(u_FragColor, ...this.color);

		drawTriangles(this.vertexCoords);
	}

	/*
	render() {
		const rgba = this.color;

		gl.uniformMatrix4fv(u_ModelMatrix, false, this.modelMatrix.elements);
		gl.uniform1i(u_RenderType, this.renderType);
		gl.uniform4f(u_FragColor, ...rgba);

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
	*/
}