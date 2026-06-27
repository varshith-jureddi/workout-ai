import { Router,type Request,type Response } from "express";
import { prisma } from "../lib/prisma";

export const profileRouter = Router();

profileRouter.post("/",async(req:Request,res:Response)=>{
    try {
        const {userId,...profileData} = req.body;

        const{
            goal,
            experience,
            daysPerWeek,
            sessionLength,
            equipment,
            injuries,
            preferredSplit,
        }=profileData;

        if(!goal||!experience||!daysPerWeek||!sessionLength||!equipment||!preferredSplit){
            return res.status(400).json({error:"values missing"});
        }
        
        await prisma.profile.upsert({
            // where:{uid:userId};
            create:{
                uid:userId,
                // uid: "1",
                goal,
                experience,
                days_in_week:daysPerWeek,
                session:sessionLength,
                equipment,
                injuries:injuries||null,
                preference:preferredSplit,
            },
            where:{uid:userId},
            update:{
                goal,
                experience,
                days_in_week:daysPerWeek,
                session:sessionLength,
                equipment,
                injuries:injuries||null,
                preference:preferredSplit,
                update_time:new Date(),
            },
            
        })
        res.json({success:true})
    } catch (error) {
        console.error("error  saving profile",error);
        res.status(500).json({error:"Couldnt Save Profile"});
    }
});