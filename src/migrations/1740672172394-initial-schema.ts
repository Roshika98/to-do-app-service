import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1740672172394 implements MigrationInterface {
    name = 'InitialSchema1740672172394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE TABLE "task" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "status" varchar CHECK( "status" IN ('PENDING','DONE') ) NOT NULL DEFAULT ('PENDING'), "dueDate" datetime NOT NULL, "createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "userId" varchar)`);
        await queryRunner.query(`CREATE INDEX "IDX_fb213f79ee45060ba925ecd576" ON "task" ("id") `);
        await queryRunner.query(`DROP INDEX "IDX_fb213f79ee45060ba925ecd576"`);
        await queryRunner.query(`CREATE TABLE "temporary_task" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "status" varchar CHECK( "status" IN ('PENDING','DONE') ) NOT NULL DEFAULT ('PENDING'), "dueDate" datetime NOT NULL, "createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "userId" varchar, CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_task"("id", "title", "description", "status", "dueDate", "createdAt", "updatedAt", "userId") SELECT "id", "title", "description", "status", "dueDate", "createdAt", "updatedAt", "userId" FROM "task"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`ALTER TABLE "temporary_task" RENAME TO "task"`);
        await queryRunner.query(`CREATE INDEX "IDX_fb213f79ee45060ba925ecd576" ON "task" ("id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_fb213f79ee45060ba925ecd576"`);
        await queryRunner.query(`ALTER TABLE "task" RENAME TO "temporary_task"`);
        await queryRunner.query(`CREATE TABLE "task" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "status" varchar CHECK( "status" IN ('PENDING','DONE') ) NOT NULL DEFAULT ('PENDING'), "dueDate" datetime NOT NULL, "createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "userId" varchar)`);
        await queryRunner.query(`INSERT INTO "task"("id", "title", "description", "status", "dueDate", "createdAt", "updatedAt", "userId") SELECT "id", "title", "description", "status", "dueDate", "createdAt", "updatedAt", "userId" FROM "temporary_task"`);
        await queryRunner.query(`DROP TABLE "temporary_task"`);
        await queryRunner.query(`CREATE INDEX "IDX_fb213f79ee45060ba925ecd576" ON "task" ("id") `);
        await queryRunner.query(`DROP INDEX "IDX_fb213f79ee45060ba925ecd576"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
