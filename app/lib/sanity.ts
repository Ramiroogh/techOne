import imageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";

// Crear conexion de Cliente Sanity
export const client = createClient({
    projectId: 'o74sqcnh',
    dataset: 'production',
    apiVersion: '2022-03-07',
    useCdn: true,
})

// Configurar herramienta para obtener URL de Imagenes
const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
    return builder.image(source)
}