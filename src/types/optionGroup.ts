export interface OptionGroup {
    id: string;
    name: string;
    description?: string;
    isRequired: boolean;
    maxSelections: number;
    minSelections: number;
    displayOrder: number;
    isActive: boolean;
    options: Option[];
}

export interface Option {
    id: string;
    optionGroupId: string;
    name: string;
    description?: string;
    additionalPrice: number;
    isDefault: boolean;
    displayOrder: number;
    isActive: boolean;
}

export interface MenuItemOptionGroup {
    id: string;
    menuItemId: string;
    optionGroupId: string;
    optionGroupName: string;
    isRequired: boolean;
    displayOrder: number;
}

export interface CreateOptionGroupRequest {
    name: string;
    description?: string;
    isRequired: boolean;
    maxSelections: number;
    minSelections: number;
    displayOrder: number;
}

export interface UpdateOptionGroupRequest {
    name: string;
    description?: string;
    isRequired: boolean;
    maxSelections: number;
    minSelections: number;
    displayOrder: number;
    isActive: boolean;
}

export interface CreateOptionRequest {
    name: string;
    description?: string;
    additionalPrice: number;
    isDefault: boolean;
    displayOrder: number;
}

export interface UpdateOptionRequest {
    name: string;
    description?: string;
    additionalPrice: number;
    isDefault: boolean;
    displayOrder: number;
    isActive: boolean;
}
