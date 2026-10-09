export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img skeleton-pulse" />
      <div className="skeleton-line skeleton-pulse" style={{ width: '70%', marginTop: 12 }} />
      <div className="skeleton-line skeleton-pulse" style={{ width: '40%', marginTop: 8 }} />
    </div>
  );
}
