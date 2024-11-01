"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cities } from "./cities";

// Replace statuses with cities
type City = {
  id: number;
  name: string;
};

export function CityCombobox({
  selectedCity,
  onSelectCity,
}: {
  selectedCity: City | null;
  onSelectCity: (city: City) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center space-x-4 flex-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex-1 justify-start">
            {selectedCity ? selectedCity.name : "+ Select City"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="bottom" align="start">
          <Command>
            <CommandInput placeholder="Search city..." />
            <CommandList>
              <CommandEmpty>No cities found.</CommandEmpty>
              <CommandGroup>
                {cities.map((city) => (
                  <CommandItem
                    key={city.id}
                    value={city.name}
                    onSelect={() => {
                      onSelectCity(city);
                      setOpen(false);
                    }}
                  >
                    {city.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
