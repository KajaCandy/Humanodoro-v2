import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

function download() {
  const ua = navigator.userAgent.toLowerCase();
  window.open(
    /iphone|ipad|ipod|macintosh/.test(ua)
      ? "https://apps.apple.com/us/app/humanodoro/id6738285218"
      : "https://play.google.com/store/apps/details?id=com.humanodoro.pad.app",
    "_blank"
  );
}

const FEATURE_TAGS = ["Proven phone barrier", "NFC Detection", "2× XP", "Any Phone"];

const FEATURES = [
  {
    color: "var(--gold)",
    bg: "#FFF9CC",
    icon: "⚡",
    label: "Physical Barrier",
    desc: "50,000+ users report they stop picking up their phone once it's on the Pad.",
  },
  {
    color: "var(--cyan)",
    bg: "#E0FBF8",
    icon: "×2",
    label: "2× XP Boost",
    desc: "Every minute on the Pad counts double. Always.",
  },
  {
    color: "var(--coral)",
    bg: "#FFF0EA",
    icon: "◎",
    label: "Built to Last",
    desc: "Cork surface, solid frame. Stays on your desk for years.",
  },
  {
    color: "var(--violet)",
    bg: "#F0EBFF",
    icon: "◎",
    label: "Universal Fit",
    desc: "Works with every phone and most cases.",
  },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function PadReveal() {
  const zone1Ref = useRef<HTMLDivElement>(null);
  const zone2Ref = useRef<HTMLDivElement>(null);
  const zone3Ref = useRef<HTMLDivElement>(null);

  const zone1InView = useInView(zone1Ref, { once: true, margin: "-8%" });
  const zone2InView = useInView(zone2Ref, { once: true, margin: "-8%" });
  const zone3InView = useInView(zone3Ref, { once: true, margin: "-8%" });

  return (
    <section id="pad" style={{ overflow: "hidden" }}>
      {/* ── ZONE 1: Dark header band ───────────────────────────── */}
      <div
        ref={zone1Ref}
        className="zone1-header-band"
        style={{
          background: "var(--ink)",
          padding:
            "clamp(3.5rem, 6vw, 6rem) clamp(2rem, 5vw, 6rem)",
        }}
      >
        <div
          className="zone1-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "clamp(2rem, 4vw, 4rem)",
            alignItems: "center",
            maxWidth: 1180,
            margin: "0 auto",
          }}
        >
          {/* Left: headline + tags */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={zone1InView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            <h2
              className="display"
              style={{
                fontSize: "clamp(2.8rem, 5vw, 5.5rem)",
                fontWeight: 700,
                color: "var(--white)",
                lineHeight: 1.05,
                letterSpacing: "-.02em",
                marginBottom: "1.75rem",
              }}
            >
              Proven to keep
              <br />
              your phone
              <br />
              right there.
            </h2>

            {/* Feature tag pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".625rem" }}>
              {FEATURE_TAGS.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: "var(--ff-body)",
                    fontSize: ".875rem",
                    fontWeight: 600,
                    color: "var(--ink)",
                    background: "var(--white)",
                    border: "2px solid var(--ink)",
                    borderRadius: "999px",
                    padding: ".3rem .875rem",
                    letterSpacing: ".01em",
                    lineHeight: 1.4,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right: price card */}
          <motion.div
            className="zone1-price-card"
            initial={{ opacity: 0, x: 40 }}
            animate={zone1InView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.12, ease: easeOut }}
            style={{
              background: "var(--gold)",
              border: "3px solid var(--ink)",
              borderRadius: "1.25rem",
              boxShadow: "6px 6px 0 rgba(255,255,255,.15)",
              padding: "2rem 2.25rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: ".375rem",
              minWidth: "min(200px, 100%)",
              textAlign: "center",
            }}
          >
            <span
              className="display"
              style={{
                fontSize: "clamp(3rem, 4vw, 4rem)",
                fontWeight: 700,
                color: "var(--ink)",
                lineHeight: 1,
                letterSpacing: "-.03em",
              }}
            >
              from 24.90 €
            </span>
            <span
              style={{
                fontSize: ".9rem",
                fontWeight: 600,
                color: "var(--ink-60)",
                letterSpacing: ".04em",
                textTransform: "uppercase",
                marginBottom: ".75rem",
              }}
            >
              one-time
            </span>
            <button
              className="btn btn-coral"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() =>
                window.open("https://humanodoro.com/shop", "_blank")
              }
            >
              Get the Pad <ArrowRight size={15} />
            </button>
            <p
              style={{
                fontSize: ".875rem",
                color: "var(--ink-60)",
                fontWeight: 600,
                marginTop: ".5rem",
                lineHeight: 1.5,
              }}
            >
              Free shipping · 30-day guarantee
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── ZONE 2: Full-width lifestyle image bento ────────────── */}
      <div
        ref={zone2Ref}
        className="zone2-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: 3,
          background: "var(--ink)",
          height: "clamp(320px, 40vw, 480px)",
        }}
      >
        {[
          { src: "/images/pad-hero.png",             alt: "Man working with pad on desk",     delay: 0,   pos: "left bottom", scale: 1.15 },
          { src: "/images/pad-sleep.png",            alt: "Cork pad on nightstand",           delay: 0.1, pos: "center center", scale: 1 },
          { src: "/images/pad-student-plastic.png",  alt: "Black plastic pad at desk",        delay: 0.2, pos: "center center", scale: 1 },
        ].map(({ src, alt, delay, pos, scale }) => (
          <motion.div
            key={src}
            initial={{ opacity: 0 }}
            animate={zone2InView ? { opacity: 1 } : {}}
            transition={{ duration: 0.65, delay, ease: "easeOut" }}
            style={{ overflow: "hidden", position: "relative" }}
          >
            <img
              src={src}
              alt={alt}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, display: "block", transform: `scale(${scale})`, transformOrigin: "center bottom" }}
            />
          </motion.div>
        ))}
      </div>

      {/* ── ZONE 3: Feature strip ──────────────────────────────── */}
      <div
        ref={zone3Ref}
        className="zone3-band"
        style={{
          background: "var(--cream)",
          padding: "clamp(3rem, 5vw, 5rem) clamp(1.5rem, 4vw, 4rem)",
        }}
      >
        <div
          className="zone3-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
            maxWidth: 1180,
            margin: "0 auto",
          }}
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 28 }}
              animate={zone3InView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1, ease: easeOut }}
              style={{
                background: "var(--white)",
                border: "2.5px solid var(--ink)",
                borderRadius: "1rem",
                padding: "1.5rem",
                boxShadow: "4px 4px 0 var(--ink)",
                display: "flex",
                flexDirection: "column",
                gap: ".75rem",
              }}
            >
              {/* Icon circle */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: f.bg,
                  border: "2.5px solid var(--ink)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: f.icon === "×2" ? "1rem" : "1.1rem",
                  fontWeight: 800,
                  fontFamily: "var(--ff-display)",
                  color: "var(--ink)",
                  flexShrink: 0,
                }}
              >
                {f.icon}
              </div>
              <div>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: ".95rem",
                    color: "var(--ink)",
                    marginBottom: ".3rem",
                    fontFamily: "var(--ff-body)",
                  }}
                >
                  {f.label}
                </p>
                <p
                  style={{
                    fontSize: ".875rem",
                    color: "var(--ink-60)",
                    lineHeight: 1.55,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={zone3InView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.45, ease: easeOut }}
          className="zone3-cta"
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "2.5rem",
          }}
        >
          <button
            className="btn btn-coral btn-lg"
            onClick={() =>
              window.open("https://humanodoro.com/shop", "_blank")
            }
          >
            Get the Pad · from 24.90 € <ArrowRight size={16} />
          </button>
          <button className="btn btn-outline btn-sm" onClick={download}>
            Free app included
          </button>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .zone1-grid {
            grid-template-columns: 1fr !important;
          }
          .zone1-price-card {
            width: 100% !important;
            min-width: 0 !important;
          }
          .zone2-grid {
            grid-template-columns: 1fr 1fr !important;
            height: auto !important;
          }
          .zone2-grid > div {
            min-height: 220px;
          }
          .zone2-grid > div:first-child {
            grid-column: 1 / -1;
          }
          .zone3-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .zone3-grid {
            grid-template-columns: 1fr !important;
          }
          .zone2-grid {
            grid-template-columns: 1fr !important;
          }
          .zone2-grid > div {
            min-height: 200px;
          }
          .zone1-header-band {
            padding: clamp(2.5rem, 7vw, 3.5rem) 1.25rem !important;
          }
          .zone3-cta { flex-direction: column !important; align-items: stretch !important; }
          .zone3-cta .btn { justify-content: center !important; }
        }
        @media (max-width: 480px) {
          .zone1-header-band {
            padding-left: 1.25rem !important;
            padding-right: 1.25rem !important;
          }
          .zone3-band {
            padding-left: 1.25rem !important;
            padding-right: 1.25rem !important;
          }
        }
      `}</style>
    </section>
  );
}
