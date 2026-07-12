import { colors } from "../../theme.ts";

interface SpinnerProps {
  size?: number;
}

const keyframes = `@keyframes nexus-spin { to { transform: rotate(360deg); } }`;

function Spinner({ size = 32 }: SpinnerProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
      }}
    >
      <style>{keyframes}</style>
      <div
        style={{
          width: size,
          height: size,
          border: `3px solid ${colors.border}`,
          borderTopColor: colors.cyan,
          borderRadius: "50%",
          animation: "nexus-spin 0.8s linear infinite",
        }}
      />
    </div>
  );
}

export default Spinner;
