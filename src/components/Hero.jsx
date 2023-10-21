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
        className={`${styles.paddingX} absolute inset-0 top-[150px] mx-auto flex max-w-7xl gap-5 sm:top-[260px]`}
      >
        {/*Scroll Down Icon */}
        {/* <div
          id="bar-scroll"
          className="mt-5 flex flex-col items-center justify-start"
        >
          <div className="h-5 w-5 rounded-full bg-[#915EFF]" />
          <div className="violet-gradient h-40 w-1 sm:h-80" />
        </div> */}
        {/* mt-28 */}
        <div className="text-[70px] sm:text-[70px] md:text-[75px] lg:text-[100px] xl:text-[110px]">
          <h1 className={`${styles.heroHeadText} leading-tight text-white`}>
            Hi, I'm <br></br>
            <span className="text-[#d5874b]">Christian</span>
          </h1>
          <p
            className={`${styles.heroSubText} mt-2 leading-tight text-white-100`}
          >
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
