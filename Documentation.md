# Documentacion TechOne
Aca Detallare los pasos importantes para levantar con exito esta aplicación E-commerce, con fines educativos, para ver en profundidad y detalle como fue construyendose la aplicacion, en vez de solo clonar el repositorio e inicializarlo.
Sabemos que son cosas totalmente distintas, bueno aca documentare los pasos que realice para la elaboracion de este E-commerce.

# Introducción
Supongamos que ya has instalado todas las dependencias del **README.md** del repostorio y todos los modulos de node con ```npm install```.

---
# Paso 1: Creación de los Schemas en Sanity.
Antes de crear el contenido que se visualizara en nuestra tienda electronica, tenemos que configurar los siguientes Schemas, en la carpeta de **sanity/schemas**:
```typescript
    └── schemas
        ├── index.ts
        ├── category.ts
        ├── heroImages.ts
        └── product.ts
```


### product.ts
Este schema nos permitira cargar nuestros articulos desde el CMS de Sanity:
```typescript
export default {
    name: 'product',
    type: 'document',
    title: 'Product',
    fields: [
        {
            name: 'name',
            type: 'string',
            title: 'Name of product'
        },
        {
            name: 'images',
            type: 'array',
            title: 'Product Images',
            of: [{type: 'image'}],
        },
        {
            name: 'description',
            type: 'text',
            title: 'Description of Product',
        },
        {
            name: 'slug',
            type: 'slug',
            title: 'Product Slug',
            options: {
                source: 'name',
            }
        },
        {
            name: 'price',
            type: 'number',
            title: 'Price of Product'
        },
        {
            name: 'category',
            title: 'Product Category',
            type: 'reference',
            to: [{
                type: 'category'
            }]
        }
    ]
}
```
### category.ts
Este schema nos permitira crear la estructura para seleccionar, crear o eliminar categorias.

```typescript
export default {
    name: 'category',
    type: 'document',
    title: 'Category',
    fields: [{
        name: 'name',
        title: 'Name of Category',
        type: 'string'
    }]
}
```
Lo mas importante de esto, es que en el schema **Products.ts**, en este fragmento:
```typescript
{
    name: 'category',
    title: 'Product Category',
    type: 'reference',
    to: [{
        type: 'category'
    }]
}
```
lo que sucede, es que estamos referenciando __category a product__. Por lo cual, luego de crear una categoria, lo podemos asignar a cualquier articulo de nuestro E-commerce.

### heroImages.ts
Este schema, nos ayudara a incluir dos imagenes para el Hero principal de nuestra aplicación.
```typescript
export default {
    name: 'imagesHero',
    type: 'document',
    title: 'Two Hero Images',
    fields: [{
        name: 'imageOne',
        type: 'image',
        title: 'First Image',
    },
    {
        name: 'imageTwo',
        type: 'image',
        title: 'Second Image',
    }]
}
```


### Importante (index.ts)
Luego de crear los Schemas, no olvidemos incluirlos en el archivo ```index.ts``` de la carpeta schemas.
+ index.ts
```typescript
import category from "./category";
import heroImages from "./heroImages";
import product from "./product";

export const schemaTypes = [product, category, heroImages]
```

---
# Paso 2: Crear el Contenido desde Sanity.
Luego de crear los schemas, ya podes crear los articulos de tu e-commerce, para ello debemos hacer lo siguiente

1. Ingresar a la carpeta sanity
```cd sanity```
2. ejecutar ```npm run dev```
3. ingresar a ```http://localhost:3333``` desde tu navegador.
4. Cargar los Articulos.

#### Testear la query GROQ, desde Sanity.
Luego de crear algunos articulos para tu e-commerce, ve a la Seccion de "Vision", y alli podras validar las querys y asegurarte que realmente estas capturando los datos, haciendo un simple fetch.
+ Intenta ejecutar esta Query:
```typescript
*[_type == 'product'] {
  name,
  images,
  description,
  slug,
  price
}
```
---
# Paso 3: Crear conexión a Sanity & Capturar URL de Imagenes
Luego de tener los schemas configurados y algunos productos ya cargados en el CMS, es momento de crear el cliente de conexion, esto podremos lograrlo con el paquete ```next-sanity```.

