export function PlansIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 3.5c.28 0 .5.22.5.5v1.55a.5.5 0 0 1-1 0V4c0-.28.22-.5.5-.5Z"
        fill="currentColor"
      />
      <path
        d="M4.5 12a7.5 7.5 0 0 1 12.62-5.5M19.5 12a7.48 7.48 0 0 1-1.62 4.68"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9.2 15.8c-.9-.75-1.7-1.85-1.7-3.3a4.5 4.5 0 0 1 9 0c0 1.45-.8 2.55-1.7 3.3-.5.42-.8 1.02-.8 1.66V18a.7.7 0 0 1-.7.7H10.7a.7.7 0 0 1-.7-.7v-.54c0-.64-.3-1.24-.8-1.66Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M10.3 21h3.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M20.5 5.5 21.3 4M3.5 5.5 2.7 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function TasksIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="4" y="3.5" width="16" height="17" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8 9.2 9.2 10.4 11.6 8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.6 9h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M8 14.7 9.2 15.9 11.6 13.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.6 14.5h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function TodayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="3.5" y="4.5" width="17" height="16" rx="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 9.2h17" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M8.8 14.2 10.6 16 15.3 11.6"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
