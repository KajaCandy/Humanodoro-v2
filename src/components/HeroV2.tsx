import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

function useMinutesLost() {
  const [mins, setMins] = useState(0);
  useEffect(() => {
    const now = new Date();
    const w = Math.max(0, now.getHours() * 60 + now.getMinutes() - 420);
    const goal = Math.min(Math.round((w / 960) * 81), 81);
    if (!goal) return;
    let cur = 0;
    const iv = setInterval(() => {
      cur = Math.min(cur + Math.ceil(goal / 60), goal);
      setMins(cur);
      if (cur >= goal) clearInterval(iv);
    }, 20);
    return () => clearInterval(iv);
  }, []);
  return mins;
}

function download() {
  const ua = navigator.userAgent.toLowerCase();
  window.open(
    /iphone|ipad|ipod|macintosh/.test(ua)
      ? "https://apps.apple.com/us/app/humanodoro/id6738285218"
      : "https://play.google.com/store/apps/details?id=com.humanodoro.pad.app",
    "_blank"
  );
}

export default function HeroV2() {
  const mins = useMinutesLost();

  return (
    <section className="hero-section" style={{
      height: "100vh",
      minHeight: 700,
      position: "relative",
      overflow: "hidden",
      background: "var(--white)",
    }}>

      {/* Blue right panel — hidden on mobile */}
      <div className="hero-right-panel" style={{
        position: "absolute",
        top: 0, right: 0, bottom: 0,
        width: "52%",
        background: "var(--blue)",
        zIndex: 0,
      }} />

      {/* Image — right side, two-layer: entrance fade + continuous float loop */}
      <div className="hero-right" style={{
        position: "absolute",
        top: 0, right: 0,
        width: "56%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        zIndex: 1,
      }}>
        {/* Float loop — runs forever, no snap */}
        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(4rem, 8vh, 6rem) clamp(2rem, 4vw, 3rem)",
          }}
        >
          {/* Entrance — simple fade + slight rise */}
          <motion.img
            src="/images/hero-mockup.png"
            alt="Humanodoro app with Smart Pad"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            style={{
              height: "100%",
              width: "auto",
              display: "block",
              filter: "drop-shadow(0 32px 80px rgba(0,0,0,.28))",
            }}
          />
        </motion.div>
      </div>

      {/* Text — grows from the LEFT edge, right padding keeps it clear of the image */}
      <div className="hero-text" style={{
        position: "relative",
        zIndex: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: "clamp(7rem, 14vh, 10rem)",
        paddingLeft: "clamp(3rem, 7vw, 9rem)",
        paddingRight: "54vw",
      }}>

        {/* Pill */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: "1.75rem" }}
        >
          {mins > 0 ? (
            <span className="pill pill-pink" style={{ gap: ".5rem" }}>
              <motion.span
                style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--pink)", display: "inline-block", flexShrink: 0 }}
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              You've lost {mins} min today
            </span>
          ) : (
            <span className="pill pill-gold">Free · No subscription · Ships worldwide</span>
          )}
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="display"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.06 }}
          style={{
            fontSize: "clamp(4rem, 6.5vw, 9rem)",
            fontWeight: 700,
            lineHeight: 0.93,
            letterSpacing: "-0.01em",
            color: "var(--ink)",
            marginBottom: "1.75rem",
          }}
        >
          Win back<br />
          <span style={{ color: "var(--gold)" }}>your time.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          style={{
            fontSize: "1.1rem",
            color: "var(--ink-60)",
            lineHeight: 1.7,
            marginBottom: "2rem",
          }}
        >
          Free app + Smart Pad that turns phone discipline into a game you can't stop winning.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "2.25rem" }}
        >
          <button className="btn btn-gold btn-lg" onClick={download}>
            Download Free <ArrowRight size={18} />
          </button>
          <a href="#pad" className="btn btn-outline">
            Get the Pad · from 24.90 €
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.42 }}
          style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
        >
          <div>
            <div style={{ color: "var(--gold)", fontSize: "1rem", letterSpacing: 2, lineHeight: 1, marginBottom: 4 }}>★★★★★</div>
            <div style={{ fontSize: ".875rem", fontWeight: 700, color: "var(--ink-60)", fontFamily: "var(--ff-display)" }}>4.8 · App Store</div>
          </div>
          <div style={{ width: 1, height: 28, background: "rgba(0,0,0,.12)" }} />
          <div>
            <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--ink)", fontFamily: "var(--ff-display)", lineHeight: 1, marginBottom: 3 }}>50K+</div>
            <div style={{ fontSize: ".875rem", fontWeight: 700, color: "var(--ink-60)", fontFamily: "var(--ff-display)" }}>active users</div>
          </div>
          <div style={{ width: 1, height: 28, background: "rgba(0,0,0,.12)" }} />
          <div>
            <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--ink)", fontFamily: "var(--ff-display)", lineHeight: 1, marginBottom: 3 }}>Free</div>
            <div style={{ fontSize: ".875rem", fontWeight: 700, color: "var(--ink-60)", fontFamily: "var(--ff-display)" }}>always</div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          /* Section stays position:relative, height auto with bottom padding for the image strip */
          .hero-section {
            height: auto !important;
            min-height: 100svh !important;
            padding-bottom: clamp(280px, 50vw, 420px) !important;
          }
          /* Blue panel — absolute at the bottom, full width */
          .hero-right-panel {
            position: absolute !important;
            top: auto !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            height: clamp(280px, 50vw, 420px) !important;
          }
          /* Image — also absolute at bottom, same height, sits on top of the panel */
          .hero-right {
            position: absolute !important;
            top: auto !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            height: clamp(280px, 50vw, 420px) !important;
          }
          .hero-text {
            position: relative !important;
            height: auto !important;
            padding-right: clamp(1.5rem, 5vw, 3rem) !important;
            padding-left: clamp(1.5rem, 6vw, 4rem) !important;
            padding-top: 6rem !important;
            padding-bottom: 2.5rem !important;
            justify-content: flex-start !important;
          }
        }
        @media (max-width: 480px) {
          .hero-section {
            padding-bottom: clamp(240px, 60vw, 320px) !important;
          }
          .hero-text {
            padding-left: 1.25rem !important;
            padding-right: 1.25rem !important;
          }
          .hero-right,
          .hero-right-panel {
            height: clamp(240px, 60vw, 320px) !important;
          }
        }
      `}</style>
    </section>
  );
}
