import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";

export default function Step1() {
    return (
    <div>
        <div className="grid grid-cols-4 grid-rows-3 gap-4 min-h-96">
            <div className="col-span-2 row-span-3 flex flex-col justify-center items-center gap-4">
                <Button>
                    Upload Resume
                    <FileUp className="w-10 h-10" />
                </Button>
            </div>
            <div className="col-span-2 row-span-2 flex flex-col items-start justify-center">
                <h1 className="text-2xl font-bold">
                    Step 1
                </h1>
            </div>
            <div className="col-span-1 row-span-1">
                <p>
                    Upload your resume in pdf or word document format to get started.
                </p>
            </div>
        </div>
    </div>
    )
}