import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

// Only render the custom cursor on devices with a fine pointer (mouse).
// On touch/coarse-pointer devices we skip it entirely so the native tap
// cursor is not broken by `cursor: none`.
function hasFinePointer() {
  return typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
}

export default function Cursor() {
  const [isFinePointer] = useState(hasFinePointer);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  const rawX = useSpring(0, { damping: 28, stiffness: 700, mass: 0.15 });
  const rawY = useSpring(0, { damping: 28, stiffness: 700, mass: 0.15 });

  useEffect(() => {
    // If this is a touch/coarse device, do nothing.
    if (!isFinePointer) return;

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      setVisible(true);
    };

    const onLeave = () => setVisible(false);

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      setHovered(!!target?.closest("a, button, [role='button'], label, input, textarea, select"));
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [rawX, rawY, isFinePointer]);

  // On touch devices: render nothing, leave cursor behaviour to the browser.
  if (!isFinePointer) return null;

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: rawX,
          y: rawY,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 99999,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        <motion.div
          animate={{
            width: hovered ? 32 : 18,
            height: hovered ? 32 : 18,
            background: hovered ? "var(--gold, #FFD700)" : "#ffffff",
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            borderRadius: "50%",
            border: "3px solid var(--ink, #0a0a0a)",
            boxShadow: "3px 3px 0 var(--ink, #0a0a0a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {!hovered && (
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "var(--ink, #0a0a0a)",
                flexShrink: 0,
              }}
            />
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
