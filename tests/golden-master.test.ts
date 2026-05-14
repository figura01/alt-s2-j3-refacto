import fs from "fs";
import path from "path";
import { execSync } from "child_process";

function normalizeOutput(output: string): string {
  return output.replace(/\r\n/g, "\n").trimEnd();
}

function runCommand(command: string): string {
  return execSync(command, {
    encoding: "utf-8",
  });
}

function testGoldenMaster(): void {
  const expectedPath = path.join(
    __dirname,
    "..",
    "legacy",
    "expected",
    "report.txt",
  );

  const legacyOutput = fs.readFileSync(expectedPath, "utf-8");

  const refactoredOutput = runCommand("npx ts-node ./src/main.ts");

  const expected = normalizeOutput(legacyOutput);
  const actual = normalizeOutput(refactoredOutput);

  console.log("Expected Output:");
  console.log(expected);
  console.log("\nActual Output:");
  console.log(actual);

  if (actual !== expected) {
    console.log("❌ Golden Master échoué");
    console.log("Les sorties sont différentes.");
    process.exit(1);
  }

  console.log("✅ Golden Master réussi : sorties strictement identiques");
}

testGoldenMaster();
