import { auth } from "../lib/auth.ts";

async function main() {
  await auth.api.signUpEmail({
    body: {
      email: "maya@prose.dev",
      password: "Password123!",
      name: "Maya Ruiz",
    },
  });
  console.log("Admin user created!");
}

main();