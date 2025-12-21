export interface KitchenMenuItemDto {
    id: string; // Guid
    name: string;
}

export interface KitchenOrderItemDto {
    id: string; // Guid
    orderId: string; // Guid
    subOrderId?: string; // Guid
    menuItemId: string; // Guid
    quantity: number;
    unitPrice: number; // decimal
    totalPrice: number; // decimal
    note?: string;
    status: string; // 'Pending', 'Cooking', 'Ready', 'Served'
    createdAt: string; // DateTime
    menuItem: KitchenMenuItemDto;
}

export interface SubOrderDto {
    id: string; // Guid
    orderId: string; // Guid
    roundNo: number;
    status: string; // 'Pending', 'Cooking', 'Ready', 'Served'
    notes?: string;
    createdAt: string; // DateTime
    orderItems: KitchenOrderItemDto[];
    // Additional field for display convenience (e.g. Table Number from Order)
    tableName?: string; 
}
