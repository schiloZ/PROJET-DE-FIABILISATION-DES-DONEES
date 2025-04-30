"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Formulaire", href: "/dashboard/forms" },
    { name: "Clients", href: "/dashboard/clients" },
    { name: "Notifications", href: "/dashboard/notification" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        const { lastName, firstName } = decoded;
        setUserName(`${firstName} ${lastName}`);
      } catch (error) {
        console.error("Erreur de décodage du token:", error);
      }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    router.push("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="text-xl md:text-sm lg:text-xl font-bold text-indigo-600"
            >
              E-collector
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`${
                  pathname === link.href
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-indigo-500"
                } px-1 py-2 text-sm font-medium`}
              >
                {link.name}
              </Link>
            ))}
            {/* User Name and Déconnexion */}
            {userName && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 font-medium px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                  {userName}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-300 hover:text-red-600 font-medium border border-red-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-500 hover:text-indigo-500"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`${
                  pathname === link.href
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-indigo-500"
                } block px-3 py-2 rounded-md text-base font-medium`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {userName && (
              <div className="px-3 py-2 border-t border-gray-200">
                <div className="text-indigo-700 font-semibold">
                  Bonjour, {userName}
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-2 text-sm text-red-300 hover:text-red-600 font-medium border border-red-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
