"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, SearchIcon, X } from "lucide-react";
import { useStore } from "@/store/storeInfos";
import { Switch } from "../ui/switch";

type Operator = "==" | "!=" | ">" | "<" | ">=" | "<=" | "array-contains";
type FieldType = "string" | "number" | "date" | "boolean" | "array";
const OperatorNames = {
  "==": "Equals",
  "!=": "Not Equals",
  ">": "Greater Than",
  "<": "Less Than",
  ">=": "Greater Than or Equals",
  "<=": "Less Than or Equals",
  "array-contains": "Contains",
};

type Filter = {
  field: string;
  operator: Operator;
  value: string | number | boolean;
};

const operatorOptions: Record<FieldType, Operator[]> = {
  string: ["=="],
  number: ["==", "!=", ">", "<", ">=", "<="],
  date: [">", "<", ">=", "<="],
  boolean: ["=="],
  array: ["array-contains"],
};

export default function FilteringComponent({
  collectionName,
  docStructure,
  callback,
  searchField,
  defaultFilters,
}: {
  collectionName: string;
  docStructure: Record<string, FieldType>;
  callback: (data: unknown[]) => void;
  searchField?: string;
  defaultFilters?: Filter[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filter[]>([]);
  const { storeId } = useStore();
  const [newFilter, setNewFilter] = useState<Filter>({
    field: "",
    operator: "==",
    value: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  const addFilter = () => {
    if (newFilter.field && newFilter.operator && newFilter.value) {
      setFilters([...filters, newFilter]);
      setNewFilter({ field: "", operator: "==", value: "" });
      setIsOpen(false);
    }
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  useEffect(() => {
    handleSearch();
  }, [filters]);

  const handleSearch = async () => {
    const filtring = {
      filters: [
        ...filters,
        {
          field: "storeId",
          operator: "==",
          value: storeId,
        },
        ...(defaultFilters || []),
      ],
    } as {
      filters?: Filter[];
      searchField?: string;
      searchValue?: string | number;
      orderBy?: string;
      orderDirection?: "asc" | "desc";
      limit?: number;
    };
    if (searchTerm !== "") {
      filtring.searchField = searchField;
      filtring.searchValue = searchTerm;
    }
    filtring.limit = 50;

    // convirt date to timestamp

    // filtring.filters = filtring.filters.map((filter) => {
    //   if (docStructure[filter.field] === "date") {
    //     return {
    //       ...filter,
    //       value: Timestamp.fromDate(new Date(filter.value as string)),
    //     };
    //   }
    //   return filter;
    // });

    console.log(filtring);
    const data = await fetch("/api/filters", {
      method: "POST",
      body: JSON.stringify({
        collectionName: collectionName,
        filters: filtring,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await data.json();
    callback(json.data);
  };

  const selectedFieldType = docStructure[newFilter.field] || "string";

  return (
    <div className="space-y-4 p-2 bg-white border mb-2 w-fit min-w-[500px] rounded-2xl ">
      <div className="flex space-x-2">
        <div className="flex flex-1">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow bg-white rounded-r-none"
          />
          <Button
            onClick={handleSearch}
            className="aspect-square rounded-l-none"
            size={"icon"}
            variant={"outline"}
          >
            <SearchIcon className="w-5 h-5" />
          </Button>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size={"icon"} className="aspect-square">
              <Filter className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Custom Filter</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Field Selection */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="field" className="text-right">
                  Field
                </Label>
                <Select
                  value={newFilter.field}
                  onValueChange={(value) =>
                    setNewFilter({ field: value, operator: "==", value: "" })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(docStructure).map((field) => (
                      <SelectItem key={field} value={field}>
                        {field}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Operator Selection */}
              {newFilter.field && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="operator" className="text-right">
                    Operator
                  </Label>
                  <Select
                    value={newFilter.operator}
                    onValueChange={(value) =>
                      setNewFilter({
                        ...newFilter,
                        operator: value as Operator,
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {operatorOptions[selectedFieldType].map((operator) => (
                        <SelectItem key={operator} value={operator}>
                          {OperatorNames[operator]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Value Input */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="value" className="text-right">
                  Value
                </Label>
                {selectedFieldType === "string" && (
                  <Input
                    type="text"
                    value={newFilter.value as string}
                    onChange={(e) =>
                      setNewFilter({
                        ...newFilter,
                        value: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                )}
                {selectedFieldType === "number" && (
                  <Input
                    type="number"
                    value={newFilter.value as number}
                    onChange={(e) =>
                      setNewFilter({
                        ...newFilter,
                        value: Number(e.target.value),
                      })
                    }
                    className="col-span-3"
                  />
                )}
                {selectedFieldType === "date" && (
                  <Input
                    type="date"
                    value={newFilter.value as string}
                    onChange={(e) =>
                      setNewFilter({
                        ...newFilter,
                        value: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                )}
                {selectedFieldType === "boolean" && (
                  <Switch
                    checked={newFilter.value as boolean}
                    onCheckedChange={(value) => {
                      setNewFilter({
                        ...newFilter,
                        value,
                      });
                    }}
                  />
                )}
              </div>
            </div>
            <Button onClick={addFilter}>Add Filter</Button>
          </DialogContent>
        </Dialog>
        {/* <div className="h-9 border-r mx-3"></div> */}
        {/* <Select value={orderBy} onValueChange={(value) => setOrderBy(value)}> */}
        {/*   <SelectTrigger className="bg-white w-[130px]"> */}
        {/*     <SelectValue placeholder="Order By" /> */}
        {/*   </SelectTrigger> */}
        {/*   <SelectContent> */}
        {/*     {Object.keys(docStructure).map((field) => ( */}
        {/*       <SelectItem key={field} value={field}> */}
        {/*         {field} */}
        {/*       </SelectItem> */}
        {/*     ))} */}
        {/*   </SelectContent> */}
        {/* </Select> */}
        {/* <Button */}
        {/*   variant={"outline"} */}
        {/*   size={"icon"} */}
        {/*   className="aspect-square" */}
        {/*   onClick={() => { */}
        {/*     setOrderDirection(orderDirection === "asc" ? "desc" : "asc"); */}
        {/*   }} */}
        {/* > */}
        {/*   {orderDirection === "asc" ? ( */}
        {/*     <ArrowDownUp className="w-5 h-5" /> */}
        {/*   ) : ( */}
        {/*     <ArrowUpDown className="w-5 h-5" /> */}
        {/*   )} */}
        {/* </Button> */}
      </div>

      {filters && filters.length > 0 && (
        <div className="flex gap-2">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter, index) => (
              <div
                key={index}
                className="flex text-xs border items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full "
              >
                <span>
                  {filter.field} {OperatorNames[filter.operator]} {filter.value}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-auto p-0"
                  onClick={() => removeFilter(index)}
                >
                  <X strokeWidth={3} className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
