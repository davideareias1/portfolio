"use client";
import React from "react";
import { useScrollSpy } from "@/hooks/useScrollSpy";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

const Header = () => {
  const activeId = useScrollSpy(
    navLinks.map((link) => link.href.substring(1)),
    { rootMargin: "0px 0px -80% 0px" }
  );

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[color:var(--color-background)]/80 backdrop-blur-sm">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1 md:flex md:items-center md:gap-12">
            <a 
              className="block text-[color:var(--color-primary)]" 
              href="#home"
              onClick={(e) => handleNavClick(e, "#home")}
            >
              <span className="sr-only">Home</span>
              <h1 className="text-2xl font-bold">DA</h1>
            </a>
          </div>

          <div className="md:flex md:items-center md:gap-12">
            <nav aria-label="Global" className="hidden md:block">
              <ul className="flex items-center gap-6 text-sm">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      className={`text-[color:var(--color-foreground)] transition hover:text-[color:var(--color-primary)] ${
                        activeId === link.href.substring(1)
                          ? "text-[color:var(--color-primary)]"
                          : ""
                      }`}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="md:hidden">
              {/* Mobile menu button will be added here */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
