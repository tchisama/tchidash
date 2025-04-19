"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const {data:session} = useSession();

  useEffect(() => {
    if (session) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [session]);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/signin");
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Image src="/icon.png" alt="Tchidash Logo" width={32} height={32} className="mr-2" />
            <span className="text-xl font-bold text-gray-900">Tchidash</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => router.push("/")}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => router.push("/about")}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              About
            </button>
            <button
              onClick={handleAuthClick}
              className="bg-[hsl(160,100%,25%)] text-white px-4 py-2 rounded-lg hover:bg-[hsl(160,100%,20%)] transition-colors"
            >
              {isAuthenticated ? "Dashboard" : "Sign In"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button
                onClick={() => {
                  router.push("/");
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => {
                  router.push("/about");
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                About
              </button>
              <button
                onClick={handleAuthClick}
                className="block w-full text-left px-3 py-2 bg-[hsl(160,100%,25%)] text-white hover:bg-[hsl(160,100%,20%)] rounded-md transition-colors"
              >
                {isAuthenticated ? "Dashboard" : "Sign In"}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar; 