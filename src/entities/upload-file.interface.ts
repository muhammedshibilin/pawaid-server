export interface UploadedFile extends Express.Multer.File {
    location: string;
    key:string;
}