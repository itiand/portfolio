import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { styles } from "../styles";
import { navLinks } from "../constants"; //structured about, work, title
import { logo, menu, close, logoWhiteNoBG } from "../assets";

const Navbar = () => {
  const [active, setActive] = useState("");

  return (
    <nav
      className={`${styles.paddingX} fixed top-0 z-20 flex w-full items-center py-5`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
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
            className="h-16 w-16 object-contain"
          />
        </Link>
        <ul className="hidden list-none flex-row gap-10 sm:flex">
          {navLinks.map((link) => {
            return (
              <li
                key={link.id}
                className={`${
                  active === link.title ? "text-white" : "text-secondary"
                } cursor-pointer font-medium hover:text-white`}
              >
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
