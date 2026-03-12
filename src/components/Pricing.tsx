import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";

const FREE_FEATURES = [
  "Unlimited focus sessions",
  "XP & leaderboard",
  "Streaks & quests",
  "iOS & Android",
];

const PAD_FEATURES = [
  "Everything in free",
  "Phone detection",
  "2× XP always",
  "Ships worldwide",
  "30-day guarantee",
];

function download() {
  const ua = navigator.userAgent.toLowerCase();
  window.open(
    /iphone|ipad|ipod|macintosh/.test(ua)
      ? "https://apps.apple.com/us/app/humanodoro/id6738285218"
      : "https://play.google.com/store/apps/details?id=com.humanodoro.pad.app",
    "_blank"
  );
}

function FeatureRow({ text, checkColor }: { text: string; checkColor: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: ".75rem", padding: ".5rem 0" }}>
      <div style={{
        width: 22, height: 22, borderRadius: "50%",
        background: checkColor + "22",
        border: `2px solid ${checkColor}`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Check size={12} color={checkColor} strokeWidth={3} />
      </div>
      <span style={{ fontSize: ".95rem", color: "var(--ink-60)", lineHeight: 1.4 }}>{text}</span>
    </div>
  );
}

export default function Pricing() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} id="pricing" style={{ background: "var(--white)", padding: "var(--section-pad) clamp(1.25rem, 5vw, 2rem)", position: "relative" }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", marginBottom: "3.5rem" }}
      >
        <span className="section-overline" style={{ marginBottom: ".875rem" }}>Pricing</span>
        <h2
          className="display"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4.25rem)", fontWeight: 700, color: "var(--ink)",
            lineHeight: 1.02, letterSpacing: "-.02em",
          }}
        >
          Simple pricing.
        </h2>
        <p style={{ fontSize: "1.1rem", color: "var(--ink-60)", marginTop: "0.625rem", lineHeight: 1.6 }}>
          No subscriptions. No catch.
        </p>
      </motion.div>

      {/* Cards */}
      <div style={{
        maxWidth: 740,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1.75rem",
        alignItems: "stretch",
      }} className="pricing-grid">

        {/* Card 1 — Free */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card"
          style={{
            padding: "2.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.375rem",
            boxShadow: "6px 6px 0 rgba(0,0,0,.12)",
          }}
        >
          <span className="pill" style={{
            alignSelf: "flex-start",
            color: "var(--ink-60)",
            borderColor: "var(--ink-30)",
            background: "var(--gray-50)",
          }}>
            The App
          </span>

          <div>
            <div
              className="display"
              style={{ fontSize: "3.75rem", fontWeight: 700, color: "var(--ink)", lineHeight: 1, letterSpacing: "-.02em" }}
            >
              $0
            </div>
            <div style={{ fontSize: ".88rem", color: "var(--ink-30)", marginTop: ".375rem", fontWeight: 500 }}>/forever</div>
          </div>

          <div style={{ borderTop: "2px solid rgba(0,0,0,.07)", paddingTop: "1.375rem", display: "flex", flexDirection: "column" }}>
            {FREE_FEATURES.map(f => <FeatureRow key={f} text={f} checkColor="var(--ink)" />)}
          </div>

          <button
            className="btn btn-outline"
            style={{ justifyContent: "center", marginTop: ".375rem", width: "100%" }}
            onClick={download}
          >
            Download Free
          </button>
        </motion.div>

        {/* Card 2 — Bundle (featured) */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card card-gold"
          style={{
            padding: "2.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.375rem",
            /* Scale up slightly and shift down to visually "pop" above the free card */
            transform: "scale(1.04) translateY(-4px)",
            transformOrigin: "top center",
          }}
        >
          <span className="pill pill-gold" style={{ alignSelf: "flex-start" }}>Most Popular</span>

          <div>
            <div style={{ fontFamily: "var(--ff-display)", fontSize: "1.05rem", fontWeight: 700, color: "var(--ink-60)", marginBottom: ".5rem", textTransform: "uppercase", letterSpacing: ".06em" }}>
              App + Pad Bundle
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: ".375rem" }}>
              <span className="display" style={{ fontSize: "3.25rem", fontWeight: 700, color: "var(--gold-dark)", lineHeight: 1, letterSpacing: "-.02em" }}>
                from 24.90 €
              </span>
              <span style={{ fontSize: ".88rem", color: "var(--ink-30)", fontWeight: 500 }}>/one-time</span>
            </div>
          </div>

          <div style={{ borderTop: "2px solid rgba(0,0,0,.1)", paddingTop: "1.375rem", display: "flex", flexDirection: "column" }}>
            {PAD_FEATURES.map(f => <FeatureRow key={f} text={f} checkColor="var(--gold-dark)" />)}
          </div>

          <button
            className="btn btn-gold"
            style={{ justifyContent: "center", marginTop: ".375rem", width: "100%" }}
            onClick={() => window.open("https://humanodoro.com/shop", "_blank")}
          >
            Get the Bundle →
          </button>

          <p style={{ fontSize: ".9rem", color: "var(--ink-30)", textAlign: "center", fontWeight: 500 }}>
            Free shipping worldwide
          </p>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .pricing-grid {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
            max-width: 100% !important;
          }
          /* Undo the scale transform on mobile — it causes horizontal overflow */
          .pricing-grid > div:last-child {
            transform: none !important;
          }
        }
        @media (max-width: 480px) {
          .pricing-grid > div {
            padding: 1.75rem 1.375rem !important;
          }
        }
      `}</style>
    </section>
  );
}
