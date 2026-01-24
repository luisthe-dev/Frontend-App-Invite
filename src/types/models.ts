export interface User {
    id: number;
    first_name: string;
    last_name: string;
    user_name: string;
    email: string;
    phone: string;
    role: string;
    avatar?: string;
    email_verified_at?: string;
    kyc_status: 'verified' | 'pending' | 'unverified';
    kyc_data?: any;
    trust_score: number;
    highest_historical_payout: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    events_count?: number;
    purchased_tickets_count?: number;
    has_password?: boolean;
}

export interface Wallet {
    id: number;
    user_id: number;
    balance: number;
    label?: string;
    created_at: string;
    updated_at: string;
}

export interface EventMedia {
    id: number;
    event_id: number;
    file_url: string;
    file_type: 'image' | 'video';
    public_id: string;
    is_cover: boolean;
    created_at: string;
}

export interface Ticket {
    id: number;
    event_id: number;
    title: string;
    description: string;
    price: number;
    quantity: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    purchased_tickets_count?: number; // often appended
}

export interface Event {
    id: number;
    user_id: number;
    title: string;
    slug: string;
    description: string;
    start_date: string;
    end_date?: string;
    image_url?: string;
    location: string;
    status: 'draft' | 'published' | 'cancelled' | 'completed';
    category: string;
    payout_status?: string;
    lat?: number;
    lng?: number;
    tags?: string[];
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    
    // Relations
    user?: User;
    tickets?: Ticket[];
    media?: EventMedia[];
    purchased_tickets_count?: number;
    total_revenue?: number;
}

export interface PurchasedTicket {
    id: number;
    event_id: number;
    ticket_id: number;
    transaction_id: number;
    scan_status: 'pending' | 'scanned';
    purchase_info: any;
    created_at: string;
    updated_at: string;
    
    // Relations
    event?: Event;
    ticket?: Ticket;
}

export interface Transaction {
    id: number;
    wallet_id?: number;
    transaction_id: string;
    total_amount: number;
    fees: number;
    processed_amount: number;
    type: 'Purchase' | 'Withdrawal' | 'Refund' | 'Credit';
    status: 'pending_payment' | 'processing' | 'payment_successful' | 'payment_failed' | 'pending_confirmation' | 'payment_refunded';
    description: string;
    transaction_data?: any;
    third_party_data?: any;
    created_at: string;
    updated_at: string;
    
    // Relations
    wallet?: Wallet;
    event?: Event; // Manually attached sometimes
    purchased_tickets?: PurchasedTicket[];
}

export interface Category {
    id: number;
    name: string;
    icon: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface TrustTier {
    id: number;
    name: string;
    min_score: number;
    max_score: number;
    withdrawal_percent: number;
    days_prior: number;
    created_at: string;
    updated_at: string;
}

export interface TrustScoreSetting {
    id: number;
    key: string;
    value: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface HostStats {
    earnings: {
        value: number;
        trend: 'up' | 'down';
        trend_value: string;
    };
    active_events: {
        value: number;
        trend: 'up' | 'down';
        trend_value: string;
    };
    tickets_sold: {
        value: number;
        trend: 'up' | 'down';
        trend_value: string;
    };
    avg_ticket_price: {
        value: string;
        trend: 'up' | 'down';
        trend_value: string;
    };
}

export interface HostEventDetails {
    event: Event;
    stats: {
        tickets_sold: number;
        revenue: number;
        withdrawable: number;
        views: number;
    };
    attendees: PurchasedTicket[]; // Or simplified attendee object if backend returns that
    tickets: Ticket[];
}

export interface AdminStats {
    total_users: number;
    total_events: number;
    active_events: number;
    total_volume: number;
    pending_payouts_count: number;
    top_events: Event[];
    recent_events: Event[];
    top_hosts: User[]; // User with events_count appended
}

export interface SupportMessage {
    id: number;
    ticket_id: number;
    user_id: number;
    message: string;
    attachments?: string[];
    is_admin: boolean;
    created_at: string;
    updated_at: string;
    
    // Relations
    user?: User;
}

export interface SupportTicket {
    id: number;
    user_id: number;
    subject: string;
    category: 'general' | 'billing' | 'technical' | 'dispute';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'open' | 'customer_reply' | 'admin_reply' | 'resolved' | 'closed';
    transaction_id?: number;
    created_at: string;
    updated_at: string;
    
    // Relations
    user?: User;
    messages?: SupportMessage[];
    transaction?: Transaction;
    messages_count?: number;
}

export interface AdminFinanceStats {
    total_volume: number;
    pending_payouts_volume: number;
    pending_payouts_count: number;
    processed_payouts_volume: number;
}

export interface Bank {
    id: number;
    name: string;
    code: string;
    active: boolean;
}
