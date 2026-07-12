import type { CSSProperties } from "react";
import { colors, radius, spacing } from "../../theme.ts";

interface SkeletonProps {
  /** Explicit width (number = px). Defaults to 100%. */
  width?: number | string;
  /** Block height in px. */
  height?: number;
  /** Border radius override. */
  borderRadius?: number;
  style?: CSSProperties;
}

interface SkeletonTableProps {
  /** Number of placeholder rows. */
  rows?: number;
  /** Number of columns per row. */
  columns?: number;
}

const shimmerKeyframes = `@keyframes nexus-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}`;

const shimmerBg = `linear-gradient(90deg, ${colors.border} 25%, ${colors.panel} 37%, ${colors.border} 63%)`;

const baseBlock: CSSProperties = {
  background: shimmerBg,
  backgroundSize: "200% 100%",
  animation: "nexus-shimmer 1.4s ease-in-out infinite",
};

/** A single shimmering placeholder block. */
export function Skeleton({
  width = "100%",
  height = 16,
  borderRadius = radius.sm,
  style,
}: SkeletonProps) {
  return (
    <>
      <style>{shimmerKeyframes}</style>
      <div
        aria-hidden="true"
        style={{ ...baseBlock, width, height, borderRadius, ...style }}
      />
    </>
  );
}

/** A table-shaped skeleton: a header row plus N shimmering body rows. */
export function SkeletonTable({ rows = 5, columns = 4 }: SkeletonTableProps) {
  const cols = Array.from({ length: columns });
  return (
    <div
      aria-hidden="true"
      style={{ display: "flex", flexDirection: "column", gap: spacing.md }}
    >
      <style>{shimmerKeyframes}</style>
      {/* Header */}
      <div
        style={{
          display: "flex",
          gap: spacing.lg,
          paddingBottom: spacing.md,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        {cols.map((_, c) => (
          <div
            key={`h-${c}`}
            style={{
              ...baseBlock,
              height: 14,
              flex: 1,
              borderRadius: radius.sm,
              opacity: 0.8,
            }}
          />
        ))}
      </div>
      {/* Body rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={`r-${r}`} style={{ display: "flex", gap: spacing.lg }}>
          {cols.map((_, c) => (
            <div
              key={`r-${r}-c-${c}`}
              style={{
                ...baseBlock,
                height: 18,
                flex: 1,
                borderRadius: radius.sm,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
