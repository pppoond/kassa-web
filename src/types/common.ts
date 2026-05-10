export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PagedList<T> {
    items: T[];
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}
