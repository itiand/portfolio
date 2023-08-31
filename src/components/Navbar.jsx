import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { styles } from "../styles";
import { navLinks } from "../constants"; //structured about, work, title
import { logo, menu, close } from "../assets";

const Navbar = () => {
  console.log("logo", logo);
  return (
    <nav>
      <div>
        <Link>
          <p className="text-white text-[18px] font-bold cursor-pointer flex">
            Christian &nbsp;
            <span className="sm:block hidden"> | Web Developer</span>
          </p>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
