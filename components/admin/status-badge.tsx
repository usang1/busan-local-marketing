import type { LeadStatus } from "@/types/lead";
import { leadStatusLabels, statusBadgeClass } from "@/lib/admin/constants";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={cn("inline-flex rounded-[6px] border px-2.5 py-1 text-xs font-bold", statusBadgeClass(status))}>
      {leadStatusLabels[status]}
    </span>
  );
}
