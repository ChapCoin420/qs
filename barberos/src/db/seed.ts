import { and, eq } from "drizzle-orm";
import { createDb, type Db } from "./client.ts";
import { locationHours, locations, services, shops, staff, staffServices } from "./schema/index.ts";
import { seedShop } from "./seed-data.ts";

/** Idempotent: re-running updates rows in place, keyed by slugs. */
export async function seed(db: Db): Promise<void> {
  await db.transaction(async (tx) => {
    const [shop] = await tx
      .insert(shops)
      .values({ slug: seedShop.slug, name: seedShop.name })
      .onConflictDoUpdate({ target: shops.slug, set: { name: seedShop.name } })
      .returning();
    if (!shop) throw new Error("shop upsert failed");

    let [location] = await tx
      .select()
      .from(locations)
      .where(eq(locations.shopId, shop.id))
      .limit(1);
    if (location) {
      [location] = await tx
        .update(locations)
        .set({ ...seedShop.location })
        .where(eq(locations.id, location.id))
        .returning();
    } else {
      [location] = await tx
        .insert(locations)
        .values({ shopId: shop.id, ...seedShop.location })
        .returning();
    }
    if (!location) throw new Error("location upsert failed");

    await tx.delete(locationHours).where(eq(locationHours.locationId, location.id));
    if (seedShop.hours.length > 0) {
      await tx
        .insert(locationHours)
        .values(seedShop.hours.map((h) => ({ shopId: shop.id, locationId: location.id, ...h })));
    }

    const serviceIds: string[] = [];
    for (const [i, s] of seedShop.services.entries()) {
      const values = { shopId: shop.id, sortOrder: i, ...s };
      const [existing] = await tx
        .select({ id: services.id })
        .from(services)
        .where(and(eq(services.shopId, shop.id), eq(services.slug, s.slug)));
      const [row] = existing
        ? await tx.update(services).set(values).where(eq(services.id, existing.id)).returning()
        : await tx.insert(services).values(values).returning();
      if (row) serviceIds.push(row.id);
    }

    for (const [i, m] of seedShop.staff.entries()) {
      const values = { shopId: shop.id, locationId: location.id, sortOrder: i, ...m };
      const [existing] = await tx
        .select({ id: staff.id })
        .from(staff)
        .where(and(eq(staff.shopId, shop.id), eq(staff.slug, m.slug)));
      const [row] = existing
        ? await tx.update(staff).set(values).where(eq(staff.id, existing.id)).returning()
        : await tx.insert(staff).values(values).returning();
      if (!row) continue;
      for (const serviceId of serviceIds) {
        await tx
          .insert(staffServices)
          .values({ shopId: shop.id, staffId: row.id, serviceId })
          .onConflictDoNothing();
      }
    }
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const { db, pool } = createDb(url);
  try {
    await seed(db);
    console.log("seed applied");
  } finally {
    await pool.end();
  }
}
