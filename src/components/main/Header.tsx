"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { authService } from "@/api/auth";
import Logo from "@/assets/svgs/logo.svg";

const Header = () => {
  const pathName = usePathname();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(authService.isAuthenticated());
  }, []);

  const navPages = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Events", path: "/events" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <header className="flex w-full items-center justify-between p-5 px-14 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-start w-1/6">
          <Link href="/">
            <Image src={Logo} alt="My Invite" className="w-1/2" />
          </Link>
        </div>
        <nav className="hidden md:flex items-center justify-center gap-10 text-md font-semibold font-outfit">
          {navPages.map((page, index) => (
            <Link
              key={index}
              href={page.path}
              className={`${
                pathName === page.path ? "text-violet-600" : "text-slate-700"
              } hover:text-violet-500 transition-colors`}
            >
              {page.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-end gap-6 md:gap-10">
          {isAuth ? (
            <Link
              href="/dashboard"
              className="font-bold text-sm md:text-md px-6 py-3 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-all shadow-lg shadow-violet-200"
            >
              My Dashboard
            </Link>
          ) : (
            <>
              <Link href={"/signin"} className="font-semibold text-slate-700 hover:text-violet-600 transition-colors">
                Sign In
              </Link>
              <Link
                href={"/register"}
                className="font-bold text-sm md:text-md px-6 py-3 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-all shadow-lg shadow-violet-200"
              >
                Host An Event
              </Link>
            </>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
