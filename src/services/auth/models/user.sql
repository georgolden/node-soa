-- PGPASSWORD=postgres psql -h 127.0.0.1 -p 5432 -U postgres -d nodesoa -f ./src/services/auth/user.sql  
drop table "User";

create table "User" (
  id bigint generated always as identity,
  name varchar(255) NOT NULL,
  password varchar NOT NULL,
  "birthDate" date NOT NULL,
  age int NOT NULL,
  email varchar(255) NOT NULL unique,
  "phoneCode" varchar(8) NOT NULL,
  "phoneNumber" varchar(255) NOT NULL,
  country varchar NOT NULL
);

ALTER TABLE "User" ADD CONSTRAINT "pkUser" PRIMARY KEY ("id");
