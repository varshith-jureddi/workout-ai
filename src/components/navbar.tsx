import { Link } from "react-router-dom";
import { Dumbbell } from "lucide-react";

export default function Navbar(){
 return(
        <header className="p-1 fixed top-0 left-0 right-0 z-10  border-border bg-background/80 backdrop-blur-md">
            <div className="flex p-2 max-w-6xl mx-auto h-16 text-foreground items-center justify-between">
                <Link to={"/"} className="flex justify-center gap-1 font-semibold">
                    <Dumbbell className="w-6 h-6 text-accent text-lg"/>
                    <span>Gym AI</span>
                </Link>
                <nav className="flex justify-center gap-4 text-muted">
                    <Link to={"/onboard"}>My Plan</Link>
                    <Link to={"/profile"}>Profile</Link>
                </nav>
            </div>

        </header>
    )
}