export interface Category {
    id: string;
    name: string;
    description?: string;
}

export interface MenuItem {
    id: string;
    categoryId: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    isAvailable: boolean;
}
