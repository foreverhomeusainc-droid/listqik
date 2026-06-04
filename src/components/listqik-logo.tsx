import Image from "next/image";
import { LISTQIK_LOGO_ALT, LISTQIK_LOGO_PATH } from "@/lib/brand-assets";

const VARIANTS = {
  header: { width: 140, height: 40, className: "h-9 w-auto max-w-[9.5rem]" },
  footer: { width: 160, height: 44, className: "h-10 w-auto max-w-[10.5rem]" },
  dashboard: { width: 120, height: 32, className: "h-8 w-auto max-w-[7.5rem]" },
  auth: { width: 200, height: 48, className: "mx-auto h-12 w-auto max-w-[12.5rem]" },
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
