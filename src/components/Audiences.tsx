const CARDS = [
  {
    img: "audience-professionals.jpg",
    bg: "#FF6B35",
    title: "High-Performance Professionals",
    desc: "Deep work blocks that actually deliver. No Slack spirals, no tab rabbit holes.",
  },
  {
    img: "audience-students.jpg",
    bg: "#00C4B4",
    title: "Students & Creatives",
    desc: "Deep focus that actually sticks.",
  },
  {
    img: "audience-family.jpg",
    bg: "#FF2D78",
    title: "Parents & Families",
    desc: "Be present. Compete together.",
  },
  {
    img: "audience-scrollers.jpg",
    bg: "#7C3AFF",
    title: "Recovering Scrollers",
    desc: "You already know you need this.",
  },
];

function AudienceCell({ card }: { card: typeof CARDS[number] }) {
  return (
    <div
      className="audience-cell"
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "52vh",
        cursor: "pointer",
      }}
      onMouseEnter={e => {
        const img = e.currentTarget.querySelector("img") as HTMLImageElement;
        if (img) img.style.transform = "scale(1.06)";
      }}
      onMouseLeave={e => {
        const img = e.currentTarget.querySelector("img") as HTMLImageElement;
        if (img) img.style.transform = "scale(1)";
      }}
    >
      {/* Background color */}
      <div style={{
        position: "absolute", inset: 0,
        background: card.bg,
        zIndex: 0,
      }} />

      {/* Photo */}
      <img
        src={`/images/${card.img}`}
        alt={card.title}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          mixBlendMode: "multiply",
          transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          zIndex: 1,
        }}
      />

      {/* Bottom gradient — deeper for better text legibility */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: "70%",
        background: "linear-gradient(to top, rgba(0,0,0,.75) 0%, rgba(0,0,0,.2) 60%, transparent 100%)",
        zIndex: 2,
      }} />

      {/* Text */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        padding: "2.25rem 2rem",
        zIndex: 3,
      }}>
        <h3
          className="display"
          style={{
            fontSize: "clamp(1.35rem, 2.5vw, 1.875rem)",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.15,
            marginBottom: ".5rem",
            letterSpacing: "-.01em",
          }}
        >
          {card.title}
        </h3>
        <p style={{
          fontSize: ".92rem", color: "rgba(255,255,255,.85)", lineHeight: 1.5, marginBottom: "1.125rem",
          fontWeight: 400,
        }}>
          {card.desc}
        </p>
        <a
          href="#pricing"
          className="audience-cell-link"
          style={{
            fontSize: ".875rem",
            fontWeight: 700,
            color: "#fff",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: ".4rem",
            opacity: 0.8,
            transition: "opacity .2s",
            fontFamily: "var(--ff-display)",
            letterSpacing: ".02em",
            minHeight: 44,
            touchAction: "manipulation",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "0.8")}
        >
          Download free →
        </a>
      </div>
    </div>
  );
}

export default function Audiences() {
  return (
    <section style={{ background: "var(--white)", overflow: "hidden" }}>
      {/* Section header */}
      <div className="audiences-header" style={{ background: "var(--white)", textAlign: "center", padding: "var(--section-pad) 2rem 3rem" }}>
        <span className="section-overline" style={{ marginBottom: ".875rem" }}>Who It's For</span>
        <h2
          className="display"
          style={{
            fontSize: "clamp(2rem, 4vw, 3.75rem)", fontWeight: 700, color: "var(--ink)",
            marginBottom: "0.875rem", letterSpacing: "-.02em", lineHeight: 1.05,
          }}
        >
          Who wins with Humanodoro?
        </h2>
        <p style={{ color: "var(--ink-60)", fontSize: "1.05rem", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
          Whether you're chasing deadlines or just trying to be present. This was built for you.
        </p>
      </div>

      {/* 2×2 full-bleed grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
      }} className="audiences-grid">
        {CARDS.map((card, i) => (
          <AudienceCell key={i} card={card} />
        ))}
      </div>

      <style>{`
        @media (max-width: 700px) {
          .audiences-grid { grid-template-columns: 1fr !important; }
          .audience-cell { min-height: 44vh !important; }
        }
        @media (max-width: 600px) {
          .audiences-header { padding: var(--section-pad) 1.25rem 2.5rem !important; }
        }
        @media (max-width: 480px) {
          .audience-cell { min-height: 56vw !important; }
          /* Ensure the tap target at the bottom of each card is comfortable */
          .audience-cell-link {
            padding: .625rem 0 !important;
            min-height: 44px !important;
            display: inline-flex !important;
            align-items: center !important;
          }
        }
      `}</style>
    </section>
  );
}
