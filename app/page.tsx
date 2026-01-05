import Hero from "@/components/alberti-components/landing/hero";
import Step1 from "@/components/alberti-components/landing/step1";
import Step2 from "@/components/alberti-components/landing/step2";
import Step3 from "@/components/alberti-components/landing/step3";

export default function Home() {
  return (
    <main>
      <div className="h-screen w-full">
      <Hero />
      </div>
      <div className="h-120 w-full bg-gray-200">
        <Step1 />
      </div>
      <div className="h-120 w-full bg-black/50">
        <Step2 />
      </div>
      <div className="h-120 w-full bg-black/80">
        <Step3 />
      </div>
    </main>
  );
}
