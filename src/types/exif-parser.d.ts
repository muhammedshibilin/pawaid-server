declare module 'exif-parser' {
    export default class ExifParser {
        static create(buffer: Buffer): ExifParser;
        parse(): { tags: Record<string, any> };
    }
}
