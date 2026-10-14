import { index, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { id } from "./columns.ts";
import { shops } from "./shop.ts";

export const actorType = pgEnum("audit_actor_type", ["user", "customer", "system", "assistant"]);

/** Append-only. The application DB role is revoked UPDATE/DELETE on this table (see migration). */
export const auditLog = pgTable(
  "audit_log",
  {
    id: id(),
    shopId: uuid("shop_id")
      .notNull()
      .references(() => shops.id),
    actorType: actorType("actor_type").notNull(),
    actorId: text("actor_id"),
    action: text("action").notNull(),
    entity: text("entity").notNull(),
    entityId: text("entity_id"),
    before: jsonb("before"),
    after: jsonb("after"),
    ipHash: text("ip_hash"),
    at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("audit_log_entity_idx").on(t.shopId, t.entity, t.entityId),
    index("audit_log_at_idx").on(t.at),
  ],
);
