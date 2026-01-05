import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function Step3() {
    return (
    <div>
        <div className="grid grid-cols-4 grid-rows-3 gap-4 min-h-96">
            <div className="col-span-2 row-span-3 flex flex-col justify-center items-center gap-4">
                <Button>
                    Optimize Resume
                    <Sparkles className="w-10 h-10" />
                </Button>
            </div>
            <div className="col-span-2 row-span-2 flex flex-col items-start justify-center">
                <h1 className="text-2xl font-bold">
                    Step 3
                </h1>
            </div>
            <div className="col-span-1 row-span-1">
                <p>
                    Optimize your resume for the job description to increase your chances of getting hired.
                </p>
            </div>
        </div>
    </div>
    )
}