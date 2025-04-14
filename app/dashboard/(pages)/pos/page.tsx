import { Suspense } from "react";
import PosSystem from "./components/pos-system";
import { Loader } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <PosSystem />
      </Suspense>
    </main>
  );
}
