import { rollback } from "migration";

const count = Number(process.argv[2]) || 1;

rollback(count).then(() => {
  console.log(`Rolled back ${count} ${count == 1 ? "migration" : "migrations"}!`);
  process.exit(0);
}).catch((err) => {
  console.error("Rollback failed:", err);
  process.exit(1);
});
