import { customType, timestamp, uuid } from "drizzle-orm/pg-core";

/** Postgres `tstzrange`, exchanged as its canonical text form, e.g. `["2026-01-01 10:00+00","2026-01-01 11:00+00")`. */
export const tstzrange = customType<{ data: string; driverData: string }>({
  dataType: () => "tstzrange",
});

export const id = () => uuid("id").primaryKey().defaultRandom();

export const timestamps = () => ({
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
