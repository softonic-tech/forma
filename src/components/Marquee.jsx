export default function Marquee({ className = '', children }) {
  return (
    <div className={'ticker ' + className}>
      <div className="ticker-track">
        <div className="ticker-group">{children}</div>
        <div className="ticker-group" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
