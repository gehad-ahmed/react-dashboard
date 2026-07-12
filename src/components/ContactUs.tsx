import { colors, spacing } from "../theme.ts";
import { Card } from "./ui/index.ts";

interface ContactRow {
  label: string;
  value: string;
  color: string;
}

const rows: ContactRow[] = [
  { label: "Email", value: "support@nexus.com", color: colors.cyan },
  { label: "Phone", value: "+20 123 456 789", color: colors.purple },
  { label: "Address", value: "Cairo, Egypt", color: colors.green },
];

function ContactUs() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacing.xl }}>
      <h3 style={{ color: colors.text, margin: 0 }}>Contact Us</h3>

      <Card title="Get in touch">
        <div
          style={{ display: "flex", flexDirection: "column", gap: spacing.lg }}
        >
          {rows.map((row) => (
            <div key={row.label}>
              <p
                style={{
                  color: row.color,
                  marginBottom: spacing.xs,
                  marginTop: 0,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {row.label}
              </p>
              <p style={{ color: colors.muted, margin: 0 }}>{row.value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default ContactUs;
