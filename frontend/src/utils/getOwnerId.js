export function getOwnerId(ownerId) {
  if (!ownerId) return null;
  if (typeof ownerId === "string") return ownerId;
  return ownerId._id;
}
