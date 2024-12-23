import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Updated Badge Variants
const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                approved:
                    "border-transparent bg-green-100 text-green-900 hover:bg-green-200",
                pending:
                    "border-transparent bg-blue-100 text-blue-900 hover:bg-blue-200",
                rejected:
                    "border-transparent bg-red-100 text-red-900 hover:bg-red-200",
                outline: "border text-foreground",
            },
        },
        defaultVariants: {
            variant: "approved", // Change the default to "approved" if appropriate
        },
    }
);

// Updated Badge Props
export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant = "approved", ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };