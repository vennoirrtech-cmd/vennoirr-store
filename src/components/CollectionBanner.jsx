import funkyImg from "../assets/images/Hero Image.png";
import premiumImg from "../assets/images/Untitled-2 (1)_page-0001.jpg";

export default function CollectionBanner({ sectionData }) {
  if (sectionData) {
    if (!sectionData.products || sectionData.products.length === 0) return null;
    const items = sectionData.products.slice(0, 2);
    return (
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
        {items.map((item, idx) => (
          <div className="collection-banner" key={item._id || item.id || idx}>
            <img src={item.images?.[0]?.url || (idx === 0 ? funkyImg : premiumImg)} alt={item.name} />
            <div className="banner-overlay">
              <h3>{item.name?.toUpperCase()}</h3>
              <p>{item.description || 'Explore this premium piece'}</p>
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
      <div className="collection-banner">
        <img src={funkyImg} alt="Men Collection" />
        <div className="banner-overlay">
          <h3>FUNKY COLLECTION</h3>
          <p>Express yourself with bold, statement pieces</p>
        </div>
      </div>

      <div className="collection-banner">
        <img src={premiumImg} alt="Women Collection" />
        <div className="banner-overlay">
          <h3>PREMIUM EDIT</h3>
          <p>Elevated essentials worth repeating</p>
        </div>
      </div>
    </section>
  );
}
