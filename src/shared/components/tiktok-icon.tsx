type TiktokIconProps = {
  className?: string;
};

export function TiktokIcon({ className }: TiktokIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.6 5.82c-1-.87-1.6-2.15-1.6-3.57h-3.13v13.3a3.08 3.08 0 1 1-2.5-3.02V9.36a6.2 6.2 0 1 0 5.63 6.17V9.7a8.24 8.24 0 0 0 4.6 1.4V8a4.94 4.94 0 0 1-3-2.18z" />
    </svg>
  );
}
