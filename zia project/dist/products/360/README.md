# Local 360-degree product frames

The supplied contact sheet contained 12 distinct views of each sample product, spaced 30 degrees apart. Those views are stored locally as WebP frames and are enabled in the product catalogue:

- Smartwatch `ch-05`: `/products/360/ch-05/frame-01.webp` through `frame-12.webp`
- Handbag `b-01`: `/products/360/b-01/frame-01.webp` through `frame-12.webp`

Each frame is a separate crop from the corresponding angle in the supplied image. The viewer preloads frames when opened and supports drag/swipe rotation, fullscreen, and reset.

For future products, place ordered frames under `public/products/360/<product-id>/` using the `frame-01.webp` naming pattern, then set `view360Frames` and `view360Enabled` in the product data in `src/App.tsx`. `createRotationFrames` generates the ordered paths for a chosen frame count.
