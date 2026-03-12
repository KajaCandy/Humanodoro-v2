import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView, useAnimation } from "framer-motion";
import Lottie from "lottie-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type GameState = "idle" | "running" | "complete" | "reward";

// ─── Constants ────────────────────────────────────────────────────────────────

const DURATION = 30000; // 30 real seconds

const LEADERBOARD = [
  { rank: 1, name: "ShadowFocus",  xp: "48,210", badge: "🏆" },
  { rank: 2, name: "ZenRunner",    xp: "41,880", badge: "🥈" },
  { rank: 3, name: "QuestMaster",  xp: "39,550", badge: "🥉" },
  { rank: 4, name: "FocusKing",    xp: "35,100", badge: "⚡" },
  { rank: 5, name: "TimeLord",     xp: "30,720", badge: "🔥" },
];

const QUESTS = [
  { name: "Morning Ritual",    duration: "25 min", xp: "+150 XP", color: "var(--gold-dark)",  bg: "var(--gold-light)",   icon: "🌅" },
  { name: "Deep Work",         duration: "50 min", xp: "+300 XP", color: "var(--violet)",     bg: "var(--violet-light)", icon: "⚡" },
  { name: "Evening Wind-down", duration: "15 min", xp: "+80 XP",  color: "var(--cyan-dark)",  bg: "var(--cyan-light)",   icon: "🌙" },
];

// ─── Character (loads JSON lazily) ────────────────────────────────────────────

// Chest Lottie for reward popup — loaded once, plays once, stays open
function ChestLottie({ style }: { style?: React.CSSProperties }) {
  const [data, setData] = useState<object | null>(null);
  useEffect(() => {
    fetch("/animations/chest-open.json").then(r => r.json()).then(setData);
  }, []);
  if (!data) return null;
  return <Lottie animationData={data} loop={false} autoplay style={style} />;
}

function CharacterLottie({
  gameState,
  resetKey,
  controls,
}: {
  gameState: GameState;
  resetKey: number;
  controls: ReturnType<typeof useAnimation>;
}) {
  const [idleData, setIdleData] = useState<object | null>(null);
  const [walkData, setWalkData] = useState<object | null>(null);

  useEffect(() => {
    fetch("/animations/character-idle.json").then(r => r.json()).then(setIdleData);
    fetch("/animations/character-walk.json").then(r => r.json()).then(setWalkData);
  }, []);

  const isWalking = gameState === "running";

  return (
    <motion.div
      key={`char-${resetKey}`}
      style={{ position: "absolute", bottom: 0, left: "5vw", width: "auto", height: "88%", zIndex: 2 }}
      animate={controls}
      initial={{ x: 0 }}
    >
      {isWalking && walkData
        ? <Lottie animationData={walkData} loop autoplay style={{ width: "auto", height: "100%", display: "block" }} />
        : idleData
        ? <Lottie animationData={idleData} loop autoplay style={{ width: "auto", height: "100%", display: "block", transform: "scale(1.185) translateY(-7%)", transformOrigin: "top center" }} />
        : null
      }
    </motion.div>
  );
}

// ─── Zone 1: Game Scene ───────────────────────────────────────────────────────

