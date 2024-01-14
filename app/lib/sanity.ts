import imageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";

export const client = createClient({
    projectId: 'o74sqcnh',
    dataset: 'production',
    apiVersion: '13-1-2024',
    useCdn: true,
})

const builder = imageUrlBuilder

export function urlFor(source: any) {
    return builder.image(source)
}