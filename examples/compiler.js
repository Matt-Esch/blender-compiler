var functionParse = /(^\s*function[^(]*\([^)]*\)\s*\{)([\s\S]*)(\}\s*$)/
var blendInvoke = /shaderFunction\s*\([^)]*\)\s*;?/
var shaderCode = blendSurface.toString()
var srcReg = /src\./g
var dstReg = /dst\./g
var outReg = /out\./g

module.exports = compileShader

function compileShader(blendFunction) {
    var blendCode = blendFunction.toString().match(functionParse),
        shader,
        shaderProgram;

    if (blendCode && blendCode.length === 4) {
        shader = shaderCode.replace(blendInvoke, "{" + blendCode[2] + "}")
        shader = shader.replace(srcReg, "src_")
        shader = shader.replace(dstReg, "dst_")
        shader = shader.replace(outReg, "out_")
        shader = shader.replace("src = {},", "src_r, src_g, src_b, src_a,")
        shader = shader.replace("dst = {},", "dst_r, dst_g, dst_b, dst_a,")
        shader = shader.replace("out = {},", "out_r, out_g, out_b, out_a,")

        if (shader !== shaderCode) {
            try {
                eval("shaderProgram = " + shader)
            } catch (e) {
                shaderProgram = null;
            }
        }
    }

    if (typeof shaderProgram !== "function") {
        // function toString not supported
        blendCode = null;
        shaderCode = null;
        shaderProgram = function (srcSurface, dstSurface, outSurface) {
            blendSurface(srcSurface, dstSurface, blendFunction)
        };
    }

    return shaderProgram
}

function blendSurface(srcSurface, dstSurface, outSurface, shaderFunction) {
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

        outSurface[px] = out.r * 255;
        outSurface[px + 1] = out.g * 255;
        outSurface[px + 2] = out.b * 255;
        outSurface[px + 3] = out.a * 255;
    }
}
