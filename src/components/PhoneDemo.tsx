import { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const STEP_BG = ["#FFFBEA", "#E0FBF8", "#F0EBFF", "#FFF0EA"];

const STEP_GLOW = [
  "rgba(255, 215, 0, 0.28)",
  "rgba(0, 196, 180, 0.28)",
  "rgba(124, 58, 255, 0.28)",
  "rgba(255, 107, 53, 0.28)",
];

const STEP_ACCENT = ["var(--gold)", "var(--cyan)", "var(--violet)", "var(--coral)"];
const STEP_ACCENT_DARK = ["var(--gold-dark)", "var(--cyan-dark)", "var(--violet-dark)", "var(--coral-dark)"];

const STEPS = [
  {
    img: "/images/screen-dashboard.png",
    pill: { label: "Pick your quest", cls: "pill-gold" },
    headline: "Pick your quest.",
    body: "Every day a new mission drops. Choose your focus block and claim the XP reward waiting at the finish line.",
    num: "01",
  },
  {
    img: "/images/screen-running.png",
    pill: { label: "Place on the Pad", cls: "pill-cyan" },
    headline: "Place it on the Pad. Watch the adventure.",
    body: "Your character sets off into the world while you focus. The Pad doubles your XP. Stay off your phone. Your hero is counting on you.",
    num: "02",
  },
  {
    img: "/images/screen-streak.png",
    pill: { label: "Keep the flame", cls: "pill-violet" },
    headline: "Keep the flame alive.",
    body: "Every session extends your streak. Miss a day and the flame dies. It's the one notification you'll actually want to answer.",
    num: "03",
  },
  {
    img: "/images/screen-stats.png",
    pill: { label: "See months add up", cls: "pill-coral" },
    headline: "See the months add up.",
    body: "Your calendar becomes a trophy wall. Weeks of consistency staring back at you. Harder to break than any habit you've ever tried.",
    num: "04",
  },
];

export default function PhoneDemo() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  const stepValue = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66, 1],
    [0, 1, 2, 3]
  );

  useMotionValueEvent(stepValue, "change", (v) => setStep(Math.round(v)));

  const s = STEPS[step];

  return (
    <div id="demo" ref={outerRef} className="demo-outer" style={{ height: "280vh", position: "relative" }}>
      <motion.div
        className="demo-sticky"
        animate={{ backgroundColor: STEP_BG[step] }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Section header */}
        <div
          style={{
            textAlign: "center",
            padding: "clamp(1.75rem, 3.5vw, 3rem) 2rem 1.25rem",
            flexShrink: 0,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              marginBottom: "0.75rem",
            }}
          >
            <motion.div
              animate={{ backgroundColor: STEP_ACCENT[step] }}
              transition={{ duration: 0.5 }}
              style={{ height: 3, width: 32, borderRadius: 99 }}
            />
            <span className="section-overline">How It Works</span>
            <motion.div
              animate={{ backgroundColor: STEP_ACCENT[step] }}
              transition={{ duration: 0.5 }}
              style={{ height: 3, width: 32, borderRadius: 99 }}
            />
          </div>

          <h2
            className="display"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.75rem)",
              fontWeight: 700,
              color: "var(--ink)",
              lineHeight: 1.02,
              letterSpacing: "-.02em",
            }}
          >
            See it{" "}
            <motion.span
              animate={{ color: STEP_ACCENT_DARK[step] }}
              transition={{ duration: 0.5 }}
              style={{ display: "inline" }}
            >
              in action.
            </motion.span>
          </h2>
        </div>

        {/* Three-column grid: sidebar | content | phone */}
        <div
          className="demo-grid"
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "64px 1fr 1fr",
            gap: "clamp(1.5rem, 4vw, 4rem)",
            alignItems: "center",
            maxWidth: 1140,
            margin: "0 auto",
            padding: "0 2rem clamp(1.5rem, 2.5vw, 2.5rem)",
            width: "100%",
          }}
        >
          {/* COLUMN 1: Vertical step sidebar */}
          <div
            className="demo-sidebar"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "0.5rem",
            }}
          >
            {STEPS.map((_, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {/* Node circle */}
                <motion.div
                  animate={{
                    background: i <= step ? STEP_ACCENT[i] : "rgba(10,10,10,.06)",
                    boxShadow: i === step ? "3px 3px 0 var(--ink)" : "none",
                  }}
                  transition={{ duration: 0.35 }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "2.5px solid var(--ink)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--ff-display)",
                      fontWeight: 700,
                      fontSize: ".84rem",
                      color: i <= step ? "var(--ink)" : "rgba(10,10,10,.25)",
                      lineHeight: 1,
                      userSelect: "none",
                    }}
                  >
                    {i + 1}
                  </span>
                </motion.div>

                {/* Connector line — not rendered after the last node */}
                {i < STEPS.length - 1 && (
                  <motion.div
                    animate={{
                      background: i < step ? "var(--ink)" : "rgba(10,10,10,.12)",
                    }}
                    transition={{ duration: 0.4 }}
                    style={{
                      width: 3,
                      height: 52,
                      borderRadius: 99,
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* COLUMN 2: Step text content */}
          <div style={{ position: "relative" }}>
            {/* ── Desktop: animated single-step view driven by scroll ── */}
            <div className="demo-animated-step">
              {/* Watermark number */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={`wm-${step}`}
                  className="display"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.055 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "-0.25em",
                    transform: "translateY(-50%)",
                    fontSize: "clamp(8rem, 18vw, 16rem)",
                    fontWeight: 700,
                    color: "var(--ink)",
                    lineHeight: 1,
                    userSelect: "none",
                    pointerEvents: "none",
                    zIndex: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.num}
                </motion.span>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.36, ease: "easeOut" }}
                  style={{ position: "relative", zIndex: 1 }}
                >
                  <span
                    className={`pill ${s.pill.cls}`}
                    style={{ marginBottom: "1.1rem", display: "inline-flex" }}
                  >
                    {s.pill.label}
                  </span>

                  <h3
                    className="display"
                    style={{
                      fontSize: "clamp(1.75rem, 3vw, 3rem)",
                      fontWeight: 700,
                      color: "var(--ink)",
                      lineHeight: 1.08,
                      marginBottom: "1rem",
                      marginTop: ".75rem",
                      letterSpacing: "-.02em",
                    }}
                  >
                    {s.headline}
                  </h3>

                  <p
                    style={{
                      fontSize: "1.05rem",
                      color: "var(--ink-60)",
                      lineHeight: 1.8,
                      maxWidth: 400,
                      marginBottom: "1.5rem",
                    }}
                  >
                    {s.body}
                  </p>

                  <motion.div
                    animate={{ backgroundColor: STEP_ACCENT[step] }}
                    transition={{ duration: 0.5 }}
                    style={{
                      height: 4,
                      width: 56,
                      borderRadius: 99,
                      border: "2px solid var(--ink)",
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Mobile: static stacked list of all 4 steps ── */}
            <div
              className="demo-step-list"
              style={{
                display: "none",
                flexDirection: "column",
                gap: "2.5rem",
              }}
            >
              {STEPS.map((st, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "1.25rem",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Step number bubble */}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      border: "2.5px solid var(--ink)",
                      background: STEP_ACCENT[i],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      boxShadow: "3px 3px 0 var(--ink)",
                      marginTop: "0.25rem",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--ff-display)",
                        fontWeight: 700,
                        fontSize: ".9rem",
                        color: "var(--ink)",
                        lineHeight: 1,
                      }}
                    >
                      {i + 1}
                    </span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <span
                      className={`pill ${st.pill.cls}`}
                      style={{ marginBottom: "0.75rem", display: "inline-flex" }}
                    >
                      {st.pill.label}
                    </span>

                    <h3
                      className="display"
                      style={{
                        fontSize: "clamp(1.3rem, 5vw, 1.75rem)",
                        fontWeight: 700,
                        color: "var(--ink)",
                        lineHeight: 1.1,
                        marginBottom: "0.625rem",
                        marginTop: "0.5rem",
                        letterSpacing: "-.02em",
                      }}
                    >
                      {st.headline}
                    </h3>

                    <p
                      style={{
                        fontSize: "1rem",
                        color: "var(--ink-60)",
                        lineHeight: 1.7,
                      }}
                    >
                      {st.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 3: Phone frame */}
          <div
            className="demo-phone-col"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <motion.div
              animate={{ backgroundColor: STEP_GLOW[step] }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{
                position: "absolute",
                width: "75%",
                height: "85%",
                borderRadius: "50%",
                filter: "blur(48px)",
                zIndex: 0,
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 1,
                width: "min(300px, 42vw)",
                aspectRatio: "9 / 19.5",
                borderRadius: 36,
                border: "3px solid var(--ink)",
                boxShadow: "8px 8px 0 var(--ink)",
                backgroundColor: "var(--white)",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 60,
                  height: 18,
                  borderRadius: 999,
                  backgroundColor: "var(--ink)",
                  zIndex: 10,
                }}
              />

              {STEPS.map((st, i) => (
                <motion.img
                  key={st.img}
                  src={st.img}
                  alt={st.headline}
                  animate={{
                    opacity: i === step ? 1 : 0,
                    scale: i === step ? 1 : 0.96,
                    y: i === step ? [0, -8, 0] : 0,
                  }}
                  transition={
                    i === step
                      ? {
                          opacity: { duration: 0.3 },
                          scale: { duration: 0.3 },
                          y: {
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.3,
                          },
                        }
                      : {
                          opacity: { duration: 0.22 },
                          scale: { duration: 0.22 },
                        }
                  }
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    pointerEvents: "none",
                  }}
                />
              ))}
            </div>

          </div>
        </div>
      </motion.div>

      <style>{`
        /* ── Desktop: keep the full scroll-driven sticky experience ── */

        /* ── Mobile (≤860px): static step list, no scroll-jacking ── */
        @media (max-width: 860px) {
          /* The outer container no longer needs 280vh of scroll space */
          .demo-outer { height: auto !important; }

          /* The sticky panel becomes a normal block that sizes to its content */
          .demo-sticky {
            position: static !important;
            height: auto !important;
            padding-bottom: clamp(2.5rem, 6vw, 4rem) !important;
          }

          /* Hide the sidebar step-tracker and the phone frame — they're part
             of the desktop sticky experience. On mobile we show all steps as
             a stacked list below the heading. */
          .demo-sidebar    { display: none !important; }
          .demo-phone-col  { display: none !important; }

          /* Single column — only the text content column is shown */
          .demo-grid {
            grid-template-columns: 1fr !important;
            padding: 0 clamp(1.25rem, 5vw, 2rem) clamp(1.5rem, 4vw, 2.5rem) !important;
          }

          /* On mobile we show a static list of all four steps instead of the
             animated single-step view driven by scroll. We hide the animated
             single-step wrapper and show the static list. */
          .demo-animated-step { display: none !important; }
          .demo-step-list     { display: flex !important; }
        }

        /* Tighten padding on very small phones */
        @media (max-width: 480px) {
          .demo-grid {
            padding: 0 1.25rem 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
}
