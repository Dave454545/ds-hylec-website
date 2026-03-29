/*
  Warnings:

  - You are about to drop the `Reservation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vehicule` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Carburant" AS ENUM ('ESSENCE', 'DIESEL', 'HYBRIDE', 'ELECTRIQUE');

-- CreateEnum
CREATE TYPE "Service" AS ENUM ('DECALAMINAGE_MOTEUR', 'DIAGNOSTIC_AUTO', 'EFFACEMENT_DEFAUT', 'DIAGNOSTIC_HYBRIDE');

-- CreateEnum
CREATE TYPE "StatutReservation" AS ENUM ('EN_ATTENTE', 'CONFIRMEE', 'EN_COURS', 'TERMINEE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "MoyenPaiement" AS ENUM ('EN_LIGNE', 'SUR_PLACE');

-- CreateEnum
CREATE TYPE "StatutParrainage" AS ENUM ('ACTIF', 'UTILISE', 'EXPIRE');

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_userId_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_vehiculeId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicule" DROP CONSTRAINT "Vehicule_userId_fkey";

-- DropTable
DROP TABLE "Reservation";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "Vehicule";

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "telephone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMaj" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicules" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "marque" TEXT NOT NULL,
    "modele" TEXT NOT NULL,
    "annee" INTEGER NOT NULL,
    "carburant" "Carburant" NOT NULL,
    "immatriculation" TEXT,
    "dateProchainCT" TIMESTAMP(3),
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMaj" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "vehiculeId" TEXT,
    "service" "Service" NOT NULL,
    "dateIntervention" TIMESTAMP(3) NOT NULL,
    "adresse" TEXT NOT NULL,
    "statut" "StatutReservation" NOT NULL DEFAULT 'EN_ATTENTE',
    "moyenPaiement" "MoyenPaiement" NOT NULL,
    "montantTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMaj" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "factures" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "urlPdf" TEXT,
    "montant" DOUBLE PRECISION NOT NULL,
    "dateEmission" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "factures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parrainages" (
    "id" TEXT NOT NULL,
    "parrainId" TEXT NOT NULL,
    "filleulEmail" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "creditParrain" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "remiseFilleul" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "statut" "StatutParrainage" NOT NULL DEFAULT 'ACTIF',
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parrainages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vehicules_immatriculation_key" ON "vehicules"("immatriculation");

-- CreateIndex
CREATE UNIQUE INDEX "factures_reservationId_key" ON "factures"("reservationId");

-- CreateIndex
CREATE UNIQUE INDEX "parrainages_code_key" ON "parrainages"("code");

-- AddForeignKey
ALTER TABLE "vehicules" ADD CONSTRAINT "vehicules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_vehiculeId_fkey" FOREIGN KEY ("vehiculeId") REFERENCES "vehicules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factures" ADD CONSTRAINT "factures_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parrainages" ADD CONSTRAINT "parrainages_parrainId_fkey" FOREIGN KEY ("parrainId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
