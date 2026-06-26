import { Router,type Request,type Response } from "express";
import { prisma } from "../lib/prisma";
import { json } from "node:stream/consumers";

export const planRouter = Router();

planRouter.post("/generate", async(req:Request,res:Response)=>{
    try {
        
        const {userId} = req.body;

        if(!userId){
            return res.status(404).json({error:"user id needed"});
        }
        const profile = await prisma.profile.findUnique({ 
            where:{uid:userId},
        })

        if(!profile){
            return res.status(404).json({error:"user not found"});
        }

        const lastPlan = await prisma.plan.findFirst({
            where:{uid:userId},
            orderBy:{created:"desc"},
            select:{version:true}
        });

        const newVersion= lastPlan?lastPlan.version+1:1;

        let planJson;

        const textPlan= JSON.stringify(planJson,null,2);

        const newPlan =await prisma.plan.create({
                data:{
                    uid:userId,
                    plan_json:planJson,
                    plan_text: textPlan,
                    version:newVersion,
                    // created:new Date
                }
        })

        res.json({
            id:newPlan.id,
            user:newPlan.uid,
            plan:newPlan.plan_text,
            ver:newPlan.version,
        })

    } catch (error) {
        console.error("error generating the plan",error);
        return res.status(500).json({error:"failed to generate plan"});
    }
});


planRouter.get("/current", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    // console.log(userId)
    console.log(userId);

    const plan = await prisma.plan.findFirst({
      where: { uid: userId },
      orderBy: { created: "desc" },
    });

    if (!plan) {
      return res.status(404).json({ error: "No plan found" });
    }

    res.json({
      id: plan.id,
      userId: plan.uid,
      planJson: plan.plan_json,
      planText: plan.plan_text,
      version: plan.version,
      createdAt: plan.created,
    });
  } catch (error) {
    console.error("Error fetching plan:", error);
    res.status(500).json({ error: "Failed to fetch plan" });
  }
});