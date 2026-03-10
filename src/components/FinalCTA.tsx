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

export default function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      ref={ref}
      className="cta-section"
      style={{
        background: "var(--violet)",
        padding: "var(--section-pad) 2rem clamp(10rem, 20vw, 18rem)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow blobs */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "-20%", left: "-10%",
        width: "55%", paddingBottom: "55%", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div aria-hidden="true" style={{
        position: "absolute", bottom: "-15%", right: "-8%",
        width: "45%", paddingBottom: "45%", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,215,0,.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Angel — left side */}
      <motion.div
        className="cta-character cta-character--angel"
        initial={{ y: 60, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.35, type: "spring", bounce: 0.3 }}
        style={{
          position: "absolute",
          top: "30%",
          transform: "translateY(-50%)",
          left: "clamp(1rem, 7vw, 9rem)",
          zIndex: 2,
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.85, type: "spring", bounce: 0.5 }}
          style={{
            background: "var(--gold)",
            border: "3px solid var(--ink)",
            borderRadius: "1.25rem",
            padding: ".6rem 1.1rem",
            boxShadow: "4px 4px 0 var(--ink)",
            position: "relative",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: "1rem", color: "var(--ink)" }}>
            You've got this!
          </span>
          <div style={{
            position: "absolute", bottom: -11, left: "50%", transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "9px solid transparent", borderRight: "9px solid transparent",
            borderTop: "11px solid var(--ink)",
          }} />
          <div style={{
            position: "absolute", bottom: -7, left: "50%", transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "7px solid transparent", borderRight: "7px solid transparent",
            borderTop: "9px solid var(--gold)",
          }} />
        </motion.div>
        <img src="/images/character-idle-static.svg" alt="" style={{ height: "clamp(220px, 26vw, 360px)", width: "auto", display: "block" }} />
      </motion.div>

      {/* Reaper — right side */}
      <motion.div
        className="cta-character cta-character--reaper"
        initial={{ y: 60, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.5, type: "spring", bounce: 0.3 }}
        style={{
          position: "absolute",
          top: "30%",
          transform: "translateY(-50%)",
          right: "clamp(1rem, 7vw, 9rem)",
          zIndex: 2,
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 1.0, type: "spring", bounce: 0.5 }}
          style={{
            background: "#fff",
            border: "3px solid var(--ink)",
            borderRadius: "1.25rem",
            padding: ".6rem 1.1rem",
            boxShadow: "4px 4px 0 var(--ink)",
            position: "relative",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: "1rem", color: "var(--ink)" }}>
            Miss one day...
          </span>
          <div style={{
            position: "absolute", bottom: -11, left: "50%", transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "9px solid transparent", borderRight: "9px solid transparent",
            borderTop: "11px solid var(--ink)",
          }} />
          <div style={{
            position: "absolute", bottom: -7, left: "50%", transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "7px solid transparent", borderRight: "7px solid transparent",
            borderTop: "9px solid #fff",
          }} />
        </motion.div>
        <img
          src="/images/reaper.svg"
          alt=""
          style={{ height: "clamp(220px, 26vw, 360px)", width: "auto", display: "block" }}
        />
      </motion.div>

      <style>{`
        @media (max-width: 900px) {
          .cta-character { display: none !important; }
          .cta-section { padding-bottom: var(--section-pad) !important; }
        }
        @media (max-width: 600px) {
          .cta-buttons {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .cta-buttons .btn { justify-content: center !important; }
        }
        @media (max-width: 480px) {
          .cta-section {
            padding-left: 1.25rem !important;
            padding-right: 1.25rem !important;
          }
        }
      `}</style>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto" }}>

        {/* Headline */}
        <motion.h2
          className="display"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            fontSize: "clamp(3rem, 8vw, 6.5rem)",
            fontWeight: 700,
            color: "#fff",
            lineHeight: .98,
            marginBottom: "1.375rem",
            letterSpacing: "-.03em",
          }}
        >
          Your future self<br />is waiting.
        </motion.h2>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.28 }}
          style={{
            fontSize: "1.15rem",
            color: "rgba(255,255,255,.7)",
            lineHeight: 1.7,
            marginBottom: "2.75rem",
          }}
        >
          Join 50,000+ people who chose focus over feed.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="cta-buttons"
          style={{ display: "flex", gap: "1.125rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2rem" }}
        >
          <button
            className="btn btn-gold btn-lg"
            onClick={download}
          >
            Download Free <ArrowRight size={19} />
          </button>
          <button
            className="btn btn-white btn-lg"
            onClick={() => window.open("https://humanodoro.com/shop", "_blank")}
          >
            Get the Pad · from 24.90 €
          </button>
        </motion.div>

        {/* Trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.55 }}
          style={{
            fontSize: ".84rem",
            color: "rgba(255,255,255,.4)",
            letterSpacing: ".06em",
            textTransform: "uppercase",
            fontFamily: "var(--ff-display)",
          }}
        >
          Free app · Ships worldwide
        </motion.p>
      </div>
    </section>
  );
}
