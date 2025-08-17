/* Combobox.js */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function Combobox({ items, selectedItem, onSelect, placeholder = "Выберите..." }) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-64 justify-between"
                >
                    {selectedItem ? selectedItem.label : placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-64">
                <Command>
                    <CommandInput
                        placeholder="Поиск..."
                        onValueChange={(query) => onSelect && onSelect(query, true)}
                    />
                    <CommandList>
                        <CommandEmpty>Ничего не найдено</CommandEmpty>
                        <CommandGroup>
                            {items.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    onSelect={() => {
                                        onSelect && onSelect(item);
                                        setOpen(false);
                                    }}
                                >
                                    {item.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
