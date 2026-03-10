import { Component, ReactNode, useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Float, Environment } from "@react-three/drei";

// ── Error boundary for Canvas ──────────────────────────────────────────────
class CanvasErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() {
    if (this.state.error) return this.props.fallback ?? null;
    return this.props.children;
  }
}

// ── 3D Pad model ───────────────────────────────────────────────────────────
function PadModel() {
  const { scene } = useGLTF("/pad.glb");
  const groupRef = useRef<any>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.55;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.5}>
      <primitive
        ref={groupRef}
        object={scene}
        scale={2.4}
        rotation={[0.25, 0.4, 0]}
      />
    </Float>
  );
}

try { useGLTF.preload("/pad.glb"); } catch (_) { /* noop */ }

// ── Live minutes-lost counter ──────────────────────────────────────────────
function useMinutesLost() {
  const [mins, setMins] = useState(0);
  useEffect(() => {
    const target = () => {
      const now = new Date();
      const wakingMins = Math.max(0, now.getHours() * 60 + now.getMinutes() - 420);
      return Math.min(Math.round((wakingMins / 960) * 81), 81);
    };
    let current = 0;
    const goal = target();
    const step = Math.ceil(goal / 60);
    const interval = setInterval(() => {
      current = Math.min(current + step, goal);
      setMins(current);
      if (current >= goal) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, []);
  return mins;
}

// ── Download handler ───────────────────────────────────────────────────────
function download() {
  const ua = navigator.userAgent.toLowerCase();
  window.open(
    /iphone|ipad|ipod|macintosh/.test(ua)
      ? "https://apps.apple.com/us/app/humanodoro/id6738285218"
      : "https://play.google.com/store/apps/details?id=com.humanodoro.pad.app",
    "_blank"
  );
}

// ── Phone mockup (light theme) ─────────────────────────────────────────────
const PhoneHero = () => (
  <div
    className="phone-frame"
    style={{ width: 230, height: 470, borderRadius: 40, background: "#fff" }}
  >
    {/* Notch */}
    <div style={{
      position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
      width: 70, height: 18, background: "var(--ink)", borderRadius: 999, zIndex: 10,
    }} />

    {/* Status bar */}
    <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 20px 4px", fontSize: 10, color: "var(--ink-30)" }}>
      <span>9:41</span><span style={{ fontWeight: 700 }}>■■■</span>
    </div>

    {/* App header */}
    <div style={{ padding: "4px 16px 6px" }}>
      <p style={{ fontFamily: "var(--ff-display)", fontSize: 17, fontWeight: 700, color: "var(--gold-dark)" }}>Morning Quest</p>
      <p style={{ fontSize: 10, color: "var(--pink)", fontWeight: 700, marginTop: 2 }}>DAY 14 🔥</p>
    </div>

    {/* Timer ring */}
    <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
      <div style={{ position: "relative", width: 100, height: 100 }}>
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
          <circle cx="50" cy="50" r="42" fill="none" stroke="#e8e8e8" strokeWidth="8" />
          <motion.circle
            cx="50" cy="50" r="42" fill="none"
            stroke="var(--gold)" strokeWidth="8"
            strokeDasharray="264" strokeLinecap="round"
            animate={{ strokeDashoffset: [264, 66] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <motion.span
            style={{ fontFamily: "var(--ff-display)", fontSize: 20, fontWeight: 700, color: "var(--ink)" }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >24:37</motion.span>
          <span style={{ fontSize: 8, color: "var(--ink-30)" }}>remaining</span>
        </div>
      </div>
    </div>

    {/* XP bar */}
    <div style={{ padding: "0 16px 8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 9 }}>
        <span style={{ color: "var(--ink-30)" }}>Level 12</span>
        <span style={{ color: "var(--gold-dark)", fontWeight: 700 }}>2,340 XP</span>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: "#e8e8e8", border: "1.5px solid var(--ink)", overflow: "hidden" }}>
        <motion.div
          style={{ height: "100%", borderRadius: 999, background: "linear-gradient(90deg, var(--gold), var(--coral))" }}
          initial={{ width: 0 }}
          animate={{ width: "68%" }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
      </div>
    </div>

    {/* Stats */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, padding: "0 14px 10px" }}>
      {[
        { v: "14d", l: "Streak", i: "🔥", bg: "var(--gold-light)" },
        { v: "3×",  l: "Today",  i: "⚡", bg: "var(--pink-light)" },
        { v: "#12", l: "Rank",   i: "🏆", bg: "var(--cyan-light)" },
      ].map(s => (
        <div key={s.l} style={{ background: s.bg, borderRadius: 10, padding: "5px 4px", textAlign: "center", border: "1.5px solid var(--ink)" }}>
          <div style={{ fontSize: 12 }}>{s.i}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink)" }}>{s.v}</div>
          <div style={{ fontSize: 7.5, color: "var(--ink-60)" }}>{s.l}</div>
        </div>
      ))}
    </div>

    {/* Pad connected */}
    <div style={{ margin: "0 14px" }}>
      <motion.div
        style={{ borderRadius: 10, padding: "5px 10px", display: "flex", alignItems: "center", gap: 6, background: "var(--cyan-light)", border: "1.5px solid var(--cyan)" }}
        animate={{ borderColor: ["var(--cyan)", "var(--cyan-dark)", "var(--cyan)"] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--cyan)", flexShrink: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span style={{ fontSize: 8.5, color: "var(--cyan-dark)", fontWeight: 700 }}>Pad connected · 2× XP active</span>
      </motion.div>
    </div>
  </div>
);

// ── Hero section ───────────────────────────────────────────────────────────
export default function Hero() {
  const mins = useMinutesLost();

  return (
    <section style={{
      minHeight: "100vh",
      background: "var(--white)",
      display: "flex",
      alignItems: "center",
      paddingTop: 80,
      paddingBottom: "3rem",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Subtle gold blob */}
      <div style={{
        position: "absolute", top: "30%", right: "2%",
        width: 500, height: 500, borderRadius: "50%",
        background: "var(--gold)", opacity: 0.1,
        filter: "blur(80px)", pointerEvents: "none",
      }} />

      <div style={{
        maxWidth: 1320,
        margin: "0 auto",
        padding: "0 2rem",
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "2rem",
        alignItems: "center",
        position: "relative",
        zIndex: 1,
      }} className="hero-grid">

        {/* LEFT — text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Live pill */}
          <AnimatePresence>
            <motion.span
              className="pill pill-pink"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ alignSelf: "flex-start", gap: "0.5rem" }}
            >
              <motion.span
                style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--pink)", flexShrink: 0 }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              LIVE · You've lost{" "}
              <strong style={{ fontFamily: "var(--ff-display)", fontSize: ".9rem" }}>&nbsp;{mins}&nbsp;</strong>{" "}
              minutes today
            </motion.span>
          </AnimatePresence>

          {/* Headline */}
          <h1
            className="display"
            style={{
              fontSize: "clamp(3.5rem, 7vw, 7rem)",
              fontWeight: 700,
              lineHeight: 1,
              color: "var(--ink)",
            }}
          >
            Stop losing<br />
            your life to<br />
            <span style={{ color: "var(--gold)", borderBottom: "6px solid var(--gold-dark)", display: "inline-block", lineHeight: 1.1 }}>
              scrolling.
            </span>
          </h1>

          {/* Sub */}
          <p style={{ fontSize: "1.1rem", color: "var(--ink-60)", lineHeight: 1.7, maxWidth: 440 }}>
            Humanodoro turns phone discipline into a game you can't stop winning. Free app + optional Smart Pad.
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <button className="btn btn-gold" onClick={download} style={{ fontSize: "1.1rem" }}>
              Download Free <ArrowRight size={18} />
            </button>
            <a href="#demo" className="btn btn-outline" style={{ fontSize: "1rem" }}>
              See how it works
            </a>
          </div>

          {/* Trust pills */}
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            {["Free app", "50K+ users", "4.8★ App Store"].map(t => (
              <span
                key={t}
                style={{
                  background: "var(--gray-50)",
                  border: "2px solid var(--ink)",
                  borderRadius: 999,
                  padding: ".3rem .9rem",
                  fontSize: ".9rem",
                  fontWeight: 700,
                  color: "var(--ink-60)",
                  fontFamily: "var(--ff-display)",
                }}
              >{t}</span>
            ))}
          </div>
        </motion.div>

        {/* RIGHT — phone + 3D pad */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem", position: "relative" }}
        >
          {/* Phone mockup */}
          <div className="float" style={{ flexShrink: 0 }}>
            <PhoneHero />
          </div>

          {/* 3D Pad canvas */}
          <div style={{ position: "relative" }}>
            {/* label */}
            <div style={{
              position: "absolute", top: -28, left: "50%", transform: "translateX(-50%)",
              whiteSpace: "nowrap", zIndex: 2,
            }}>
              <span className="pill pill-coral" style={{ fontSize: ".84rem" }}>SMART PAD</span>
            </div>

            <div style={{
              width: 200,
              height: 200,
              borderRadius: "1.5rem",
              border: "3px solid var(--ink)",
              overflow: "hidden",
              boxShadow: "6px 6px 0 var(--ink)",
              background: "var(--cream)",
            }}>
              <CanvasErrorBoundary
                fallback={
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src="/images/shop-pad-base.webp" alt="Smart Pad" style={{ width: "90%", objectFit: "contain" }} />
                  </div>
                }
              >
                <Canvas
                  camera={{ position: [0, 2, 6], fov: 38 }}
                  style={{ width: "100%", height: "100%" }}
                >
                  <ambientLight intensity={1.0} />
                  <directionalLight position={[4, 6, 4]} intensity={2.0} color="#FFD700" />
                  <directionalLight position={[-4, -2, -4]} intensity={0.6} color="#ffffff" />
                  <Environment preset="studio" />
                  <PadModel />
                </Canvas>
              </CanvasErrorBoundary>
            </div>

            {/* XP badge below pad */}
            <div style={{ marginTop: "0.75rem", textAlign: "center" }}>
              <span
                className="display"
                style={{
                  background: "var(--gold)",
                  border: "2.5px solid var(--ink)",
                  borderRadius: 999,
                  padding: "0.25rem 0.9rem",
                  fontSize: ".85rem",
                  fontWeight: 700,
                  boxShadow: "3px 3px 0 var(--ink)",
                }}
              >2× XP when placed</span>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
