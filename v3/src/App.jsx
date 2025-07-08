import { useState, useRef, useEffect } from 'react';
// ⬇️ Fabric v6 – named imports
import { Canvas, FabricImage, Rect } from 'fabric';
import Gallery from './components/Gallery';
import styles from './App.module.scss';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [apiMessage, setApiMessage] = useState(''); // ⬅️ FastAPI message

  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  // 🔁 Fetch from FastAPI backend
  useEffect(() => {
    fetch('http://127.0.0.1:8000/')
      .then((response) => response.json())
      .then((data) => {
        setApiMessage(data.message); // Assumes FastAPI returns { "message": "..." }
      })
      .catch((error) => {
        console.error('Error fetching from FastAPI:', error);
        setApiMessage('Failed to connect to FastAPI');
      });
  }, []);

  // 🎨 Setup Fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fCanvas = new Canvas(canvasRef.current, {
      selection: false,
      preserveObjectStacking: true,
    });
    fabricRef.current = fCanvas;

    return () => {
      fCanvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  // 🖼️ Handle image + region rendering
  useEffect(() => {
    const fCanvas = fabricRef.current;
    if (!fCanvas) return;

    fCanvas.clear();

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

        const region = new Rect({
          left: img.left + 100 * scale,
          top:  img.top  + 60  * scale,
          width: 200 * scale,
          height: 140 * scale,
          fill: 'rgba(255,0,0,0.3)',
          stroke: 'red',
          strokeWidth: 2,
          transparentCorners: false,
          cornerStyle: 'circle',
        });
        fCanvas.add(region);
      })
      .catch((err) => {
        console.error('Image load failed', err);
      });
  }, [selectedImage]);

  return (
    <div className={styles.container}>
      <div className={styles.galleryContainer}>
        <Gallery onImageSelect={setSelectedImage} />
      </div>

      <main>
        <div className={styles.canvasContainer}>
          <canvas ref={canvasRef} width={800} height={600} />
        </div>

        <div className={styles.inspectorContainer}>
          <p><strong>FastAPI says:</strong> {apiMessage}</p>
        </div>
      </main>
    </div>
  );
}

export default App;
