import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Sign up",
};

async function signUp(formData) {
  "use server";

  const email = formData.get("email");
  const password = formData.get("password");

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect("/signup?error=true");
  }

  redirect("/profile");
}

export default async function SignupPage({ searchParams }) {
  const { error } = await searchParams;

  // Already logged in? Then there is nothing to do here
  const user = await getCurrentUser();

  if (user) {
    redirect("/profile");
  }

  return (
    <main>
      <h1>Sign up</h1>

      {error && <p className="form-error" role="alert">Could not create the user. Please try again.</p>}

      <form className="auth-form" action={signUp}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="At least 6 characters"
          autoComplete="new-password"
          minLength={6}
          required
        />

        <button type="submit">Sign up</button>
      </form>

      <p>
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </main>
  );
}
