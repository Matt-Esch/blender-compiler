module.exports = hardlight

function hardlight(src, dst, out) {
    var ratio, r, g, b;

    if (src.r <= 0.5) {
        r = dst.r * 2 * src.r;
    } else {
        r = 1 - ((1 - dst.r) * (1 - ((2 * src.r) - 1)));
    }

    if (src.g <= 0.5) {
        g = dst.g * 2 * src.g;
    } else {
        g = 1 - ((1 - dst.g) * (1 - ((2 * src.g) - 1)));
    }

    if (src.b <= 0.5) {
        b = dst.b * 2 * src.b;
    } else {
        b = 1 - ((1 - dst.b) * (1 - ((2 * src.b) -1)));
    }

    out.a = (src.a + dst.a) - (src.a * dst.a);

    ratio = out.a > 0 ? src.a / out.a : 0;

    out.r = ((1 - ratio) * dst.r) + (ratio * (((1 - dst.a) * src.r) +
                (dst.a * r)));
    out.g = ((1 - ratio) * dst.g) + (ratio * (((1 - dst.a) * src.g) +
                (dst.a * g)));
    out.b = ((1 - ratio) * dst.b) + (ratio * (((1 - dst.a) * src.b) +
                (dst.a * b)));
}
