import { IPayload } from "../entities/IPayload";

declare global{
    namespace Express{
        interface Request{
            user?:UserPayload
            userId?:UserPayload
        }
    }
}

