-- DropForeignKey
ALTER TABLE "todolists" DROP CONSTRAINT "todolists_label_id_fkey";

-- AlterTable
ALTER TABLE "todolists" ALTER COLUMN "label_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "todolists" ADD CONSTRAINT "todolists_label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "labels"("id") ON DELETE SET NULL ON UPDATE CASCADE;
