import { useProducts } from "@/store/products";

const useClean = () => {
    const {setProducts,setCurrentProduct,setLastUploadedProduct} = useProducts();

  const cleanAll = () => {
    setProducts([]);
    setCurrentProduct(null);
    setLastUploadedProduct(null);
  };

  return { cleanAll };
};

export default useClean;
