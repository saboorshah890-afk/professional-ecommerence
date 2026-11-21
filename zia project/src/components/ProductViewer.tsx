import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ProductViewerMedia } from '../types/productViewer';
import { getHighResolutionSource, MAGNIFICATION_LEVELS, type MagnificationLevel } from './product-zoom';
import { getFrameIndexForDrag, getProductTilt, type ProductTilt } from './product-rotation';

type ViewerMode = 'zoom' | 'simulated3d' | '360' | null;
type Point = { x: number; y: number };
type Transform = { x: number; y: number };

interface ProductViewerProps extends ProductViewerMedia {
  image: string;
  name: string;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const LENS_SIZE = 160;
const LENS_RADIUS = LENS_SIZE / 2;
const NEUTRAL_TILT: ProductTilt = { rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 };

export const ProductViewer: React.FC<ProductViewerProps> = ({
  image,
  name,
  galleryImages,
  zoomImage,
  zoomEnabled,
  simulated3dEnabled,
  view360Frames,
  view360Enabled,
}) => {
  const images = useMemo(() => {
    const configuredImages = galleryImages?.filter((source) => source.trim()) ?? [];
    if (configuredImages.length === 0) return [image];
    return configuredImages.includes(image) ? configuredImages : [image, ...configuredImages];
  }, [galleryImages, image]);
  const frames = useMemo(
    () => view360Frames?.filter((source) => source.trim()) ?? [],
    [view360Frames],
  );
  const [activeImage, setActiveImage] = useState(0);
  const [mode, setMode] = useState<ViewerMode>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [scale, setScale] = useState(MIN_ZOOM);
  const [pan, setPan] = useState<Transform>({ x: 0, y: 0 });
  const [magnification, setMagnification] = useState<MagnificationLevel>(2);
  const [lensPosition, setLensPosition] = useState<Point | null>(null);
  const [tilt, setTilt] = useState<ProductTilt>(NEUTRAL_TILT);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [viewerImageLoaded, setViewerImageLoaded] = useState(false);
  const [viewerImageFailed, setViewerImageFailed] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [preloadedFrames, setPreloadedFrames] = useState(0);
  const [failedPreloads, setFailedPreloads] = useState(0);
  const [fullscreenMessage, setFullscreenMessage] = useState('');
  const previewRef = useRef<HTMLImageElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const lensFrameRef = useRef<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const scaleRef = useRef(MIN_ZOOM);
  const panRef = useRef<Transform>({ x: 0, y: 0 });
  const pointersRef = useRef(new Map<number, Point>());
  const pointerActionRef = useRef<'pan' | 'rotate' | 'pinch' | 'tilt' | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0, frame: 0 });
  const pinchStartRef = useRef({
    distance: 1,
    midpoint: { x: 0, y: 0 },
    scale: MIN_ZOOM,
    pan: { x: 0, y: 0 },
  });
  const displayedImage = images[activeImage] ?? image;
  const zoomSource = zoomImage || getHighResolutionSource(displayedImage);
  const currentViewerImage = mode === '360' ? frames[frameIndex] : zoomSource;

  useEffect(() => {
    setActiveImage(0);
    setPreviewFailed(false);
  }, [images]);

  useEffect(() => () => {
    if (lensFrameRef.current !== null) cancelAnimationFrame(lensFrameRef.current);
  }, []);

  useEffect(() => {
    if (!mode) return;

    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      if (document.fullscreenElement) {
        void document.exitFullscreen().catch(() => {
          setFullscreenMessage('Could not exit fullscreen. Use your browser controls to leave fullscreen.');
        });
        return;
      }
      setMode(null);
    };

    window.addEventListener('keydown', closeOnEscape, true);
    window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    return () => {
      window.removeEventListener('keydown', closeOnEscape, true);
      previousFocusRef.current?.focus();
    };
  }, [mode]);

  useEffect(() => {
    if (!mode) return;
    setViewerImageLoaded(false);
    setViewerImageFailed(false);
  }, [mode, currentViewerImage]);

  useEffect(() => {
    if (mode !== '360' || frames.length < 2) return;

    let cancelled = false;
    let nextIndex = 0;
    let activeLoads = 0;
    let completed = 0;
    let failures = 0;
    setPreloadedFrames(0);
    setFailedPreloads(0);

    const loadNext = () => {
      if (cancelled || nextIndex >= frames.length || activeLoads >= 4) return;

      const source = frames[nextIndex];
      nextIndex += 1;
      activeLoads += 1;
      const preload = new Image();
      const finish = (failed: boolean) => {
        activeLoads -= 1;
        completed += 1;
        if (failed) failures += 1;
        if (!cancelled) {
          setPreloadedFrames(completed);
          setFailedPreloads(failures);
          loadNext();
        }
      };

      preload.onload = () => finish(false);
      preload.onerror = () => finish(true);
      preload.src = source;
    };

    for (let index = 0; index < Math.min(4, frames.length); index += 1) loadNext();

    return () => {
      cancelled = true;
    };
  }, [frames, mode]);

  const applyTransform = (nextScale: number, x: number, y: number) => {
    const safeScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextScale));
    const rect = stageRef.current?.getBoundingClientRect();
    const maxX = rect ? (rect.width * (safeScale - 1)) / 2 : 0;
    const maxY = rect ? (rect.height * (safeScale - 1)) / 2 : 0;
    const nextPan = {
      x: Math.min(maxX, Math.max(-maxX, safeScale === MIN_ZOOM ? 0 : x)),
      y: Math.min(maxY, Math.max(-maxY, safeScale === MIN_ZOOM ? 0 : y)),
    };

    scaleRef.current = safeScale;
    panRef.current = nextPan;
    setScale(safeScale);
    setPan(nextPan);
  };

  const zoomAround = (
    nextScale: number,
    anchor: Point,
    originScale = scaleRef.current,
    originPan = panRef.current,
  ) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect || originScale <= 0) return;
    const safeScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextScale));
    const ratio = safeScale / originScale;
    const offsetX = anchor.x - rect.left - rect.width / 2;
    const offsetY = anchor.y - rect.top - rect.height / 2;

    applyTransform(
      safeScale,
      offsetX * (1 - ratio) + originPan.x * ratio,
      offsetY * (1 - ratio) + originPan.y * ratio,
    );
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (mode !== 'zoom' || !stage) return;

    const zoomWithWheel = (event: WheelEvent) => {
      event.preventDefault();
      zoomAround(scaleRef.current * (event.deltaY < 0 ? 1.15 : 1 / 1.15), {
        x: event.clientX,
        y: event.clientY,
      });
    };

    stage.addEventListener('wheel', zoomWithWheel, { passive: false });
    return () => stage.removeEventListener('wheel', zoomWithWheel);
  }, [mode]);

  const stageCenter = (): Point => {
    const rect = stageRef.current?.getBoundingClientRect();
    return rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: 0, y: 0 };
  };

  const openViewer = (nextMode: Exclude<ViewerMode, null>) => {
    setFrameIndex(0);
    setScale(MIN_ZOOM);
    scaleRef.current = MIN_ZOOM;
    setPan({ x: 0, y: 0 });
    panRef.current = { x: 0, y: 0 };
    setLensPosition(null);
    setTilt(NEUTRAL_TILT);
    setViewerImageLoaded(false);
    setViewerImageFailed(false);
    setFullscreenMessage('');
    setMode(nextMode);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!mode) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (mode === 'simulated3d') {
      pointerActionRef.current = 'tilt';
      setTilt(getProductTilt(event.clientX, event.clientY, event.currentTarget.getBoundingClientRect()));
      return;
    }

    if (mode === '360') {
      pointerActionRef.current = 'rotate';
      dragStartRef.current = {
        x: event.clientX,
        y: event.clientY,
        panX: 0,
        panY: 0,
        frame: frameIndex,
      };
      return;
    }

    if (pointersRef.current.size >= 2) {
      const [first, second] = Array.from(pointersRef.current.values());
      const dx = second.x - first.x;
      const dy = second.y - first.y;
      pinchStartRef.current = {
        distance: Math.max(1, Math.hypot(dx, dy)),
        midpoint: { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 },
        scale: scaleRef.current,
        pan: panRef.current,
      };
      pointerActionRef.current = 'pinch';
    } else if (scaleRef.current > MIN_ZOOM) {
      pointerActionRef.current = 'pan';
      dragStartRef.current = {
        x: event.clientX,
        y: event.clientY,
        panX: panRef.current.x,
        panY: panRef.current.y,
        frame: frameIndex,
      };
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!mode) return;
    const pointerIsDown = pointersRef.current.has(event.pointerId);
    if (pointerIsDown) pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    const stage = stageRef.current;
    const stageBounds = stage?.getBoundingClientRect();
    if (mode === 'zoom' && event.pointerType === 'mouse' && stageBounds) {
      const imageBounds = stage.querySelector<HTMLImageElement>('.product-viewer-image')?.getBoundingClientRect();
      const insideImage = imageBounds
        && event.clientX >= imageBounds.left
        && event.clientX <= imageBounds.right
        && event.clientY >= imageBounds.top
        && event.clientY <= imageBounds.bottom;
      if (insideImage) {
        const nextPosition = { x: event.clientX - stageBounds.left, y: event.clientY - stageBounds.top };
        if (lensFrameRef.current !== null) cancelAnimationFrame(lensFrameRef.current);
        lensFrameRef.current = requestAnimationFrame(() => {
          setLensPosition(nextPosition);
          lensFrameRef.current = null;
        });
      } else {
        setLensPosition(null);
      }
    } else if (mode === 'simulated3d' && stageBounds
      && (event.pointerType === 'mouse' || pointerActionRef.current === 'tilt')) {
      setTilt(getProductTilt(event.clientX, event.clientY, stageBounds));
    }

    if (!pointerIsDown) return;

    if (mode === '360' && pointerActionRef.current === 'rotate' && frames.length > 1) {
      setFrameIndex(getFrameIndexForDrag(
        dragStartRef.current.frame,
        dragStartRef.current.x,
        event.clientX,
        frames.length,
      ));
      return;
    }

    if (mode !== 'zoom') return;

    if (pointerActionRef.current === 'pinch' && pointersRef.current.size >= 2) {
      const [first, second] = Array.from(pointersRef.current.values());
      const distance = Math.max(1, Math.hypot(second.x - first.x, second.y - first.y));
      const pinch = pinchStartRef.current;
      zoomAround(
        pinch.scale * (distance / pinch.distance),
        pinch.midpoint,
        pinch.scale,
        pinch.pan,
      );
    } else if (pointerActionRef.current === 'pan') {
      const drag = dragStartRef.current;
      applyTransform(
        scaleRef.current,
        drag.panX + event.clientX - drag.x,
        drag.panY + event.clientY - drag.y,
      );
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(event.pointerId);
    if (mode === 'simulated3d') setTilt(NEUTRAL_TILT);
    if (pointersRef.current.size === 0) {
      pointerActionRef.current = null;
      return;
    }

    if (mode === 'zoom' && scaleRef.current > MIN_ZOOM) {
      const remaining = Array.from(pointersRef.current.values())[0];
      pointerActionRef.current = 'pan';
      dragStartRef.current = {
        x: remaining.x,
        y: remaining.y,
        panX: panRef.current.x,
        panY: panRef.current.y,
        frame: frameIndex,
      };
    }
  };

  const handleStageKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (mode === 'zoom') {
      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        zoomAround(scaleRef.current * 1.2, stageCenter());
      } else if (event.key === '-') {
        event.preventDefault();
        zoomAround(scaleRef.current / 1.2, stageCenter());
      } else if (event.key === '0') {
        event.preventDefault();
        applyTransform(MIN_ZOOM, 0, 0);
      }
    } else if (mode === 'simulated3d' && event.key === '0') {
      event.preventDefault();
      setTilt(NEUTRAL_TILT);
    } else if (mode === '360' && frames.length > 0) {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        setFrameIndex((current) => (current + direction + frames.length) % frames.length);
      }
    }
  };

  const requestFullscreen = async () => {
    if (!viewerRef.current?.requestFullscreen) {
      setFullscreenMessage('Fullscreen is not supported by this browser. The viewer remains open.');
      return;
    }

    try {
      await viewerRef.current.requestFullscreen();
      setFullscreenMessage('');
    } catch {
      setFullscreenMessage('Fullscreen access was blocked. The viewer remains open.');
    }
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    if (mode === 'zoom' && event.pointerType === 'mouse') setLensPosition(null);
    if (mode === 'simulated3d' && event.pointerType === 'mouse') setTilt(NEUTRAL_TILT);
  };

  const getLensStyle = (): React.CSSProperties | undefined => {
    const stage = stageRef.current;
    const productImage = stage?.querySelector<HTMLImageElement>('.product-viewer-image');
    if (!stage || !productImage || !lensPosition) return undefined;

    const bounds = productImage.getBoundingClientRect();
    const pointX = stage.getBoundingClientRect().left + lensPosition.x - bounds.left;
    const pointY = stage.getBoundingClientRect().top + lensPosition.y - bounds.top;

    return {
      left: lensPosition.x - LENS_RADIUS,
      top: lensPosition.y - LENS_RADIUS,
      backgroundImage: `url("${zoomSource.replace(/["\\]/g, '\\$&')}")`,
      backgroundSize: `${bounds.width * magnification}px ${bounds.height * magnification}px`,
      backgroundPosition: `${LENS_RADIUS - pointX * magnification}px ${LENS_RADIUS - pointY * magnification}px`,
    };
  };

  return (
    <>
      <div className="product-viewer-preview">
        <div className="product-viewer-preview-stage">
          {previewFailed ? (
            <div className="product-viewer-preview-error" role="status">
              <span>Product image unavailable.</span>
              <button
                type="button"
                onClick={() => {
                  setPreviewFailed(false);
                  if (previewRef.current) previewRef.current.src = displayedImage;
                }}
              >
                Try again
              </button>
            </div>
          ) : (
            <img
              ref={previewRef}
              key={displayedImage}
              src={displayedImage}
              alt={name}
              loading="lazy"
              decoding="async"
              onError={() => setPreviewFailed(true)}
            />
          )}
          {images.length > 1 && (
            <span className="product-viewer-image-count" aria-live="polite">
              {activeImage + 1} / {images.length}
            </span>
          )}
          {zoomEnabled !== false && (
            <button type="button" className="product-viewer-action" onClick={() => openViewer('zoom')}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="10.8" cy="10.8" r="6.3" />
                <path d="m15.5 15.5 4.2 4.2M10.8 7.5v6.6M7.5 10.8h6.6" />
              </svg>
              Zoom &amp; Inspect
            </button>
          )}
          {simulated3dEnabled !== false && (
            <button type="button" className="product-viewer-action product-viewer-action-3d" onClick={() => openViewer('simulated3d')}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
                <path d="m4.5 7.8 7.5 4.3 7.5-4.3M12 12.1V21" />
              </svg>
              3D Preview
            </button>
          )}
          {view360Enabled !== false && (
            <button type="button" className="product-viewer-action product-viewer-action-secondary" onClick={() => openViewer('360')}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4.5 9.5a8 8 0 0 1 13-3L20 9" />
                <path d="M20 4.5V9h-4.5M19.5 14.5a8 8 0 0 1-13 3L4 15" />
                <path d="M4 19.5V15h4.5" />
              </svg>
              360 View
            </button>
          )}
        </div>
        {images.length > 1 && (
          <div className="product-viewer-thumbnails" aria-label="Product gallery">
            {images.map((source, index) => (
              <button
                key={`${source}-${index}`}
                type="button"
                className={index === activeImage ? 'is-selected' : ''}
                aria-label={`Show product image ${index + 1}`}
                aria-pressed={index === activeImage}
                onClick={() => setActiveImage(index)}
              >
                <img src={source} alt="" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        )}
      </div>
      {mode && typeof document !== 'undefined' && createPortal(
        <div
          ref={viewerRef}
          className="product-viewer-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={
            mode === 'zoom'
              ? `Zoom and inspect ${name}`
              : mode === 'simulated3d'
                ? `Simulated 3D preview of ${name}`
                : `360 degree view of ${name}`
          }
        >
          <header className="product-viewer-toolbar">
            <div className="product-viewer-heading">
              <p>
                {mode === 'zoom'
                  ? 'ZOOM & INSPECT'
                  : mode === 'simulated3d'
                    ? 'SIMULATED 3D PREVIEW'
                    : '360° PRODUCT VIEW'}
              </p>
              <h2>{name}</h2>
            </div>
            <div className="product-viewer-toolbar-actions">
              <button type="button" onClick={requestFullscreen} aria-label="Enter fullscreen">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 4H4v4M16 4h4v4M20 16v4h-4M4 16v4h4" />
                </svg>
                Fullscreen
              </button>
              <button
                ref={closeButtonRef}
                type="button"
                className="product-viewer-close"
                onClick={() => setMode(null)}
                aria-label="Close product viewer"
              >
                ×
              </button>
            </div>
          </header>

          <div
            ref={stageRef}
            className={`product-viewer-stage${mode === '360' ? ' is-rotating' : mode === 'simulated3d' ? ' is-3d' : ' is-zooming'}${lensPosition ? ' is-lens-active' : ''}`}
            tabIndex={0}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            onKeyDown={handleStageKeyDown}
            aria-label={
              mode === '360'
                ? 'Drag horizontally to rotate the product'
                : mode === 'simulated3d'
                  ? 'Move or drag to tilt the product image'
                  : 'Drag to inspect the zoomed image'
            }
          >
            {mode === '360' && view360Enabled === false ? (
              <div className="product-viewer-empty">
                <span className="product-viewer-empty-icon" aria-hidden="true">360°</span>
                <h3>360° view is turned off</h3>
                <p>This product’s 360° viewer is currently disabled.</p>
              </div>
            ) : mode === '360' && frames.length < 2 ? (
              <div className="product-viewer-empty">
                <span className="product-viewer-empty-icon" aria-hidden="true">360°</span>
                <h3>{frames.length === 0 ? '360° images aren’t available yet' : 'More 360° images are needed'}</h3>
                <p>
                  {frames.length === 0
                    ? 'There are no rotation frames for this product. You can still zoom in to inspect its image.'
                    : 'Add at least two real product frames to enable rotation. You can still zoom in to inspect its image.'}
                </p>
              </div>
            ) : viewerImageFailed ? (
              <div className="product-viewer-empty" role="alert">
                <h3>We couldn’t load this image</h3>
                <p>Check your connection and try loading the image again.</p>
                <button
                  type="button"
                  className="product-viewer-primary"
                  onClick={() => {
                    setViewerImageFailed(false);
                    setViewerImageLoaded(false);
                    setRetryKey((current) => current + 1);
                  }}
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                {!viewerImageLoaded && (
                  <div className="product-viewer-loading" role="status">
                    <span className="product-viewer-spinner" />
                    <span>{mode === '360' ? `Loading 360° frames ${preloadedFrames}/${frames.length}` : 'Loading high-resolution image'}</span>
                  </div>
                )}
                <img
                  key={`${currentViewerImage}-${retryKey}`}
                  src={currentViewerImage}
                  alt={name}
                  draggable={false}
                  loading="eager"
                  decoding="async"
                  onLoad={() => {
                    setViewerImageLoaded(true);
                    setViewerImageFailed(false);
                  }}
                  onError={() => {
                    setViewerImageLoaded(false);
                    setViewerImageFailed(true);
                  }}
                  className={`product-viewer-image${mode === 'zoom' ? ' is-zoomed' : mode === 'simulated3d' ? ` is-tilting${tilt.rotateX || tilt.rotateY ? ' is-tilted' : ''}` : ''}`}
                  style={mode === 'zoom'
                    ? { transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})` }
                    : mode === 'simulated3d'
                      ? { transform: `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(1.035)` }
                      : undefined}
                />
                {mode === 'simulated3d' && (
                  <div
                    className="product-viewer-glare"
                    aria-hidden="true"
                    style={{
                      background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,.32), transparent 48%)`,
                      opacity: tilt.rotateX === 0 && tilt.rotateY === 0 ? 0 : 1,
                    }}
                  />
                )}
                {mode === 'zoom' && lensPosition && viewerImageLoaded && (
                  <div className="product-viewer-lens" aria-hidden="true" style={getLensStyle()}>
                    <span>{magnification}×</span>
                  </div>
                )}
              </>
            )}
          </div>

          <footer className="product-viewer-controls">
            {mode === 'zoom' ? (
              <>
                <div className="product-viewer-button-group">
                  <button type="button" onClick={() => zoomAround(scaleRef.current / 1.25, stageCenter())} aria-label="Zoom out">
                    −
                  </button>
                  <span aria-live="polite">{Math.round(scale * 100)}%</span>
                  <button type="button" onClick={() => zoomAround(scaleRef.current * 1.25, stageCenter())} aria-label="Zoom in">
                    +
                  </button>
                </div>
                <div className="product-viewer-magnification" role="group" aria-label="Magnification level">
                  {MAGNIFICATION_LEVELS.map((level) => (
                    <button
                      key={level}
                      type="button"
                      aria-pressed={magnification === level}
                      onClick={() => {
                        setMagnification(level);
                        zoomAround(level, stageCenter());
                      }}
                    >
                      {level}×
                    </button>
                  ))}
                </div>
                <button type="button" className="product-viewer-reset" onClick={() => applyTransform(MIN_ZOOM, 0, 0)}>
                  Reset view
                </button>
                <p>Scroll to zoom · Drag to pan · Pinch to inspect</p>
              </>
            ) : mode === 'simulated3d' ? (
              <p>Move or drag to tilt · Simulated from one image, not a 360° rotation</p>
            ) : (
              <>
                {frames.length > 0 && (
                  <span className="product-viewer-frame-count" aria-live="polite">
                    Frame {frameIndex + 1} of {frames.length}
                    {failedPreloads > 0 ? ` · ${failedPreloads} unavailable` : ''}
                  </span>
                )}
                <p>{frames.length > 1 ? 'Drag or swipe horizontally to rotate' : 'A 360° rotation is not configured for this product.'}</p>
              </>
            )}
            {fullscreenMessage && <span className="product-viewer-status" role="status">{fullscreenMessage}</span>}
          </footer>
        </div>,
        document.querySelector('.site-shell') ?? document.body,
      )}
    </>
  );
};
