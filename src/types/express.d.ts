import { IPayload } from "../entities/IPayload";

declare global{
    namespace Express{
        interface Request{
            user?:UserPayload
            userId?:UserPayload
        }
    }
}

declare module 'exif-parser' {
    export default class ExifParser {
        static create(buffer: Buffer): ExifParser;
        parse(): { tags: Record<string, any> };
    }
}
