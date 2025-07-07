import React from 'react';
import styles from './Slider.module.scss';

interface SliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ label, min, max, step, value, onChange }) => {
  return (
    <div className={styles.sliderContainer}>
      <label className={styles.label}>{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={styles.slider}
      />
      {/* <span className={styles.value}>{value}</span> */}
    </div>
  );
};

export default Slider;