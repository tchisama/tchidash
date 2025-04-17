import { LandingPageBuilder } from "./components/landing-page-builder";
import { ProductProvider } from "./context/product-context";

export default function Home() {
  return (
    <ProductProvider>
      <main className="min-h-screen bg-gray-50">
        <LandingPageBuilder />
      </main>
    </ProductProvider>
  );
}