1. Crear la carpeta app/lib. Dentro de lib,
creamos un archivo llamado ```sanity.ts```
```typescript
    └── app
        └── lib
            └── sanity.ts
```
Este archivo tendra la conexion de nuestra aplicacion por medio de ```projectId```, ademas de otros atributos, tambien usaremos la dependencia ```@sanity/image-url```, ya que nos servira el modulo llamado ```imageUrlBuilder```, este modulo nos sirve para poder capturar el source o direccion path, de nuestras imagenes de los productos que hemos cargado en el CMS de Sanity.

Aca esta el codigo:
```typescript
import imageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";

export const client = createClient({
    projectId: 'o74sqcnh',
    dataset: 'production',
    apiVersion: '2022-03-07',
    useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
    return builder.image(source)
}
```
+ La version de tu proyecto **projectId**, podes verla en el archivo ```sanity.config.ts``` de la carpeta sanity, en tu aplicacion.

## Funcion urlFor( )
La funcion que estas viendo en el codigo de arriba, que esta en ``lib/sanity.ts`` La usaremos en muchas vistas y componentes de nuestra aplicacion, ya que es la unica forma en la que podemos capturar la URL de las imagenes desde Sanity, aca un ejemplo de codigo:
```typescript
<Image src={urlFor(image).url()} alt="image" className="h-full w-full object-cover object-center cursor-pointer" width={500} height={500} priority />
```

---
# Paso 4: Crear los componentes
No entrare en detalles ya que algunos componentes hay que agregarle nuevas modificaciones segun avances en el proyecto, el desarrollo es asi, no todo es lineal :/

+ Solo documentare la logica que se aplicara en los componentes para manejar los datos segun sea necesario.

Ademas, podras ver los componentes ya creados, pero usare Tailwind y Shadcn, y algunos componentes de shadcn deberas instalarlos manualmente.

---
# Paso 5: Configurar next.config.js
Al momento de agregar la logica asincrona de los componentes para traer los datos desde sanity, con los archivos de lib, es necesario configurar el cdn de sanity, ya que estamos obteniendo recursos de otro Host:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
              protocol: "https",
              hostname: "cdn.sanity.io**",
            },
          ],
    }
}

module.exports = nextConfig
```
#### Importante:
Domains ya fue deprecado, debe usarse `remotePatterns`.

---
# Paso 6: Enmaquetación de la Pagina Principal
En la Home, no vamos a realizar tanta logica, solo vamos a mostrar algunos productos desde sanity, desde un componente donde realice una peticion con una query que solo recolecta 4 articulos.

Nuestro home se vera por el momento así:
```typescript
import Image from 'next/image'
import Hero from './components/Hero'
import Newest from './components/Newest'

export default function Home() {
  return (
    <div className="bg-white pb-6 sm:pb-8 lg:pb-12">
      <Hero />
      <Newest />
    </div>
  )
}
```
+ Este componente del cual hablo, en el que hace un fetch a sanity es: `<Newest />`:
```typescript
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
```
---
# Paso 7: Desarrollo de Ruta Dinamica para los Productos

Esta ruta dinamica, debe crearse de la siguiente forma en Nextjs, Esto es asi ya que segun el sistema de archivos en next, sabe que sera una estructura dinamica, en la que los parametros y el slug juegan un papel importante: 

```typescript
    └── app
        └── product
            └── [slug]
                └── page.tsx
