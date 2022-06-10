CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW() 
);

CREATE TABLE "links" (
    "id" SERIAL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "shortUrl" TEXT UNIQUE NOT NULL,
    "userId" INTEGER NOT NULL REFERENCES "users"(id),
    "visits" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "tokens" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "userId" INTEGER NOT NULL REFERENCES "users"(id),
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);