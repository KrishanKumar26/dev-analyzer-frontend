import React from "react";

export function SkeletonText({ width = "100%" }) {
  return <div className="skeleton skeleton-text" style={{ width }} />;
}

export function SkeletonRow() {
  return (
    <div className="skeleton-row">
      <div className="skeleton skeleton-avatar" />
      <div style={{ flex: 1 }}>
        <SkeletonText width="60%" />
        <SkeletonText width="35%" />
      </div>
      <div className="skeleton skeleton-text" style={{ width: 48, height: 16 }} />
    </div>
  );
}

export function SkeletonRows({ count = 5 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="skeleton-card">
      <SkeletonText width="50%" />
      <div className="skeleton skeleton-text" style={{ width: "70%", height: 26, marginTop: 6 }} />
    </div>
  );
}

export function SkeletonStatsGrid({ count = 4 }) {
  return (
    <div className="stats-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonStatCard key={i} />
      ))}
    </div>
  );
}
