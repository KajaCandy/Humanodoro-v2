const NAV_LINKS = [
  { label: "How It Works", href: "#demo" },
  { label: "The Pad", href: "#pad" },
  { label: "Reviews", href: "#reviews" },
  { label: "Pricing", href: "#pricing" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Contact", href: "mailto:hello@humanodoro.com" },
];

export default function Footer() {
  return (
    <footer className="footer-outer" style={{
      background: "#00111C",
      borderTop: "6px solid var(--gold)",
      padding: "3.75rem 2rem 2.5rem",
    }}>
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1.5fr 1fr 1fr",
        gap: "3rem",
        alignItems: "start",
        marginBottom: "2.5rem",
      }} className="footer-grid">

        {/* LEFT — logo + tagline */}
        <div>
          <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", textDecoration: "none", marginBottom: "1rem" }}>
            <img src="/images/logo.png" alt="Humanodoro" style={{ width: 32, height: 32, objectFit: "contain" }} />
            <span style={{
              fontFamily: "var(--ff-display)",
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-.01em",
            }}>
              Humanodoro
            </span>
          </a>
          <p style={{ fontSize: ".9rem", color: "rgba(255,255,255,.55)", lineHeight: 1.7, maxWidth: 260 }}>
            Turn your phone into a quest machine. Focus is a superpower. We made it a game.
          </p>
        </div>

        {/* CENTER — nav links */}
        <div>
          <div style={{
            fontSize: ".84rem",
            fontWeight: 700,
            color: "rgba(255,255,255,.35)",
            letterSpacing: ".12em",
            textTransform: "uppercase",
            marginBottom: "1.125rem",
            fontFamily: "var(--ff-display)",
          }}>
            Navigate
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: ".625rem", marginBottom: "2rem" }}>
            {NAV_LINKS.map(l => (
              <a
                key={l.label}
                href={l.href}
                className="footer-link"
                style={{
                  color: "rgba(255,255,255,.65)",
                  fontSize: ".9rem",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color .15s",
                  lineHeight: 1.4,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.65)")}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
            <a
              href="https://apps.apple.com/us/app/humanodoro/id6738285218"
              target="_blank"
              rel="noreferrer"
              className="pill pill-gold"
              style={{ textDecoration: "none" }}
            >
              App Store
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.humanodoro.pad.app"
              target="_blank"
              rel="noreferrer"
              className="pill pill-cyan"
              style={{ textDecoration: "none" }}
            >
              Google Play
            </a>
          </div>
        </div>

        {/* RIGHT — legal + copyright */}
        <div>
          <div style={{
            fontSize: ".84rem",
            fontWeight: 700,
            color: "rgba(255,255,255,.35)",
            letterSpacing: ".12em",
            textTransform: "uppercase",
            marginBottom: "1.125rem",
            fontFamily: "var(--ff-display)",
          }}>
            Company
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".625rem" }}>
            {LEGAL_LINKS.map(l => (
              <a
                key={l.label}
                href={l.href}
                className="footer-link"
                style={{
                  color: "rgba(255,255,255,.65)",
                  fontSize: ".9rem",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color .15s",
                  lineHeight: 1.4,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.65)")}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        paddingTop: "1.5rem",
        borderTop: "1.5px solid rgba(255,255,255,.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
      }}>
        <p style={{ fontSize: ".84rem", color: "rgba(255,255,255,.3)", fontWeight: 500 }}>
          © 2025 Humanodoro. All rights reserved.
        </p>
        <p style={{ fontSize: ".84rem", color: "rgba(255,255,255,.3)", fontWeight: 500 }}>
          Made for people who want their time back.
        </p>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
        @media (max-width: 480px) {
          .footer-outer { padding: 3rem 1.25rem 2rem !important; }
          /* Make footer links comfortable tap targets */
          .footer-link { min-height: 36px; display: flex !important; align-items: center; }
        }
      `}</style>
    </footer>
  );
}
