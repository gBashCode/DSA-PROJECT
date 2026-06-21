import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/tracker";

  if (code) {
    const supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.headers.get("cookie")?.split(";").map(c => {
              const [name, ...value] = c.split("=");
              return { name: name.trim(), value: value.join("=") };
            }) ?? [];
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              supabaseResponse.headers.append("Set-Cookie", `${name}=${value}`)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const redirectResponse = NextResponse.redirect(`${origin}${next}`);
      supabaseResponse.headers.getAll("Set-Cookie").forEach((cookie) => {
        redirectResponse.headers.append("Set-Cookie", cookie);
      });
      return redirectResponse;
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=Invalid+link`);
}
