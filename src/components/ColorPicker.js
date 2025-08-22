import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { SketchPicker } from "react-color";
import { Droplet } from "lucide-react";
import clsx from "clsx";


const ColorPicker = ({
  value,
  onChange,
  showIcon = true,
  showLabel = true,
  showColorPreview = true,
  label = "Выбрать цвет",
  icon,
  buttonVariant = "outline",
  className,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant={buttonVariant}
            className={clsx("flex items-center gap-2", className)}
          >
            {showColorPreview && (
              <div
                className="h-4 w-4 rounded-full border"
                style={{ backgroundColor: value }}
              />
            )}
            {showIcon && (icon || <Droplet size={16} />)}
            {showLabel && <span>{label}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2 w-auto">
          <SketchPicker
            color={value}
            onChange={(color) => onChange(color.hex)}
            disableAlpha
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ColorPicker;
