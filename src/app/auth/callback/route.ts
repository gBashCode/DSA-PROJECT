import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") ?? "magiclink";
  const next = searchParams.get("next") ?? "/profile";

  if (token_hash && token_hash.length > 0) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const response = await fetch(`${supabaseUrl}/auth/v1/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseKey,
      },
      body: JSON.stringify({ token_hash, type }),
    });

    if (response.ok) {
      const data = await response.json();
      const redirectUrl = `${origin}${next}`;
      const res = NextResponse.redirect(redirectUrl);

      if (data.access_token) {
        res.cookies.set("sb-access-token", data.access_token, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 60 * 60,
        });
      }
      if (data.refresh_token) {
        res.cookies.set("sb-refresh-token", data.refresh_token, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
        });
      }

      return res;
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=Invalid+link`);
}
