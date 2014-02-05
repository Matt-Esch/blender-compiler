# blender-compiler

[![build status][1]][2] [![dependency status][3]][4] [![coverage report][9]][10] [![stability index][15]][16]

[![npm stats][13]][14]

[![browser support][5]][6]

Compile per-pixel blend functions into a high performance shader.

## Motivation

When layering images on top of each other, we often wish to apply a blend
function to combine the images in some way. The functions that define how these
images should be blended together are easier to think about in the form of a
source pixel a destination pixel and a result pixel.

For example, an "average" blend function might be of the form

    result.r = (source.r + destination.r) / 2
    result.g = (source.g + destination.g) / 2
    result.b = (source.b + destination.b) / 2
    result.a = (source.a + destination.a) / 2

So we can quite easily define a per pixel "blend function", but if we are going
to blend two images on top of each other, we also have to do the following

  - Loop over and read each pixel in the source and destination pixels
  - Scale the pixels from their source scale [0,255] to their blend scale [0,1]
  - Call the blend function for the matching pixels
  - Upscale the pixels back from their blend scale to their destination scale

The blender compiler will do all of these things for us, whilst also making
agressive performance optimisations, so that we just have to provide a blend
function.

blender-compiler was used to generate [blender-compiler][17], an implementation of the
blend modes used in PDF and Adobe® Photoshop®

## Use

Per pixel blend functions are written in the form

```js
function blendFunction(src, dst, out) {}
```

Where
  - `src` is the pixel object to be blended on top
  - `dst` is the pixel object to blend over
  - `out` is the pixel result of the blend function
  - `{ r: 0, g: 0, b: 0, a: 0 }` are pixels, with values between 0 and 1

**Precaution** - Eval is used to compile the shader. The shader is compiled in
the folling way:

The per pixel blend function is inlined into a per-pixel loop. All references
to `src.r` `dst.r` and `out.r` (and for g, b, a) are replaced by local variables
`src_r`, `dst_r` and `out_r` - This is achieved by naive string replace for
efficiency (instead of parsing the AST), so you need to be careful about how
you name any other tokens in your blend function.

The function is tested after being compiled, and if it fails, a working but
less efficient version is returned, using the same pixel loop function but
without the blend function inlining.

The resulting blender is a function in the form

```js
function blender(src, dst, out) {}
```

Where
  - `src` is the image on top
  - `dst` is the image underneath
  - `out` is the array in which to write the result of the operation

The functions are designed to work with the pixel format of an `ImageData`
object, where pixel values are stored as

    [R, G, B, A, R, G, B, A, R, G, B, A, ... ]

The RGB values in the images range from 0 - 255. They are scaled to 0 - 1 for
pixel shading and then automatically upscaled for you efficienly back to 0 - 255

Note that the values are not rounded to integers when they are upscaled. If you
use a `Uint8ClampedArray` as the out array, then setting this value will
efficiently round it for you anyway, so we can avoid the extra rounding.

## Example

```js
var compile = require("blender-compiler")

var blender = compile(function (src, dst, out)) {
    // An averaging blend function
    out.r = (src.r + dst.r) / 2
    out.g = (src.g + dst.g) / 2
    out.b = (src.b + dst.b) / 2
    out.a = (src.a + dst.a) / 2
})
```

## Installation

`npm install blender-compiler`

## Contributors

 - Matt-Esch

## MIT Licenced

  [1]: https://secure.travis-ci.org/Matt-Esch/blender-compiler.png
  [2]: https://travis-ci.org/Matt-Esch/blender-compiler
  [3]: https://david-dm.org/Matt-Esch/blender-compiler.png
  [4]: https://david-dm.org/Matt-Esch/blender-compiler
  [5]: https://ci.testling.com/Matt-Esch/blender-compiler.png
  [6]: https://ci.testling.com/Matt-Esch/blender-compiler
  [9]: https://coveralls.io/repos/Matt-Esch/blender-compiler/badge.png
  [10]: https://coveralls.io/r/Matt-Esch/blender-compiler
  [13]: https://nodei.co/npm/blender-compiler.png?downloads=true&stars=true
  [14]: https://nodei.co/npm/blender-compiler
  [15]: http://hughsk.github.io/stability-badges/dist/unstable.svg
  [16]: http://github.com/hughsk/stability-badges

  [7]: https://badge.fury.io/js/blender-compiler.png
  [8]: https://badge.fury.io/js/blender-compiler
  [11]: https://gemnasium.com/Matt-Esch/blender-compiler.png
  [12]: https://gemnasium.com/Matt-Esch/blender-compiler

  [17]: https://github.com/Matt-Esch/blender-compiler
