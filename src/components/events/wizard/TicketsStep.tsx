"use client";

import { Trash2, Plus, CheckCircle2, X } from "lucide-react";
import { Ticket, EventFormData } from "./types";

interface Props {
  formData: EventFormData;
  setFormData: (data: EventFormData) => void;
  tickets: Ticket[];
  addTicket: () => void;
  removeTicket: (index: number) => void;
  updateTicket: (index: number, field: string, value: string | boolean) => void;
  fees: { service: number; tax: number };
  ticketsSold?: number;
}

export default function TicketsStep({
  formData,
  setFormData,
  tickets,
  addTicket,
  removeTicket,
  updateTicket,
  fees,
  ticketsSold = 0,
}: Props) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6 text-primary font-medium">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
          3
        </div>
        <h2>Tickets</h2>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket, index) => (
          <div
            key={index}
            className="p-4 rounded-xl border border-border bg-muted/30 relative group"
          >
            <button
              type="button"
              onClick={() => removeTicket(index)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Ticket Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. VIP"
                  value={ticket.type}
                  onChange={(e) => updateTicket(index, "type", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:border-primary text-sm text-foreground"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-1">
                <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                  <span>Price (₦)</span>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ticket.is_price_tbd || false}
                      onChange={(e) => {
                        updateTicket(index, "is_price_tbd", e.target.checked);
                        if (e.target.checked) {
                          updateTicket(index, "price", "0");
                        }
                      }}
                      className="rounded border-input text-primary focus:ring-primary h-3 w-3"
                    />
                    <span className="text-[10px] font-normal uppercase">TBD</span>
                  </label>
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={ticket.price}
                  onChange={(e) => updateTicket(index, "price", e.target.value)}
                  disabled={ticket.is_price_tbd}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:border-primary text-sm text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  placeholder="100"
                  value={ticket.quantity}
                  onChange={(e) =>
                    updateTicket(index, "quantity", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:border-primary text-sm text-foreground"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Short description"
                  value={ticket.description || ""}
                  onChange={(e) =>
                    updateTicket(index, "description", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:border-primary text-sm text-foreground"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addTicket}
          className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground font-medium hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Ticket Type
        </button>

        {/* Fee Absorption Toggle */}
        <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                Absorb Platform Fees
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full uppercase tracking-tighter">
                  Pro
                </span>
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                If enabled, you pay the {fees.service + fees.tax}% platform fee
                from your revenue. Attendees pay exactly the ticket price.
              </p>
              {ticketsSold > 0 && (
                <p className="text-[10px] font-bold text-amber-600 mt-2 flex items-center gap-1">
                  <X className="w-3 h-3" /> Fee settings locked since tickets
                  have been sold
                </p>
              )}
            </div>
            <button
              type="button"
              disabled={ticketsSold > 0}
              onClick={() => {
                if (ticketsSold === 0) {
                  setFormData({
                    ...formData,
                    absorb_fees: !formData.absorb_fees,
                  });
                }
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                formData.absorb_fees ? "bg-primary" : "bg-input"
              } ${ticketsSold > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  formData.absorb_fees ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Price Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {tickets
              .filter((t) => t.price && parseFloat(t.price) > 0)
              .slice(0, 1)
              .map((t, i) => {
                const price = parseFloat(t.price);
                const feeAmt = price * ((fees.service + fees.tax) / 100);
                return (
                  <div
                    key={i}
                    className="bg-background rounded-xl p-4 border border-border"
                  >
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest block mb-2">
                      Example: {t.type || "Ticket"}
                    </span>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Attendee Pays
                        </p>
                        <p className="text-xl font-black text-foreground">
                          ₦
                          {(formData.absorb_fees
                            ? price
                            : price + feeAmt
                          ).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          You Receive
                        </p>
                        <p className="text-xl font-black text-primary">
                          ₦
                          {(formData.absorb_fees
                            ? price - feeAmt
                            : price
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            {tickets.every((t) => !t.price || parseFloat(t.price) === 0) && (
              <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/20 col-span-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-700">
                      Free Event detected
                    </p>
                    <p className="text-xs text-emerald-600/80">
                      Platform fees are ₦0 for free events. Enjoy!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
