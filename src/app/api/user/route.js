import { getCurrentUser } from "@/_lib/auth";
import { NextResponse } from "next/server";
import { supabase } from "@/_lib/supabase";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const { data: { users } } = await supabase.auth.getUser()
    return NextResponse.json({ user, users });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

