"use client"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { useShoppingCart } from "use-shopping-cart"
  

export default function ShoppingCartModal() {

    const {cartCount, handleCartClick, shouldDisplayCart} = useShoppingCart()

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
                                    <h1 className="text-3xl py-6">hay x Articulos en el carrito</h1>
                                )}
                            </ul>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}