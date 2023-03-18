// Monkey-patch Zdog based on https://github.com/metafizzy/zdog/issues/2#issuecomment-513565209

const DEFAULT_FOV = -150;

function scale(z, fovParam) {
	const fov = fovParam || this.fov || DEFAULT_FOV;
	return fov / (fov + z);
}

function line(ctx, elem, point, fovParam) {
	const fov = fovParam || this.fov || DEFAULT_FOV;
	const scaleFn = this.scale || scale;
	const s = scaleFn(point.z, fov);
	ctx.lineTo(point.x * s, point.y * s);
}

function move(ctx, elem, point, fovParam) {
	const fov = fovParam || this.fov || DEFAULT_FOV;
	const scaleFn = this.scale || scale;
	const s = scaleFn(point.z, fov);
	ctx.moveTo(point.x * s, point.y * s);
}

function bezier(ctx, elem, cp0, cp1, end, fovParam) {
	const fov = fovParam || this.fov || DEFAULT_FOV;
	const scaleFn = this.scale || scale;
	const s0 = scaleFn(cp0.z, fov);
	const s1 = scaleFn(cp1.z, fov);
	const sEnd = scaleFn(end.z, fov);
	ctx.bezierCurveTo(cp0.x * s0, cp0.y * s0, cp1.x * s1, cp1.y * s1, end.x * sEnd, end.y * sEnd);
}

/** apply the field of view perspective patch to Zdog */
function applyFovPatch(dog = window.Zdog, fov = DEFAULT_FOV) {
	/*
	function scale(z) {
		this.fov / (this.fov + z);
	}
	function line(ctx, elem, point) {
		const s = dog.patch.scale(point.z);
		ctx.lineTo(point.x * s, point.y * s);
	}
	function move(ctx, elem, point) {
		const s = dog.patch.scale(point.z);
		ctx.moveTo( point.x * s, point.y * s);
	}
	function bezier(ctx, elem, cp0, cp1, end) {
		const s0 = dog.patch.scale(cp0.z);
		const s1 = dog.patch.scale(cp1.z);
		const sEnd = dog.patch.scale(end.z);
		ctx.bezierCurveTo(cp0.x * s0, cp0.y * s0, cp1.x * s1, cp1.y * s1, end.x * sEnd, end.y * sEnd);
	}
	*/
	// Add one new property
	// TODO: Would be better to define the fov on the illustration level, and then pass it along
	dog.CanvasRenderer.fov = fov; // eslint-disable-line no-param-reassign
	// Add one new method
	dog.CanvasRenderer.scale = scale; // eslint-disable-line no-param-reassign
	// Replace existing methods
	dog.CanvasRenderer.line = line; // eslint-disable-line no-param-reassign
	dog.CanvasRenderer.move = move; // eslint-disable-line no-param-reassign
	dog.CanvasRenderer.bezier = bezier; // eslint-disable-line no-param-reassign
	// TODO: Patch SvgRenderer also
	return dog;
}

// const fovZdog = (window.Zdog) ? applyFovPatch(window.Zdog) : null;
// if (!window.Zdog) {
// // eslint-disable-next-line no-console
// console.warn('window.Zdog is missing so we cannot created an auto-patched fovZdog');
// }

export {
	applyFovPatch,
	// fovZdog,
	scale, line, move, bezier, DEFAULT_FOV,
};
