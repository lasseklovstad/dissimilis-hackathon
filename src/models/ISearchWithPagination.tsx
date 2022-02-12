export interface ISearchWithPagination<
    SearchItem extends unknown,
    Payload extends { pageSize: number; page: number }
> {
    queryDto: Payload
    results: SearchItem[]
    currentPage: number
    pageCount: number
    pageSize: number
    rowCount: number
    firstRowOnPage: number
    lastRowOnPage: number
}
