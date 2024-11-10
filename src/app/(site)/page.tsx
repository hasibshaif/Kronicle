import Hero from "@/components/Hero";
import CompanyMarquee from "@/components/CompanyMarquee";

export default function Home() {
  return (
    <div className="container flex flex-col">
      <Hero />
      <CompanyMarquee />
    </div>
  );
}
