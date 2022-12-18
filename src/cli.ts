import { Command } from "commander";

import { sum } from "./index";

const program = new Command();

program
  .name(process.env.ROLLUP_PKG_NAME || "")
  .description(process.env.ROLLUP_PKG_DESC || "")
  .argument("<a>", "first addend")
  .argument("<b>", "second addend");

program.parse();

console.log(
  `${program.args[0]} + ${program.args[1]} = ${sum(
    Number(program.args[0]),
    Number(program.args[1])
  )}`
);
