import React, { useCallback, useRef, useState } from "react";
import { Card } from "../components/ui/Card";
import { Select } from "../components/ui/Select";
import { Textarea } from "../components/ui/Textarea";
import type { Profile } from "../types";
import { api } from "../lib/api";
import { Button } from "../components/ui/Button";

import { ArrowBigRight, Loader2 } from "lucide-react";
// import ArrowBigRight
import { useNavigate } from "react-router-dom";

const goalOptions = [
{ value: "bulk", label: "Build Muscle (Bulk)" },
{ value: "cut", label: "Lose Fat (Cut)" },
{ value: "recomp", label: "Body Recomposition" },
{ value: "strength", label: "Build Strength" },
{ value: "endurance", label: "Improve Endurance" },
];

const experienceOptions = [
{ value: "beginner", label: "Beginner (0-1 years)" },
{ value: "intermediate", label: "Intermediate (1-3 years)" },
{ value: "advanced", label: "Advanced (3+ years)" },
];

const daysOptions = [
{ value: "2", label: "2 days per week" },
{ value: "3", label: "3 days per week" },
{ value: "4", label: "4 days per week" },
{ value: "5", label: "5 days per week" },
{ value: "6", label: "6 days per week" },
];

const sessionOptions = [
{ value: "30", label: "30 minutes" },
{ value: "45", label: "45 minutes" },
{ value: "60", label: "60 minutes" },
{ value: "90", label: "90 minutes" },
];

const equipmentOptions = [
{ value: "full_gym", label: "Full Gym Access" },
{ value: "home", label: "Home Gym" },
{ value: "dumbbells", label: "Dumbbells Only" },
];

const splitOptions = [
{ value: "full_body", label: "Full Body" },
{ value: "upper_lower", label: "Upper/Lower Split" },
{ value: "ppl", label: "Push/Pull/Legs" },
{ value: "custom", label: "Let AI Decide" },
];
export default function Onboardpage(){

    
    const [isGenerating,setIsGenerating] = useState(false);
    const [error, setError] = useState("");
    const isRefreshingRef = useRef(false);

    // refreshData memoize
      const refreshData = useCallback(async () => {
        if (isRefreshingRef.current) return;
    
        isRefreshingRef.current = true;
    
        try {
          // Fetch profile
          // const profileData =
    
          // Fetch Plan
          const planData = await api.getCurrentPlan("1").catch(() => null);
          if (planData) {
            setPlan({
              id: planData.id,
              userId: planData.userId,
              overview: planData.planJson.overview,
              weeklySchedule: planData.planJson.weeklySchedule,
              progression: planData.planJson.progression,
              version: planData.version,
              createdAt: planData.createdAt,
            });
          }
        } catch (error) {
          console.error("Error refreshing data:", error);
        } finally {
          isRefreshingRef.current = false;
        }
      }, ["1"]);
    

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        goal: "bulk",
        experience: "intermediate",
        daysPerWeek: "4",
        sessionLength: "60",
        equipment: "full_gym",
        injuries: "",
        preferredSplit: "upper_lower",
    });

    function changeData(field:string, value: string) {
        setFormData((prev)=>({...prev, [field]:value}))
        
    }
    async function saveProfile (profileData: Omit<Profile,"userId" | "updatedAt">){
        await api.saveProfile("1",profileData)
        await refreshData();
    }
    async function generatePlan(){
        await api.generatePlan("1");
        await refreshData();
    }

    async function saveOptions(e: React.SubmitEvent){
        e.preventDefault();
            
        const profile: Omit<Profile, "userId" | "updatedAt"> = {
        goal: formData.goal as Profile["goal"],
        experience: formData.experience as Profile["experience"],
        daysPerWeek: parseInt(formData.daysPerWeek),
        sessionLength: parseInt(formData.sessionLength),
        equipment: formData.equipment as Profile["equipment"],
        injuries: formData.injuries || undefined,
        preferredSplit: formData.preferredSplit as Profile["preferredSplit"],
        };

        try {
            await saveProfile(profile);
        setIsGenerating(true);
        await generatePlan();
        navigate("/profile");
        } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save profile");
        } finally {
        setIsGenerating(false);
        }

    }

    return(
        <div className="min-h-screen pt-20 px-20">
            {!isGenerating ? (
            <Card className="max-w-2xl mx-auto mt-8 flex flex-col gap-3">
                <h1 className="text-3xl font-semibold mb-1">Your Goals and Choices</h1>
                <p className="text-muted">Information to understand you</p>
                <form className="space-y-5" onSubmit={saveOptions}>
                    <Select
                    id="goal"
                    label="What is Your goal?"
                    options={goalOptions}
                    value={formData.goal}
                    onChange={(e)=>changeData("goal", e.target.value)}
                    />
                    <Select
                    id="experience"
                    label="Training EXperience"
                    options={experienceOptions}
                    value={formData.experience}
                    onChange={(e)=>changeData("experience", e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-4">
                    <Select
                    id="daysPerWeek"
                    label="Days per week"
                    options={daysOptions}
                    value={formData.daysPerWeek}
                    onChange={(e)=>changeData("daysPerWeek", e.target.value)}
                    />
                    <Select
                    id="sessionLength"
                    label="Session Lentgh"
                    options={sessionOptions}
                    value={formData.sessionLength}
                    onChange={(e)=>changeData("sessionLength", e.target.value)}
                    />
                    </div>
                    <Select
                    id="equipment"
                    label="Equipment access"
                    options={equipmentOptions}
                    value={formData.equipment}
                    onChange={(e)=>changeData("equipment", e.target.value)}
                    />
                    <Select
                    id="preferedSplit"
                    label="Preferred training split"
                    options={splitOptions}
                    value={formData.preferredSplit}
                    onChange={(e)=>changeData("preferedSplit", e.target.value)}
                    />
                    <Textarea
                    id="injureies"
                    label="Any injuries or limitations?[optional]"
                    placeholder="Ex:lower back issues, shoulder injury..."
                    value={formData.injuries}
                    onChange={(e)=>changeData("injuries",e.target.value)}
                    rows={3}
                    />
                    <div className="flex gap-3 pt-2">
                         <Button type="submit" className="flex-1 gap-2">
                            Generate Plan <ArrowBigRight className="w-4 h-4" />
                        </Button>
                        {/* <Button>Generate Plan ArrowRight</Button>  */}
                    </div>
                </form>
            </Card>):(
                <Card variant="bordered" className="text-center py-16 max-w-2xl mt-8 mx-auto">
                    <Loader2 className="w-20 h-20 text-accent mx-auto mb-10 animate-spin "/>
                    <h1 className="text-4xl font-bold mb-4">Generating Your Plan</h1>
                    <p className="text-muted">AI is analysing the data for planning</p>
                </Card>
            )
            }
        </div>
    )
}