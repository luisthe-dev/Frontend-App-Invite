"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Logo from "@/assets/svgs/logo.svg";

const Header = () => {
  const pathName = usePathname();
  const navPages = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Events", path: "/events" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <header className="flex w-full items-center justify-between p-5 px-14 bg-white shadow-md">
        <div className="flex items-center justify-start w-1/6">
          <Image src={Logo} alt="My Invite" className="w-1/2" />
        </div>
        <nav className="flex items-center justify-center gap-10 text-md font-semibold">
          {navPages.map((page, index) => (
            <Link
              key={index}
              href={page.path}
              className={`${
                pathName === page.path ? "text-[#8E6FF7]" : "text-[#2a1767]"
              }`}
            >
              {page.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-end gap-12">
          <Link href={"/login"} className="font-semibold text-md">
            Sign In
          </Link>
          <Link
            href={"/register"}
            className="font-semibold text-md px-5 py-3 rounded-xl bg-[#8E6FF7] text-white"
          >
            Host An Event
          </Link>
        </div>
      </header>
    </>
  );
};

export default Header;
