import Link from "next/link";
import { simplifiedProduct } from "../interfaces/interface";
import { client } from "../lib/sanity";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

async function getData() {
    const query = `*[_type == 'product'][0...4] | order(_createdAt desc) {
        _id,
        price,
        name,
        "slug": slug.current,
        "categoryName": category->name,
        "imageUrl":  images[0].asset->url
    }`;
    const data = await client.fetch(query)
    return data;
}

export default async function Newest() {
    const data: simplifiedProduct[] = await getData();

    return(
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold tracing-tight text-gray-900">Nuestros productos más nuevos</h2>
                
                    <Link className="text-primary flex items-center font-bold gap-x-1 hover:text-slate-500" href="/all">Ver todo<span><ArrowRight /></span></Link>
                </div>

                <div className="mt-6 grid frid-cols-1 gap-x-6 gap-y-10 sm:frid-cols2 lg:grid-cols-4 xl:gap-x-8">
                    {data.map((product) => (
                        <div key={product._id} className="group relative">
                            <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
                                <Image src={product.imageUrl} alt="image" width={500} height={500} className="w-full h-full object-cover object-center lg:h-full lg:w-full"/>
                            </div>

                            <div className="mt-4 flex justify-between">
                                <div >
                                    <h3 className="text-lg text-gray-700 justify-between">
                                        <Link href={`/product/${product.slug}`}>
                                        {product.name}
                                        </Link>
                                    </h3>
                                    <p className="text-sm text-gray-700">{product.categoryName}</p>
                                </div>
                                <p className="font-medium">$ {product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}