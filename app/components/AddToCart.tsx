"use client"
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useShoppingCart } from "use-shopping-cart";
import { urlFor } from "../lib/sanity";

export interface ProductCart{
    name: string;
    description: string;
    currency: string;
    image: any;
    price: number;
    id: string;
}

// Añadir producto al carrito y simultaneamente, ir al Carrito
export default function AddToCart({name, description, currency, image, price, id} : ProductCart) {
    const {addItem, handleCartClick} = useShoppingCart()
    const product = {
        name: name,
        description: description,
        currency: currency,
        image: urlFor(image).url(),
        price: price,
        id: id,
    }

    return (
        <Button onClick={() => { addItem(product), handleCartClick(); }} className="text-sm"><ShoppingCart className="w-5 h-5 mr-3"/>Añadir al Carrito</Button>
    )
}