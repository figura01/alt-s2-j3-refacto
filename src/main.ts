import path from "path";
import { fileURLToPath } from "url";

import { loadInputData } from "./utils/loadInputData";
import { calculateCustomerReports } from "./services/orderCalculator";
import { formatReport } from "./reports/formatReport";
import { exportJson } from "./utils/exportJson";

export function run(): string {
  const basePath = __dirname;

  const data = loadInputData(__dirname);
  // console.log("data: ", data);

  const report = calculateCustomerReports(data);
  // console.log("report: ", report);

  const textOutput = formatReport(report);
  // console.log("textOutput: ", textOutput);

  exportJson(basePath, report.reports);

  // console.log(textOutput);

  return textOutput; //;
}

run();
