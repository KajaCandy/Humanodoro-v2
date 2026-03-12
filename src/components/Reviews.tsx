const ALL_REVIEWS = [
  { name: "Markus K.", title: "Software Engineer",    img: "review-markus.webp", stars: 5, source: "email",      text: "I used to check my phone constantly while working. Now I start a session, and when I feel the urge to grab my phone, the timer reminds me why I started. Most times, I keep going." },
  { name: "Nina",      title: "Student from Slovenia", img: "review-lena.webp",  stars: 5, source: "trustpilot", text: "I actually use this pad consistently. I was sceptical at first because I've downloaded many study apps which I sooner or later stopped using. But the actual pad somehow compels me to use it." },
  { name: "Lena",      title: "Marketing Student",    img: "review-nina.webp",   stars: 5, source: "interview",  text: "Spent way too much time on TikTok. What surprised me is that this worked because it feels like a journey, not punishment. The little characters actually keep me going." },
  { name: "Maja",      title: "Parent of two",        img: "review-maja.png",    stars: 5, source: "fair",       text: "Time with our kids was disappearing into our phones. We started putting them down together at the same time. Even the kids noticed. That alone made it worth it." },
  { name: "David",     title: "Product Manager",      img: "review-david.webp",  stars: 5, source: "email",      text: "Tried app blockers before, but they always annoyed me and I deleted them. Humanodoro isn't invasive. It feels more like building a habit than being locked out." },
  { name: "Eva",       title: "University Student",   img: "review-eva.webp",    stars: 5, source: "instagram",  text: "Studying was impossible with notifications. Keeping my phone on the Humanodoro Pad in the other room, on silent, changed everything." },
  { name: "André",     title: "Economics Student",    img: "review-andre.webp",  stars: 5, source: "email",      text: "We connected in the Humanodoro app with friends and turned it into a challenge. Competing on minutes and levels made it stick." },
];

function ReviewCard({ r }: { r: typeof ALL_REVIEWS[number] }) {
  return (
    <div className="review-card" style={{
      background: "#fff",
      border: "3px solid var(--ink)",
      borderRadius: "1.375rem",
      padding: "1.375rem 1.5rem",
      minWidth: 300,
      maxWidth: 420,
      flexShrink: 0,
      boxShadow: "4px 4px 0 var(--ink)",
      marginRight: "1.25rem",
    }}>
      {/* Stars first for visual punch */}
      <div style={{ color: "var(--gold)", fontSize: "1rem", letterSpacing: 1, marginBottom: ".625rem" }}>★★★★★</div>

      <p style={{ fontSize: ".9rem", color: "var(--ink)", lineHeight: 1.65, marginBottom: "1rem", fontWeight: 400 }}>
        "{r.text}"
      </p>

      {/* Author below the text */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", borderTop: "1.5px solid rgba(0,0,0,.07)", paddingTop: ".75rem" }}>
        <img
          src={`/images/${r.img}`}
          alt={r.name}
          style={{
            width: 36, height: 36, borderRadius: "50%",
            objectFit: "cover", border: "2px solid var(--ink)", flexShrink: 0,
          }}
        />
        <div>
          <div style={{ fontSize: ".875rem", fontWeight: 700, color: "var(--ink)", fontFamily: "var(--ff-display)" }}>{r.name}</div>
          <div style={{ fontSize: ".875rem", color: "var(--ink-30)", fontWeight: 500 }}>{r.title}</div>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ reviews, direction }: { reviews: typeof ALL_REVIEWS; direction: "left" | "right" }) {
  const tripled = [...reviews, ...reviews, ...reviews];
  return (
    <div className="marquee-row">
      <div className={`marquee-track marquee-track--${direction}`}>
        {tripled.map((r, i) => <ReviewCard key={i} r={r} />)}
      </div>
    </div>
  );
}

export default function Reviews() {
  const row1 = ALL_REVIEWS;
  const row2 = [...ALL_REVIEWS].reverse();

  return (
    <section id="reviews" style={{ background: "var(--white)", padding: "var(--section-pad) 0", overflow: "hidden" }}>
      {/* Header */}
      <div className="reviews-header" style={{ textAlign: "center", marginBottom: "3.5rem", padding: "0 2rem" }}>

        {/* Star rating summary — lead with this */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.625rem", marginBottom: "1.125rem" }}>
          <div style={{ display: "flex", gap: 3 }}>
            {[0,1,2,3,4].map(i => (
              <svg key={i} width="22" height="22" viewBox="0 0 16 16" fill="var(--gold)">
                <path d="M8 1l1.9 3.8 4.2.6-3.1 3 .7 4.2L8 10.4l-3.7 2.2.7-4.2L2 5.4l4.2-.6z" />
              </svg>
            ))}
          </div>
          <span style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--ink)", fontFamily: "var(--ff-display)" }}>4.8</span>
          <span style={{ color: "var(--ink-30)", fontSize: ".9rem" }}>· App Store & Google Play</span>
        </div>

        <h2
          className="display"
          style={{
            fontSize: "clamp(2rem, 4vw, 3.75rem)",
            fontWeight: 700, color: "var(--ink)", marginBottom: "0.625rem",
            letterSpacing: "-.02em", lineHeight: 1.05,
          }}
        >
          50,000+ people already winning
        </h2>

        <p style={{ color: "var(--ink-60)", fontSize: ".975rem", lineHeight: 1.6 }}>Real results from real people</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <MarqueeRow reviews={row1} direction="left" />
        <MarqueeRow reviews={row2} direction="right" />
      </div>

      <style>{`
        @media (max-width: 600px) {
          .reviews-header { padding: 0 1.25rem !important; }
        }
        @media (max-width: 480px) {
          /* Reduce card min-width so marquee cards fit better on small screens */
          .review-card {
            min-width: 280px !important;
            max-width: 320px !important;
            padding: 1rem 1.125rem !important;
          }
          /* Slightly smaller text to fit more per card */
          .review-card p { font-size: .875rem !important; }
          .reviews-header { margin-bottom: 2.5rem !important; }
        }
      `}</style>
    </section>
  );
}
