import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function Step2() {
    return (
    <div>
        <div className="grid grid-cols-4 grid-rows-3 gap-4 min-h-96">
            <div className="col-span-2 row-span-3 flex flex-col justify-center items-center gap-4">
                <Button>
                    Search Jobs
                    <Search className="w-10 h-10" />
                </Button>
            </div>
            <div className="col-span-2 row-span-2 flex flex-col items-start justify-center">
                <h1 className="text-2xl font-bold">
                    Step 2
                </h1>
            </div>
            <div className="col-span-1 row-span-1">
                <p>
                    Search for jobs that match your skills and experience.
                </p>
            </div>
        </div>
    </div>
    )
}