function GameScene() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [elapsed, setElapsed]     = useState(0);
  const [resetKey, setResetKey]   = useState(0);
  const [email, setEmail]         = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const sceneRef         = useRef<HTMLDivElement>(null);
  const rafRef           = useRef<number | null>(null);
  const effectiveStartRef = useRef<number | null>(null);
  const pausedAtRef      = useRef<number | null>(null);

  const bgControls   = useAnimation();
  const charControls = useAnimation();

  // ── IntersectionObserver — pause/resume at 60% visibility ────────────────
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.intersectionRatio >= 0.6);
      },
      { threshold: 0.6 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── Timer via requestAnimationFrame — only runs when visible ─────────────
  useEffect(() => {
    if (gameState !== "running") {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    if (!isVisible) {
      // Pause: record when we paused
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (pausedAtRef.current === null) {
        pausedAtRef.current = Date.now();
      }
      bgControls.stop();
      charControls.stop();
      return;
    }

    // Resume: if we were paused, shift effectiveStart forward by paused duration
    if (pausedAtRef.current !== null) {
      const pausedDuration = Date.now() - pausedAtRef.current;
      if (effectiveStartRef.current !== null) {
        effectiveStartRef.current += pausedDuration;
      }
      pausedAtRef.current = null;

      // Restart animations for remaining duration
      const currentElapsed = effectiveStartRef.current !== null
        ? Math.min(Date.now() - effectiveStartRef.current, DURATION)
        : 0;
      const remainingSec = (DURATION - currentElapsed) / 1000;

      bgControls.start({ x: -900, transition: { duration: remainingSec, ease: "linear" } });
      charControls.start({ x: "calc(78vw - 100px)", transition: { duration: remainingSec, ease: "linear" } });
    }

    const tick = () => {
      if (effectiveStartRef.current === null) {
        effectiveStartRef.current = Date.now();
      }
      const e = Math.min(Date.now() - effectiveStartRef.current, DURATION);
      setElapsed(e);
      if (e < DURATION) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setGameState("complete");
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [gameState, isVisible, bgControls, charControls]);

  // ── Freeze animations when complete ──────────────────────────────────────
  useEffect(() => {
    if (gameState === "complete") {
      bgControls.stop();
      charControls.stop();
    }
  }, [gameState, bgControls, charControls]);

  // ── Auto-transition: complete → reward ───────────────────────────────────
  useEffect(() => {
    if (gameState !== "complete") return;
    const id = setTimeout(() => setGameState("reward"), 1800);
    return () => clearTimeout(id);
  }, [gameState]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleStart = () => {
    setElapsed(0);
    effectiveStartRef.current = null;
    pausedAtRef.current = null;
    setGameState("running");
    bgControls.start({ x: -900, transition: { duration: 30, ease: "linear" } });
    charControls.start({ x: "calc(78vw - 100px)", transition: { duration: 30, ease: "linear" } });
  };

  const handleReset = () => {
    setElapsed(0);
    setSubmitted(false);
    setEmail("");
    effectiveStartRef.current = null;
    pausedAtRef.current = null;
    bgControls.set({ x: 0 });
    charControls.set({ x: 0 });
    setResetKey((k) => k + 1);
    setGameState("idle");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // ── Derived display values ────────────────────────────────────────────────
  const remaining   = Math.ceil((DURATION - elapsed) / 1000);
  const displayTime = `0:${String(remaining).padStart(2, "0")}`;
  const progressPct = (elapsed / DURATION) * 100;

  return (
    <div
      ref={sceneRef}
      className="game-scene"
      style={{
        position: "relative",
        height: "min(88vh, 800px)",
        overflow: "hidden",
        background: "#A4DCFF",
      }}
    >
      {/* ── Tiling background — 5 SVG copies side by side ───────────────── */}
      <motion.div
        style={{ position: "absolute", bottom: 0, left: 0, height: "130%", display: "flex", alignItems: "flex-end", flexShrink: 0 }}
        animate={bgControls}
        initial={{ x: 0 }}
      >
        {[0, 1, 2, 3, 4].map(i => (
          <img
            key={i}
            src="/animations/background-scene.svg"
            alt=""
            style={{ height: "100%", width: "auto", maxWidth: "none", display: "block", flexShrink: 0, marginLeft: i > 0 ? -1 : 0 }}
          />
        ))}
      </motion.div>

      {/* ── Gradient overlays ─────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: "linear-gradient(to bottom, rgba(0,0,0,.18) 0%, transparent 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "35%",
          background: "linear-gradient(to top, rgba(0,0,0,.22) 0%, transparent 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* ── Dark overlay — idle / complete / reward; fades out on run ────── */}
      <AnimatePresence>
        {gameState !== "running" && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: gameState === "idle" ? 0.52 : 0.72 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: "absolute", inset: 0,
              background: "#000",
              zIndex: 3,
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Character ─────────────────────────────────────────────────────── */}
      <CharacterLottie gameState={gameState} resetKey={resetKey} controls={charControls} />

      {/* ── HUD layer ─────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 4,
          pointerEvents: "none",
        }}
      >
        <AnimatePresence mode="wait">

          {/* STATE: idle ─────────────────────────────────────────────────── */}
          {gameState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1.25rem",
                padding: "2rem",
                pointerEvents: "auto",
                textAlign: "center",
              }}
            >
              <h2
                className="display"
                style={{
                  fontFamily: "var(--ff-display)",
                  fontSize: "clamp(1.6rem, 4vw, 2.5rem)",
                  color: "#fff",
                  textShadow: "0 2px 12px rgba(0,0,0,.55)",
                  margin: 0,
                  lineHeight: 1.15,
                  maxWidth: 520,
                }}
              >
                Think you can focus for 30 seconds?
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,.75)",
                  fontSize: "1rem",
                  margin: 0,
                  maxWidth: 380,
                  lineHeight: 1.6,
                  textShadow: "0 1px 6px rgba(0,0,0,.4)",
                }}
              >
                Most people check their phone before the timer ends.
              </p>
              <button
                className="btn btn-gold btn-lg"
                onClick={handleStart}
                style={{ fontFamily: "var(--ff-display)", fontWeight: 700 }}
              >
                Accept the Challenge →
              </button>
            </motion.div>
          )}

          {/* STATE: running ──────────────────────────────────────────────── */}
          {gameState === "running" && (
            <motion.div
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ position: "absolute", inset: 0 }}
            >
              {/* Top-left HUD card */}
              <div
                className="hud-timer-card"
                style={{
                  position: "absolute",
                  top: "1.5rem",
                  left: "1.5rem",
                  background: "rgba(255,255,255,.92)",
                  border: "2.5px solid var(--ink)",
                  borderRadius: "1rem",
                  padding: "1rem 1.25rem",
                  boxShadow: "4px 4px 0 rgba(0,0,0,.2)",
                  minWidth: 140,
                }}
              >
                <div
                  style={{
                    fontSize: ".84rem",
                    fontWeight: 700,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    color: "var(--ink-60)",
                    marginBottom: ".5rem",
                  }}
                >
                  🎯 Focus Challenge
                </div>
                <div
                  className="hud-timer-value"
                  style={{
                    fontFamily: "var(--ff-display)",
                    fontSize: "3rem",
                    color: "var(--ink)",
                    lineHeight: 1,
                    letterSpacing: "-.02em",
                    marginBottom: ".625rem",
                  }}
                >
                  {displayTime}
                </div>
                <div
                  style={{
                    height: 8,
                    borderRadius: 999,
                    background: "#eee",
                    border: "2px solid var(--ink)",
                    overflow: "hidden",
                    marginBottom: ".5rem",
                  }}
                >
                  <motion.div
                    style={{
                      height: "100%",
                      borderRadius: 999,
                      background: "var(--gold)",
                    }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.1, ease: "linear" }}
                  />
                </div>
                <div
                  style={{
                    fontSize: ".875rem",
                    color: "var(--ink-60)",
                    fontStyle: "italic",
                  }}
                >
                  Stay focused...
                </div>
              </div>

              {/* Top-right streak chip */}
              <div
                className="hud-streak-chip"
                style={{
                  position: "absolute",
                  top: "1.5rem",
                  right: "1.5rem",
                  background: "rgba(0,0,0,.55)",
                  border: "1.5px solid rgba(255,255,255,.3)",
                  borderRadius: 999,
                  padding: ".5rem 1rem",
                  color: "#fff",
                  fontSize: ".9rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                🔥 Streak saves: 1,247 today
              </div>
            </motion.div>
          )}

          {/* STATE: complete ─────────────────────────────────────────────── */}
          {gameState === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.45, type: "spring", bounce: 0.35 }}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                pointerEvents: "none",
              }}
            >
              <img
                src="/animations/chest-max-sparkle.gif"
                alt="Treasure chest"
                style={{ width: 260, height: 260, objectFit: "contain" }}
              />
              <div
                className="display"
                style={{
                  fontFamily: "var(--ff-display)",
                  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                  color: "#fff",
                  textShadow: "0 2px 16px rgba(0,0,0,.7)",
                  letterSpacing: "-.01em",
                }}
              >
                Quest Complete!
              </div>
            </motion.div>
          )}

          {/* STATE: reward ───────────────────────────────────────────────── */}
          {gameState === "reward" && (
            <motion.div
              key="reward"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1.5rem",
                pointerEvents: "auto",
              }}
            >
              <motion.div
                initial={{ y: 36, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4, type: "spring", bounce: 0.25 }}
                style={{
                  background: "rgba(255,255,255,.97)",
                  border: "3px solid var(--ink)",
                  borderRadius: "1.5rem",
                  padding: "1.75rem 2.25rem 2.25rem",
                  boxShadow: "8px 8px 0 var(--ink)",
                  maxWidth: 420,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.875rem",
                  textAlign: "center",
                }}
              >
                <ChestLottie style={{ width: 130, height: 130 }} />

                <h3
                  style={{
                    fontFamily: "var(--ff-display)",
                    fontSize: "2rem",
                    color: "var(--ink)",
                    margin: 0,
                    lineHeight: 1.1,
                  }}
                >
                  You earned it.
                </h3>

                <p
                  style={{
                    fontSize: ".95rem",
                    color: "var(--ink-60)",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  Enter your email and we'll send you a discount code for the Smart Pad.
                </p>

                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleSubmit}
                      style={{ width: "100%", display: "flex", flexDirection: "column", gap: ".75rem" }}
                    >
                      <input
                        type="email"
                        required
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          border: "2.5px solid var(--ink)",
                          borderRadius: 999,
                          height: 48,
                          padding: "0 1.25rem",
                          fontSize: "1rem",
                          width: "100%",
                          outline: "none",
                          fontFamily: "var(--ff-body)",
                          boxSizing: "border-box",
                        }}
                      />
                      <button
                        type="submit"
                        className="btn btn-gold"
                        style={{
                          width: "100%",
                          justifyContent: "center",
                          fontFamily: "var(--ff-display)",
                          fontWeight: 700,
                          fontSize: "1rem",
                          height: 48,
                        }}
                      >
                        Claim My Coupon →
                      </button>
                      <p
                        style={{
                          fontSize: ".875rem",
                          color: "var(--ink-30)",
                          margin: 0,
                        }}
                      >
                        No spam. One email. Unsubscribe anytime.
                      </p>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
                      style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--ff-display)",
                          fontSize: "1.5rem",
                          color: "var(--ink)",
                          fontWeight: 700,
                        }}
                      >
                        🎉 Check your inbox!
                      </div>
                      <p
                        style={{
                          fontSize: ".9rem",
                          color: "var(--ink-60)",
                          margin: 0,
                          lineHeight: 1.6,
                        }}
                      >
                        Coupon on its way. In the meantime, explore the app for free.
                      </p>
                      <button
                        className="btn btn-outline"
                        onClick={handleReset}
                        style={{ fontFamily: "var(--ff-display)", fontWeight: 700 }}
                      >
                        Download Free
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Zone 2: Feature Cards ────────────────────────────────────────────────────

