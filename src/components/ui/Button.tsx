import type { ButtonHTMLAttributes, CSSProperties } from "react";
import { useState } from "react";
import { colors, radius, focusRing, transitions } from "../../theme.ts";

type Variant = "primary" | "warning" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, CSSProperties> = {
  primary: {
    backgroundColor: colors.cyan,
    color: colors.bgDeep,
    border: "none",
  },
  warning: {
    backgroundColor: colors.amber,
    color: colors.bgDeep,
    border: "none",
  },
  danger: {
    backgroundColor: colors.red,
    color: colors.bgDeep,
    border: "none",
  },
  ghost: {
    backgroundColor: "transparent",
    color: colors.text,
    border: `1px solid ${colors.border}`,
  },
};

// Hover tint for the ghost variant (which has no solid background to brighten).
const ghostHoverBg = "rgba(148,163,184,0.12)";

function Button({
  variant = "primary",
  style,
  disabled,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onFocus,
  onBlur,
  ...rest
}: ButtonProps) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const [focus, setFocus] = useState(false);

  const isGhost = variant === "ghost";

  const interactive: CSSProperties = disabled
    ? {}
    : {
        filter: hover && !isGhost ? "brightness(1.08)" : "none",
        backgroundColor:
          isGhost && hover ? ghostHoverBg : variantStyles[variant].backgroundColor,
        borderColor: isGhost && hover ? colors.muted : undefined,
        transform: active ? "translateY(1px)" : hover ? "translateY(-1px)" : "none",
        boxShadow: focus ? `0 0 0 3px ${focusRing}` : "none",
      };

  return (
    <button
      disabled={disabled}
      onMouseEnter={(e) => {
        setHover(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHover(false);
        setActive(false);
        onMouseLeave?.(e);
      }}
      onMouseDown={(e) => {
        setActive(true);
        onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        setActive(false);
        onMouseUp?.(e);
      }}
      onFocus={(e) => {
        setFocus(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocus(false);
        onBlur?.(e);
      }}
      style={{
        padding: "10px 16px",
        borderRadius: radius.sm,
        fontSize: 14,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        outline: "none",
        transition: `transform ${transitions.fast}, filter ${transitions.base}, background-color ${transitions.base}, box-shadow ${transitions.base}, opacity ${transitions.base}, border-color ${transitions.base}`,
        ...variantStyles[variant],
        ...interactive,
        ...style,
      }}
      {...rest}
    />
  );
}

export default Button;
