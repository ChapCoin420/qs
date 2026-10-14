import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { cache } from "react";
import { getDb } from "@/db/client";
import { services, staff } from "@/db/schema";
import { getShopProfile } from "@/modules/shop";

export interface PublicService {
  slug: string;
  name: string;
  description: string | null;
  category: string;
  durationMin: number;
  priceAgorot: number | null;
}

export interface PublicStaffMember {
  slug: string;
  displayName: string;
  role: string;
  bio: string | null;
  photoPath: string | null;
  photoAlt: string | null;
}

export const listServices = cache(async (): Promise<PublicService[]> => {
  const shop = await getShopProfile();
  return getDb()
    .select({
      slug: services.slug,
      name: services.name,
      description: services.description,
      category: services.category,
      durationMin: services.durationMin,
      priceAgorot: services.priceAgorot,
    })
    .from(services)
    .where(and(eq(services.shopId, shop.id), eq(services.active, true)))
    .orderBy(asc(services.sortOrder));
});

export const listStaff = cache(async (): Promise<PublicStaffMember[]> => {
  const shop = await getShopProfile();
  return getDb()
    .select({
      slug: staff.slug,
      displayName: staff.displayName,
      role: staff.role,
      bio: staff.bio,
      photoPath: staff.photoPath,
      photoAlt: staff.photoAlt,
    })
    .from(staff)
    .where(and(eq(staff.shopId, shop.id), eq(staff.active, true)))
    .orderBy(asc(staff.sortOrder));
});
