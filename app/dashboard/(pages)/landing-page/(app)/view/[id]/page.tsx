import { LandingPageView } from "../../../components/landing-page-view";
import { ProductProvider } from "../../../context/product-context";


export default function ViewPage({ params }: { params: { id: string } }) {
  return (
    <ProductProvider>
      <LandingPageView pageId={params.id} />
    </ProductProvider>
  )
}
