import { useEffect, useState } from "react";

/** Trả về giá trị đã trì hoãn `delay` ms — dùng cho ô tìm kiếm để giảm số request. */
export function useDebouncedValue<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
