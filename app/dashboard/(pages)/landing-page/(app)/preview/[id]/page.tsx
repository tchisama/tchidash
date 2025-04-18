import { LandingPagePreview } from "../../../components/landing-page-preview";
import { ProductProvider } from "../../../context/product-context";

export default function PreviewPage({ params }: { params: { id: string } }) {
  return (
    <ProductProvider>
      <main className="min-h-screen bg-gray-50">
        <LandingPagePreview pageId={params.id} />
      </main>
    </ProductProvider>
  )
}
