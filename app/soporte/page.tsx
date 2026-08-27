import Seccion1 from '@/app/soporte/paginas/Seccion1';
import Seccion2 from '@/app/soporte/paginas/Seccion2';
import Seccion3 from '@/app/soporte/paginas/Seccion3';

export default function SoportePage() {
  return (
    <div className="min-h-screen bg-[#091A23]">
      <Seccion1 variante="darkNoise" />
      <Seccion2 variante="darkNoise" />
      <Seccion3 variante="darkNoise" />
    </div>
  );
}