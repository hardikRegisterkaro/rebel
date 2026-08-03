import { Frameworks } from "@/components/frameworks";
import { Hero } from "@/components/hero";
import { OpenLab } from "@/components/open-lab";
import { Philosophy } from "@/components/philosophy";
import { Principles } from "@/components/principles";
import { WhyUs } from "@/components/why-us";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Philosophy />
      <Frameworks />
      <Principles />
      <WhyUs />
      <OpenLab />
    </>
  );
}
