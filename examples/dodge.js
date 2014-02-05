module.exports = dodge

function dodge(src, dst, out) {
    var ratio, diff, r, g, b;

    if (dst.r === 0) {
        r = 0;
    } else {
        diff = 1 - src.r;
        if (dst.r >= diff) {
            r = 1;
        } else {
            r = dst.r / diff;
        }
    }

    if (dst.g === 0) {
        g = 0;
    } else {
        diff = 1 - src.g;
        if (dst.g >= diff) {
            g = 1;
        } else {
            g = dst.g / diff;
        }
    }

    if (dst.b === 0) {
        b = 0;
    } else {
        diff = 1 - src.b;
        if (dst.b >= diff) {
            b = 1;
        } else {
            b = dst.b / diff;
        }
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
