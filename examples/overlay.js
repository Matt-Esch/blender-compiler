module.exports = overlay

function overlay(src, dst, out) {
    var ratio, r, g, b;

    if (dst.r <= 0.5) {
        r = src.r * 2 * dst.r;
    } else {
        r = 1 - ((1 - src.r) * (1 - ((2 * dst.r) - 1)));
    }

    if (dst.g <= 0.5) {
        g = src.g * 2 * dst.g;
    } else {
        g = 1 - ((1 - src.g) * (1 - ((2 * dst.g) - 1)));
    }

    if (dst.b <= 0.5) {
        b = src.b * 2 * dst.b;
    } else {
        b = 1 - ((1 - src.b) * (1 - ((2 * dst.b) -1)));
    }

    out.a = (dst.a + src.a) - (dst.a * src.a);

    ratio = out.a > 0 ? dst.a / out.a : 0;

    out.r = ((1 - ratio) * src.r) + (ratio * (((1 - src.a) * dst.r) +
                (src.a * r)));
    out.g = ((1 - ratio) * src.g) + (ratio * (((1 - src.a) * dst.g) +
                (src.a * g)));
    out.b = ((1 - ratio) * src.b) + (ratio * (((1 - src.a) * dst.b) +
                (src.a * b)));
}