function FeatureZone() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  const QUESTS = [
    { name: "Morning Ritual",    dur: "25 min", xp: "+150 XP", done: true  },
    { name: "Deep Work",         dur: "50 min", xp: "+300 XP", done: true  },
    { name: "Evening Wind-down", dur: "15 min", xp: "+80 XP",  done: false },
  ];

  const RANKS = [
    { rank: "#1",  name: "FocusMaster", xp: "48,210", you: false },
    { rank: "#2",  name: "ZenRunner",   xp: "41,880", you: false },
    { rank: "#31", name: "You",          xp: "12,330", you: true  },
  ];

  return (
    <div ref={ref} className="feature-zone" style={{ background: "var(--cream)", padding: "clamp(6rem, 12vw, 10rem) clamp(1.5rem, 4vw, 3rem) clamp(8rem, 16vw, 14rem)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <h2 className="display" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)", fontWeight: 700, color: "var(--ink)", letterSpacing: "-.02em", lineHeight: 1.05, margin: 0 }}>
            Your progress, gamified.
          </h2>
          <p style={{ color: "var(--ink-60)", fontSize: "1rem", marginTop: ".875rem", lineHeight: 1.6 }}>
            XP, streaks, quests, leaderboards. All in the free app.
          </p>
        </motion.div>

        {/* 2×2 grid */}
        <div className="feature-bento" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>

          {/* ── Card 1: XP & Levels ── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.08 }}
            style={{ background: "var(--gold)", border: "3px solid var(--ink)", borderRadius: "1.375rem", boxShadow: "6px 6px 0 var(--ink)", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div className="display" style={{ fontSize: ".84rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-60)", marginBottom: ".2rem" }}>Level</div>
                <div className="display" style={{ fontSize: "5rem", fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>12</div>
              </div>
              <div style={{ background: "var(--ink)", color: "var(--gold)", borderRadius: 999, padding: ".4rem 1rem", fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: ".85rem", whiteSpace: "nowrap" }}>
                +150 XP
              </div>
            </div>
            <div>
              <div style={{ height: 16, borderRadius: 999, background: "rgba(0,0,0,.15)", border: "2.5px solid var(--ink)", overflow: "hidden" }}>
                <motion.div
                  style={{ height: "100%", background: "var(--ink)", borderRadius: 999 }}
                  initial={{ width: 0 }}
                  animate={inView ? { width: "72%" } : { width: 0 }}
                  transition={{ duration: 1.3, delay: 0.5, ease: "easeOut" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: ".4rem" }}>
                <span className="display" style={{ fontSize: ".84rem", fontWeight: 600, color: "var(--ink-60)" }}>4,250 XP</span>
                <span className="display" style={{ fontSize: ".84rem", fontWeight: 600, color: "var(--ink-60)" }}>6,000 XP</span>
              </div>
            </div>
            <div style={{ borderTop: "2.5px solid rgba(0,0,0,.14)", paddingTop: "1rem" }}>
              <div className="display" style={{ fontWeight: 700, fontSize: "1.2rem", color: "var(--ink)" }}>Earn XP. Level up.</div>
              <div style={{ fontSize: ".875rem", color: "var(--ink-60)", marginTop: ".2rem", lineHeight: 1.5 }}>Every focused minute earns points. The more you do, the higher you climb.</div>
            </div>
          </motion.div>

          {/* ── Card 2: Daily Quests ── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.16 }}
            style={{ background: "#fff", border: "3px solid var(--ink)", borderRadius: "1.375rem", boxShadow: "6px 6px 0 var(--ink)", padding: "2rem", display: "flex", flexDirection: "column" }}
          >
            <div className="display" style={{ fontWeight: 700, fontSize: "1.2rem", color: "var(--ink)", marginBottom: ".2rem" }}>A new quest every day.</div>
            <div style={{ fontSize: ".875rem", color: "var(--ink-60)", marginBottom: "1.5rem", lineHeight: 1.5 }}>Pick one, complete it, earn XP and keep your streak alive.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0, flex: 1, justifyContent: "center" }}>
              {QUESTS.map((q, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: ".9rem 0", borderBottom: i < QUESTS.length - 1 ? "2px solid rgba(0,0,0,.07)" : "none" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", border: "2.5px solid var(--ink)", background: q.done ? "var(--ink)" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {q.done && <span style={{ color: "var(--gold)", fontSize: ".75rem", fontWeight: 900 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: ".9rem", color: "var(--ink)", textDecoration: q.done ? "line-through" : "none", opacity: q.done ? 0.45 : 1 }}>{q.name}</div>
                    <div style={{ fontSize: ".875rem", color: "var(--ink-30)", fontWeight: 500 }}>{q.dur}</div>
                  </div>
                  <div className="display" style={{ fontWeight: 700, fontSize: ".9rem", color: q.done ? "var(--ink-30)" : "var(--gold-dark)" }}>{q.xp}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Card 3: Leaderboard ── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.24 }}
            style={{ background: "var(--cyan)", border: "3px solid var(--ink)", borderRadius: "1.375rem", boxShadow: "6px 6px 0 var(--ink)", padding: "2rem", display: "flex", flexDirection: "column" }}
          >
            <div className="display" style={{ fontWeight: 700, fontSize: "1.2rem", color: "var(--ink)", marginBottom: ".2rem" }}>See where you rank.</div>
            <div style={{ fontSize: ".875rem", color: "var(--ink-60)", marginBottom: "1.5rem", lineHeight: 1.5 }}>A global leaderboard updated every session.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0, flex: 1, justifyContent: "center" }}>
              {RANKS.map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    padding: ".875rem 0",
                    borderBottom: i < RANKS.length - 1 ? "2px solid rgba(0,0,0,.1)" : "none",
                  }}
                >
                  <span className="display" style={{ fontSize: "1rem", fontWeight: 700, color: row.you ? "var(--ink)" : "rgba(0,0,0,.35)", minWidth: 28 }}>{row.rank}</span>
                  <span style={{ flex: 1, fontWeight: row.you ? 700 : 500, fontSize: ".9rem", color: row.you ? "var(--ink)" : "rgba(0,0,0,.55)" }}>{row.name}</span>
                  {row.you && (
                    <span style={{ background: "var(--ink)", color: "var(--cyan)", borderRadius: 999, padding: ".2rem .625rem", fontFamily: "var(--ff-display)", fontSize: ".8rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", marginRight: ".5rem" }}>you</span>
                  )}
                  <span className="display" style={{ fontWeight: 700, fontSize: ".85rem", color: row.you ? "var(--ink)" : "rgba(0,0,0,.4)" }}>{row.xp}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Card 4: Streaks ── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.32 }}
            style={{ background: "var(--coral)", border: "3px solid var(--ink)", borderRadius: "1.375rem", boxShadow: "6px 6px 0 var(--ink)", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <div style={{ display: "flex", alignItems: "flex-end", gap: "1.25rem" }}>
              <div>
                <div className="display" style={{ fontSize: "5.5rem", fontWeight: 700, color: "#fff", lineHeight: 1, textShadow: "3px 3px 0 rgba(0,0,0,.18)" }}>67</div>
                <div className="display" style={{ fontSize: ".84rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(255,255,255,.65)", marginTop: ".3rem" }}>day streak</div>
              </div>
              <div className="streak-day-circles" style={{ display: "flex", gap: ".35rem", paddingBottom: ".6rem" }}>
                {["M","T","W","T","F","S","S"].map((d, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".25rem" }}>
                    <div className="streak-day-circle" style={{ width: 24, height: 24, borderRadius: "50%", border: "2.5px solid var(--ink)", background: i < 5 ? "var(--ink)" : "rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {i < 5 && <span style={{ color: "var(--coral)", fontSize: ".55rem", fontWeight: 900 }}>✓</span>}
                    </div>
                    <span className="display" style={{ fontSize: ".75rem", color: "rgba(255,255,255,.5)", fontWeight: 600 }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderTop: "2.5px solid rgba(0,0,0,.14)", paddingTop: "1rem" }}>
              <div className="display" style={{ fontWeight: 700, fontSize: "1.2rem", color: "#fff" }}>Miss one day. Lose it all.</div>
              <div style={{ fontSize: ".875rem", color: "rgba(255,255,255,.7)", marginTop: ".2rem", lineHeight: 1.5 }}>Streaks make habits permanent. The chain is the point.</div>
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @media (max-width: 520px) {
          .feature-bento { grid-template-columns: 1fr !important; }
          /* Guarantee symmetric horizontal padding at small sizes */
          .feature-zone {
            padding-left: clamp(1.25rem, 5vw, 2rem) !important;
            padding-right: clamp(1.25rem, 5vw, 2rem) !important;
          }
        }
        @media (max-width: 480px) {
          .feature-zone {
            padding-left: 1.25rem !important;
            padding-right: 1.25rem !important;
          }
        }
        @media (max-width: 768px) {
          .game-scene { height: min(70vh, 560px) !important; }
          .hud-timer-card {
            padding: .75rem 1rem !important;
            min-width: 140px !important;
          }
          .hud-timer-value {
            font-size: 2.25rem !important;
          }
          .hud-streak-chip {
            font-size: .78rem !important;
            padding: .4rem .75rem !important;
          }
        }
        @media (max-width: 480px) {
          .game-scene { height: min(60vh, 440px) !important; }
          .hud-timer-card {
            top: 1rem !important;
            left: 1rem !important;
          }
          .hud-streak-chip {
            top: 1rem !important;
            right: 1rem !important;
            font-size: .72rem !important;
          }
          .streak-day-circles { gap: .2rem !important; }
          .streak-day-circle  { width: 20px !important; height: 20px !important; }
        }
        @media (max-width: 400px) {
          .hud-timer-card {
            padding: .5rem .75rem !important;
          }
          .hud-timer-value {
            font-size: 1.75rem !important;
          }
        }
        @keyframes floatSlow { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .float-slow { animation: floatSlow 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function Gamification() {
  return (
    // overflow: visible so the neo-brutalist card box-shadows are not clipped
    // on either side. The GameScene handles its own overflow internally.
    <section style={{ overflow: "visible", paddingTop: "clamp(4rem, 8vw, 7rem)" }}>
      <GameScene />
      <FeatureZone />
    </section>
  );
}
