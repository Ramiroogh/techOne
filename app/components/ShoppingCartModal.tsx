"use client"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import Image from "next/image"
import { useShoppingCart } from "use-shopping-cart"
  

export default function ShoppingCartModal() {

    // Hook para manejar el estado del carrito, desde aca, y en Navbar.tsx
    const {cartCount, handleCartClick, shouldDisplayCart, cartDetails, removeItem, totalPrice} = useShoppingCart()

    return(
        <div>
            <Sheet open={shouldDisplayCart} onOpenChange={() => handleCartClick()}>
                <SheetContent className="sm:max-w-lg w-[90vw]">
                    <SheetHeader>
                        <SheetTitle>Are you absolutely sure?</SheetTitle>
                    </SheetHeader>

                    <div className="h-full flex flex-col justify-between">
                        <div className="mt-8 flex-1 overflow-y-auto">
                            <ul className="-my-6 divide-y divide-gray-200">
                                {cartCount === 0 ? (
                                    <h1 className=" py-6">No hay Articulos en el Carrito</h1>
                                ): (
                                    <>
                                        {Object.values(cartDetails ?? {}).map((entry) => (
                                            <li key={entry.id} className="flex py-6">
                                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                    <Image src={entry.image as string}
                                                    alt="product image"
                                                    width={100}
                                                    height={100}
                                                    />
                                                </div>
                                                
                                                <div className="ml-4 flex flex-1 flex-col">
                                                    <div>
                                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                                            <h3>{entry.name}</h3>
                                                            <p className="ml-4">${entry.price}</p>
                                                        </div>
                                                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{entry.description}</p>
                                                    </div>

                                                    <div className="flex flex-1 items-end justify-between text-sm">
                                                        <p className="text-gray-500 text-sm">Cantidad: {entry.quantity}</p>

                                                        <div className="flex">
                                                            <button
                                                                onClick={() => removeItem(entry.id)}
                                                                type="button"
                                                                className="font-medium text-primary hover:text-primary/80"
                                                            >Eliminar</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </>
                                )}
                            </ul>
                        </div>

                        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                            <div className="flex justify-between text-base font-medium text-gray-900">
                                <p className="">Subtotal: </p>
                                <p className="">$ {totalPrice}</p>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">Los gastos de envío y los impuestos se calculan al finalizar la compra</p>

                            <div className="mt-6">
                                <Button className="checkout">Checkout</Button>
                            </div>

                            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                <p>O {" "} <button onClick={() => handleCartClick()} className="font-medium text-primary hover:text-primary/80">Continuar Comprando</button></p>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}