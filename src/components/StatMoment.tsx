import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

function useCountUp(target: number, active: boolean, duration = 1800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const pct = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - pct, 3);
      setValue(Math.round(target * eased));
      if (pct < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return value;
}

const STATS = [
  { value: "2.5 hrs", label: "of your day, gone" },
  { value: "5 years",  label: "lost by age 70" },
  { value: "9 in 10",  label: "want to use it less" },
];

export default function StatMoment() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const count = useCountUp(81, inView, 1800);

  return (
    <section
      ref={ref}
      className="stat-section"
      style={{
        background: "var(--gold)",
        color: "var(--ink)",
        position: "relative",
        overflow: "hidden",
        padding: "var(--section-pad) clamp(1.25rem, 5vw, 2rem)",
      }}
    >
      {/* Subtle large-type watermark for texture */}
      <div aria-hidden="true" style={{
        position: "absolute",
        right: "-4rem",
        top: "50%",
        transform: "translateY(-50%)",
        fontFamily: "var(--ff-display)",
        fontSize: "clamp(24rem, 40vw, 56rem)",
        fontWeight: 700,
        lineHeight: 1,
        color: "rgba(0,0,0,.04)",
        pointerEvents: "none",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}>
        81
      </div>

      <div style={{
        maxWidth: 900,
        margin: "0 auto",
        textAlign: "center",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Giant number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "0.625rem", marginBottom: "0.375rem" }}
        >
          <span
            className="display"
            style={{
              fontSize: "clamp(8rem, 25vw, 20rem)",
              fontWeight: 700,
              lineHeight: 1,
              color: "var(--ink)",
              textShadow: "8px 8px 0 rgba(0,0,0,.07)",
            }}
          >
            {count}
          </span>
          <span
            className="display"
            style={{
              fontSize: "clamp(2rem, 6vw, 5rem)",
              fontWeight: 700,
              paddingBottom: "clamp(1.5rem, 3vw, 3.5rem)",
              color: "rgba(0,0,0,.4)",
              letterSpacing: "-.01em",
            }}
          >
            minutes
          </span>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ width: 56, height: 4, background: "rgba(0,0,0,.2)", margin: "0 auto 1.75rem", borderRadius: 2 }}
        />

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.3 }}
          style={{
            fontSize: "clamp(1rem, 2.2vw, 1.2rem)",
            color: "rgba(0,0,0,.6)",
            lineHeight: 1.75,
            maxWidth: 540,
            margin: "0 auto 3rem",
            fontWeight: 400,
          }}
        >
          That's how much time the average person loses to mindless phone scrolling{" "}
          <strong style={{ color: "var(--ink)", fontWeight: 700 }}>every single day.</strong>
        </motion.p>

        {/* 3-stat boxes */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.45 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.25rem",
            marginBottom: "3.5rem",
          }}
          className="stat-boxes"
        >
          {STATS.map((s, i) => (
            <div
              key={i}
              className="stat-box-inner"
              style={{
                background: "rgba(255,255,255,.7)",
                border: "3px solid rgba(0,0,0,.18)",
                borderRadius: "1.25rem",
                padding: "1.75rem 1.25rem",
                textAlign: "center",
                backdropFilter: "blur(4px)",
              }}
            >
              <div
                className="display"
                style={{
                  fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginBottom: "0.5rem",
                  letterSpacing: "-.01em",
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: ".88rem", color: "rgba(0,0,0,.55)", fontWeight: 500, lineHeight: 1.4 }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Hook */}
        <motion.p
          className="display"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            fontWeight: 700,
            color: "var(--ink)",
            letterSpacing: "-.01em",
          }}
        >
          Humanodoro gives those minutes back.
        </motion.p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stat-boxes { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .stat-boxes {
            grid-template-columns: 1fr !important;
            gap: .875rem !important;
          }
          /* Keep the stat boxes comfortable on small screens */
          .stat-box-inner { padding: 1.375rem 1rem !important; }
        }
      `}</style>
    </section>
  );
}
