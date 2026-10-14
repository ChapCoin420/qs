import { eq, sql } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createDb } from "@/db/client";
import { runMigrations } from "@/db/migrate";
import { auditLog, locationHours, services, shops } from "@/db/schema";
import { seed } from "@/db/seed";

const url = process.env.TEST_DATABASE_URL;
// The suite drops and recreates the schema: refuse anything that is not a dedicated test database.
if (url && !new URL(url).pathname.endsWith("_test")) {
  throw new Error("TEST_DATABASE_URL must point to a database whose name ends with _test");
}

/** Drizzle wraps driver errors; return the underlying Postgres message of a failing query. */
async function rootMessage(query: PromiseLike<unknown>): Promise<string> {
  try {
    await query;
  } catch (e) {
    const err = e as Error & { cause?: Error };
    return err.cause?.message ?? err.message;
  }
  throw new Error("expected query to fail");
}

describe.skipIf(!url)("database (integration)", () => {
  const { db, pool } = createDb(url ?? "postgres://invalid");

  beforeAll(async () => {
    await pool.query(
      "drop schema if exists public cascade; drop schema if exists drizzle cascade; create schema public;",
    );
    await runMigrations(url!);
    await seed(db);
  });

  afterAll(async () => {
    await pool.end();
  });

  it("seed is idempotent", async () => {
    await seed(db);
    const [{ count }] = (await db.execute(sql`select count(*)::int as count from services`))
      .rows as [{ count: number }];
    expect(count).toBe(5);
  });

  it("rejects negative prices and zero durations", async () => {
    const [shop] = await db.select().from(shops).limit(1);
    await expect(
      db
        .insert(services)
        .values({ shopId: shop!.id, slug: "bad", name: "x", category: "hair", durationMin: 0 }),
    ).rejects.toThrow();
    await expect(
      db.insert(services).values({
        shopId: shop!.id,
        slug: "bad2",
        name: "x",
        category: "hair",
        durationMin: 10,
        priceAgorot: -1,
      }),
    ).rejects.toThrow();
  });

  it("rejects opening hours that end before they start", async () => {
    const [shop] = await db.select().from(shops).limit(1);
    const loc = await db.execute(sql`select id from locations limit 1`);
    const locationId = (loc.rows[0] as { id: string }).id;
    await expect(
      db
        .insert(locationHours)
        .values({ shopId: shop!.id, locationId, weekday: 1, opensAt: "18:00", closesAt: "09:00" }),
    ).rejects.toThrow();
  });

  it("keeps the audit log append-only", async () => {
    const [shop] = await db.select().from(shops).limit(1);
    const [row] = await db
      .insert(auditLog)
      .values({
        shopId: shop!.id,
        actorType: "system",
        action: "test",
        entity: "shop",
        entityId: shop!.id,
      })
      .returning();
    await expect(
      rootMessage(db.update(auditLog).set({ action: "tampered" }).where(eq(auditLog.id, row!.id))),
    ).resolves.toMatch(/append-only/);
    await expect(rootMessage(db.delete(auditLog).where(eq(auditLog.id, row!.id)))).resolves.toMatch(
      /append-only/,
    );
  });

  it("maintains updated_at on update", async () => {
    const [before] = await db.select().from(shops).limit(1);
    await new Promise((r) => setTimeout(r, 20));
    const [after] = await db
      .update(shops)
      .set({ name: before!.name })
      .where(eq(shops.id, before!.id))
      .returning();
    expect(after!.updatedAt.getTime()).toBeGreaterThan(before!.updatedAt.getTime());
  });
});
