import { generateContenidoZona } from "@/lib/generadorContenidoZona";

type Props = {
  comuna: string;
  zonas: string[];
};

export default function ZonasSection({ comuna, zonas }: Props) {
  if (!zonas || zonas.length === 0) return null;

  return (
    <section style={{ marginTop: "60px" }}>
      <h2>Cobertura en sectores de {comuna}</h2>

      {zonas.map((zona) => {
        const contenido = generateContenidoZona(zona, comuna);

        return (
          <div key={zona} style={{ marginBottom: "30px" }}>
            <h3>{contenido.titulo}</h3>

            <p>{contenido.parrafo1}</p>
            <p>{contenido.parrafo2}</p>
            <p>{contenido.parrafo3}</p>

            <a
              href={`https://wa.me/56940918672?text=Necesito%20destape%20en%20${zona}%20${comuna}`}
              target="_blank"
            >
              Solicitar servicio en {zona}
            </a>
          </div>
        );
      })}
    </section>
  );
}
