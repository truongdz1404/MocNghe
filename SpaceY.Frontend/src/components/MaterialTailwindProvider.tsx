'use client';

import { ThemeProvider } from "@material-tailwind/react";
import { ReactNode } from "react";

export function MaterialTailwindProvider({ children }: { children: ReactNode }) {
    return <ThemeProvider>{children}</ThemeProvider>;
}