import { placeAuditInputSchema, type PlaceAuditInput } from "@/lib/audit/schema";

const selfAuditPrefix = "self-";

export function encodeSelfAuditInput(input: PlaceAuditInput) {
  const payload = Buffer.from(JSON.stringify(input), "utf8").toString("base64url");
  return `${selfAuditPrefix}${payload}`;
}

export function decodeSelfAuditInput(id: string) {
  if (!id.startsWith(selfAuditPrefix)) return null;

  try {
    const json = Buffer.from(id.slice(selfAuditPrefix.length), "base64url").toString("utf8");
    const parsed = placeAuditInputSchema.safeParse(JSON.parse(json));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
