import Pagina1 from './paginas/Pagina1';
import Pagina2 from './paginas/Pagina2';
import Pagina3 from './paginas/Pagina3';

// Componente separador reutilizable
function SeparadorNeon() {
  return (
    <div className="relative max-w-6xl mx-auto px-6 my-6">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#0DEDC0]/30 to-transparent" />
    </div>
  );
}

export default function NoticiasPage() {
  return (
    <div className="min-h-screen bg-[#070B14] text-white">
      {/* PÁGINA 1 */}
      <Pagina1 variante="hexGrid" />

      {/* SEPARADOR 1 */}
      <SeparadorNeon />

      {/* PÁGINA 2 */}
      <Pagina2 variante="hexGrid" />

      {/* SEPARADOR 2 */}
      <SeparadorNeon />

      {/* PÁGINA 3 */}
      <Pagina3 variante="hexGrid" />
    </div>
  );
}