module.exports = normal

function normal(src, dst, out) {

    out.a = (src.a + dst.a) - (src.a * dst.a);

    if (out.a > 0) {
        out.r = (((out.a - src.a) * dst.r) + (src.a * src.r)) / out.a;
        out.g = (((out.a - src.a) * dst.g) + (src.a * src.g)) / out.a;
        out.b = (((out.a - src.a) * dst.b) + (src.a * src.b)) / out.a;
    } else {
        out.r = dst.r;
        out.g = dst.g;
        out.b = dst.b;
    }
}
