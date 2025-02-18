export interface ServiceResponse<T> {
    status: number;
    message: string;
    accessToken?: string;
    refreshToken?: string;
    data?: T | T[];  
}
