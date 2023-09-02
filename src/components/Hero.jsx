import React from "react";
import { styles } from "../styles";

const Hero = () => {
  return (
    <section className="relative h-screen">
      <div id="hero-content" className="absolute inset-0 border border-sky-500">
        <div
          id="bar-scroll"
          className="mt-5 flex flex-col items-center justify-center border border-sky-500"
        >
          <div className="h-5 w-5 rounded-full bg-[#915EFF]" />
          <div className="violet-gradient h-40 w-1 sm:h-80" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
