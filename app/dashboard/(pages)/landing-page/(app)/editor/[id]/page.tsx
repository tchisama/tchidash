'use client'
import { LandingPageEditor } from "../../../components/landing-page-editor"
import { ProductProvider } from "../../../context/product-context"
import { useStore } from "@/store/storeInfos"

export default function EditorPage({ params }: { params: { id: string } }) {
  const { storeId } = useStore()
  
  return (
    <ProductProvider storeId={storeId || ""}>
      <main className="min-h-screen bg-gray-50">
        <LandingPageEditor pageId={params.id} />
      </main>
    </ProductProvider>
  )
}
