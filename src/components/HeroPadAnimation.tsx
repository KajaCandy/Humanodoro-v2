import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_FRAMES   = 250;   // frames 0001–0250 (indices 0–249)
const FIRST_FRAME    = 1;
const IDLE_END       = 39;    // frames 0–39 loop while idle (files 0001–0040)
const IDLE_FPS       = 18;    // idle loop playback speed
const SCROLL_START   = 39;    // scroll control begins at frame index 39
const LERP_FACTOR    = 0.28;  // transition smoothness (higher = snappier)
const SECTION_HEIGHT = 1350;
const TOTAL_HEIGHT   = SECTION_HEIGHT * 3;

const SECTIONS = [
  {
    overline: null,
    heading: (<>Win back<br /><span style={{ color: "var(--gold)" }}>your time.</span></>),
    body: "Free app + Smart Pad that turns phone discipline into a game you can't stop winning.",
    cta: "hero" as const,
  },
  {
    overline: "What is it?",
    heading: (<>A physical pad<br />for your phone.</>),
    body: "Place your phone face-down on the pad. The app detects it and starts a focus session. Leave it, earn XP. Pick it up, lose your streak.",
    cta: "features" as const,
  },
  {
    overline: "The Humanodoro Pad",
    heading: (<>From 24.90 €,<br />one-time.</>),
    body: "Cork surface. Works with any phone. No subscription. Ships worldwide.",
    cta: "buy" as const,
  },
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function HeroPadAnimation() {
  const outerRef  = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(Array(TOTAL_FRAMES).fill(null));

  // Single persistent rAF loop
  const rafRef          = useRef<number | null>(null);

  // Displayed frame (fractional for lerp)
  const displayFrameRef = useRef(0);
  // Target frame — updated by idle loop or scroll
  const targetFrameRef  = useRef(0);

  // Idle loop timing
  const idleFrameRef    = useRef(0);       // fractional idle position
  const lastIdleTimeRef = useRef(0);
  const idleFrameMs     = 1000 / IDLE_FPS;
  const isIdleRef       = useRef(true);    // false while scroll-controlling

  // Scroll state
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const [loadedCount, setLoadedCount]   = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  // ── Draw a specific frame index to canvas ─────────────────────────────────
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const clamped = Math.max(0, Math.min(Math.round(index), TOTAL_FRAMES - 1));
    const img = imagesRef.current[clamped];
    if (!img?.complete || !img.naturalWidth) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    const cw = canvas.width, ch = canvas.height;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale, sh = ih * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
  }, []);

  // ── Persistent rAF loop — lerps displayFrame → targetFrame ────────────────
  const startRafLoop = useCallback(() => {
    if (rafRef.current) return;
    const tick = (timestamp: number) => {
      // Advance idle loop target
      if (isIdleRef.current) {
        if (!lastIdleTimeRef.current) lastIdleTimeRef.current = timestamp;
        const elapsed = timestamp - lastIdleTimeRef.current;
        if (elapsed >= idleFrameMs) {
          const steps = Math.floor(elapsed / idleFrameMs);
          const prev = idleFrameRef.current;
          idleFrameRef.current = (idleFrameRef.current + steps) % (IDLE_END + 1);
          // On loop wrap: snap display frame to 0 so lerp doesn't play backwards
          if (idleFrameRef.current < prev) {
            displayFrameRef.current = 0;
          }
          targetFrameRef.current = idleFrameRef.current;
          lastIdleTimeRef.current = timestamp - (elapsed % idleFrameMs);
        }
      }

      // Lerp display toward target
      const diff = targetFrameRef.current - displayFrameRef.current;
      if (Math.abs(diff) > 0.15) {
        displayFrameRef.current += diff * LERP_FACTOR;
        drawFrame(displayFrameRef.current);
      } else if (Math.round(displayFrameRef.current) !== Math.round(targetFrameRef.current)) {
        displayFrameRef.current = targetFrameRef.current;
        drawFrame(displayFrameRef.current);
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [drawFrame, idleFrameMs]);

  const stopRafLoop = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  }, []);

  // ── Preload frames ────────────────────────────────────────────────────────
  useEffect(() => {
    let loaded = 0;
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/animations/pad-landing/${String(i + FIRST_FRAME).padStart(4, "0")}.webp`;
      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
        if (i === 0) drawFrame(0);
      };
      imagesRef.current[i] = img;
    }
  }, [drawFrame]);

  // ── Resize canvas to actual rendered pixels ───────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const setSize = () => {
      const dpr  = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width  = Math.round(rect.width  * dpr);
      canvas.height = Math.round(rect.height * dpr);
      drawFrame(displayFrameRef.current);
    };
    setSize();
    window.addEventListener("resize", setSize);
    return () => window.removeEventListener("resize", setSize);
  }, [drawFrame]);

  // Start rAF loop once idle frames are loaded
  useEffect(() => {
    if (loadedCount >= IDLE_END + 1) startRafLoop();
    return stopRafLoop;
  }, [loadedCount >= IDLE_END + 1]); // eslint-disable-line

  // ── Scroll → update target frame ──────────────────────────────────────────
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    // Switch to scroll mode
    isIdleRef.current = false;
    setIsScrolling(true);

    // Map progress 0→1 to frames SCROLL_START→(TOTAL_FRAMES-1)
    targetFrameRef.current = Math.min(
      SCROLL_START + progress * (TOTAL_FRAMES - 1 - SCROLL_START),
      TOTAL_FRAMES - 1
    );

    // Debounce back to idle when scroll stops at top
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
      if (scrollYProgress.get() < 0.005) {
        isIdleRef.current = true;
        lastIdleTimeRef.current = 0;
      }
    }, 600);

    setActiveSection(progress < 0.22 ? 0 : progress < 0.58 ? 1 : 2);
  });

  const loadPercent = Math.round((loadedCount / TOTAL_FRAMES) * 100);
  const isReady     = loadedCount >= 1;

  return (
    <div ref={outerRef} style={{ height: TOTAL_HEIGHT, position: "relative" }}>

      {/* Sticky full-viewport panel */}
      <div style={{
        position: "sticky", top: 0, width: "100%", height: "100vh", overflow: "hidden",
        background: "#022D4C",
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,.1) 1.5px, transparent 1.5px)`,
        backgroundSize: "28px 28px",
      }}>

        {/* ── Canvas — 80% width, pinned right ──────────────────────── */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            right: "8%",
            width: "80%",
            height: "100%",
            display: "block",
            opacity: isReady ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        />

        {/* ── Text overlay ──────────────────────────────────────────── */}
        <div
          className="hero-anim-text"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "clamp(320px, 82vw, 1180px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft:   "clamp(7rem, 14vw, 14rem)",
            paddingRight:  "clamp(2rem, 4vw, 4rem)",
            paddingTop:    "clamp(2rem, 5vw, 5rem)",
            paddingBottom: "clamp(2rem, 5vw, 5rem)",
            zIndex: 2,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Progress dots */}
              <div style={{ display: "flex", gap: 6, marginBottom: "1.75rem" }}>
                {SECTIONS.map((_, i) => (
                  <div key={i} style={{ height: 8, borderRadius: 999, background: i === activeSection ? "#fff" : "rgba(255,255,255,.3)", transition: "width 0.35s ease", width: i === activeSection ? 24 : 8 }} />
                ))}
              </div>

              {SECTIONS[activeSection].overline && (
                <div className="section-overline" style={{ marginBottom: "1rem", color: "rgba(255,255,255,.7)" }}>
                  {SECTIONS[activeSection].overline}
                </div>
              )}

              <h2
                className="display"
                style={{ fontSize: "clamp(2.8rem, 6vw, 7.5rem)", fontWeight: 700, lineHeight: 0.93, letterSpacing: "-0.01em", color: "#fff", marginBottom: "1.5rem" }}
              >
                {SECTIONS[activeSection].heading}
              </h2>

              <p style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", color: "rgba(255,255,255,.8)", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 460 }}>
                {SECTIONS[activeSection].body}
              </p>

              {SECTIONS[activeSection].cta === "hero" && (
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <button className="btn btn-gold btn-lg" onClick={download}>Download Free <ArrowRight size={18} /></button>
                  <a href="#pad" className="btn btn-white">Get the Pad · from 24.90 €</a>
                </div>
              )}

              {SECTIONS[activeSection].cta === "features" && (
                <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
                  {["Detects your phone automatically", "Works with any smartphone", "Free app included"].map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--gold)", border: "2px solid var(--gold-dark)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ color: "var(--ink)", fontSize: ".65rem", fontWeight: 900 }}>✓</span>
                      </div>
                      <span style={{ fontSize: ".95rem", fontWeight: 600, color: "#fff" }}>{f}</span>
                    </div>
                  ))}
                </div>
              )}

              {SECTIONS[activeSection].cta === "buy" && (
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <a href="#pad" className="btn btn-gold btn-lg">Get the Pad <ArrowRight size={18} /></a>
                  <button className="btn btn-white" onClick={download}>Download Free App</button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Scroll hint */}
          <AnimatePresence>
            {activeSection === 0 && !isScrolling && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1.4 }}
                style={{ position: "absolute", bottom: "clamp(1.5rem, 4vh, 2.5rem)", left: "clamp(7rem, 14vw, 14rem)", display: "flex", alignItems: "center", gap: ".5rem", color: "rgba(255,255,255,.5)", fontSize: ".78rem", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase" }}
              >
                <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}>↓</motion.span>
                Scroll to explore
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Loading bar ───────────────────────────────────────────── */}
        {loadedCount < TOTAL_FRAMES && (
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(0,0,0,.06)", zIndex: 10 }}>
            <motion.div style={{ height: "100%", background: "var(--gold)", borderRadius: 999 }} animate={{ width: `${loadPercent}%` }} transition={{ duration: 0.15, ease: "linear" }} />
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 700px) {
          .hero-anim-text {
            width: 100% !important;
            justify-content: flex-end !important;
            padding: 1.5rem 1.5rem 5rem !important;
            background: linear-gradient(to top, rgba(2,45,76,1) 60%, rgba(2,45,76,0));
          }
        }
        @media (max-width: 480px) {
          .hero-anim-text { padding: 1.25rem 1.25rem 4.5rem !important; }
        }
        @media (max-width: 400px) {
          .hero-anim-text { padding: 1rem 1rem 4rem !important; }
        }
      `}</style>
    </div>
  );
}
