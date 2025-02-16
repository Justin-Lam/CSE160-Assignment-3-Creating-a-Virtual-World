class King {
	constructor(modelMatrix) {
		const shirtColor = [175/255, 27/255, 15/255, 1];	// red
		const pantsColor = [255/255, 249/255, 240/255, 1];	// cream
		const skinColor = [233/255, 196/255, 162/255, 1];
		const black = [0,0,0,1];
		const gold = [246/255, 195/255, 66/255, 1];

		this.torso = new Cube(0, shirtColor);
		this.torso.modelMatrix.set(modelMatrix);
		this.torso.modelMatrix.translate(0, 1.05, 0);
		this.torso.modelMatrix.scale(0.5, 0.7, 0.25);
		this.torso.modelMatrix.translate(-0.5, -0.5, -0.5);

		this.leg_l = new Cube(0, pantsColor);
		this.leg_l.modelMatrix.set(modelMatrix);
		this.leg_l.modelMatrix.translate(0.125, 0.35, 0);
		this.leg_l.modelMatrix.scale(0.251, 0.7, 0.251);
		this.leg_l.modelMatrix.translate(-0.5, -0.5, -0.5);

		this.leg_r = new Cube(0, pantsColor);
		this.leg_r.modelMatrix.set(modelMatrix);
		this.leg_r.modelMatrix.translate(-0.125, 0.35, 0);
		this.leg_r.modelMatrix.scale(0.251, 0.7, 0.251);
		this.leg_r.modelMatrix.translate(-0.5, -0.5, -0.5);

		this.sleeve_l = new Cube(0, shirtColor);
		this.sleeve_l.modelMatrix.set(modelMatrix);
		this.sleeve_l.modelMatrix.translate(0.375, 1.225, 0);
		this.sleeve_l.modelMatrix.scale(0.25, 0.35, 0.25);
		this.sleeve_l.modelMatrix.translate(-0.5, -0.5, -0.5);

		this.sleeve_r = new Cube(0, shirtColor);
		this.sleeve_r.modelMatrix.set(modelMatrix);
		this.sleeve_r.modelMatrix.translate(-0.375, 1.225, 0);
		this.sleeve_r.modelMatrix.scale(0.25, 0.35, 0.25);
		this.sleeve_r.modelMatrix.translate(-0.5, -0.5, -0.5);

		this.arm_l = new Cube(0, skinColor);
		this.arm_l.modelMatrix.set(modelMatrix);
		this.arm_l.modelMatrix.translate(0.375, 0.875, 0);
		this.arm_l.modelMatrix.scale(0.25, 0.35, 0.25);
		this.arm_l.modelMatrix.translate(-0.5, -0.5, -0.5);

		this.arm_r = new Cube(0, skinColor);
		this.arm_r.modelMatrix.set(modelMatrix);
		this.arm_r.modelMatrix.translate(-0.375, 0.875, 0);
		this.arm_r.modelMatrix.scale(0.25, 0.35, 0.25);
		this.arm_r.modelMatrix.translate(-0.5, -0.5, -0.5);

		this.head = new Cube(0, skinColor);
		this.head.modelMatrix.set(modelMatrix);
		this.head.modelMatrix.translate(0, 1.65, 0);
		this.head.modelMatrix.scale(0.5, 0.5, 0.5);
		this.head.modelMatrix.translate(-0.5, -0.5, -0.5);

		this.eye_l = new Cube(0, black);
		this.eye_l.modelMatrix.set(modelMatrix);
		this.eye_l.modelMatrix.translate(0.15, 1.7, 0.25);
		this.eye_l.modelMatrix.scale(0.1, 0.1, 0.05);
		this.eye_l.modelMatrix.translate(-0.5, -0.5, -0.5);

		this.eye_r = new Cube(0, black);
		this.eye_r.modelMatrix.set(modelMatrix);
		this.eye_r.modelMatrix.translate(-0.15, 1.7, 0.25);
		this.eye_r.modelMatrix.scale(0.1, 0.1, 0.05);
		this.eye_r.modelMatrix.translate(-0.5, -0.5, -0.5);

		this.mouth_bottom = new Cube(0, black);
		this.mouth_bottom.modelMatrix.set(modelMatrix);
		this.mouth_bottom.modelMatrix.translate(0, 1.45, 0.25);
		this.mouth_bottom.modelMatrix.scale(0.2, 0.05, 0.05);
		this.mouth_bottom.modelMatrix.translate(-0.5, -0.5, -0.5);

		this.mouth_l = new Cube(0, black);
		this.mouth_l.modelMatrix.set(modelMatrix);
		this.mouth_l.modelMatrix.translate(-0.1, 1.5, 0.25);
		this.mouth_l.modelMatrix.scale(0.05, 0.05, 0.05);
		this.mouth_l.modelMatrix.translate(-0.5, -0.5, -0.5);

		this.mouth_r = new Cube(0, black);
		this.mouth_r.modelMatrix.set(modelMatrix);
		this.mouth_r.modelMatrix.translate(0.1, 1.5, 0.25);
		this.mouth_r.modelMatrix.scale(0.05, 0.05, 0.05);
		this.mouth_r.modelMatrix.translate(-0.5, -0.5, -0.5);

		this.crown_bottom = new Cube(0, gold);
		this.crown_bottom.modelMatrix.set(modelMatrix);
		this.crown_bottom.modelMatrix.translate(0, 1.9, 0);
		this.crown_bottom.modelMatrix.scale(0.55, 0.1, 0.55);
		this.crown_bottom.modelMatrix.translate(-0.5, -0.5, -0.5);

		this.crown_front_l_corner = new Cube(0, gold);
		this.crown_front_l_corner.modelMatrix.set(modelMatrix);
		this.crown_front_l_corner.modelMatrix.translate(0.225, 2, 0.225);
		this.crown_front_l_corner.modelMatrix.scale(0.1, 0.15, 0.1);
		this.crown_front_l_corner.modelMatrix.translate(-0.5, -0.5, -0.5);

		this.crown_front_m_corner = new Cube(0, gold);
		this.crown_front_m_corner.modelMatrix.set(modelMatrix);
		this.crown_front_m_corner.modelMatrix.translate(0, 2, 0.225);
		this.crown_front_m_corner.modelMatrix.scale(0.1, 0.15, 0.1);
		this.crown_front_m_corner.modelMatrix.translate(-0.5, -0.5, -0.5);

		this.crown_front_r_corner = new Cube(0, gold);
		this.crown_front_r_corner.modelMatrix.set(modelMatrix);
		this.crown_front_r_corner.modelMatrix.translate(-0.225, 2, 0.225);
		this.crown_front_r_corner.modelMatrix.scale(0.1, 0.15, 0.1);
		this.crown_front_r_corner.modelMatrix.translate(-0.5, -0.5, -0.5);

		this.crown_m_l_corner = new Cube(0, gold);
		this.crown_m_l_corner.modelMatrix.set(modelMatrix);
		this.crown_m_l_corner.modelMatrix.translate(0.225, 2, 0);
		this.crown_m_l_corner.modelMatrix.scale(0.1, 0.15, 0.1);
		this.crown_m_l_corner.modelMatrix.translate(-0.5, -0.5, -0.5);

		this.crown_back_l_corner = new Cube(0, gold);
		this.crown_back_l_corner.modelMatrix.set(modelMatrix);
		this.crown_back_l_corner.modelMatrix.translate(0.225, 2, -0.225);
		this.crown_back_l_corner.modelMatrix.scale(0.1, 0.15, 0.1);
		this.crown_back_l_corner.modelMatrix.translate(-0.5, -0.5, -0.5);

		this.crown_back_m_corner = new Cube(0, gold);
		this.crown_back_m_corner.modelMatrix.set(modelMatrix);
		this.crown_back_m_corner.modelMatrix.translate(0, 2, -0.225);
		this.crown_back_m_corner.modelMatrix.scale(0.1, 0.15, 0.1);
		this.crown_back_m_corner.modelMatrix.translate(-0.5, -0.5, -0.5);

		this.crown_back_r_corner = new Cube(0, gold);
		this.crown_back_r_corner.modelMatrix.set(modelMatrix);
		this.crown_back_r_corner.modelMatrix.translate(-0.225, 2, -0.225);
		this.crown_back_r_corner.modelMatrix.scale(0.1, 0.15, 0.1);
		this.crown_back_r_corner.modelMatrix.translate(-0.5, -0.5, -0.5);

		this.crown_m_r_corner = new Cube(0, gold);
		this.crown_m_r_corner.modelMatrix.set(modelMatrix);
		this.crown_m_r_corner.modelMatrix.translate(-0.225, 2, 0);
		this.crown_m_r_corner.modelMatrix.scale(0.1, 0.15, 0.1);
		this.crown_m_r_corner.modelMatrix.translate(-0.5, -0.5, -0.5);
	}
	
	render() {
		this.torso.render();
		this.leg_l.render();
		this.leg_r.render();
		this.sleeve_l.render();
		this.sleeve_r.render();
		this.arm_l.render();
		this.arm_r.render();
		this.head.render();
		this.eye_l.render();
		this.eye_r.render();
		this.mouth_bottom.render();
		this.mouth_l.render();
		this.mouth_r.render();
		this.crown_bottom.render();
		this.crown_front_l_corner.render();
		this.crown_front_r_corner.render();
		this.crown_front_m_corner.render();
		this.crown_m_l_corner.render();
		this.crown_back_l_corner.render();
		this.crown_back_m_corner.render();
		this.crown_back_r_corner.render();
		this.crown_m_r_corner.render();
	}
}