```
Antes de ver el codigo de la vista, necesitamos crear una interface, para tipar todos los datos que se van a renderizar de forma dinamica, luego importarlo y usarlo en la variable que esta capturando los datos, cuando se invoca la funcion asincrona llamada `getData()`:

```typescript
export interface fullProduct {
    _id: string;
    images: any;
    price: number;
    name: string;
    description: string;
    slug: string;
    categoryName: string;
}
```
+ Aca esta el codigo de esta pagina:

```typescript
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
```

## Componente `<ImageGallery images={data.images}/>`
Este componente tendra la logica para poder renderizar las imagenes de cualquier producto que seleccionemos de forma Dinamica.

```typescript
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

    return(
        <div className="grid gap-4 lg:grid-cols-5">
            <div className="order-last flex gap-5 lg:order-none lg:flex-col">
                {images.map((image: any, index: any) => (
                    <div key={index} className="overflow-hidden rounded-lg bg-gray-100">
                        <Image src={urlFor(image).url()} alt="image" className="h-full w-full object-cover object-center cursor-pointer" width={500} height={500} priority />
                    </div>
                ))}
            </div>

            <div className="relative overflow-hidden rounded-lg bg-gray-100 lg:col-span-4">
                <Image src={urlFor(bigImage).url()} width={500} height={500} alt="image" priority/>
            </div>
        </div>
    )
}
```
### Breve Explicación:
Al cargarse la pagina dinamica, recordemos que desde alli estamos haciendo el fetch de los datos con la query correspondiente.

Los datos que nos llega como atributos en `<ImageGallery images={data.images}/>`, lo almacenamos en un Hook de Estado, y tambien le asignamos una pequeña interfaz declarada en el mismo archivo.

+ con `<Image src={urlFor(image).url()}` cargamos varias imagenes pequeñas
+ con `<Image src={urlFor(bigImage).url()}` cargamos la primera imagen del index 0, totalmente grande.

---
# Paso 8: Funcionalidad de Cambio de Imagenes
Ahora es importante configurar el Hook de estado `const [bigImage, setBigImage] = useState(images[0]);`

Mas bien, vamos a agregar mas logica, ya que por ahora no estamos seteando ningun valor, solo esta cargando una imagen por defecto al hacer el fetch a sanity, y solo trae una sola imagen.
Vamos a imitar la funcionalidad de los ecommerce en el que podemos seleccionar las otras fotos en miniatura y que se seteen en la seccion donde aparece la imagen en tamaño mas grande.

---
# Paso 9: Ruta Dinamica para las Categorias
Es momento de definir la logica de las vistas para nuestras categorias, es basicamente repetir lo que venimos haciendo, usando una interfaz `simplifiedProduct`, haciedo uso de client en /lib, y pintando los datos que traemos desde el cliente.

```typescript
    └── app
         └── [category]
                  └── page.tsx
```

Aca esta el codigo de esta pagina dinamica:
```typescript
import Link from "next/link";
import Image from "next/image";
import { simplifiedProduct } from "../interfaces/interface";
import { client } from "../lib/sanity"

async function getData(category: string) {
    const query = `*[_type == "product" && category->name == "${category}"] {
        _id,
        "imageUrl": images[0].asset->url,
        price,
        name,
        "slug": slug.current,
        "categoryName": category->name
    }`;
    const data = await client.fetch(query)
    return data;
}


