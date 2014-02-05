module.exports = multiply

function multiply(src, dst, out) {
    var ratio;

    out.a = (src.a + dst.a) - (src.a * dst.a);

    ratio = out.a > 0 ? src.a / out.a : 0;

    out.r = ((1 - ratio) * dst.r) + (ratio * (((1 - dst.a) * src.r) +
                (dst.a * (src.r * dst.r))));
    out.g = ((1 - ratio) * dst.g) + (ratio * (((1 - dst.a) * src.g) +
                (dst.a * (src.g * dst.g))));
    out.b = ((1 - ratio) * dst.b) + (ratio * (((1 - dst.a) * src.b) +
                (dst.a * (src.b * dst.b))));
}
