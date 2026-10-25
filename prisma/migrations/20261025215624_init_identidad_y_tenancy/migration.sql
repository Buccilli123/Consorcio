-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('ADMIN', 'OWNER', 'TENANT', 'STAFF');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "revokedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consortium" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Consortium_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" UUID NOT NULL,
    "consortiumId" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "floor" TEXT,
    "coefficient" DECIMAL(7,4) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "consortiumId" UUID NOT NULL,
    "role" "MembershipRole" NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitAssignment" (
    "consortiumId" UUID NOT NULL,
    "unitId" UUID NOT NULL,
    "membershipId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UnitAssignment_pkey" PRIMARY KEY ("unitId","membershipId")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" UUID NOT NULL,
    "consortiumId" UUID,
    "actorUserId" UUID,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_consortiumId_code_key" ON "Unit"("consortiumId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_consortiumId_id_key" ON "Unit"("consortiumId", "id");

-- CreateIndex
CREATE INDEX "Membership_consortiumId_idx" ON "Membership"("consortiumId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_consortiumId_role_key" ON "Membership"("userId", "consortiumId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_consortiumId_id_key" ON "Membership"("consortiumId", "id");

-- CreateIndex
CREATE INDEX "UnitAssignment_consortiumId_membershipId_idx" ON "UnitAssignment"("consortiumId", "membershipId");

-- CreateIndex
CREATE INDEX "AuditEvent_consortiumId_createdAt_idx" ON "AuditEvent"("consortiumId", "createdAt");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_consortiumId_fkey" FOREIGN KEY ("consortiumId") REFERENCES "Consortium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_consortiumId_fkey" FOREIGN KEY ("consortiumId") REFERENCES "Consortium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitAssignment" ADD CONSTRAINT "UnitAssignment_consortiumId_fkey" FOREIGN KEY ("consortiumId") REFERENCES "Consortium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitAssignment" ADD CONSTRAINT "UnitAssignment_consortiumId_unitId_fkey" FOREIGN KEY ("consortiumId", "unitId") REFERENCES "Unit"("consortiumId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitAssignment" ADD CONSTRAINT "UnitAssignment_consortiumId_membershipId_fkey" FOREIGN KEY ("consortiumId", "membershipId") REFERENCES "Membership"("consortiumId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_consortiumId_fkey" FOREIGN KEY ("consortiumId") REFERENCES "Consortium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ---------------------------------------------------------------------------
-- Reglas agregadas a mano: Prisma no puede expresarlas en el esquema.
-- ---------------------------------------------------------------------------

-- Los emails se guardan normalizados en minúsculas para que el índice único
-- no admita duplicados que solo difieran en mayúsculas.
ALTER TABLE "User" ADD CONSTRAINT "User_email_lowercase_check" CHECK ("email" = lower("email"));

ALTER TABLE "Consortium" ADD CONSTRAINT "Consortium_name_not_blank_check" CHECK (btrim("name") <> '');

ALTER TABLE "Unit" ADD CONSTRAINT "Unit_code_not_blank_check" CHECK (btrim("code") <> '');
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_coefficient_range_check" CHECK ("coefficient" > 0 AND "coefficient" <= 100);

-- La auditoría es de solo inserción: se rechaza cualquier UPDATE o DELETE.
CREATE FUNCTION "audit_event_immutable"() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'AuditEvent es de solo inserción: % no está permitido', TG_OP;
END;
$$;

CREATE TRIGGER "AuditEvent_immutable"
  BEFORE UPDATE OR DELETE ON "AuditEvent"
  FOR EACH ROW EXECUTE FUNCTION "audit_event_immutable"();
