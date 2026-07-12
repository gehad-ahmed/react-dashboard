import type {
  CSSProperties,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";
import { useState } from "react";
import { colors, radius, focusRing, transitions } from "../../theme.ts";

interface FieldProps {
  label: string;
  children: ReactNode;
  style?: CSSProperties;
}

export function Field({ label, children, style }: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
      <label style={{ color: colors.muted, fontSize: 13, marginBottom: 4 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const controlStyle: CSSProperties = {
  width: "100%",
  padding: 10,
  borderRadius: radius.sm,
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.bgDeep,
  color: colors.text,
  outline: "none",
  transition: `border-color ${transitions.base}, box-shadow ${transitions.base}`,
};

function focusStyle(focused: boolean): CSSProperties {
  return focused
    ? { borderColor: colors.cyan, boxShadow: `0 0 0 3px ${focusRing}` }
    : {};
}

export function Input({
  style,
  onFocus,
  onBlur,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      style={{ ...controlStyle, ...focusStyle(focused), ...style }}
      {...rest}
    />
  );
}

export function Select({
  style,
  onFocus,
  onBlur,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      style={{ ...controlStyle, ...focusStyle(focused), ...style }}
      {...rest}
    />
  );
}
