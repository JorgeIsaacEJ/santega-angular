export interface Tokenresponse {
    Authorization: string;
    Expires_in: string;
    ErrorCode: string;
    ErrorMessage: string;
}
export interface Reference {
    paging: results
}
interface results {
    results: data
}
interface data
{
    ErrorCode: string,
    ErrorMessage: string,
    Reference: number,
    Type: string,
    SenderId: number,
    Amount: number,
    CreateDate: string,
    StatusName: string,
    ExpirationDate: string
}