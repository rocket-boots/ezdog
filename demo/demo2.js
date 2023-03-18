/* eslint-disable no-new */
// import { fovZdog, Zdog } from '../src/index.js';

function run(dog, element) {
	const { TAU } = dog;
	let isSpinning = true;

	const illo = new dog.Illustration({
		element,
		zoom: 5,
		rotate: { x: -0.2, y: 0, z: 0 },
		dragRotate: true,
		// stop spinning when drag starts
		onDragStart: () => { isSpinning = false; },
		onDragEnd: () => { isSpinning = true; },
	});

	const cordPath = Object.freeze([
		{ x: 2, y: -20, z: 10 },
		{ arc: [
			{ x: 10, y: -20 }, // corner
			{ x: 15, y: -20 }, // end point
		] },
		{ arc: [
			{ x: 20, y: -1, z: 10 }, // corner
			{ x: 10, y: 6, z: 30 }, // end point
		] },
		{ arc: [
			{ x: 10, y: -20, z: -2 }, // corner
			{ x: 20, y: -20, z: 45 }, // end point
		] },
		{ arc: [
			{ x: 20, y: 0, z: 50 }, // corner
			{ x: 0, y: 0, z: 40 }, // end point
		] },
		{ x: 0, y: 0, z: 40 },
	]);

	function clone(obj) {
		return JSON.parse(JSON.stringify(obj));
	}

	function makeScene(illo) {
		const rocket = new dog.Anchor({
			addTo: illo,
		});

		// circle
		const orbit = new dog.Ellipse({
			addTo: illo,
			diameter: 200,
			translate: { y: 100 },
			stroke: 1,
			color: '#366',
		});

		/*
		// square
		new dog.Rect({
			addTo: rocket,
			width: 20,
			height: 20,
			translate: { z: -10 },
			stroke: 3,
			color: '#E62',
			fill: true,
		});
		*/

		const cyl = {
			addTo: rocket,
			diameter: 10,
			length: 20,
			color: '#983',
			frontFace: '#aa3',
			backface: '#343',
		};

		new dog.Cylinder({ ...cyl, translate: { z: 20 }, color: '#983' });
		new dog.Cylinder({ ...cyl, color: '#872' });
		new dog.Cylinder({ ...cyl, translate: { z: -20 }, color: '#761' });

		// Capsule
		const capsule = new dog.Cone({
			addTo: rocket,
			diameter: 10,
			length: 12,
			color: '#768',
			backface: '#546',
			translate: { z: 40 },
		});
		new dog.Cylinder({
			addTo: capsule,
			diameter: 4,
			length: 6,
			translate: { z: 10 },
			color: '#768',
			backface: '#879',
		});
		// Engine
		const engine = new dog.Box({
			addTo: rocket,
			width: 4,
			height: 4,
			depth: 4,
			translate: { z: -32 },
			color: '#b54',
		});
		new dog.Cone({
			addTo: engine,
			diameter: 8,
			length: 8,
			color: '#b54',
			backface: '#933',
			translate: { z: -8 },
		});

		const naut = new dog.Shape({ addTo: rocket, stroke: 0, color: '#f00', translate: { x: 2, y: -20, z: 10 } });
		new dog.Shape({
			addTo: naut,
			path: [ // almost-triangle body
				{ x: 1, y: -2 },
				{ x: -1, y: -2 },
				{ x: 3, y: 4 }, // hip
				{ x: -3, y: 4 }, // hip
			],
			stroke: 4,
			color: '#15f',
			fill: true,
		});
		const legPath = [ // leg
			{ x: 0, y: 0 },
			{ x: 0, y: 4 },
			{ x: 0, y: 5, z: -2 },
			{ x: 0, y: 6, z: -1 },
		];
		const limbOpts = {
			addTo: naut,
			// path: legPath,
			closed: false,
			color: '#04f',
			stroke: 2,
		};
		const legOpts = { ...limbOpts, path: legPath };
		new dog.Shape({ ...legOpts, translate: { x: -3, y: 4 } }); // right leg
		new dog.Shape({ ...legOpts, translate: { x: 3, y: 4 }, rotate: { x: TAU / 6 } }); // left leg
		// Head
		const head = new dog.Shape({ addTo: naut, color: '#37f', stroke: 7, translate: { x: 0, y: -5 } });
		new dog.Shape({ addTo: head, color: '#37f', stroke: 7, translate: { x: -1 } });
		new dog.Shape({ addTo: head, color: '#37f', stroke: 7, translate: { x: 1 } });
		new dog.Hemisphere({ addTo: head, color: '#6bf', backface: false, diameter: 6, translate: { x: 0, z: 2 } });
		// Shoulders
		new dog.Shape({ ...limbOpts, path: [{ x: 4 }, { x: -4 }], color: '#15f' });
		// Belly
		new dog.Shape({ ...limbOpts, translate: { y: 2, z: 1 }, stroke: 5, color: '#15f' });
		// Arms
		const armOps = { ...limbOpts, path: [{ x: 0, y: 0 }, { x: 0, y: 3 }, { x: 0, y: 5, z: 2 }], color: '#26f' };
		new dog.Shape({ ...armOps, translate: { x: -4 }, rotate: { z: TAU / 6 } });
		new dog.Shape({ ...armOps, translate: { x: 4 }, rotate: { x: TAU / 6, z: -TAU / 6 } });
		// Backpack
		new dog.Box({
			addTo: naut,
			width: 8,
			height: 8,
			depth: 4,
			translate: { y: 1, z: -3 },
			stroke: 1,
			color: '#666',
			frontFace: '#26f',
			rearFace: '#03d',
			leftFace: '#37f',
			rightFace: '#37f',
			topFace: '#04e',
			bottomFace: '#04e',
		});
		// Cord
		const cord = new dog.Shape({ addTo: rocket, path: clone(cordPath), stroke: 0, closed: false, color: '#03d' });
		// Planet
		const planet = new dog.Shape({ addTo: illo, stroke: 80, translate: { y: 100 }, color: '#4f9' });
		return [rocket, orbit, naut, cord, planet];
	}

	const [rocket, orbit, naut, cord] = makeScene(illo);
	// makeScene(svgIllo);

	document.addEventListener('wheel', (event) => {
		// console.log(event.deltaY);
		const zoomAmount = event.deltaY / -250;
		illo.zoom += zoomAmount;
		// svgIllo.zoom += zoomAmount;
	});

	let i = 0;
	function animate() {
		i += 1;
		const flux = Math.sin(i * 0.01);
		// viewZ = Math.sin(i * 0.001)* 100;
		// illo.rotate.y += isSpinning ? 0.03 : 0;
		rocket.rotate.y += isSpinning ? 0.0001 : 0;
		rocket.rotate.x += isSpinning ? 0.00005 : 0;
		naut.rotate.z += 0.0005;
		naut.rotate.y += 0.0001;
		naut.rotate.x -= 0.005;
		orbit.rotate.z += 0.01;

		cord.path[0].y = cordPath[0].y + (flux * 500);
		cord.path[4].x = cordPath[4].x + (flux * 500);

		illo.updateRenderGraph();
		// svgIllo.updateRenderGraph();
		requestAnimationFrame(animate);
	}
	animate();

	// window.cord = cord;
	// window.rocket = rocket;
	// window.naut = naut;
	// window.illo = illo;
} // end of `run`
export default run;
