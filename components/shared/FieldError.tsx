import { toMessage } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export function FieldError({ errors }: { errors: unknown[] }) {
  if (!errors.length) return null;
  return (
    <div className="flex items-start gap-1.5 mt-1.5">
      <AlertCircle
        size={13}
        style={{ color: '#F87171', flexShrink: 0, marginTop: '0.1rem' }}
      />
      <p style={{ fontSize: '0.75rem', color: '#F87171', lineHeight: 1.4 }}>
        {toMessage(errors[0])}
      </p>
    </div>
  );
}
