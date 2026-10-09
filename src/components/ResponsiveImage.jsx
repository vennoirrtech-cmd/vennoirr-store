import React from "react";

export default function ResponsiveImage({ 
  src, 
  alt, 
  className = "", 
  sizes = "(max-width: 768px) 50vw, 25vw", 
  loading = "lazy" 
}) {
  if (!src) return <div className={`img-placeholder ${className}`}></div>;

  // Cloudinary Optimization Logic
  if (src.includes("res.cloudinary.com") && typeof src === "string") {
    // Clean any existing transformations to avoid double applying
    const baseUrl = src.replace(/\/upload\/(?:q_auto,f_auto,w_\d+\/)?/, "/upload/");

    const src400 = baseUrl.replace("/upload/", "/upload/q_auto,f_auto,w_400/");
    const src800 = baseUrl.replace("/upload/", "/upload/q_auto,f_auto,w_800/");
    const src1200 = baseUrl.replace("/upload/", "/upload/q_auto,f_auto,w_1200/");
    
    return (
      <img
        src={src800} // Fallback for browsers that don't support srcSet
        srcSet={`${src400} 400w, ${src800} 800w, ${src1200} 1200w`}
        sizes={sizes}
        alt={alt}
        className={className}
        loading={loading}
        decoding="async"
      />
    );
  }

  // Fallback for non-cloudinary local/external images
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      loading={loading}
      decoding="async"
    />
  );
}
