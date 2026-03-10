import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Hero from "@/components/HeroV2"; // swap back to Hero.tsx to revert
import StatMoment from "@/components/StatMoment";
import PhoneDemo from "@/components/PhoneDemo";
import Gamification from "@/components/Gamification";
import PadReveal from "@/components/PadReveal";
import Reviews from "@/components/Reviews";
import Audiences from "@/components/Audiences";
import Pricing from "@/components/Pricing";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function App() {
  return (
    <>
      <Cursor />
      <Nav />
      <Hero />
      <StatMoment />
      <PhoneDemo />
      <PadReveal />
      <Gamification />
      <Reviews />
      <Audiences />
      <Pricing />
      <FinalCTA />
      <Footer />
    </>
  );
}
