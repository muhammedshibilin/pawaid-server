

export interface IAdminController{
    login(req: Request, res: Response): Promise<Response>;
    blockUser(req: Request, res: Response): Promise<Response> 
}