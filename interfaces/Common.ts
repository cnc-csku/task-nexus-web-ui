export interface ErrorApiResponse {
    status: string;
    message: string;
}

export interface PaginationResponse {
    page: number;
    pageSize: number;
    totalPage: number;
    totalItem: number;
}