export default async function CategoryPage({params} : {params: {category : string}}) {
    
    const data: simplifiedProduct[] = await getData(params.category);

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold tracing-tight text-gray-900">Productos de la categoria {params.category}</h2>

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
```
Si nos damos cuenta, no es algo nuevo, simplemente estamos desestructurando los parametros, ya que estos parametros estan apuntando al componente `Navbar.tsx`.
Al ingresar a algun enlace de estos, nos redirije a la pagina dinamica de la respectiva categoria.
en Navbar tenemos:
```typescript
import { usePathname } from "next/navigation";

const links = [
    {name: 'Home', href: '/'},
    {name: 'Laptop', href: '/Laptop'},
    {name: 'Smartphone', href: '/Smartphone'}
]
```
+ Tambien, en la query de la ruta ``[category]``, tenemos los datos que podremos acceder, siempre que coincida con una categoria en especifico.

Esto es un beneficio, ya que no necesitamos hacer dos o mas paginas para todas las categorias inecesariamente, solo con una es suficiente, ya que los params, que estan desestructurados haran lo suyo, pero solo podremos acceder a estos datos de esta query:
```typescript
async function getData(category: string) {
    const query = `*[_type == "product" && category->name == "${category}"] {
        _id,
        "imageUrl": images[0].asset->url,
        price,
        name,
        "slug": slug.current,
        "categoryName": category->name
    }`;
    const data = await client.fetch(query)
    return data;
}
```

---
# Paso 10: Configurar `use-shopping-cart`
+ 
El paquete use-shopping-cart es un React Hook que maneja el estado del carrito de compras y la lógica para stripe.

Como primer paso, vamos a crear un componente llamado `Providers.tsx`:
```typescript
"use client"

import { ReactNode } from "react"
import { CartProvider as USCProvider } from "use-shopping-cart"

export default function CartProvider({children}: {children: ReactNode}) {

    return (
        <USCProvider mode="payment" cartMode="client-only" stripe={process.env.NEXT_PUBLIC_STRIPE_KEY as string} successUrl="http://localhost:3000/success" cancelUrl="http://localhost:3000/error" currency="USD" billingAddressCollection={true} shouldPersist={true} language="en-US">
            {children}
        </USCProvider>
    )
}
```

### Crear el componente ShoppingCartModal.tsx
Este componente va a manejar el estado del carrito, ademas usaremos la libreria `Shadcn` para utilizar el componente sheets, este mismo es un tipo de modal que aparece a la derecha del viewport:

```typescript
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

    // Hook para manejar el estado del carrito, desde aca, y en Navbar.tsx
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
```
Algo para analizar de aca, es que `const {cartCount, handleCartClick, shouldDisplayCart} = useShoppingCart()`, es la configuracion del Hook.

+ `cartCount`, nos lo ofrece de forma nativa desde `import { useShoppingCart } from "use-shopping-cart"`. Este nos devuelve un "true o false", ideal para comprobar si existe algun producto añadido o no, y asi mismo vincularlo con la pasarella de pago despues.

NOTA: si nos fijamos en el html, veremos una renderizacion condicional en el que usamos esta propiedad del hook:
```typescript
{cartCount === 0 ? (
    <h1 className=" py-6">No hay ArticuloCarrito</h1>
): (
    <h1 className="text-3xl py-6">hay x Articulos en el carrito</h1>
)}
```

+ `handleCartClick` tambien viene de forma nativa, este mismo debe estar configurado en el componente de shadCN, `<Sheet open={shouldDisplayCart} onOpenChange={() => handleCartClick()}>`.
Esto activa o desactiva la vista UI, tambien debera estar configurado en el Navbar.tsx.
```typescript
"use client"
// UI
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShoppingCart } from "use-shopping-cart";

const links = [
    {name: 'Home', href: '/'},
    {name: 'Laptop', href: '/Laptop'},
    {name: 'Smartphone', href: '/Smartphone'}
]

export default function Navbar() {
    const pathname = usePathname();
    const {handleCartClick} = useShoppingCart()

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
                    <Button onClick={() => handleCartClick()} className="flex flex-col gap-y-1.5 h-12 w-12 sm:h-20 sm:w-20 md:h-20 md:w-20 rounded-none bg-violet-800 hover:bg-slate-800">
                        <ShoppingBag />
                        <span className="hidden text-xs font-semibold text-gray-200 sm:block">Cart</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}    
```

+ `shouldDisplayCart` tambien viene de forma nativa, este mismo nos sirve para mostrar la vista, el handleCartClick maneja la ACCION, y el shouldDisplayCart, es el callback, producto de activar la acción.

---
# Paso 11: Configurar el Boton de "Añadir al Carrito"
Lo siguiente que hay que hacer es crear el componente addToCart.tsx para agregar la logica de añadir al carrito y al mismo tiempo, que se active el modal del carrito.
```typescript
"use client"
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useShoppingCart } from "use-shopping-cart";


// Añadir producto al carrito y simultaneamente, ir al Carrito
export default function AddToCart() {
    const {addItem, handleCartClick} = useShoppingCart()
    return (
        <Button onClick={() => handleCartClick()} className="text-sm"><ShoppingCart className="w-5 h-5 mr-3"/>Añadir al Carrito</Button>
    )
}
```

