import { useState, useRef, useEffect, useCallback } from 'react';
// Fabric v6 – named imports
import { Canvas, FabricImage, Rect } from 'fabric';
import Gallery from './components/Gallery';
import styles from './App.module.scss';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [drawMode, setDrawMode] = useState(false);

  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  /* ───────────────────────────
   * 1) Canvas Initialization & Drawing Handler
   * ─────────────────────────── */
  useEffect(() => {
    if (!canvasRef.current) return;

    // 1‑1) Create fabric.Canvas
    const fCanvas = new Canvas(canvasRef.current, {
      selection: true,
      preserveObjectStacking: true,
    });
    fabricRef.current = fCanvas;

    // 1‑2) Region Drawing Logic
    let isDown = false;
    let startX = 0;
    let startY = 0;
    let rect; // Rectangle currently being drawn

    const mouseDown = (opt) => {
      if (!drawMode) return; // Ignore if not in drawing mode

      const { x, y } = fCanvas.getPointer(opt.e);
      isDown = true;
      startX = x;
      startY = y;

      rect = new Rect({
        left: x,
        top: y,
        width: 0,
        height: 0,
        fill: 'rgba(0,153,255,0.3)',
        stroke: '#0099ff',
        strokeWidth: 2,
        transparentCorners: false,
        cornerStyle: 'circle',
      });
      fCanvas.add(rect);
    };

    const mouseMove = (opt) => {
      if (!isDown || !drawMode) return;
      const { x, y } = fCanvas.getPointer(opt.e);

      const w = x - startX;
      const h = y - startY;

      // Adjust coordinates for negative dragging
      rect.set({
        width: Math.abs(w),
        height: Math.abs(h),
        left: w < 0 ? x : startX,
        top:  h < 0 ? y : startY,
      });
      rect.setCoords();
      fCanvas.requestRenderAll();
    };

    const mouseUp = () => {
      if (!drawMode) return;
      isDown = false;
      rect = null; // A new object has been completed
    };

    fCanvas.on('mouse:down', mouseDown);
    fCanvas.on('mouse:move', mouseMove);
    fCanvas.on('mouse:up', mouseUp);

    // 1‑3) Cleanup on unmount
    return () => {
      fCanvas.off('mouse:down', mouseDown);
      fCanvas.off('mouse:move', mouseMove);
      fCanvas.off('mouse:up', mouseUp);

      fCanvas.dispose();
      fabricRef.current = null;
    };
  }, [drawMode]);

  /* ───────────────────────────
   * 2) Redraw whenever the image changes
   * ─────────────────────────── */
  useEffect(() => {
    const fCanvas = fabricRef.current;
    if (!fCanvas) return;

    fCanvas.clear(); // Remove all objects

    if (!selectedImage) return;

    FabricImage.fromURL(selectedImage.src, { crossOrigin: 'anonymous' })
      .then((img) => {
        const maxW = fCanvas.getWidth();
        const maxH = fCanvas.getHeight();
        const scale = Math.min(maxW / img.width, maxH / img.height);

        img.set({
          left: (maxW - img.width * scale) / 2,
          top:  (maxH - img.height * scale) / 2,
          scaleX: scale,
          scaleY: scale,
          selectable: false,
        });

        fCanvas.add(img);
        fCanvas.sendToBack(img);
      })
      .catch(console.error);
  }, [selectedImage]);

  const toggleDrawMode = useCallback(() => setDrawMode((prev) => !prev), []);

  return (
    <div className={styles.container}>
      <div className={styles.galleryContainer}>
        <Gallery onImageSelect={setSelectedImage} />
        <button
          type="button"
          className={drawMode ? styles.activeBtn : styles.btn}
          onClick={toggleDrawMode}
        >
          {drawMode ? 'Done' : 'Select Region'}
        </button>
      </div>

      <main>
        <div className={styles.canvasContainer}>
          {/* <canvas> controlled by fabric.js */}
          <canvas ref={canvasRef} width={800} height={600} />
        </div>

        <div className={styles.inspectorContainer}>
          {/* Display selected object properties, etc. */}
        </div>
      </main>
    </div>
  );
}

export default App;
