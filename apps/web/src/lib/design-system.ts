import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging Tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Animation variants for landing page elements
 */
export const animations = {
    fadeIn: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }
    },
    staggerContainer: {
        animate: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    },
    reveal: {
        initial: { y: "100%" },
        animate: { y: 0 },
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
};
