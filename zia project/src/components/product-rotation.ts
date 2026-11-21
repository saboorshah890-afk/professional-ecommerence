export interface ProductTilt {
  rotateX: number;
  rotateY: number;
  glareX: number;
  glareY: number;
}

interface Bounds {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function getProductTilt(clientX: number, clientY: number, bounds: Bounds): ProductTilt {
  const horizontal = bounds.width > 0
    ? clamp(((clientX - bounds.left) / bounds.width) * 2 - 1, -1, 1)
    : 0;
  const vertical = bounds.height > 0
    ? clamp(((clientY - bounds.top) / bounds.height) * 2 - 1, -1, 1)
    : 0;

  return {
    rotateX: -vertical * 9,
    rotateY: horizontal * 9,
    glareX: 50 + horizontal * 36,
    glareY: 50 + vertical * 36,
  };
}

export function getFrameIndexForDrag(
  startFrame: number,
  startX: number,
  currentX: number,
  frameCount: number,
): number {
  if (frameCount < 1) return 0;
  const delta = Math.round((startX - currentX) / 8);
  return ((startFrame + delta) % frameCount + frameCount) % frameCount;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
