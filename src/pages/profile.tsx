import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom"
import type { TrainingPlan } from "../types";
import { api } from "../lib/api";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import {
  Calendar,
  Dumbbell,
  RefreshCcw,
  Target,
  TrendingUp,
} from "lucide-react";
import { PlanDisplay } from "../components/plan";
// import { useVariables } from "../context/context";


export default function ProfilePage(){


    // const plan = await 
    const [plan,setPlan]=useState<TrainingPlan|null>(null);
    const isRefreshingRef = useRef(false);
    // const [isloading,setisLoading]=useState(true);
    const [isLoading, setIsLoading] = useState(true); 

    
  // refreshData memoize
  const refreshData = useCallback(async () => {
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;
    setIsLoading(true);
    try {
      // Fetch profile
      // const profileData =

      // Fetch Plan
      console.log("Fetching plan for user 1...");
      const planData = await api.getCurrentPlan("1").catch(() => null);
       console.log("Raw API Response received:", planData);
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
      setIsLoading(false);
    }
  }, []);


   useEffect(() => {
    refreshData();
  }, [refreshData]);

  async function generatePlan(){
            await api.generatePlan("1");
            await refreshData();
        }

    //   const planData = await api.getCurrentPlan("1").catch(() => null);
    if(isLoading){
        return(<div className="min-h-screen flex justify-center items-center p-8 text-center text-muted">Loading your plan...</div>);
    }

    if(!plan){
        return <Navigate to={"/onboard"} />;
    }

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        });
    } 
    // const {generatePlan} = useVariables();

    return(
       
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Your Training Plan</h1>
            <p className="text-muted">
              Version {plan.version} • Created {formatDate(plan.createdAt)}
            </p>
          </div>

          <Button
            variant="secondary"
            className="gap-2"
            onClick={async () => await generatePlan()}
          >
            <RefreshCcw className="w-4 h-4" />
            Regenerate Plan
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card variant="bordered" className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted">Goal</p>
              <p className="font-medium text-sm">{plan.overview.goal}</p>
            </div>
          </Card>
          <Card variant="bordered" className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted">Frequency</p>
              <p className="font-medium text-sm">{plan.overview.frequency}</p>
            </div>
          </Card>
          <Card variant="bordered" className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted">Split</p>
              <p className="font-medium text-sm">{plan.overview.split}</p>
            </div>
          </Card>
          <Card variant="bordered" className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted">Version</p>
              <p className="font-medium text-sm">{plan.version}</p>
            </div>
          </Card>
        </div>

        {/* Plan notes */}
        <Card variant="bordered" className="mb-8">
          <h2 className="font-semibold text-lg mb-2">Program Notes</h2>
          <p className="text-muted text-sm leading-relaxed">
            {plan.overview.notes}
          </p>
        </Card>

        {/* Weekly Schedule */}
        <h2 className="font-semibold text-xl mb-4">Weekly Schedule</h2>
        <PlanDisplay weeklySchedule={plan.weeklySchedule} />

        <Card variant="bordered" className="mb-8">
          <h2 className="font-semibold text-lg mb-2">Progression Strategy</h2>
          <p className="text-muted text-sm leading-relaxed">
            {plan.progression}
          </p>
        </Card>
      </div>
    </div>
    );
};