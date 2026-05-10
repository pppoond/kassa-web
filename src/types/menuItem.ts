export interface MenuItem {
    id: string;
    categoryId: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    isAvailable: boolean;
}

export interface CreateMenuItemRequest {
    categoryId: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
}

export interface UpdateMenuItemRequest {
    categoryId: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    isAvailable: boolean;
}
