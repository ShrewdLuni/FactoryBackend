import { rollback } from "migration";

const count = Number(process.argv[2]) || 1;

rollback(count).then(() => {
  console.log(`Rolled back ${count} ${count == 1 ? "migration" : "migrations"}!`);
  process.exit(0);
}).catch((err) => {
  console.error("Rollback failed:", err);
  process.exit(1);
});

// npm run rollback     ; Rollback 1 last migration
// npm run rollback -- 3; Rollback 3 last migrations
// npm run rollback -- 5; Rollback 5 last migrations
// npm run rollback -- n; Rollback n last migrations
