import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string): string {
    const amount = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount || 0);
}

export function getPriceRange(event: any): string {
    if (event.free || (event.tickets && event.tickets.length > 0 && event.tickets.every((t: any) => parseFloat(t.price) === 0))) {
        return 'Free';
    }
  
    if (event.min_price !== undefined && event.max_price !== undefined) {
         if (parseFloat(event.min_price) === parseFloat(event.max_price)) {
             return formatCurrency(event.min_price);
         }
         return `${formatCurrency(event.min_price)} - ${formatCurrency(event.max_price)}`;
    }
  
    if (event.tickets && event.tickets.length > 0) {
        const prices = event.tickets.map((t: any) => parseFloat(t.price));
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        if (min === max) {
            return formatCurrency(min);
        }
        return `${formatCurrency(min)} - ${formatCurrency(max)}`;
    }
  
    if (event.price) {
        return formatCurrency(event.price);
    }
  
    return 'Free';
}
