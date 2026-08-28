import { connection } from "next/server";

import { PublicAdminCases } from "@/components/admin/PublicAdminCases";
import { getPublicWorkCasesForPath } from "@/lib/admin/public-work-cases";

export async function PublicAdminCasesForPath({
  path,
  title,
  limit,
}: {
  path: string;
  title?: string;
  limit?: number;
}) {
  await connection();
  const cases = await getPublicWorkCasesForPath(path, limit);
  return <PublicAdminCases cases={cases} title={title} />;
}
