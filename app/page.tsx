"use client";
import { useRouter } from "next/navigation";
import React from "react";
import Navbar from "./components/Navbar";

function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Hero Content */}
        <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              {/* Decorative Elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-full">
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-[hsl(160,100%,25%)] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-72 h-72 bg-[hsl(160,100%,25%)] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-[hsl(160,100%,25%)] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
              </div>

              {/* Main Content */}
              <div className="relative">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-6">
                  Welcome to{" "}
                  <span className="text-[hsl(160,100%,25%)] relative">
                    Tchidash
                    <span className="absolute -bottom-2 left-0 w-full h-2 bg-[hsl(160,100%,25%)] opacity-20 rounded-full"></span>
                  </span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Your all-in-one dashboard solution for managing and monitoring your business metrics in real-time.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => router.push("/signin")}
                    className="bg-[hsl(160,100%,25%)] text-white px-8 py-3 rounded-lg text-lg hover:bg-[hsl(160,100%,20%)] transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Get Started
                  </button>
                  <button
                    onClick={() => router.push("/about")}
                    className="border-2 border-[hsl(160,100%,25%)] text-[hsl(160,100%,25%)] px-8 py-3 rounded-lg text-lg hover:bg-[hsl(160,100%,25%)] hover:text-white transition-all transform hover:scale-105"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-[hsl(160,100%,25%)] text-2xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
              <p className="text-gray-600">Monitor your data in real-time with intuitive visualizations and insights.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-[hsl(160,100%,25%)] text-2xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">Your data is protected with enterprise-grade security and reliability.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-[hsl(160,100%,25%)] text-2xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Experience blazing fast performance with optimized data handling.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p>© 2024 Tchidash. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Page;
