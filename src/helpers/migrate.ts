import { migrate } from "migration"

migrate().then(() => {
  console.log(`Migration finished`);
  process.exit(0);
}).catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
