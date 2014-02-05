var test = require("tape")

var compile = require("../index")

test("blenderCompiler is a function", function (assert) {
    assert.equal(typeof compile, "function")
    assert.end()
})

test("compile averaging function", function (assert) {
    var src = [10, 20, 30, 40, 50, 60, 70, 80]
    var dst = [20, 30, 40, 50, 60, 70, 80, 90]
    var out = []
    var expected = [15, 25, 35, 45, 55, 65, 75, 85]

    var blender = compile(function (src, dst, out) {
        out.r = (src.r + dst.r) / 2
        out.g = (src.g + dst.g) / 2
        out.b = (src.b + dst.b) / 2
        out.a = (src.a + dst.a) / 2
    })

    blender(src, dst, out)

    assertEqualPixels(assert, out, expected)
    assert.end()
})

test("bad tokens use fallback", function (assert) {
    var src = [10, 20, 30, 40, 50, 60, 70, 80]
    var dst = [20, 30, 40, 50, 60, 70, 80, 90]
    var out = []
    var expected = [15, 25, 35, 45, 55, 65, 75, 85]

    var blender = compile(function (q, r, s) {
        s.r = (q.r + r.r) / 2
        s.g = (q.g + r.g) / 2
        s.b = (q.b + r.b) / 2
        s.a = (q.a + r.a) / 2
    })

    blender(src, dst, out)

    assertEqualPixels(assert, out, expected)
    assert.end()
})

test("function toString unsupported", function (assert) {
    var src = [10, 20, 30, 40, 50, 60, 70, 80]
    var dst = [20, 30, 40, 50, 60, 70, 80, 90]
    var out = []
    var expected = [15, 25, 35, 45, 55, 65, 75, 85]

    function shader(q, r, s) {
        s.r = (q.r + r.r) / 2
        s.g = (q.g + r.g) / 2
        s.b = (q.b + r.b) / 2
        s.a = (q.a + r.a) / 2
    }

    shader.toString = function () { return "" }

    var blender = compile(shader)

    blender(src, dst, out)

    assertEqualPixels(assert, out, expected)
    assert.end()
})

test("bad eval", function (assert) {
    var src = [10, 20, 30, 40, 50, 60, 70, 80]
    var dst = [20, 30, 40, 50, 60, 70, 80, 90]
    var out = []
    var expected = [15, 25, 35, 45, 55, 65, 75, 85]

    var shaderCode = "function shader(q, r, s) {\n" +
        "s.r = (q.r + r.r) / 2\n" +
        "s.g = (q.g + r.g) / 2\n" +
        "OOPS++" +
        "s.b = (q.b + r.b) / 2\n" +
        "s.a = (q.a + r.a) / 2\n" +
    "}"

    function shader(q, r, s) {
        s.r = (q.r + r.r) / 2
        s.g = (q.g + r.g) / 2
        s.b = (q.b + r.b) / 2
        s.a = (q.a + r.a) / 2
    }
    shader.toString = function () { return shaderCode  }

    var blender = compile(shader)

    blender(src, dst, out)

    assertEqualPixels(assert, out, expected)
    assert.end()
})

function assertEqualPixels(assert, actual, expected) {
    for (var i = 0; i < expected.length; i++) {
        assert.true(Math.abs(actual[i] - expected[i]) < 0.000001)
    }
}
