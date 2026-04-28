"use client";

import { useState } from "react";
import { useOrders } from "@/hooks/use-orders";
import { useTrades } from "@/hooks/use-trades";
import OrdersTable from "@/components/orders/OrdersTable";
import TradesTable from "@/components/orders/TradesTable";
import ErrorBanner from "@/components/shared/ErrorBanner";

type Tab = "orders" | "trades";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const orders = useOrders();
  const trades = useTrades();
  const hasError = orders.isError || trades.isError;

  const ordersCount = orders.data?.length ?? 0;
  const tradesCount = trades.data?.length ?? 0;
  const activeCount = activeTab === "orders" ? ordersCount : tradesCount;

  return (
    <div className="flex flex-col gap-10">
      {hasError && <ErrorBanner />}

      {/* PRIMARY — count of today's flow */}
      <div className="py-4">
        <div className="font-mono text-[10px] tracking-[0.20em] uppercase text-text-muted">
          / Today
        </div>
        <div
          className="mt-3 font-display font-medium text-[clamp(56px,8vw,96px)] leading-[0.85] tracking-[-0.04em] text-text-display"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {String(activeCount).padStart(3, "0")}
        </div>
        <div className="mt-3 font-mono text-[11px] tracking-[0.14em] uppercase text-text-secondary">
          {activeTab === "orders" ? "Orders placed" : "Trades executed"}
        </div>
      </div>

      {/* SECONDARY — segmented control */}
      <div className="flex items-center justify-between gap-6 flex-wrap">
        <div
          role="tablist"
          aria-label="View"
          className="inline-flex border border-border-visible"
        >
          {(["orders", "trades"] as Tab[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors ${
                  isActive
                    ? "bg-text-display text-bg-primary"
                    : "bg-transparent text-text-muted hover:text-text-secondary"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-text-dim flex items-center gap-3">
          <span>Orders {String(ordersCount).padStart(2, "0")}</span>
          <span>·</span>
          <span>Trades {String(tradesCount).padStart(2, "0")}</span>
        </div>
      </div>

      {/* TERTIARY — table */}
      {activeTab === "orders" && (
        <OrdersTable orders={orders.data} isLoading={orders.isLoading} />
      )}
      {activeTab === "trades" && (
        <TradesTable trades={trades.data} isLoading={trades.isLoading} />
      )}
    </div>
  );
}
