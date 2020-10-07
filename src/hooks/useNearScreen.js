import { useEffect, useRef, useState } from 'react';

export function useNearScreen() {
  const element = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    // Envolvemos la ternaria en una promesa
    // para que siempre nos devuelva el resultado de una promesa
    Promise.resolve(
      typeof window.IntersectionObserver !== 'undefined'
        ? window.IntersectionObserver
        // Este import devuelve una promesa, que se resolverá cuando la dependencia esté lista
        : import('intersection-observer'),
    ).then(() => {
      // Un observer que te indica si es visible un elemento, entre otras cosas
      const observer = new window.IntersectionObserver((entries) => {
        const { isIntersecting } = entries[0];
        if (isIntersecting) {
          setShow(true);
          // Porque sólo queremos que se actualice un vez
          // y una vez que está mostrándose, se puede desconectar:
          observer.disconnect();
        }
      });
      observer.observe(element.current);
    });
  }, [element]);
  return [show, element];
}
