"use client";

import { AdminActionButton } from "@/components/admin/admin-shell";

export function ExportAnalyticsButton({ data }: { data: any }) {
  const handleExport = () => {
    const csvContent = 
      "Metric,Value\n" +
      `Total Revenue,$${data.totalRevenue}\n` +
      `Active Orders,${data.activeOrders}\n` +
      `Total Users,${data.customerCount}\n` +
      `Revenue Growth,${data.revenueGrowth}%\n`;

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "analytics_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminActionButton tone="primary" onClick={handleExport}>
      Export Report
    </AdminActionButton>
  );
}
