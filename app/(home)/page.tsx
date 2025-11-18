import Image from "next/image";
import Hero from "./components/Hero";
import TopCategories from "./components/categories";
import Learn from "./components/Learn";
import HomeTutorsSection from "./components/Tutors";
import PartnershipMarquee from "./components/Partnership";

export default function Home() {
  return (
    <div className="bg-zinc-50 font-sans dark:bg-black ">
      <Hero/>
      <TopCategories/>
      <Learn/>
      <HomeTutorsSection/>
      <PartnershipMarquee/>
    </div>
  );
}
