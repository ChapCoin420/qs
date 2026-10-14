import { sql } from "drizzle-orm";
import {
  check,
  index,
  jsonb,
  pgTable,
  smallint,
  text,
  time,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { id, timestamps } from "./columns.ts";

/** Tenant. Every business table references a shop (ADR-009). */
export const shops = pgTable(
  "shops",
  {
    id: id(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    legalName: text("legal_name"),
    businessId: text("business_id"),
    timezone: text("timezone").notNull().default("Asia/Jerusalem"),
    settings: jsonb("settings").$type<Record<string, unknown>>().notNull().default({}),
    ...timestamps(),
  },
  (t) => [uniqueIndex("shops_slug_uq").on(t.slug)],
);

export const locations = pgTable(
  "locations",
  {
    id: id(),
    shopId: uuid("shop_id")
      .notNull()
      .references(() => shops.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    street: text("street").notNull(),
    city: text("city").notNull(),
    phone: text("phone"),
    whatsappE164: text("whatsapp_e164"),
    latitude: text("latitude"),
    longitude: text("longitude"),
    /** Free-text Hebrew description of physical accessibility, shown in the accessibility statement. */
    accessibilityInfo: text("accessibility_info"),
    ...timestamps(),
  },
  (t) => [index("locations_shop_idx").on(t.shopId)],
);

/** Public opening hours of a location. Several rows per weekday allowed (split shifts). */
export const locationHours = pgTable(
  "location_hours",
  {
    id: id(),
    shopId: uuid("shop_id")
      .notNull()
      .references(() => shops.id),
    locationId: uuid("location_id")
      .notNull()
      .references(() => locations.id, { onDelete: "cascade" }),
    /** 0 = Sunday … 6 = Saturday (JS `getDay()` convention). */
    weekday: smallint("weekday").notNull(),
    opensAt: time("opens_at").notNull(),
    closesAt: time("closes_at").notNull(),
    ...timestamps(),
  },
  (t) => [
    index("location_hours_location_idx").on(t.locationId, t.weekday),
    check("location_hours_weekday_ck", sql`${t.weekday} between 0 and 6`),
    check("location_hours_order_ck", sql`${t.opensAt} < ${t.closesAt}`),
  ],
);
