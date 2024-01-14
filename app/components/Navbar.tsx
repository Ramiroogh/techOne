"use client"
// UI
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    {name: 'Home', href: '/'},
    {name: 'Laptop', href: '/Laptop'},
    {name: 'Smartphone', href: '/Smartphone'}
]

export default function Navbar() {
    const pathname = usePathname();

    return (
        <header className="mb-8 border-b">
            <div className="flex items-center justify-between mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl">
                <Link href='/'>
                    <h1 className="text-2xl md:text-4xl font-bold">
                    Tech<span className="text-primary">One</span>
                    </h1>
                </Link>

                <nav className="hidden gap-12 lg:flex 2xl:ml-16">
                    {links.map((link, index) => (
                        <div key={index}>
                            {pathname === link.href ? (
                                <Link href={link.href} className="text-lg font-semibold text-primary">
                                    {link.name}
                                </Link>
                            ) : (
                                <Link href={link.href} className="text-lg font-semibold text-gray-600">
                                    {link.name}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="flex divide-b border-r sm:border-l">
                    <Button className="flex flex-col gap-y-1.5 h-12 w-12 sm:h-20 sm:w-20 md:h-20 md:w-20 rounded-none bg-violet-800 hover:bg-slate-800">
                        <ShoppingBag />
                        <span className="hidden text-xs font-semibold text-gray-200 sm:block">Cart</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}    