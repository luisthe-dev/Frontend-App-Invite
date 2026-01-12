import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string) {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(value)) {
    return '₦0.00';
  }

  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
}

export function getPriceRange(event: any) {
    if (event.price_range) return event.price_range;
    
    if (!event.tickets || event.tickets.length === 0) {
        return "Free";
    }

    const prices = event.tickets.map((t: any) => Number(t.price));
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    if (max === 0) return "Free";
    if (min === max) return formatCurrency(min);
    return `${formatCurrency(min)} - ${formatCurrency(max)}`;
}
