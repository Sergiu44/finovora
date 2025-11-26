import { createFileRoute } from "@tanstack/react-router";
import Header from "./-components/Header";
import HeroSection from "./-components/HeroSection";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <div className="h-full">
    <Header />

    <HeroSection />
  </div>
}
