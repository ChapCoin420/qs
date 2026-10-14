import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { id, timestamps } from "./columns.ts";
import { shops } from "./shop.ts";
import { staff } from "./staff.ts";

export const services = pgTable(
  "services",
  {
    id: id(),
    shopId: uuid("shop_id")
      .notNull()
      .references(() => shops.id),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    category: text("category").notNull(),
    durationMin: integer("duration_min").notNull(),
    /** Integer agorot, VAT-inclusive consumer price. Null = priced on consultation. */
    priceAgorot: integer("price_agorot"),
    bufferBeforeMin: integer("buffer_before_min").notNull().default(0),
    bufferAfterMin: integer("buffer_after_min").notNull().default(0),
    isOnlineBookable: boolean("is_online_bookable").notNull().default(true),
    active: boolean("active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps(),
  },
  (t) => [
    index("services_shop_idx").on(t.shopId, t.active),
    check("services_duration_ck", sql`${t.durationMin} > 0 and ${t.durationMin} <= 480`),
    check("services_price_ck", sql`${t.priceAgorot} is null or ${t.priceAgorot} >= 0`),
  ],
);

/** Which staff member performs which service, with optional per-barber overrides. */
export const staffServices = pgTable(
  "staff_services",
  {
    shopId: uuid("shop_id")
      .notNull()
      .references(() => shops.id),
    staffId: uuid("staff_id")
      .notNull()
      .references(() => staff.id, { onDelete: "cascade" }),
    serviceId: uuid("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
    durationOverrideMin: integer("duration_override_min"),
    priceOverrideAgorot: integer("price_override_agorot"),
  },
  (t) => [primaryKey({ columns: [t.staffId, t.serviceId] })],
);
