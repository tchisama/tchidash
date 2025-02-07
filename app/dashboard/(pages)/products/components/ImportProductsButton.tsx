import { useState } from 'react';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { Button, buttonVariants } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useStore } from '@/store/storeInfos';

const ImportProducts = () => {
  const [file, setFile] = useState<File | null>(null);
  const {storeId} = useStore();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    try {
      // Read the file
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const content = e.target?.result as string;
        const products = JSON.parse(content);

        // Iterate through each product and add it to Firebase
        for (const product of products) {
          const productForUpload = {
            ...product,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            storeId: storeId,
          }
          if (!product.id) {
            console.error('Product is missing an ID:', product);
            continue;
          }

          // Add the product to Firebase with the specified ID
          const productRef = doc(db, 'products', product.id); // 'products' is the collection name
          await setDoc(productRef, productForUpload);
          console.log(`Product ${product.id} added successfully.`);
        }

        alert('Import completed successfully!');
      };

      fileReader.readAsText(file);
    } catch (error) {
      console.error('Error importing products:', error);
      alert('An error occurred while importing products.');
    }
  };

  return (
    <>
      <input className="hidden" id="fileInputImport" type="file" accept=".json" onChange={handleFileChange} />
      {
        !file &&
        <Label className={buttonVariants({ variant: "outline", size: "sm" })} htmlFor="fileInputImport">
          Start Import
        </Label>
      }
      {
        file &&
        <Button variant={"outline"} size={"sm"} onClick={handleImport} >
          Import
        </Button>
      }

    </>
  );
};

export default ImportProducts;