import { Request, Response } from "express";
import { RecruiterAlertService } from "../services/implementation/recruiter-alert.service";



export class RecruiterAlertController {


    constructor(private recruiterAlertService:RecruiterAlertService){}
    async fetchRescueAlertsForRecruiter(req: Request, res: Response): Promise<Response> {
        try {
            const recruiterId = req.params.recruiterId;
            
            if (!recruiterId) {
                return res.status(400).json({ success: false, message: "Recruiter ID is required" });
            }
            
            const responseData = await this.recruiterAlertService.fetchRescueAlertsForRecruiter(recruiterId);
            console.log('responseDataaa is in controlllerre',responseData)
            return res.status(200).json({ success: true, data: responseData });
        } catch (error) {
            console.error("Error fetching rescue alerts:", error);
            return res.status(500).json({ success: false, message: "Failed to fetch rescue alerts" });
        }
    }

    async acceptRescue(req:Request,res:Response){
        try {
            const reportId = req.body
            const response = await this.recruiterAlertService.acceptAlert(reportId)

        } catch (error) {
            
        }
    }
    
    
      
}
