import { useEffect, useState } from "react";
import { MapPin, FileText, DollarSign, User, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useOrderStore } from "@/store/orders";
import { cities } from "./cities";
import { CityCombobox } from "./CityCombobox";
import { Input } from "@/components/ui/input";
import { useDialogs } from "@/store/dialogs";
import axios from "axios";
import { dbUpdateDoc } from "@/lib/dbFuntions/fbFuns";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Order } from "@/types/order";
import { useIntegrations } from "@/hooks/use-integrations";
import { digylogIntegration } from "@/types/store";

type City = {
  name: string;
  id: number;
};

export default function DigylogDialog({
  currentOrder,
}: {
  currentOrder: Order;
}) {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [note, setNote] = useState("");
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const { setCurrentOrderData } = useOrderStore();
  const { digylogOpen: open, setDigylogOpen: setOpen } = useDialogs();
  const [, setLoading] = useState(false);

  useEffect(() => {
    if (currentOrder) {
      const city = cities.find((c: City) =>
        c.name
          .toLowerCase()
          .includes(currentOrder.cityAi?.city.toLowerCase() ?? ""),
      );
      setSelectedCity(city ?? null);
      setNote("Please deliver this order as soon as possible.");
      setPrice(currentOrder.totalPrice.toString());
      setName(currentOrder.customer.name);
      setAddress(currentOrder.customer.shippingAddress.address);
      setPhone(currentOrder.customer.phoneNumber ?? "");
      setTrakingId(currentOrder.shippingInfo?.trackingNumber ?? "");
    }
  }, [currentOrder, open]);

  const integrations = useIntegrations();
  useEffect(() => {
    const digylogIntegration = integrations("digylog") as digylogIntegration;
    setNote(digylogIntegration?.note ?? "");
  }, [integrations]);

  const sendOrderToDigylog = () => {
    setLoading(true);
    if (!selectedCity) return;
    if (!currentOrder) return;
    setOpen(false);

    const data = {
      mode: 1,
      status: 0,
      orders: [
        {
          num: "commande " + currentOrder.sequence,
          type: 1,
          name: name,
          phone: phone,
          address: address,
          city: selectedCity.name,
          note: note,
          refs: [
            {
              designation: "test designation",
              quantity: currentOrder.totalItems,
            },
          ],
          price: Number(price),
          port: 1,
          openproduct: 1,
        },
      ],
    };

    axios
      // i want to send data as well as paramas
      .post("/api/integrations/digylog/orders", data, {
        params: {
          storeId: currentOrder.storeId,
        },
      })
      .then((response) => {
        console.log("Response from Digylog", response.data);
        if (response.data.status == "success") {
          const trackingNumber = response.data.data[0].traking;
          console.log("Tracking number from Digylog", trackingNumber);
          console.log("currentOrder", currentOrder.id);
          updateDoc(doc(db, "orders", currentOrder.id), {
            shippingInfo: {
              trackingNumber: trackingNumber,
              shippingProvider: "Digylog",
              shippingCost: 0,
            },
          });
          setCurrentOrderData({
            ...currentOrder,
            shippingInfo: {
              trackingNumber: trackingNumber,
              shippingProvider: "Digylog",
              shippingCost: 0,
            },
          } as Order);
        }
      })

      // .then(async (response) => {
      // console.log("Response from Digylog", response.data);
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      // const get = await axios.get("/api/integrations/digylog", {
      //   params: {
      //     phone: currentOrder.customer.phoneNumber,
      //     storeId: currentOrder.storeId,
      //   },
      // });
      // if (get.data !== "success") {
      //   console.log("Error while fetching data from Digylog");
      // }
      // let trackingNumber = "";
      // let cost = 0;
      // if (get.data.data.length > 0) {
      //   trackingNumber = get.data.data[0].traking;
      //   cost = Number(get.data.data[0].delivery_cost);
      // }
      // console.log("Tracking number from Digylog", trackingNumber);
      //
      // if (!trackingNumber.includes(response.data.data[0])) {
      //   console.log("ids are not equal");
      // }
      //
      // if (response.data.status === "success") {
      //   dbUpdateDoc(
      //     doc(db, "orders", currentOrder.id),
      //     {
      //       shippingInfo: {
      //         trackingNumber: trackingNumber,
      //         shippingProvider: "Digylog",
      //         shippingCost: cost,
      //       },
      //     },
      //     currentOrder.id,
      //     "",
      //   );
      //   setCurrentOrderData({
      //     ...currentOrder,
      //     shippingInfo: {
      //       trackingNumber: trackingNumber,
      //       shippingProvider: "Digylog",
      //       shippingCost: cost,
      //     },
      //   } as Order);
      // }
      // })
      .catch((error) => {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [trakingId, setTrakingId] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const handleAssignTrackingNumber = () => {
    if (!currentOrder) return;
    dbUpdateDoc(
      doc(db, "orders", currentOrder.id),
      {
        shippingInfo: {
          trackingNumber: trakingId,
          shippingProvider: "Digylog",
          shippingCost: shippingCost,
        },
      },
      currentOrder.id,
      "",
    );
    setCurrentOrderData({
      ...currentOrder,
      shippingInfo: {
        trackingNumber: trakingId,
        shippingProvider: "Digylog",
        shippingCost: shippingCost,
      },
    } as Order);
    setOpen(false);
  };

  const [tab, setTab] = useState("send");
  const getTracking = async () => {
    if (!phone) return;
    setLoading(true);
    axios
      .get("/api/integrations/digylog", {
        params: {
          phone: phone,
          storeId: currentOrder?.storeId,
        },
      })
      .then((response) => {
        console.log("Response from Digylog", response.data);
        if (response.data.data.length > 0) {
          setTrakingId(response.data.data[0].traking);
          setShippingCost(Number(response.data.data[0].delivery_cost));
        } else {
          console.log("No tracking number found");
        }
      })
      .catch((error) => {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Order Details</DialogTitle>
          </DialogHeader>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="send">Send Order to Digylog</TabsTrigger>
              <TabsTrigger value="assign">Assign Tracking Number</TabsTrigger>
            </TabsList>
            <TabsContent value="send">
              <div
                className="grid grid-cols-2 gap-4 py-4"
                style={{ gridTemplateColumns: "1fr 5fr" }}
              >
                <Label htmlFor="name" className="text-right flex items-center">
                  <User className="h-4 w-4 inline-block mr-2" />
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1"
                />

                <Label htmlFor="phone" className="text-right flex items-center">
                  <Phone className="h-4 w-4 inline-block mr-2" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1"
                />
                <Label
                  htmlFor="address"
                  className="text-right flex items-center"
                >
                  <MapPin className="h-4 w-4 inline-block mr-2" />
                  Address
                </Label>
                <Input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="flex-1"
                />

                <Label htmlFor="city" className="text-right flex items-center">
                  <MapPin className="h-4 w-4 inline-block mr-2" />
                  City
                </Label>
                <CityCombobox
                  selectedCity={selectedCity}
                  onSelectCity={setSelectedCity}
                />
                <Label htmlFor="price" className="text-right flex items-center">
                  <DollarSign className="h-4 w-4 inline-block mr-2" />
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="flex-1"
                />
                <Label htmlFor="note" className="text-right flex items-center">
                  <FileText className="h-4 w-4 inline-block mr-2" />
                  Note
                </Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="flex-1 min-h-[100px]"
                />
              </div>
            </TabsContent>
            <TabsContent value="assign">
              <div className="flex gap-2 my-3 justify-between">
                <h1 className="font-bold ">
                  Get Tracking Number Based on phone Number
                </h1>
                <Button variant={"outline"} onClick={getTracking}>
                  Get Tracking{" "}
                </Button>
              </div>

              <div
                className="grid grid-cols-2 gap-4 py-4"
                style={{ gridTemplateColumns: "2fr 5fr" }}
              >
                <Label
                  htmlFor="tracking"
                  className="text-right flex items-center"
                >
                  <MapPin className="h-4 w-4 inline-block mr-2" />
                  Tracking Number
                </Label>
                <Input
                  id="tracking"
                  type="text"
                  value={trakingId}
                  onChange={(e) => setTrakingId(e.target.value)}
                  className="flex-1"
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              type="submit"
              onClick={() => {
                if (tab === "assign") {
                  handleAssignTrackingNumber();
                } else if (tab === "send") {
                  sendOrderToDigylog();
                }
              }}
            >
              {tab === "assign"
                ? "Assign Tracking Number"
                : "Send Order to Digylog"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
