import { ExternalLink, Phone } from "lucide-react";
import Link from "next/link";
import { CopyPhoneButton } from "@/components/admin/copy-phone-button";
import { StatusBadge } from "@/components/admin/status-badge";
import { leadTypeLabels } from "@/lib/admin/constants";
import { formatDateTime, isSafeHttpUrl } from "@/lib/admin/format";
import type { Lead } from "@/types/database";

export function LeadTable({ leads }: { leads: Lead[] }) {
  return (
    <div className="overflow-hidden rounded-[8px] border border-slate-200 bg-white">
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-bold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">업체명</th>
              <th className="px-4 py-3">담당자</th>
              <th className="px-4 py-3">연락처</th>
              <th className="px-4 py-3">업종</th>
              <th className="px-4 py-3">지역</th>
              <th className="px-4 py-3">유형</th>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3">신청일</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-slate-950">
                  <Link href={`/admin/leads/${lead.id}`}>{lead.business_name}</Link>
                </td>
                <td className="px-4 py-3 text-slate-700">{lead.contact_name}</td>
                <td className="px-4 py-3 text-slate-700">{lead.phone}</td>
                <td className="px-4 py-3 text-slate-700">{lead.industry}</td>
                <td className="px-4 py-3 text-slate-700">{lead.region}</td>
                <td className="px-4 py-3 text-slate-700">{leadTypeLabels[lead.lead_type]}</td>
                <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                <td className="px-4 py-3 text-slate-600">{formatDateTime(lead.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid divide-y divide-slate-100 lg:hidden">
        {leads.map((lead) => (
          <article key={lead.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link href={`/admin/leads/${lead.id}`} className="text-base font-extrabold text-slate-950">
                  {lead.business_name}
                </Link>
                <p className="mt-1 text-sm text-slate-600">{lead.industry} · {lead.region}</p>
              </div>
              <StatusBadge status={lead.status} />
            </div>
            <div className="mt-4 grid gap-2 text-sm text-slate-700">
              <p>{leadTypeLabels[lead.lead_type]} · {lead.contact_name}</p>
              <div className="flex flex-wrap gap-2">
                <a className="inline-flex items-center gap-1 rounded-[6px] border border-slate-200 px-2 py-1" href={`tel:${lead.phone}`}>
                  <Phone size={14} aria-hidden="true" />
                  {lead.phone}
                </a>
                <CopyPhoneButton phone={lead.phone} />
                {isSafeHttpUrl(lead.place_url) ? (
                  <a className="inline-flex items-center gap-1 rounded-[6px] border border-slate-200 px-2 py-1" href={lead.place_url || "#"} target="_blank" rel="noreferrer">
                    <ExternalLink size={14} aria-hidden="true" />
                    플레이스
                  </a>
                ) : null}
              </div>
              <p className="text-slate-500">{formatDateTime(lead.created_at)}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
