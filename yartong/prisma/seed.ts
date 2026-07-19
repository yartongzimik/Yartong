const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  throw new Error("Demo seed users are disabled in production.");
}

const demoUsers = [
  {
    email: "senapati@yartong.local",
    name: "Senapati Demo Admin",
    primaryRole: "ADMIN",
    accountStatus: "ACTIVE",
  },
] as const;

console.info("Development seed users:", demoUsers.map((user) => user.email).join(", "));
console.info("Senapati is seeded initial data only, not a permanent platform restriction.");
