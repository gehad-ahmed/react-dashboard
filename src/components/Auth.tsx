import { useState, type FormEvent } from "react";
import { colors, spacing } from "../theme.ts";
import { Card, Field, Input, Button, useToast } from "./ui/index.ts";
import { login, signup, loginAsGuest, type AuthUser } from "../lib/auth.ts";

type Mode = "login" | "signup";

function Auth({ onAuthenticated }: { onAuthenticated: (user: AuthUser) => void }) {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const isSignup = mode === "signup";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isSignup) {
        if (name.trim().length < 2) throw new Error("Please enter your name.");
        if (password.length < 6)
          throw new Error("Password must be at least 6 characters.");
        const user = signup(name, email, password);
        toast(`Welcome, ${user.name}!`, "success");
        onAuthenticated(user);
      } else {
        const user = login(email, password);
        toast(`Welcome back, ${user.name}!`, "success");
        onAuthenticated(user);
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Something went wrong.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(isSignup ? "login" : "signup");
    setPassword("");
  };

  const handleGuest = () => {
    const user = loginAsGuest();
    toast(`Welcome, ${user.name}! Exploring the demo.`, "info");
    onAuthenticated(user);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.bgDeep,
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: spacing.xxl }}>
          <h1 style={{ color: colors.cyan, margin: 0, fontSize: 32, letterSpacing: 1 }}>
            Nexus
          </h1>
          <p style={{ color: colors.muted, marginTop: spacing.sm }}>
            {isSignup ? "Create your account" : "Sign in to your dashboard"}
          </p>
        </div>

        <Card>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: spacing.lg }}
          >
            {isSignup && (
              <Field label="Name">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </Field>
            )}

            <Field label="Email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </Field>

            <Field label="Password">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={isSignup ? "new-password" : "current-password"}
                required
              />
            </Field>

            <Button type="submit" disabled={submitting} style={{ width: "100%", marginTop: spacing.xs }}>
              {submitting ? "Please wait…" : isSignup ? "Sign up" : "Log in"}
            </Button>
          </form>

          <Button
            variant="ghost"
            type="button"
            onClick={handleGuest}
            style={{ width: "100%", marginTop: spacing.md }}
          >
            Explore as guest
          </Button>

          <div
            style={{
              textAlign: "center",
              marginTop: spacing.lg,
              color: colors.muted,
              fontSize: 14,
            }}
          >
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={switchMode}
              style={{
                background: "none",
                border: "none",
                color: colors.cyan,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
                padding: 0,
              }}
            >
              {isSignup ? "Log in" : "Sign up"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Auth;
