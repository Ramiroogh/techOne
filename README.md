# TechOne
TechOne es un E-commerce de productos electronicos relacionados a la tecnologia, smartphones, laptops, pc, consolas, etc.

Desarrolle esta aplicacion con las siguientes tecnologias y dependencias que explicare a continuacion, el proposito principal de este proyecto, es con fines educativos y profesionales, ya que esta orientado a un comercio electronico en la vida real, es de codigo abierto, por lo cual cualquier persona puede clonar este repositorio con fines educativos si asi lo desea, ademas yo mismo realice una respectiva Documentacion del paso a paso, para desarrollar esta aplicación. [Documentación de TechOne](Documentation.md)


# Tecnologías Usadas
La tecnologia base en la que se construyo esta aplicacion fueron las siguientes:
+ NextJS 14
+ Sanity (CMS Headless)
+ Typescript
+ Tailwind CSS

# Dependencies
Estas son los paquetes/dependencias que se utilizaron para construir la Aplicación con formato E-commerce:

# Sanity CMS Headless
```next-sanity``` Headless CMS: utilice la version compatible para NextJS, con sanity almacenaremos los productos del E-commerce.

```@sanity/image-url``` Este paquete nos ayuda a obtener la URL de las imagenes desde la API de Sanity, para poder usarlas en nuestra aplicacion por medio de las queries.

+ Crear nuestro Proyecto Sanity, dentro de la carpeta de nuestra Aplicacion con el Siguiente comando: ```npm create sanity@latest -- --template clean --create-project "Sanity Project" --dataset production```

Para mas detalles, aca esta la Documentacion Oficial: [Create a Sanity Project](https://www.sanity.io/docs/create-a-sanity-project)


## Paquetes NPM usados
```npm i use-shopping-cart``` Este paquete se encarga de optimizar el proceso del carrito de compras, facilitando el manejo de estado al agregar o quitar articulos. En este caso, lo adaptaremos al procesador de pagos **Stripe**.

```npx shadcn-ui@latest init``` Este paquete es una libreria de componentes, instalara otras dependencias adicionales, faciltara la maquetacion de la Aplicación.

## Procesador de Pagos (Stripe)
Con los siguientes comandos, podremos instalar los paquetes necesarios para incluir la pasarella de pago Stripe en nuestra aplicacion de NextJS 14:

```npm i @stripe/stripe-js``` Version de Stripe del lado del Cliente.

```npm i stripe ``` Procesador de pagos Stripe.


