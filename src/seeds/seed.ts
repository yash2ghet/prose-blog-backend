import { db } from "../config/db.ts";
import { blogCategoriesTable } from "../db/schema/index.ts";
import { auth } from "../lib/auth.ts"; 

async function main() {
  console.log("🌱 Seeding database...");

  let adminId = "admin-123";

  try {
    const res = await auth.api.signUpEmail({
      body: {
        email: "maya@prose.dev", 
        password: "Password123!",  
        name: "Maya Ruiz",
      },
    });

    if (res?.user?.id) {
      adminId = res.user.id;
    }
    console.log("✅ Admin user created with hashed credentials");
  } catch (err: any) {
    console.log("ℹ️ Admin user already exists or seeding skipped:", err.message);
  }

  await db
    .insert(blogCategoriesTable)
    .values([
      { name: "Technology", slug: "technology", createdBy: adminId },
      { name: "Design", slug: "design", createdBy: adminId },
      { name: "Tutorials", slug: "tutorials", createdBy: adminId },
    ])
    .onConflictDoNothing();

  console.log("✅ Default categories created");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});