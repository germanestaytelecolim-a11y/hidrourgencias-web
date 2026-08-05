import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>Hidrourgencias SpA · Servicios sanitarios técnicos en la Región de Valparaíso.</p>
        <Link href="/creditos-imagenes" className="font-semibold text-slate-200 underline-offset-4 hover:underline">
          Créditos de imágenes
        </Link>
      </div>
    </footer>
  );
}
