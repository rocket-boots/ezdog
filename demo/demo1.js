// import { fovZdog, Zdog } from '../src/index.js';

function run(dog, element) {
	const { TAU } = dog;
	let isSpinning = true;

	let illo = new dog.Illustration({
		element: '.zdog-demo1',
		zoom: 2,
		rotate: { x: -.2, y: 0, z: 0 },
		dragRotate: true,
		// stop spinning when drag starts
		onDragStart: function() {
			isSpinning = false;
		},
	});

	const terrain = new dog.Anchor({
		addTo: illo,
	});

	// circle
	new dog.Ellipse({
		addTo: terrain,
		diameter: 20,
		translate: { z: 10 },
		stroke: 5,
		color: '#636',
	});

	// square
	new dog.Rect({
		addTo: terrain,
		width: 20,
		height: 20,
		translate: { z: -10 },
		stroke: 3,
		color: '#E62',
		fill: true,
	});

	const wallOptions = {
		addTo: terrain,
		width: 100,
		height: 100,
		rotate: { x: 0, y: TAU/4, z: 0 },
		translate: { z: -20 },
		stroke: 3,
		color: '#555',
		fill: true,
	};

	const walls = [];

	walls[0] = new dog.Rect({ ...wallOptions, rotate: { x: 0, y: TAU/4, z: 0 }, translate: { y: 0, z: -20, x: -50 } });
	walls[1] = new dog.Rect({ ...wallOptions, rotate: { x: TAU/4, y: 0, z: 0 }, translate: { y: -50, z: -20 }, color: '#333' });
	walls[0] = new dog.Rect({ ...wallOptions, rotate: { x: 0, y: TAU/4, z: 0 }, translate: { y: 0, z: -20, x: 50 } });
	walls[3] = new dog.Rect({ ...wallOptions, rotate: { x: TAU/4, y: 0, z: 0 }, translate: { y: 50, z: -20 }, color: '#222' });
	new dog.Rect({ ...wallOptions, rotate: { x: 0, y: TAU/4, z: 0 }, translate: { y: 0, z: -120, x: -50 } });
	new dog.Rect({ ...wallOptions, rotate: { x: TAU/4, y: 0, z: 0 }, translate: { y: -50, z: -120 }, color: '#222' });
	new dog.Rect({ ...wallOptions, rotate: { x: 0, y: TAU/4, z: 0 }, translate: { y: 0, z: -120, x: 50 } });
	new dog.Rect({ ...wallOptions, rotate: { x: TAU/4, y: 0, z: 0 }, translate: { y: 50, z: -120 }, color: '#111' });

	const dot = new dog.Shape({ addTo: terrain, stroke: 80, color: '#ff0' });

	// Ground
	new dog.Rect({
		addTo: terrain,
		width: 500,
		height: 500,
		rotate: { x: TAU/4, y: 0, z: 0 }, translate: { y: 60, z: -200 }, color: '#3b4', stroke: 3, fill: true,
	});

	let viewZ = 0;
	let i = 0;
	function animate() {
		i += .001;
		viewZ = Math.sin(i)* 100;
	//   illo.rotate.y += isSpinning ? 0.03 : 0;
	//   illo.translate.z = Math.sin(i)* 10;
		terrain.translate.z = viewZ;
		dot.stroke = 10 * dog.CanvasRenderer.scale(viewZ);
		// wall.rotate.y += .03;
	//   illo.translate.x = Math.sin(i)* 10;
		illo.updateRenderGraph();
		requestAnimationFrame(animate);
	}
	animate();
}

export default run;
