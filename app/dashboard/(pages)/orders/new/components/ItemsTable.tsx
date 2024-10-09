import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useOrderStore } from "@/store/orders";
import { Button } from "@/components/ui/button";
import { OrderItem } from "@/types/order";
import { Input } from "@/components/ui/input";
import ChooseProductWithVariant from "./ChooseProductWithVariant";
import { getTotalPriceFromItem } from "@/lib/orders";
import { PlusCircle, X } from "lucide-react";

function ItemsTable() {
	const { newOrder, setNewOrder } = useOrderStore();

	// new order item with the type of OrderItem
	const addItem = () => {
		const newItem: OrderItem = {
			id: Date.now().toString(),
			productId: "",
			title: "",
			quantity: 1,
			price: 0,
			totalPrice: 0,
			imageUrl: "",
		};

		if (!newOrder) return;

		setNewOrder({
			...newOrder,
			items: [...newOrder.items, newItem],
		});
	};

	return (
    <div className="flex flex-col items-end">

			<Button size={"sm"} onClick={addItem} variant={"outline"} className="ml-auto mb-2">
        <PlusCircle className="h-3.5 w-3.5 mr-2" />
				Add Item
			</Button>
		<div className="bg-slate-50 rounded-2xl w-full border">
{
  newOrder?.items.length === 0 ? (
    <div className="flex justify-center items-center h-24">
      <p className="text-slate-500">No items added</p>
    </div>
  ) : (
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[30%]">Product</TableHead>
						<TableHead>Item Price</TableHead>
						<TableHead>Quantity</TableHead>
						<TableHead>Discount</TableHead>
						<TableHead className="">Total Price</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{newOrder?.items.map((item) => (
						<TableRow key={item.id}>
							{/* Product Info */}
							<TableCell>
								<ChooseProductWithVariant item={item} />
							</TableCell>

							{/* Item Price */}
							<TableCell>
								<div className="font-medium">{item.price} {newOrder.currency}</div>
							</TableCell>

							{/* Quantity */}
							<TableCell>
								<Input
									className="w-32"
									value={item.quantity}
									onChange={(e) => {
										const value = e.target.value;
										setNewOrder({
											...newOrder,
											items: newOrder?.items.map((i) => {
												if (i.id === item.id) {
													return {
														...i,
														quantity: value, // Keep as string for onBlur evaluation
													};
												}
												return i;
											}) as OrderItem[],
										});
									}}
									onBlur={(e) => {
										try {
											const evaluatedValue = eval(e.target.value); // Use eval to calculate the result
											if (typeof evaluatedValue === "number") {
												setNewOrder({
													...newOrder,
													items: newOrder?.items.map((i) => {
														if (i.id === item.id) {
															return {
																...i,
																quantity: evaluatedValue, // Set the quantity to the evaluated result
															};
														}
														return i;
													}),
												});
											} else {
												console.error("Invalid expression"); // Handle cases where eval does not return a number
											}
										} catch (error) {
											console.error("Error evaluating expression:", error); // Catch any errors from eval
										}
									}}
								/>
							</TableCell>

							{/* Discount */}
							<TableCell>
								<div className="font-medium">
									{item.discount?.type === "percentage"
										? `${item.discount.amount} %`
										: `${item.discount?.amount} ${newOrder.currency}`}
								</div>
							</TableCell>

							{/* Total Price */}
							<TableCell className="text-right">
								<div className="font-medium">
                  {getTotalPriceFromItem(item)} {" "}
                   {newOrder.currency}</div>
							</TableCell>
              <TableCell className="text-right">
                <Button
                  size={"icon"}
                  variant={"outline"}
                  onClick={() => {
                    setNewOrder({
                      ...newOrder,
                      items: newOrder?.items.filter((i) => i.id !== item.id),
                    });
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </TableCell>

						</TableRow>
					))}
				</TableBody>
			</Table>
      )
    }
		</div>
		</div>
	);
}

export default ItemsTable;
