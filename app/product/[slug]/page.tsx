// UI
import AddToCart from "@/app/components/AddToCart";
import ImageGallery from "@/app/components/ImageGallery";
import { Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

import { fullProduct } from "@/app/interfaces/interface";
import { client } from "@/app/lib/sanity";


async function getData(slug: string) {
    // Para esta query, se utiliza la interfaz "fullProduct".
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

                    <div className="md:py-8">
                        <div className="mb-2 md:mb-3">
                            <span className="mb-0.5 inline-block text-gray-500">{data.categoryName}</span>
                            <h2 className="text-2xl text-gray-800 font-bold lg_text-3xl">{data.name}</h2>
                        </div>

                        <div className="mb-6 flex items-center gap-3 md:mb-10">
                            <Button className="rounded-full gap-x-2">
                                <span className="text-small">4.2</span>
                                <Star className="h-5 w-6"/>
                            </Button>

                            <span className="text-sm text-gray-500 transition duration-100">56 Ratings</span>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-end gap-2">
                                <span className="text-xl md:text-2xl font-bold text-gray-800">${data.price}</span>
                                <span className="mb-0.5 text-red-500 line-through">${data.price + 2000}</span>
                            </div>

                            <div className="mb-6 flex items-center gap-2 text-gray-500">
                                <Truck className="w-6 h-6"/>
                                <span className="text-sm">Envio en 5-12 Días</span>
                            </div>

                            <div className="flex gap-2.5">
                                <AddToCart
                                    currency="USD"
                                    name={data.name}
                                    description={data.description}
                                    image={data.images[0]}
                                    price={data.price}
                                    key={data._id}
                                    id={data._id}
                                />
                                <Button variant={"secondary"}>Chekout now</Button>
                            </div>

                            <p className="mt-12 text-base text-gray-500 tracking-wide">{data.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}