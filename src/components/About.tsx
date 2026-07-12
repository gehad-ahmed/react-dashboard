import { colors, spacing } from "../theme.ts";
import { Card } from "./ui/index.ts";

function About() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacing.xl }}>
      <h3 style={{ color: colors.text, margin: 0 }}>About</h3>

      <Card title="Nexus Dashboard" titleColor={colors.cyan}>
        <p style={{ color: colors.muted, lineHeight: 1.8, margin: 0 }}>
          Nexus is a modern analytics dashboard built with React and Recharts.
          It helps businesses track their orders, customers, and revenue in real
          time.
        </p>
      </Card>

      <Card title="Tech Stack" titleColor={colors.purple}>
        <ul
          style={{
            color: colors.muted,
            lineHeight: 2,
            margin: 0,
            paddingLeft: spacing.xl,
          }}
        >
          <li>React + TypeScript</li>
          <li>Recharts for data visualization</li>
          <li>Custom CSS styling</li>
        </ul>
      </Card>
    </div>
  );
}

export default About;
