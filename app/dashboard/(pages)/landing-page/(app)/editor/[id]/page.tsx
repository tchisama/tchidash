import { LandingPageEditor } from "../../../components/landing-page-editor"
import { ProductProvider } from "../../../context/product-context"

export default function EditorPage({ params }: { params: { id: string } }) {
  return (
    <ProductProvider>
      <main className="min-h-screen bg-gray-50">
        <LandingPageEditor pageId={params.id} />
      </main>
    </ProductProvider>
  )
}
