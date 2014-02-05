module.exports = exclusion

function exclusion(src, dst, out) {
    var ratio;

    out.a = (src.a + dst.a) - (src.a * dst.a);

    ratio = out.a > 0 ? src.a / out.a : 0;

    out.r = ((1 - ratio) * dst.r) + (ratio * (((1 - dst.a) * src.r) +
                (dst.a * ((dst.r + src.r) - (2 * dst.r * src.r)))));
    out.g = ((1 - ratio) * dst.g) + (ratio * (((1 - dst.a) * src.g) +
                (dst.a * ((dst.g + src.g) - (2 * dst.g * src.g)))));
    out.b = ((1 - ratio) * dst.b) + (ratio * (((1 - dst.a) * src.b) +
                (dst.a * ((dst.b + src.b) - (2 * dst.b * src.b)))));
}
