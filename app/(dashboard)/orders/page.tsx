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

  return (
    <div className="flex flex-col gap-1.5">
      {hasError && <ErrorBanner />}
      <div className="flex gap-px">
        {(["orders", "trades"] as Tab[]).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 text-[12px] font-bold uppercase tracking-wider transition-colors ${activeTab === tab ? "bg-bg-surface text-accent border border-border" : "bg-bg-primary text-text-dim border border-transparent hover:text-text-secondary"}`}>{tab}</button>
        ))}
      </div>
      {activeTab === "orders" && <OrdersTable orders={orders.data} isLoading={orders.isLoading} />}
      {activeTab === "trades" && <TradesTable trades={trades.data} isLoading={trades.isLoading} />}
    </div>
  );
}
