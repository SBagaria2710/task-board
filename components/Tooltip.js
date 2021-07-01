import React, { useRef } from 'react';

//Styles
import s from '../styles/Tooltip.module.css';

function Tooltip({ children, tooltipText, placement }) {
  const tipRef = useRef(null);
  function handleMouseEnter() {
      tipRef.current.style.opacity = 1;
  }
  function handleMouseLeave() {
      tipRef.current.style.opacity = 0;
  }
  return (
      <div
          className={s.tooltipContainer}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
      >
          <div className={`${s.tooltip} ${s[placement]}`} ref={tipRef}>
            {tooltipText}
          </div>
          {children}
      </div>
  );
}

Tooltip.defaultProps = {
  placement: "left",
}


export default Tooltip;
