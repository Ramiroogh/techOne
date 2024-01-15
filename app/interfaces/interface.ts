export interface simplifiedProduct {
    _id: string;
    name: string;
    imageUrl: string;
    price: number;
    slug: string;
    categoryName: string;
}

// Interfaz para Mostrar todos los datos del producto
export interface fullProduct {
    _id: string;
    images: any;
    price: number;
    name: string;
    description: string;
    slug: string;
    categoryName: string;
}