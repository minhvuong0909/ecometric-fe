import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { Input } from "./input";
import { formatDate } from "@/shared/lib/date-format";

type Props = {
  id: string;
  value: string;
  onChange: (event: { target: { value: string } }) => void;
  required?: boolean;
};
export function DateInput({ id, value, onChange, required }: Props) {
  const [draft, setDraft] = useState(formatDate(value));
  useEffect(() => setDraft(formatDate(value)), [value]);
  return (
    <div className="relative">
      <Input
        id={id}
        value={draft}
        required={required}
        placeholder="dd/mm/yyyy"
        inputMode="numeric"
        maxLength={10}
        className="pr-12 tabular-nums"
        onChange={(event) => {
          const text = event.target.value;
          setDraft(text);
          const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
          const iso = match ? `${match[3]}-${match[2]}-${match[1]}` : "";
          const valid =
            !!iso &&
            !Number.isNaN(Date.parse(iso)) &&
            new Date(iso).toISOString().slice(0, 10) === iso;
          event.target.setCustomValidity(
            text && !valid ? "Nhập ngày hợp lệ theo dạng dd/mm/yyyy." : "",
          );
          if (valid || !text) onChange({ target: { value: iso } });
        }}
      />
      <div className="absolute inset-y-0 right-0 flex w-11 items-center justify-center border-l border-input text-muted-foreground">
        <CalendarDays className="size-4" aria-hidden />
        <input
          type="date"
          aria-label={`Chọn ngày cho ${id}`}
          value={value}
          onChange={(event) => {
            setDraft(formatDate(event.target.value));
            const field = document.getElementById(
              id,
            ) as HTMLInputElement | null;
            field?.setCustomValidity("");
            onChange(event);
          }}
          className="absolute inset-0 w-full cursor-pointer opacity-0"
          tabIndex={0}
        />
      </div>
    </div>
  );
}
