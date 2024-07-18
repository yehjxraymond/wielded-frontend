import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ComponentProps, FunctionComponent } from "react";

export const StyledLink: FunctionComponent<ComponentProps<typeof Link>> = ({
  children,
  ...props
}) => (
  <Link
    className={cn(
      "border-b-4 border-gray-300 font-semibold decoration-transparent",
      props.className
    )}
    {...props}
  >
    {children}
  </Link>
);
