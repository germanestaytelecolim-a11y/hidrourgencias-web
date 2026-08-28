import { revalidatePath, revalidateTag } from "next/cache";

import { getPublicDistributionPaths } from "@/lib/admin/distribution-paths";
import type { WorkCase } from "@/lib/admin/types";

export function revalidateWorkCaseDistribution(workCase: WorkCase) {
  revalidateTag("admin-work-cases", "max");
  for (const path of getPublicDistributionPaths(workCase)) {
    revalidatePath(path);
  }
}
