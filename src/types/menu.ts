export interface MenuItemDto {
  id: string; // Guid
  name: string;
  description: string;
  price: number; // decimal
  imageUrl?: string;
}

export interface CategoryMenuDto {
  categoryId: string; // Guid
  categoryName: string;
  items: MenuItemDto[];
}
