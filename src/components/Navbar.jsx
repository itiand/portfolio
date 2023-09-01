import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { styles } from "../styles";
import { navLinks } from "../constants"; //structured about, work, title
import { logo, menu, close, logoWhiteNoBG } from "../assets";

const Navbar = () => {
  const [acive, setActice] = useState("");

  return (
    <nav className={`${styles.paddingX} w-full flex items-center py-5`}>
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <Link
          to="/"
          className="flex items-center"
          onClick={() => {
            setActice("");
            window.scrollTo(0, 0);
          }}
        >
          <img
            src={logoWhiteNoBG}
            alt="logo"
            className="w-16 h-16 object-contain"
          />
        </Link>
        <ul className="list-none hidden sm:flex flex-row gap-10">
          {navLinks.map((link) => {
            return (
              <li key={link.id} className="">
                {link.title}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
