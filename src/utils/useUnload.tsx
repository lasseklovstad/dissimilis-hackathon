import { useRef, useEffect } from 'react';

const useUnload = () => {

  useEffect(() => {

    window.addEventListener("beforeunload", e => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave?';
    });

    return () => window.removeEventListener("beforeunload", e => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave?';
    });
  }, []);
};

export default useUnload;