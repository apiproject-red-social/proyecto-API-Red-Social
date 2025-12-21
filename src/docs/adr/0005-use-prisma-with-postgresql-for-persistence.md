# 5. Use Prisma with PostgreSQL for persistence
# 5. Use Prisma with PostgreSQL for persistence

Date: 2025-12-21

## Status

2025-12-21 proposed

## Context

The project requires a robust relational database to store entities like users, posts, and comments in a structured and maintainable way. For an academic project (TFG), it is essential to use a stack that balances modern industry standards, high-quality developer experience, and reliable data integrity.

## Decision

Adopt PostgreSQL as the main relational database and Prisma as the ORM (Object-Relational Mapper). We will use Prisma Schema to define the data models and Prisma Migrate to manage database versioning.

## Consequences

- Strong typing and automatic TypeScript type generation based on the database schema.
- Simplified migrations and clear database evolution history.
- Improved developer experience with tools like Prisma Studio.
- Requires an additional build step (`prisma generate`) after schema changes.
- PostgreSQL ensures ACID compliance and is highly compatible with most production environments.
