'use client';

import Seccion1 from './paginas/inicio/Seccion1';
import Seccion2 from './paginas/inicio/Seccion2';
import Seccion3 from './paginas/inicio/Seccion3';
import Seccion4 from './paginas/inicio/Seccion4';
import Seccion5 from './paginas/inicio/Seccion5';
import Seccion6 from './paginas/inicio/Seccion6';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#091A23]">
      <Seccion1 variante="hexGrid" />
      <Seccion2 variante="spotlightCyan" />
      <Seccion3 variante="hexGrid" />
      <Seccion4 variante="dualAmbient" />
      <Seccion5 variante="hexGrid" />
      <Seccion6 variante="cyanSolidDots" />
    </main>
  );
}