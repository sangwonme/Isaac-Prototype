import { useState, useRef, useEffect } from 'react';
import Gallery from './components/Gallery';
import styles from './App.module.scss';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (selectedImage) {
      const image = new Image();
      image.src = selectedImage.src;
      image.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        const scale = Math.min(canvas.width / image.width, canvas.height / image.height);
        const x = (canvas.width / 2) - (image.width / 2) * scale;
        const y = (canvas.height / 2) - (image.height / 2) * scale;
        context.drawImage(image, x, y, image.width * scale, image.height * scale);
      };
    } else {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [selectedImage]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.galleryContainer}>
          <Gallery onImageSelect={setSelectedImage} />
        </div>

        <main>
          <div className={styles.canvasContainer}>
            <canvas ref={canvasRef} width="800" height="600" />
          </div>

          <div className={styles.inspectorContainer}>

          </div>
        </main>

      </div>
    </>
  );
}

export default App;

