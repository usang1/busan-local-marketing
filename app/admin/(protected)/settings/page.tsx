import { AdminPageHeader } from "@/components/admin/admin-page";
import { SettingsForm } from "@/components/admin/settings-form";
import { getSiteSettings } from "@/lib/admin/db";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <AdminPageHeader title="설정" description="공개 사이트에서 사용할 기본 운영 정보를 관리합니다. 환경변수와 config 값은 fallback으로 유지됩니다." />
      <SettingsForm settings={settings} />
    </>
  );
}
