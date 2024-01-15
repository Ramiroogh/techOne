import ImageGallery from "@/app/components/ImageGallery";
import { fullProduct } from "@/app/interfaces/interface";
import { client } from "@/app/lib/sanity";

async function getData(slug: string) {
    const query = `*[_type == 'product' && slug.current == "${slug}"][0]{
        _id,
        images,
        price,
        name,
        description,
        "slug": slug.current,
        "categoryName": category->name,
    }`;
    const data = await client.fetch(query);
    return data;
}

// Desestructuración para capturar el slug, y Tiparlo al mismo tiempo.
// el slug, se obtiene cuando se monta la funcion ProductPage, y luego
// se la pasa a data, como parametro.
export default async function ProductPage({params} : { params : { slug: string;} }) {
    
    // Cuando obtengo los datos, los moldeo con la interfaz de fullProduct.
    const data: fullProduct = await getData(params.slug);
    
    return(
        <div className="bg-white">
            <div className="mx-auto max-w-screen-xl px-4 md:px-8">
                <div className="grid gap-8 md:grid-cols-2">
                    <ImageGallery images={data.images}/>
                </div>
            </div>
        </div>
    )
}