module.exports = burn

function burn(src, dst, out) {
    var ratio, diff, r, g, b;

    if (dst.r === 1) {
        r = 1;
    } else {
        diff = 1 - dst.r;
        if (diff >= src.r) {
            r = 0;
        } else {
            r = 1 - (diff / src.r);
        }
    }

    if (dst.g === 1) {
        g = 1;
    } else {
        diff = 1 - dst.g;
        if (diff >= src.g) {
            g = 0;
        } else {
            g = 1 - (diff / src.g);
        }
    }

    if (dst.b === 1) {
        b = 1;
    } else {
        diff = 1 - dst.b;
        if (diff >= src.b) {
            b = 0;
        } else {
            b = 1 - (diff / src.b);
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
