import React from 'react';
import styles from './Toolbar.module.scss';

const Toolbar = ({ onSelectTool }) => {
  return (
    <div className={styles.toolbar}>
      <button onClick={() => onSelectTool('select')}>Select</button>
      <button onClick={() => onSelectTool('arrow')}>Arrow</button>
      <button onClick={() => onSelectTool('text')}>Text</button>
      <button onClick={() => onSelectTool('circle')}>Circle</button>
      <button onClick={() => onSelectTool('rectangle')}>Rectangle</button>
      <button onClick={() => onSelectTool('polygon')}>Polygon</button>
    </div>
  );
};

export default Toolbar;
