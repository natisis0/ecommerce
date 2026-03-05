import { NextResponse } from "next/server";
import { createClient } from "@/_lib/supabase-server";
import {
  getCartItems,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
} from "@/_lib/cart-service";

async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// GET /api/cart — fetch cart items for authenticated user
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await getCartItems(user.id);
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/cart — add item to cart
export async function POST(request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, price, quantity } = await request.json();
    if (!productId || !price) {
      return NextResponse.json(
        { error: "productId and price are required" },
        { status: 400 },
      );
    }

    const item = await addCartItem(user.id, productId, price, quantity || 1);
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/cart — update item quantity
export async function PATCH(request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity } = await request.json();
    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: "productId and quantity are required" },
        { status: 400 },
      );
    }

    const item = await updateCartItemQuantity(user.id, productId, quantity);
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/cart — remove item from cart
export async function DELETE(request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 },
      );
    }

    await removeCartItem(user.id, productId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
