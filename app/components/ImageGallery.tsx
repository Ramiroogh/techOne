"use client"
import Image from "next/image";
import { urlFor } from "../lib/sanity";
import { useState } from "react";

interface iAppProps {
    images:any;
}

export default function ImageGallery({images}: iAppProps) {
    // Estado para la primera imagen GRANDE en index 0, del producto
    const [bigImage, setBigImage] = useState(images[0]);

    // Alternar imagenes
    const handleSmallImageClick = (image: any) => {
        setBigImage(image);
    };

    return(
        <div className="grid gap-4 lg:grid-cols-5">
            <div className="order-last flex gap-5 lg:order-none lg:flex-col">
                {images.map((image: any, index: any) => (
                    <div key={index} className="overflow-hidden rounded-lg bg-gray-100">
                        <Image
                        src={urlFor(image).url()}
                        alt="image"
                        className="h-full w-full object-cover object-center cursor-pointer"
                        width={500}
                        height={500}
                        priority
                        onClick={() => handleSmallImageClick(image)}
                        />
                    </div>
                ))}
            </div>

            <div className="relative overflow-hidden rounded-lg bg-gray-100 lg:col-span-4">
                <Image
                src={urlFor(bigImage).url()}
                width={500}
                height={500}
                alt="image"
                priority
                />

                <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm uppercase tracking-wider text-white">Sale</span>
            </div>
        </div>
    )
}