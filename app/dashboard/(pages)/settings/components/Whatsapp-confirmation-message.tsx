import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/store/storeInfos";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Image from "next/image";
import { useSession } from "next-auth/react";

const demoData = {
  name: "John",
  lastname: "Doe",
  phone: "123456789",
  address: "1234 Main St",
  city: "Marrakech",
  total_price: "100",
};

function WhatsappConfirmationMessage() {
  const [confirmationMessage, setConfirmationMessage] = React.useState("");
  const { store } = useStore();
  const [saved, setSaved] = React.useState(false);
  const { data } = useSession();

  useEffect(() => {
    if (store) {
      setConfirmationMessage(store?.whatsappConfirmationMessage ?? "");
    }
  }, [store]);

  const save = () => {
    // save the message
    if (store) {
      updateDoc(doc(db, "stores", store.id), {
        whatsappConfirmationMessage: confirmationMessage,
      });
      setSaved(true);
    }
  };
  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Whatsapp Confirmation Message</CardTitle>
        <CardDescription>
          this message will be sent to the customer when confirming the order
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="text-md mb-2">Variables</h3>
        <div className="flex gap-2">
          {["name", "lastname", "phone", "address", "city", "total_price"].map(
            (item) => (
              <Badge key={item} variant={"outline"}>
                {item}
              </Badge>
            ),
          )}
        </div>
        <div className="flex mt-4 gap-4">
          <Textarea
            className=" flex-1"
            placeholder="Your message here..."
            rows={5}
            value={confirmationMessage}
            onChange={(e) => {
              setSaved(false);
              setConfirmationMessage(e.target.value);
            }}
          />
          <div className="flex-1 items-start flex-row-reverse gap-2 flex  bg-green-50 p-5 border rounded-2xl">
            <Image
              src={store?.logoUrl ?? ""}
              alt="Store Logo"
              width={40}
              height={40}
              className="rounded-full border"
            />
            <div className="bg-white border text-gray-800 p-3 rounded-lg mb-4 relative">
              <p
                className="text-sm"
                // put it as html
                dangerouslySetInnerHTML={{
                  __html: confirmationMessage
                    .replaceAll("{{name}}", demoData.name)
                    .replaceAll("{{lastname}}", demoData.lastname)
                    .replaceAll("{{phone}}", demoData.phone)
                    .replaceAll("{{address}}", demoData.address)
                    .replaceAll("{{city}}", demoData.city)
                    .replaceAll("{{total_price}}", demoData.total_price)
                    .replaceAll("{{total_items}}", "2")
                    .replaceAll(
                      "{{user}}",
                      store?.employees?.find(
                        (e) => e.email === data?.user?.email,
                      )?.name ?? "",
                    )
                    .replaceAll("\n", "<br />")
                    // replace **something** with <strong>something</strong>
                    .replaceAll(/\*(.*?)\*/g, "<strong>$1</strong>"),
                }}
              ></p>
              <span className="absolute bottom-1 right-2 text-xs opacity-70">
                12:00 PM
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button onClick={save}>
          {saved ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Saved
            </>
          ) : (
            "Save"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default WhatsappConfirmationMessage;
