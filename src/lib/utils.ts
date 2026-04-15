import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string): string {
    const amount = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(amount)) {
        return '₦0';
    }

    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount || 0);
}

export function getPriceRange(event: any): string {
    if (!event) return 'Free';
    
    // Check if event has a pre-formatted price range
    if (event.price_range) return event.price_range;
    
    // If all tickets are strictly TBD, return TBD
    if (event.tickets && event.tickets.length > 0 && event.tickets.every((t: any) => t.is_price_tbd)) {
        return 'TBD';
    }

    if (event.free || (event.tickets && event.tickets.length > 0 && event.tickets.every((t: any) => parseFloat(t.price) === 0 && !t.is_price_tbd))) {
        return 'Free';
    }
  
    // Check if event has min/max price pre-calculated
    if (event.min_price !== undefined && event.max_price !== undefined && event.min_price !== null) {
         const min = parseFloat(event.min_price);
         const max = parseFloat(event.max_price);
         if (min === max) {
             return min === 0 ? 'Free' : formatCurrency(min);
         }
         return `${formatCurrency(min)} - ${formatCurrency(max)}`;
    }
  
    // Fallback to searching tickets
    if (event.tickets && event.tickets.length > 0) {
        const validTickets = event.tickets.filter((t: any) => !t.is_price_tbd);
        if (validTickets.length > 0) {
            const prices = validTickets.map((t: any) => parseFloat(t.price)).filter((p: number) => !isNaN(p));
            if (prices.length > 0) {
                const min = Math.min(...prices);
                const max = Math.max(...prices);
                if (min === max) {
                    return min === 0 ? 'Free' : formatCurrency(min);
                }
                return `${formatCurrency(min)} - ${formatCurrency(max)}`;
            }
        }
    }
  
    if (event.price) {
        const p = parseFloat(event.price);
        return p === 0 ? 'Free' : formatCurrency(p);
    }
  
    return 'Free';
}
