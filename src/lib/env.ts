type SupabaseEnvironment = {
  url: string;
  publishableKey: string;
};

export function getSupabaseEnvironment(): SupabaseEnvironment {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Supabase is not configured. Copy .env.example to .env.local and provide the project URL and publishable key.",
    );
  }

  return { url, publishableKey };
}

