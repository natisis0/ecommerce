import { NextResponse } from "next/server";
import { createClient } from "@/_lib/supabase-server";
import { mergeCart } from "@/_lib/cart-service";

// POST /api/cart/merge — merge localStorage cart into DB cart on login
export async function POST(request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "items array is required" },
        { status: 400 },
      );
    }

    const mergedCart = await mergeCart(user.id, items);
    return NextResponse.json({ items: mergedCart });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
