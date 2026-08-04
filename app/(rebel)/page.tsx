import { Frameworks } from "@/components/frameworks";
import { Hero } from "@/components/hero";
import { OpenLab } from "@/components/open-lab";
import { Philosophy } from "@/components/philosophy";
import { Principles } from "@/components/principles";
import { WhyUs } from "@/components/why-us";

export default function HomePage() {
  return (
    <>
      {/* Surfaces alternate dark/light down the page: Hero and Principles take
          the layout's ink background, Frameworks sets its own. WhyUs sits
          between Frameworks and Principles so the two dark sections aren't
          adjacent. */}
      <Hero />
      <Philosophy />
      <Frameworks />
      <WhyUs />
      <Principles />
      <OpenLab />
    </>
  );
}
