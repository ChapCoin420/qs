import "server-only";
import { asc, eq } from "drizzle-orm";
import { cache } from "react";
import { getDb } from "@/db/client";
import { locationHours, locations, shops } from "@/db/schema";
import { env } from "@/lib/env";
import type { OpeningSlot } from "@/lib/hours";

export interface ShopProfile {
  id: string;
  name: string;
  location: {
    id: string;
    street: string;
    city: string;
    phone: string | null;
    whatsappE164: string | null;
    accessibilityInfo: string | null;
  };
  hours: OpeningSlot[];
}

/** The current tenant's public profile. Cached per request. */
export const getShopProfile = cache(async (): Promise<ShopProfile> => {
  const db = getDb();
  const [shop] = await db.select().from(shops).where(eq(shops.slug, env().SHOP_SLUG)).limit(1);
  if (!shop) throw new Error(`Shop '${env().SHOP_SLUG}' not found — run db:seed`);
  const [location] = await db
    .select()
    .from(locations)
    .where(eq(locations.shopId, shop.id))
    .limit(1);
  if (!location) throw new Error("Shop has no location");
  const hours = await db
    .select({
      weekday: locationHours.weekday,
      opensAt: locationHours.opensAt,
      closesAt: locationHours.closesAt,
    })
    .from(locationHours)
    .where(eq(locationHours.locationId, location.id))
    .orderBy(asc(locationHours.weekday), asc(locationHours.opensAt));

  return {
    id: shop.id,
    name: shop.name,
    location: {
      id: location.id,
      street: location.street,
      city: location.city,
      phone: location.phone,
      whatsappE164: location.whatsappE164,
      accessibilityInfo: location.accessibilityInfo,
    },
    hours,
  };
});
