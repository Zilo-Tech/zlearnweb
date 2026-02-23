import Hero from "./components/Hero";
import WaitlistSection from "./components/WaitlistSection";
import TopCategories from "./components/categories";
import Learn from "./components/Learn";
import HomeTutorsSection from "./components/Tutors";
import PartnershipMarquee from "./components/Partnership";
import TrendingCourse from "./components/TrendingCourses";
import CallToACtion from "./components/CallToAction";

export default function Home() {
  return (
    <div className="bg-zinc-50 font-sans dark:bg-black text-base antialiased">
      <Hero/>
      <WaitlistSection/>
      <TopCategories/>
      <Learn/>
      <TrendingCourse/>
      <HomeTutorsSection/>
      <PartnershipMarquee/>
      <CallToACtion/>
    </div>
  );
}
