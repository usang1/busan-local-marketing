import Link from "next/link";
import { ArchiveButton } from "@/components/admin/archive-button";
import { AdminError, AdminPageHeader, EmptyState } from "@/components/admin/admin-page";
import { listPortfolios } from "@/lib/admin/db";
import { formatDate } from "@/lib/admin/format";

export default async function AdminPortfolioPage() {
  const { data, error } = await listPortfolios();

  return (
    <>
      <AdminPageHeader
        title="포트폴리오"
        description="공개 사이트에 노출될 Case Study를 관리합니다."
        action={<Link className="rounded-[8px] bg-accent px-4 py-2 text-sm font-bold text-white" href="/admin/portfolio/new">새 포트폴리오</Link>}
      />
      {error ? <AdminError message={error} /> : null}
      {data.length ? (
        <div className="overflow-hidden rounded-[8px] border border-slate-200 bg-white">
          <table className="hidden min-w-full divide-y divide-slate-200 text-sm lg:table">
            <thead className="bg-slate-50 text-left text-xs font-bold uppercase text-slate-500">
              <tr><th className="px-4 py-3">제목</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3">공개</th><th className="px-4 py-3">메인</th><th className="px-4 py-3">순서</th><th className="px-4 py-3">수정일</th><th className="px-4 py-3">관리</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-bold">{item.title}</td>
                  <td className="px-4 py-3">{item.slug}</td>
                  <td className="px-4 py-3">{item.published ? "공개" : "비공개"}</td>
                  <td className="px-4 py-3">{item.featured ? "노출" : "-"}</td>
                  <td className="px-4 py-3">{item.sort_order}</td>
                  <td className="px-4 py-3">{formatDate(item.updated_at)}</td>
                  <td className="px-4 py-3"><div className="flex gap-2"><Link className="rounded-[8px] border border-slate-200 px-3 py-2 font-bold" href={`/admin/portfolio/${item.id}/edit`}>수정</Link><ArchiveButton endpoint={`/api/admin/portfolio/${item.id}`} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="grid divide-y divide-slate-100 lg:hidden">
            {data.map((item) => (
              <article key={item.id} className="p-4">
                <h2 className="font-extrabold">{item.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{item.slug} · {item.published ? "공개" : "비공개"}</p>
                <div className="mt-3 flex gap-2"><Link className="rounded-[8px] border border-slate-200 px-3 py-2 text-sm font-bold" href={`/admin/portfolio/${item.id}/edit`}>수정</Link><ArchiveButton endpoint={`/api/admin/portfolio/${item.id}`} /></div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState title="포트폴리오 없음" description="등록된 포트폴리오가 없습니다." action={<Link className="rounded-[8px] bg-accent px-4 py-2 text-sm font-bold text-white" href="/admin/portfolio/new">첫 포트폴리오 등록</Link>} />
      )}
    </>
  );
}
