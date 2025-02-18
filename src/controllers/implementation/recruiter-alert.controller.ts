import { Request, Response } from "express";
import { RecruiterAlertService } from "../../services/implementation/recruiter-alert.service";




export class RecruiterAlertController {


    constructor(private recruiterAlertService: RecruiterAlertService) { }

    async fetchRescueAlertsForRecruiter(req: Request, res: Response): Promise<Response> {
        try {
            const recruiterId = req.params.recruiterId;

            if (!recruiterId) {
                return res.status(400).json({ success: false, message: "Recruiter ID is required" });
            }

            const responseData = await this.recruiterAlertService.fetchRescueAlertsForRecruiter(recruiterId);
            return res.status(200).json({ success: true, data: responseData });
        } catch (error) {
            console.error("Error fetching rescue alerts:", error);
            return res.status(500).json({ success: false, message: "Failed to fetch rescue alerts" });
        }
    }

    async updateAlert(req: Request, res: Response):Promise<Response> {
        try{

        const { animalReportId, recruiterId, status, location } = req.body;
    
        const animalReport = await this.recruiterAlertService.updateAlert(animalReportId, recruiterId, status, location)
        if (!animalReport) {
            return res.status(404).json({ success: false, message: 'Animal report not found' });
        }


        return res.status(200).json({ success: true, message: 'Rescue accepted successfully', data: animalReport });
        }catch(error) {
        console.log('Error updating alert:', error);
        return res.status(500).json({ success: false, message: 'Failed to update alert' });
    }
}

}


