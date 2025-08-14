import {
  boolean,
  integer,
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
} from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  price: integer('price').notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
