import React, { useState, useRef } from 'react';
import styles from './Gallery.module.scss';

const Gallery = ({ onImageSelect }) => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleAddClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now(),
          src: e.target.result,
        };
        setImages((prevImages) => [...prevImages, newImage]);
        handleImageClick(newImage);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    onImageSelect(image);
  };

  return (
    <div className={styles.gallery}>
      <div className={styles.addButton} onClick={handleAddClick}>
        +
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/*"
      />
      {images.map((image) => (
        <div
          key={image.id}
          className={`${styles.galleryItem} ${
            selectedImage && selectedImage.id === image.id ? styles.selected : ''
          }`}
          onClick={() => handleImageClick(image)}
        >
          <img src={image.src} alt="gallery item" />
        </div>
      ))}
    </div>
  );
};

export default Gallery;
