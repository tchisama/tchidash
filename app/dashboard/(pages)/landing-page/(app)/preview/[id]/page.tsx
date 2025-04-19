import { LandingPagePreview } from "../../../components/landing-page-preview";
import { ProductProvider } from "../../../context/product-context";
import { useStore } from "@/store/storeInfos";

export default function PreviewPage({ params }: { params: { id: string } }) {
  const { storeId } = useStore();
  
  return (
    <ProductProvider storeId={storeId || ""}>
      <main className="min-h-screen bg-gray-50">
        <LandingPagePreview pageId={params.id} />
      </main>
    </ProductProvider>
  )
}
