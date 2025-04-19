"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Transforming E-commerce with{" "}
              <span className="text-[hsl(160,100%,25%)]">Data-Driven Insights</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover how Tchidash helps businesses optimize their e-commerce operations and boost sales through advanced analytics and real-time monitoring.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* E-commerce Challenges Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Current E-commerce Challenges</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-[hsl(160,100%,25%)]">Data Overload</h3>
                <p className="text-gray-600 mb-4">
                  E-commerce businesses face an overwhelming amount of data from multiple sources:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Customer behavior and preferences</li>
                  <li>Sales and revenue metrics</li>
                  <li>Inventory and supply chain data</li>
                  <li>Marketing campaign performance</li>
                  <li>Competitor analysis</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-[hsl(160,100%,25%)]">Decision Making</h3>
                <p className="text-gray-600 mb-4">
                  Critical challenges in e-commerce decision-making:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Real-time inventory management</li>
                  <li>Pricing optimization</li>
                  <li>Customer retention strategies</li>
                  <li>Marketing budget allocation</li>
                  <li>Product assortment planning</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Solutions Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Solutions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-[hsl(160,100%,25%)] text-2xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
                <p className="text-gray-600">
                  Monitor sales, inventory, and customer behavior in real-time with intuitive dashboards and alerts.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-[hsl(160,100%,25%)] text-2xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">Predictive Insights</h3>
                <p className="text-gray-600">
                  Leverage AI-powered predictions for inventory management, pricing, and customer behavior.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-[hsl(160,100%,25%)] text-2xl mb-4">📈</div>
                <h3 className="text-xl font-semibold mb-2">Performance Tracking</h3>
                <p className="text-gray-600">
                  Track KPIs and metrics that matter most to your e-commerce success.
                </p>
              </div>
            </div>
          </section>

          {/* Best Practices Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">E-commerce Best Practices</h2>
            <div className="space-y-8">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-[hsl(160,100%,25%)]">1. Customer Experience Optimization</h3>
                <p className="text-gray-600 mb-4">
                  Enhance your customer journey with these proven strategies:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Streamlined checkout process</li>
                  <li>Mobile-first design approach</li>
                  <li>Personalized product recommendations</li>
                  <li>Fast and reliable shipping options</li>
                  <li>Easy returns and refunds</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-[hsl(160,100%,25%)]">2. Data-Driven Decision Making</h3>
                <p className="text-gray-600 mb-4">
                  Make informed decisions using analytics:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Track customer lifetime value</li>
                  <li>Monitor cart abandonment rates</li>
                  <li>Analyze product performance</li>
                  <li>Measure marketing ROI</li>
                  <li>Optimize pricing strategies</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-[hsl(160,100%,25%)]">3. Inventory Management</h3>
                <p className="text-gray-600 mb-4">
                  Optimize your inventory with these techniques:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Real-time stock monitoring</li>
                  <li>Automated reorder points</li>
                  <li>Seasonal demand forecasting</li>
                  <li>Supplier performance tracking</li>
                  <li>Warehouse optimization</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-[hsl(160,100%,25%)] text-white p-12 rounded-2xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your E-commerce Business?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of successful e-commerce businesses using Tchidash to optimize their operations and boost sales.
            </p>
            <button
              onClick={() => router.push("/signin")}
              className="bg-white text-[hsl(160,100%,25%)] px-8 py-3 rounded-lg text-lg hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </button>
          </section>
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

export default AboutPage; 