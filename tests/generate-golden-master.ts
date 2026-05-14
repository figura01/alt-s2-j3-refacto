import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const output = execSync("npm run legacy", {
  encoding: "utf-8",
});

const expectedDir = path.join(__dirname, "..", "legacy", "expected");

if (!fs.existsSync(expectedDir)) {
  fs.mkdirSync(expectedDir, { recursive: true });
}

fs.writeFileSync(path.join(expectedDir, "report.txt"), output, "utf-8");

console.log("✅ Golden Master généré : legacy/expected/report.txt");
