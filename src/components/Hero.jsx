import React from "react";
import { styles } from "../styles";

import { ComputerCanvas } from "./canvas";
// import { Computers } from "./canvas";

const Hero = () => {
  return (
    <section className="relative h-screen">
      {/*Hero Content */}
      <div
        id="hero-content"
        className={`${styles.paddingX} absolute inset-0 top-[120px] mx-auto flex max-w-7xl gap-5`}
      >
        {/*Scroll Down Icon */}
        <div
          id="bar-scroll"
          className="mt-5 flex flex-col items-center justify-start"
        >
          <div className="h-5 w-5 rounded-full bg-[#915EFF]" />
          <div className="violet-gradient h-40 w-1 sm:h-80" />
        </div>
        <div>
          <h1 className={`${styles.heroHeadText} text-white`}>
            Hi, I'm <span className="text-[#915EFF]">Christian</span>
          </h1>
          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            I develop user interfaces
            <br className="hidden sm:block" /> and web applications
          </p>
        </div>
      </div>
      <ComputerCanvas></ComputerCanvas>
    </section>
  );
};

export default Hero;
