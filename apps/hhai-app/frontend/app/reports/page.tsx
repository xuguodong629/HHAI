import { Suspense } from "react";
import { LoadingState } from "@/components/primitives";
import { ReportsCenter } from "@/features/reports/reports-center";

export default function ReportsPage() {
  return <Suspense fallback={<LoadingState />}><ReportsCenter /></Suspense>;
}