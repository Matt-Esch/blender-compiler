(function () {

var functionParse = /(^\s*function[^(]*\([^)]*\)\s*\{)([\s\S]*)(\}\s*$)/,
	blendInvoke = /shaderFunction\s*\([^)]*\)\s*;?/,
	contextType = '[object CanvasRenderingContext2D]',
	imageType = '[object ImageData]',

	defaultOffsets = {
		destX   : 0,
		destY   : 0,
		sourceX : 0,
		sourceY : 0,
		width   : 'auto',
		height  : 'auto'
	};
	
blend.modes = {};
shade.modes = {};

function blend(src, dst, blendMode, offsetOptions) {
	var shader = blendOnto.modes[blendMode.toLowerCase()],
		offsets = {},
		key,
		srcSurface,
		dstSurface,
		srcType,
		dstType;	
		
	if (!shader) {
		return;
	}

	offsetOptions = offsetOptions || {};
	for (key in defaultOffsets) {
		if (defaultOffsets.hasOwnProperty(key)) {
			offsets[key] = offsetOptions[key] || defaultOffsets[key];
		}
	}

	if (offsets.width === 'auto') {
		offsets.width = srcContext.canvas.width;
	}

	if (offsets.height === 'auto') {
		offsets.height = srcContext.canvas.height;
	}

	offsets.width = Math.min(
		offsets.width,
		srcContext.canvas.width - offsets.sourceX,
		dstContext.canvas.width - offsets.destX
	);

	offsets.height = Math.min(
		offsets.height,
		srcContext.canvas.height - offsets.sourceY,
		dstContext.canvas.height - offsets.destY
	);
	
	srcType = Object.prototype.toString.apply(src);
	dstType = Object.prototype.toString.apply(dst);
	
	if (srcType === contextType) {
		srcSurface = srcContext.getImageData(
			offsets.sourceX,
			offsets.sourceY,
			offsets.width,
			offsets.height
		);
	} else if (srcType == imageType) {
	
	} else {
		return;
	}
	

	if (srcType === contextType) {
		dstSurface = dstContext.getImageData(
			offsets.destX,
			offsets.destY,
			offsets.width,
			offsets.height
		);
	} else if (srcType ==

	shader(srcSurface.data, dstSurface.data);

	dstContext.putImageData(dstSurface, offsets.destX, offsets.destY);
}

// For registering and querying custom blend functions
function blendMode(blendMode, blendFunction) {
	if (typeof blendFunction === 'function') {
		// Compile the function into an efficient pixel shader
		blendOnto.modes[blendMode] = compileShader(blendFunction);
	}
}

// -- Pixel shader -------------------------------------------------------------
function blendSurface(srcSurface, dstSurface, blendFunction) {
	var len = dstSurface.length, 
		src = {}, 
		dst = {}, 
		out = {}, 
		px;

	for (px = 0; px < len; px += 4) {
		src.r = srcSurface[px] / 255;
		src.g = srcSurface[px + 1] / 255;
		src.b = srcSurface[px + 2] / 255;
		src.a = srcSurface[px + 3] / 255

		dst.r = dstSurface[px] / 255;
		dst.g = dstSurface[px + 1] / 255;
		dst.b = dstSurface[px + 2] / 255;
		dst.a = dstSurface[px + 3] / 255;

		shaderFunction(src, dst, out);

		dstSurface[px] = out.r * 255;
		dstSurface[px + 1] = out.g * 255;
		dstSurface[px + 2] = out.b * 255;
		dstSurface[px + 3] = out.a * 255;
	}
}

// Shader with current pixel read access
function shadeSurface(srcSurface, shaderFunction) {
	var len = dstSurface.length, src = {}, dst = {}, out = {}, px;

	for (px = 0; px < len; px += 4) {
		src.r = srcSurface[px] / 255;
		src.g = srcSurface[px + 1] / 255;
		src.b = srcSurface[px + 2] / 255;
		src.a = srcSurface[px + 3] / 255

		shaderFunction(src, out);

		srcSurface[px] = out.r * 255;
		srcSurface[px + 1] = out.g * 255;
		srcSurface[px + 2] = out.b * 255;
		srcSurface[px + 3] = out.a * 255;
	}
}

// Shader with entire surface read access
function shadeSurfaceRead(srcSurface, shaderFunction) {
	var len = dstSurface.length, src = {}, dst = {}, out = {}, px;

	for (px = 0; px < len; px += 4) {
		src.r = srcSurface[px] / 255;
		src.g = srcSurface[px + 1] / 255;
		src.b = srcSurface[px + 2] / 255;
		src.a = srcSurface[px + 3] / 255

		shaderFunction(src, out);

		srcSurface[px] = out.r * 255;
		srcSurface[px + 1] = out.g * 255;
		srcSurface[px + 2] = out.b * 255;
		srcSurface[px + 3] = out.a * 255;
	}
}


// -- Shader compiler ----------------------------------------------------------
function compileShader(blendFunction) {
	var blendCode = blendFunction.toString().match(functionParse),
		shaderCode = blendSurface.toString(),
		shader,
		shaderProgram;

	if (blendCode && blendCode.length === 4) {
		shader = shaderCode.replace(blendInvoke, '{' + blendCode[2] + '}');
		shader = shader.replace('src.', 'src_');
		shader = shader.replace('dst.', 'dst_');
		shader = shader.replace('out.', 'out_');
		shader = shader.replace('src = {},', 'src_r, src_g, src_b, src_a,');
		shader = shader.replace('dst = {},', 'dst_r, dst_g, dst_b, dst_a,');
		shader = shader.replace('out = {},', 'out_r, out_g, out_b, out_a,');
		
		if (shader !== shaderCode) {
			try {
				eval('shaderProgram = ' + shader);
			} catch (e) {
				shaderProgram = null;
			}
		}
	}

	if (typeof shaderProgram !== 'function') {
		// function toString not supported
		blendCode = null;
		shaderCode = null;
		shaderProgram = function (srcSurface, dstSurface) {
			blendSurface(srcSurface, dstSurface, blendFunction);
		};
	}

	return shaderProgram;
}

}())