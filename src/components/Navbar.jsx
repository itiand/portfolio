import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { styles } from "../styles";
import { navLinks } from "../constants"; //structured about, work, title
import { logo, menu, close, logoWhiteNoBG } from "../assets";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [menuToggle, setMenuToggle] = useState(false);

  return (
    <nav
      className={`${styles.paddingX} fixed top-0 z-20 flex w-full items-center py-5`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link
          to="/"
          className="flex items-center"
          onClick={() => {
            setActive("");
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
                } cursor-pointer text-[18px] font-medium hover:text-white`}
                onClick={() => {
                  setActive(link.title);
                }}
              >
                {link.title}
              </li>
            );
          })}
        </ul>
        <div className="sm:hidden">
          <img
            src={menuToggle ? close : menu}
            alt="menu"
            className="h-[20px] w-[20px] cursor-pointer object-contain"
            onClick={() => {
              setMenuToggle(!menuToggle);
            }}
          ></img>

          <div
            className={`${
              !menuToggle ? "hidden" : "flex"
            } black-gradient absolute right-0 top-20 z-10 mx-4 my-2 min-w-[140px] px-4 pb-2 pt-4`}
          >
            <ul className="flex list-none flex-col gap-4 text-secondary">
              {navLinks.map((link) => {
                return (
                  <li
                    key={link.id}
                    className={`cursor-pointer text-[16px] ${
                      active === link.title ? "text-white" : "text-secondary"
                    }`}
                    onClick={() => {
                      setActive(link.title);
                    }}
                  >
                    {link.title}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
