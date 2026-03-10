import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { label: "How It Works", href: "#demo" },
  { label: "The Pad", href: "#pad" },
  { label: "Reviews", href: "#reviews" },
  { label: "Pricing", href: "#pricing" },
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

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => {
      const y = window.scrollY;
      setVisible(y < 80 || y < lastY);
      setScrolled(y > 40);
      setLastY(y);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [lastY]);

  return (
    <motion.header
      animate={{ y: visible || open ? 0 : -100, opacity: visible || open ? 1 : 0 }}
      transition={{ duration: 0.25 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "rgba(255,255,255,.97)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "2px solid rgba(0,0,0,.08)",
      }}
    >
      <div className="nav-inner" style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "0 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 68,
      }}>
        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <img src="/images/logo.png" alt="Humanodoro" style={{ width: 34, height: 34, objectFit: "contain" }} />
          <span style={{
            fontFamily: "var(--ff-display)",
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "var(--ink)",
            letterSpacing: "-.01em",
          }}>
            Humanodoro
          </span>
        </a>

        {/* Desktop nav */}
        <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }} className="nav-desktop">
          {links.map(l => (
            <a
              key={l.label}
              href={l.href}
              style={{
                fontFamily: "var(--ff-body)",
                fontWeight: 600,
                fontSize: ".9rem",
                color: "rgba(10,10,10,.55)",
                textDecoration: "none",
                transition: "color .18s",
                letterSpacing: ".01em",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--ink)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(10,10,10,.55)")}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            className="btn btn-gold btn-sm nav-download-btn"
            onClick={download}
          >
            Download Free
          </button>
          <button
            onClick={() => setOpen(o => !o)}
            style={{
              background: "none",
              border: "none",
              color: "var(--ink)",
              cursor: "pointer",
              display: "none",
              padding: "0.5rem",
              lineHeight: 1,
              minWidth: 44,
              minHeight: 44,
              alignItems: "center",
              justifyContent: "center",
              touchAction: "manipulation",
            }}
            className="nav-hamburger"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="nav-mobile-menu"
            style={{
              background: "#fff",
              borderTop: "2px solid rgba(0,0,0,.07)",
              padding: "1.25rem 2rem 1.75rem",
              boxShadow: "0 16px 40px rgba(0,0,0,.08)",
            }}
          >
            {links.map(l => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  padding: ".875rem 0",
                  color: "var(--ink)",
                  fontWeight: 600,
                  fontSize: "1.05rem",
                  textDecoration: "none",
                  borderBottom: "1.5px solid rgba(0,0,0,.05)",
                  fontFamily: "var(--ff-display)",
                  letterSpacing: ".01em",
                  minHeight: 44,
                  touchAction: "manipulation",
                }}
              >
                {l.label}
              </a>
            ))}
            <button
              className="btn btn-gold"
              style={{ marginTop: "1.375rem", justifyContent: "center", width: "100%" }}
              onClick={() => { download(); setOpen(false); }}
            >
              Download Free
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          /* flex so the icon centres correctly */
          .nav-hamburger { display: flex !important; }
        }
        @media (max-width: 480px) {
          .nav-inner { padding: 0 1.25rem !important; }
          .nav-download-btn { display: none !important; }
          .nav-mobile-menu { padding: 1rem 1.25rem 1.5rem !important; }
        }
      `}</style>
    </motion.header>
  );
}
