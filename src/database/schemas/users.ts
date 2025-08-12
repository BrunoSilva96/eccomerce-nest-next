import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
