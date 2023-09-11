-- DropForeignKey
ALTER TABLE "ProjectItem" DROP CONSTRAINT "ProjectItem_project_id_fkey";

-- AddForeignKey
ALTER TABLE "ProjectItem" ADD CONSTRAINT "ProjectItem_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
