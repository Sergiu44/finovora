import { useRef } from "react";
import { Button } from "../../components/ui/button";
import {
  SectionBand,
  SectionInner,
} from "../../components/reusable/layouts/SectionLayout";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <SectionBand ref={containerRef} className="relative">
        <SectionInner>
          <div className="grid grid-cols-3 gap-10">
            <div className="flex flex-col col-span-2 gap-4">
              <h1 className="text-5xl font-bold">
                Monitor your money in real time
              </h1>
              <h2 className="text-2xl text-muted-foreground">
                Bring all your accounts, budgets, and insights into one elegant
                workspace designed to help you grow long-term wealth.
              </h2>
              <div className="flex gap-2">
                <Button size="lg" className="rounded-xl" variant="default">
                  Get Started
                </Button>
                <Button size="lg" className="rounded-xl" variant="outline">
                  Learn More
                </Button>
              </div>

              <div className="mt-8 flex gap-6 items-center">
                <div className="flex -space-x-1">
                  <span className="bg-[#8244ee] h-7 w-7 rounded-full outline-2 outline-white"></span>
                  <span className="bg-[#0080ff] h-7 w-7 rounded-full outline-2 outline-white"></span>
                  <span className="bg-[#009ff8] h-7 w-7 rounded-full outline-2 outline-white"></span>
                  <span className="bg-[#00b2cd] h-7 w-7 rounded-full outline-2 outline-white"></span>
                  <span className="bg-[#3abeaa] h-7 w-7 rounded-full outline-2 outline-white z-10"></span>
                </div>
                <div className="flex flex-col">
                  <div className="text-sm font-bold">50,000+ users</div>
                  <div className="text-xs text-muted-foreground">
                    Growing wealth together
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <span>TO BE DONE</span>
            </div>
          </div>
        </SectionInner>
      </SectionBand>

      <SectionBand className="w-full h-full bg-primary-300">
        <SectionInner className="text-white">
          <div className="grid grid-cols-3 gap-10">test</div>
        </SectionInner>
      </SectionBand>
    </>
  );
}
