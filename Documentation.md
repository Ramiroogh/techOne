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
# Paso 3: Crear conexión a Sanity
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

# Paso 4: Crear los componentes
No entrare en detalles ya que algunos componentes hay que agregarle nuevas modificaciones segun avances en el proyecto, el desarrollo es asi, no todo es lineal :/

+ Solo documentare la logica que se aplicara en los componentes para manejar los datos segun sea necesario.

Ademas, podras ver los componentes ya creados, pero usare Tailwind y Shadcn, y algunos componentes de shadcn deberas instalarlos manualmente.

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