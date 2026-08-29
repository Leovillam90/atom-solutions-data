import Seccion1 from './landing/Seccion1';
import Seccion2 from './landing/Seccion2';
import Seccion3 from './landing/Seccion3';
import Seccion4 from './landing/Seccion4';
import Seccion5 from './landing/Seccion5';
import Seccion6 from './landing/Seccion6';

// Componente separador neón reutilizable
function SeparadorNeon() {
  return (
    <div className="relative max-w-6xl mx-auto px-6 my-6">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#0DEDC0]/30 to-transparent" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#070B14]">
      {/* SECCIÓN 1 */}
      <Seccion1 variante="perspectiveGrid" />

      {/* SEPARADOR 1 */}
      

      {/* SECCIÓN 2 */}
      <Seccion2 variante="spotlightCyan" />

      {/* SEPARADOR 2 */}
     

      {/* SECCIÓN 3 */}
      <Seccion3 variante="perspectiveGrid" />

      {/* SEPARADOR 3 */}
      

      {/* SECCIÓN 4 */}
      <Seccion4 variante="dualAmbient" />

      {/* SEPARADOR 4 */}
      

      {/* SECCIÓN 5 */}
      <Seccion5 variante="perspectiveGrid" />

      {/* SEPARADOR 5 */}
      <SeparadorNeon />

      {/* SECCIÓN 6 */}
      <Seccion6 variante="perspectiveGrid" />
    </div>
  );
}