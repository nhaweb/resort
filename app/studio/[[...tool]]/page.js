import { isSanityConfigured } from "@/lib/sanity/client";
import Studio from "./Studio";

export default function StudioPage() {
  if (!isSanityConfigured()) {
    return (
      <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
        <h1>Sanity Studio is not configured</h1>
        <p>
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{" "}
          <code>NEXT_PUBLIC_SANITY_DATASET</code> in your environment, then
          reload. Until then the marketing site uses the built-in dictionary
          copy.
        </p>
      </main>
    );
  }
  return <Studio />;
}
