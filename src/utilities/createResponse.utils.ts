import { HttpStatus } from "../enums/http-status.enum";

export function createResponse<T>(status:HttpStatus,message:string,data?:T){
return{
    status,
    message,
    data:data||null,
}
}