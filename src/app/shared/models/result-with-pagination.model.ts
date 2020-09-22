import { PaginationParams } from "./paginationParams.model";

export class ResultWithPagination<T> {
    pagination: PaginationParams | null;
    result: T;
}