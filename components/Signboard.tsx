export function StatusBadge({ status }: { status: "available" | "taken" }) {
  return (
    <span
      className={`signboard text-xs ${
        status === "available" ? "signboard--available" : "signboard--taken"
      }`}
    >
      {status === "available" ? "To Let" : "Taken"}
    </span>
  );
}

export function VerifiedBadge() {
  return (
    <span className="signboard signboard--verified text-xs">✓ Verified Agent</span>
  );
}
