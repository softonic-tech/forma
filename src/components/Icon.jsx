const icons = {
  bag: (
    <>
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  arrowUpRight: <path d="M7 17L17 7M9 7h8v8" />,
  arrowUp: <path d="M12 19V5M6 11l6-6 6 6" />,
  arrowDown: <path d="M12 5v14M6 13l6 6 6-6" />,
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" />
      <rect x="13" y="4" width="7" height="7" />
      <rect x="4" y="13" width="7" height="7" />
      <rect x="13" y="13" width="7" height="7" />
    </>
  ),
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10z" />,
  building: (
    <>
      <path d="M4 20V6l8-3 8 3v14" />
      <path d="M9 20v-6h6v6M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M5 19l1.4-3.6A7.5 7.5 0 1 1 12 19.5c-1.2 0-2.4-.3-3.4-.8L5 19z" />
      <path d="M9 10.2c.2 1.8 2.6 3.4 2.8 3.5.8.5 1.8.4 2.1 0 .2-.3.8-1 .9-1.2.1-.2 0-.4-.2-.5l-1.2-.6c-.2-.1-.4 0-.5.2l-.4.6c-.1.1-.3.2-.5.1-1-.4-1.6-1.2-1.8-1.5-.1-.2 0-.4.1-.5l.5-.5c.2-.2.2-.4.1-.6l-.6-1.3c-.1-.2-.3-.3-.5-.2-.3.1-1 .5-1.2 1.5z" />
    </>
  ),
  phone: (
    <>
      <path d="M7 4h3l1 4-2 1a12 12 0 0 0 6 6l1-2 4 1v3c0 1-1 2-2 2C10 19 5 14 5 6c0-1 1-2 2-2z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="1" />
      <path d="M4 7l8 6 8-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </>
  ),
  ruler: <path d="M4 16l12-12 4 4-12 12H4v-4zm4-2l2-2m2-2 2-2m2-2 2-2" />,
  shirt: <path d="M8 5l4 2 4-2 3 3-3 2v11H8V10L5 8l3-3z" />,
  pants: <path d="M8 4h8l1 16h-4l-1-8-1 8H7L8 4z" />,
  palette: (
    <>
      <path d="M12 4a8 8 0 1 0 0 16h.5a2 2 0 0 0 2-2 2 2 0 0 1 2-2H18a4 4 0 0 0 0-8h-1" />
      <circle cx="8.5" cy="10" r=".8" fill="currentColor" stroke="none" />
      <circle cx="11" cy="7.5" r=".8" fill="currentColor" stroke="none" />
      <circle cx="15" cy="8" r=".8" fill="currentColor" stroke="none" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19a7 7 0 0 1 14 0" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 19a6 6 0 0 1 12 0" />
      <circle cx="17" cy="9" r="2.2" />
      <path d="M16 19a5 5 0 0 0 5-5" />
    </>
  ),
  check: <path d="M5 12.5l4.2 4.2L19 7" />,
  layers: (
    <>
      <path d="M12 4l8 4-8 4-8-4 8-4z" />
      <path d="M4 12l8 4 8-4" />
      <path d="M4 16l8 4 8-4" />
    </>
  )
};

export default function Icon({ name, size = 22 }) {
  return (
    <svg
      className="ui-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}
