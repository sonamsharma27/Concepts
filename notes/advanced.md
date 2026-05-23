# advanced

1. The Usual Case

## Normally, many DOM elements are:
Painted together into a shared bitmap (paint layer) in system memory (CPU).
That bitmap is then uploaded as a texture to the GPU for compositing.
So if one element changes (say, a background color), the browser may need to repaint the entire bitmap (all siblings), then re-upload it → costly.

2. Layer Promotion (What Happens)

## When the browser decides an element deserves its own GPU layer:
That element’s pixels are painted into a separate texture instead of being merged with its siblings.
The GPU can then move, transform, or fade this texture independently without repainting.
This process is called layer promotion (or "isolation").
Essentially: the element becomes its own little canvas managed by the GPU.

3. Why This Helps

## Once promoted:
Animations like transform (move/scale/rotate) or opacity only require compositing operations (cheap GPU work).
No need to re-paint or re-layout the rest of the page.
This is why animating opacity or transform is considered “GPU-friendly.”

4. Triggers for Promotion

## Browsers promote elements to their own composite layer when:
You use CSS transforms (transform: translate/scale/rotate/...)
You animate opacity
You use will-change: transform or will-change: opacity
You use CSS filters (filter: blur(...), etc.)
Certain cases like <video>, <canvas>, position: fixed, or 3D transforms.

5. Trade-offs

## ⚠️ Promotion isn’t free:

Each composite layer consumes GPU memory (one texture per layer).
Too many promoted layers → memory pressure, slow uploads, and jank.
Browsers use heuristics to decide automatically, but you can force it with will-change.

6. Analogy

## Think of a stage play:
Paint layers = painting scenery on one big backdrop. Changing one object means repainting the whole backdrop.

Composite layer promotion = instead of painting a moving car on the backdrop, you cut it out on a separate board. Now you can just slide that board across the stage → faster, no need to repaint everything.

## ✅ So when we say “element promoted to its own composite layer”, it means:
The browser decided to isolate that element into its own GPU texture so updates can be handled by the compositor (fast) instead of repainting (slow).


1. Bitmap

A bitmap is just an array of pixel values in memory (e.g., RGB or RGBA values).
When the browser paints elements (background, text, images, borders), it produces a bitmap image for that paint layer.
At this point, the bitmap usually lives in system RAM (CPU memory).

2. Uploading to the GPU

The GPU cannot directly use that CPU-side bitmap for rendering.
To let the GPU work on it, the browser uploads this bitmap into GPU memory (VRAM).
Once uploaded, it becomes a texture.

3. Texture

In graphics terms, a texture is an image stored in GPU memory that can be mapped onto shapes for rendering.
Think of it like a sticker or wallpaper that you can place on 2D or 3D surfaces.
In the browser’s case: each composite layer’s bitmap becomes a texture that the GPU can move, rotate, fade, or scale without re-painting pixels.

4. Compositing with Textures

The compositor takes all those textures (one per composite layer) and draws them in the right order (stacking, z-index, opacity).
Instead of re-drawing pixels (paint), the GPU just moves these textures around.
## That’s why animating transform: translateX(...) or opacity is cheap:
The GPU just repositions or blends textures — no CPU painting.

## ✅ So:

“That bitmap is uploaded as a texture to the GPU” means the CPU-painted pixel data is transferred into GPU memory so the compositor can treat it as a texture and manipulate it efficiently (move, scale, blend) during rendering.


1. What is __proto__?

__proto__ is an accessor property (getter/setter) defined on Object.prototype.
It lets you get or set an object’s prototype.

## Example:

```js
const obj = {};
console.log(obj.__proto__ === Object.prototype); // true
```


So __proto__ is not a “real” own property of your object — it’s inherited from Object.prototype.

2. Deleting __proto__
Case A: Deleting from an object directly
```js
const obj = {};
delete obj.__proto__;
console.log(obj.__proto__); // still works
```


➡️ Nothing changes.
Because obj doesn’t own the __proto__ property. It inherits it.
delete only affects own properties, not prototype-inherited ones.

Case B: Deleting from Object.prototype
```js
delete Object.prototype.__proto__;
const obj = {};
console.log(obj.__proto__); // undefined
```


➡️ Now it disappears, because you removed the accessor definition from the prototype chain.

## At this point:
Objects still have prototypes internally (e.g., Object.getPrototypeOf(obj) still works).
But you no longer have the convenient __proto__ accessor to reach it.

3. Important Notes

## __proto__ is non-standard legacy — modern code prefers:
Object.getPrototypeOf(obj)
Object.setPrototypeOf(obj, proto)

Deleting __proto__ does not break the prototype chain itself.
The internal [[Prototype]] slot is untouched.
You only lose the way to access it via __proto__.

4. Analogy

## Think of __proto__ as a window into the prototype chain:
Deleting it doesn’t demolish the house (the prototype system).
You just boarded up one window — but there are still doors (Object.getPrototypeOf) to enter.

## ✅ In short:

delete obj.__proto__ → does nothing (property is inherited).

delete Object.prototype.__proto__ → removes the accessor, so __proto__ stops working, but prototypes still exist internally.
