/*
  Warnings:

  - You are about to drop the column `patientId` on the `Report` table. All the data in the column will be lost.
  - Added the required column `doctorId` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `ReportAssets` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Report` DROP FOREIGN KEY `Report_patientId_fkey`;

-- DropIndex
DROP INDEX `Report_patientId_fkey` ON `Report`;

-- AlterTable
ALTER TABLE `Report` DROP COLUMN `patientId`,
    ADD COLUMN `doctorId` VARCHAR(191) NOT NULL,
    ADD COLUMN `paymentStatus` ENUM('PENDING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `status` ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    MODIFY `description` VARCHAR(10000) NOT NULL;

-- AlterTable
ALTER TABLE `ReportAssets` ADD COLUMN `mimeType` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `phone` VARCHAR(191) NULL DEFAULT 'null',
    ADD COLUMN `role` ENUM('DOCTOR', 'PATIENT', 'ADMIN', 'USER') NOT NULL DEFAULT 'DOCTOR',
    ADD COLUMN `status` ENUM('PAID', 'UNPAID') NOT NULL DEFAULT 'UNPAID';

-- CreateTable
CREATE TABLE `consultation` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `note` LONGTEXT NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `bookingUrl` VARCHAR(191) NOT NULL,
    `doctorId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Integration` (
    `id` VARCHAR(191) NOT NULL,
    `platform` VARCHAR(191) NOT NULL,
    `platformURL` VARCHAR(191) NULL,
    `access_token` VARCHAR(1000) NULL,
    `refresh_token` VARCHAR(1000) NULL,
    `publicKey` VARCHAR(1000) NULL,
    `secretKey` VARCHAR(1000) NULL,
    `stripeAmount` INTEGER NULL,
    `stripeAmountReport` INTEGER NULL,
    `expires_in` INTEGER NULL,
    `meta_data` JSON NULL,
    `orgUri` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment` (
    `id` VARCHAR(191) NOT NULL,
    `reportId` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `paymentStatus` VARCHAR(191) NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `doctorId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Integration` ADD CONSTRAINT `Integration_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
