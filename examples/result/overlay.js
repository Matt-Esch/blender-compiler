module.exports = function blendSurface(srcSurface, dstSurface, outSurface, shaderFunction) {
    var len = dstSurface.length,
        src_r, src_g, src_b, src_a,
        dst_r, dst_g, dst_b, dst_a,
        out_r, out_g, out_b, out_a,
        px;

    for (px = 0; px < len; px += 4) {
        src_r = srcSurface[px] / 255;
        src_g = srcSurface[px + 1] / 255;
        src_b = srcSurface[px + 2] / 255;
        src_a = srcSurface[px + 3] / 255

        dst_r = dstSurface[px] / 255;
        dst_g = dstSurface[px + 1] / 255;
        dst_b = dstSurface[px + 2] / 255;
        dst_a = dstSurface[px + 3] / 255;

        {
    var ratio, r, g, b;

    if (dst_r <= 0.5) {
        r = src_r * 2 * dst_r;
    } else {
        r = 1 - ((1 - src_r) * (1 - ((2 * dst_r) - 1)));
    }

    if (dst_g <= 0.5) {
        g = src_g * 2 * dst_g;
    } else {
        g = 1 - ((1 - src_g) * (1 - ((2 * dst_g) - 1)));
    }

    if (dst_b <= 0.5) {
        b = src_b * 2 * dst_b;
    } else {
        b = 1 - ((1 - src_b) * (1 - ((2 * dst_b) -1)));
    }

    out_a = (dst_a + src_a) - (dst_a * src_a);

    ratio = out_a > 0 ? dst_a / out_a : 0;

    out_r = ((1 - ratio) * src_r) + (ratio * (((1 - src_a) * dst_r) +
                (src_a * r)));
    out_g = ((1 - ratio) * src_g) + (ratio * (((1 - src_a) * dst_g) +
                (src_a * g)));
    out_b = ((1 - ratio) * src_b) + (ratio * (((1 - src_a) * dst_b) +
                (src_a * b)));
}

        outSurface[px] = out_r * 255;
        outSurface[px + 1] = out_g * 255;
        outSurface[px + 2] = out_b * 255;
        outSurface[px + 3] = out_a * 255;
    }
}
