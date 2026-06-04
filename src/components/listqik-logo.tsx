import Image from "next/image";
import { LISTQIK_LOGO_ALT, LISTQIK_LOGO_PATH } from "@/lib/brand-assets";

const VARIANTS = {
  header: { width: 280, height: 56, className: "h-12 w-auto max-w-[18rem] sm:max-w-[20rem]" },
  footer: { width: 280, height: 56, className: "h-12 w-auto max-w-[18rem] sm:max-w-[20rem]" },
  dashboard: { width: 220, height: 44, className: "h-10 w-auto max-w-[14rem]" },
  auth: { width: 300, height: 60, className: "mx-auto h-14 w-auto max-w-[20rem] sm:max-w-[22rem]" },
} as const;

export type ListQikLogoVariant = keyof typeof VARIANTS;

type ListQikLogoProps = {
  variant?: ListQikLogoVariant;
  className?: string;
  priority?: boolean;
};

export function ListQikLogo({ variant = "header", className, priority = false }: ListQikLogoProps) {
  const size = VARIANTS[variant];
  const mergedClass = className ? `${size.className} ${className}` : size.className;

  return (
    <Image
      src={LISTQIK_LOGO_PATH}
      alt={LISTQIK_LOGO_ALT}
      width={size.width}
      height={size.height}
      className={mergedClass}
      priority={priority}
    />
  );
}
