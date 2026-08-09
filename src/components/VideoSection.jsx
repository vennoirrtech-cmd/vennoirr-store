import { useRef, useState, useEffect, useCallback, useContext } from "react";
import { FiHeart } from "react-icons/fi";
import { WishlistContext } from "../context/WishlistContext";
import "./VideoSection.css";

const videoCards = [
  {
    id: 1,
    poster: "/images/video_thumb_1.png",
    handle: "vennoirr",
    caption: "CORDUROY — The Signature Edit. Redefining texture, one thread at a time.",
    hasShop: true,
  },
  {
    id: 2,
    poster: "/images/video_thumb_2.png",
    handle: "vennoirr",
    caption: '"Mehnat Zabardast honi chahiye…" meet the man who makes it happen.',
    hasShop: true,
  },
  {
    id: 3,
    poster: "/images/video_thumb_3.png",
    handle: "vennoirr",
    caption: "She had other brands. We had other sharks. Now we have this collab 🤯…",
    hasShop: true,
  },
  {
    id: 4,
    poster: "/images/video_thumb_4.png",
    handle: "vennoirr",
    caption: "Street-ready. Graffiti energy meets vintage denim — the rebel edit.",
    hasShop: true,
  },
  {
    id: 5,
    poster: "/images/video_thumb_5.png",
    handle: "vennoirr",
    caption: "Leather & attitude. The night-out collection you've been waiting for.",
    hasShop: true,
  },
  {
    id: 6,
    poster: "/images/video_thumb_6.png",
    handle: "vennoirr",
    caption: "Unboxed — behind the packaging of our premium drops. Pure craftsmanship.",
    hasShop: true,
  },
];

/* ─── Shopping Bag SVG Icon ─── */
function BagIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

/* ─── Play Button SVG ─── */
function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

/* ─── Instagram Icon ─── */
function InstaIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

/* ─── Arrow Icon ─── */
function ArrowIcon({ direction }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === "left" ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 6 15 12 9 18" />
      )}
    </svg>
  );
}

/* ─── Single Video Card ─── */
function VideoCard({ card }) {
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const videoWishlistItemId = `video-${card.id}`;
  const isWishlisted = wishlist.some((item) => item.id === videoWishlistItemId);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: videoWishlistItemId,
      title: card.caption,
      image: card.poster,
      isVideo: true,
    });
  };

  return (
    <div className="vc-card">
      {/* Poster Image */}
      <img src={card.poster} alt={card.caption} className="vc-poster" />

      {/* Bottom gradient overlay */}
      <div className="vc-gradient" />

      {/* Instagram handle */}
      <div className="vc-handle">
        <InstaIcon />
        <span>{card.handle}</span>
      </div>

      {/* Shopping bag button */}
      {card.hasShop && (
        <button className="vc-bag-btn" aria-label="Shop this look">
          <BagIcon />
        </button>
      )}

      {/* Wishlist Button */}
      <button
        className={`vc-wishlist-btn ${isWishlisted ? "liked" : ""}`}
        onClick={handleWishlist}
        aria-label="Wishlist"
      >
        <FiHeart />
      </button>

      {/* Centered play button */}
      <div className="vc-play">
        <PlayIcon />
      </div>

      {/* Caption */}
      <p className="vc-caption">{card.caption}</p>
    </div>
  );
}

/* ─── Main Video Section ─── */
export default function VideoSection() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector(".vc-card")?.offsetWidth || 300;
    el.scrollBy({ left: dir === "left" ? -cardWidth - 20 : cardWidth + 20, behavior: "smooth" });
  };

  return (
    <section className="vc-section">
      <h2 className="vc-title">Explore Our Collection</h2>

      <div className="vc-viewport">
        {/* Left arrow */}
        {canScrollLeft && (
          <button
            className="vc-arrow vc-arrow--left"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <ArrowIcon direction="left" />
          </button>
        )}

        {/* Scrollable row */}
        <div className="vc-row" ref={scrollRef}>
          {videoCards.map((card) => (
            <VideoCard key={card.id} card={card} />
          ))}
        </div>

        {/* Right arrow */}
        {canScrollRight && (
          <button
            className="vc-arrow vc-arrow--right"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ArrowIcon direction="right" />
          </button>
        )}
      </div>
    </section>
  );
}
