import { useEffect } from 'react';

function useKeyPress(key, handleKeypress) {
  useEffect(() => {
    function onKeyUp(e) {
      if (e.key === key) handleKeypress();
    }
    window.addEventListener('keyup', onKeyUp);
    return () => window.removeEventListener('keyup', onKeyUp);
  }, []);
}

export default useKeyPress;