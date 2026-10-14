import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  smallint,
  text,
  time,
  uuid,
} from "drizzle-orm/pg-core";
import { id, timestamps, tstzrange } from "./columns.ts";
import { locations, shops } from "./shop.ts";

export const staff = pgTable(
  "staff",
  {
    id: id(),
    shopId: uuid("shop_id")
      .notNull()
      .references(() => shops.id),
    locationId: uuid("location_id")
      .notNull()
      .references(() => locations.id),
    /** Linked dashboard account, once identity lands (Phase 1.4). */
    userId: uuid("user_id"),
    slug: text("slug").notNull(),
    displayName: text("display_name").notNull(),
    role: text("role_title").notNull(),
    bio: text("bio"),
    photoPath: text("photo_path"),
    photoAlt: text("photo_alt"),
    isBookable: boolean("is_bookable").notNull().default(true),
    active: boolean("active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps(),
  },
  (t) => [index("staff_shop_idx").on(t.shopId, t.active)],
);

/** Weekly working pattern per staff member, in shop-local time. */
export const workingHours = pgTable(
  "working_hours",
  {
    id: id(),
    shopId: uuid("shop_id")
      .notNull()
      .references(() => shops.id),
    staffId: uuid("staff_id")
      .notNull()
      .references(() => staff.id, { onDelete: "cascade" }),
    weekday: smallint("weekday").notNull(),
    startLocal: time("start_local").notNull(),
    endLocal: time("end_local").notNull(),
    validFrom: date("valid_from"),
    validTo: date("valid_to"),
    ...timestamps(),
  },
  (t) => [
    index("working_hours_staff_idx").on(t.staffId, t.weekday),
    check("working_hours_weekday_ck", sql`${t.weekday} between 0 and 6`),
    check("working_hours_order_ck", sql`${t.startLocal} < ${t.endLocal}`),
  ],
);

export const exceptionKind = pgEnum("schedule_exception_kind", [
  "closed",
  "time_off",
  "extra_hours",
]);

/** Closures, time off and extra hours. `staff_id` null = applies to the whole location. */
export const scheduleExceptions = pgTable(
  "schedule_exceptions",
  {
    id: id(),
    shopId: uuid("shop_id")
      .notNull()
      .references(() => shops.id),
    locationId: uuid("location_id")
      .notNull()
      .references(() => locations.id),
    staffId: uuid("staff_id").references(() => staff.id, { onDelete: "cascade" }),
    period: tstzrange("period").notNull(),
    kind: exceptionKind("kind").notNull(),
    reason: text("reason"),
    ...timestamps(),
  },
  (t) => [index("schedule_exceptions_period_idx").using("gist", t.period)],
);
