import type { CSSProperties, ReactNode } from "react";
import { colors, panelStyle, shadow } from "../../theme.ts";

interface CardProps {
  title?: string;
  titleColor?: string;
  children?: ReactNode;
  style?: CSSProperties;
}

function Card({ title, titleColor = colors.cyan, children, style }: CardProps) {
  return (
    <div
      style={{
        ...panelStyle,
        border: `1px solid ${colors.border}`,
        boxShadow: shadow.md,
        ...style,
      }}
    >
      {title && (
        <h3
          style={{
            color: titleColor,
            margin: 0,
            marginBottom: 16,
            fontSize: 16,
          }}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

export default Card;
