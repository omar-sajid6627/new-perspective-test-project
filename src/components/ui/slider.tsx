import * as React from "react";
import { cn } from "../../lib/utils";

export type SliderProps = React.InputHTMLAttributes<HTMLInputElement>;

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, type = "range", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer slider-amber",
          className
        )}
        style={{
          background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${
            (Number(props.value) || 0) * 100
          }%, #fef3c7 ${(Number(props.value) || 0) * 100}%, #fef3c7 100%)`,
        }}
        ref={ref}
        {...props}
      />
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
