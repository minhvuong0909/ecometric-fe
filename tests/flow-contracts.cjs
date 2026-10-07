const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const fe = path.resolve(__dirname, "../src");
const be = path.resolve(__dirname, "../../ecometric-be/src");
function load(file, modules = {}) {
  const exports = {};
  const context = { exports, Date, Number, require(name) { if (name in modules) return modules[name]; throw new Error("Unexpected dependency " + name); } };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, context);
  return exports;
}
const common = load(path.join(be,"shared/types/common.types.ts"));
const zod = require("../../ecometric-be/node_modules/zod");
const schemas = name => load(path.join(be,`modules/${name}/${name}.validator.ts`), { zod, "../../shared/types/common.types": common });
const { buildActivityInput } = load(path.join(fe,"features/app/lib/activity-input.ts"));
const period = { id:"period",status:"OPEN",startDate:"2026-10-01T00:00:00.000Z",endDate:"2026-10-31T23:59:59.000Z" };
const fields = { businessId:"business",period,source:{id:"source"},quantity:"1850",unit:"kWh",startDate:"2026-10-01T00:00:00.000Z",endDate:"2026-10-05T23:59:59.000Z" };
const physical = buildActivityInput(fields);
assert.equal(physical.quantity,1850);
assert.equal(physical.emissionSourceId,"source");
assert.ok(schemas("activity-data").createActivityDataSchema.safeParse(physical).success);
assert.ok(schemas("ai-scan").confirmInvoiceScanSchema.safeParse(physical).success);
for (const patch of [{quantity:"0"},{quantity:"NaN"},{unit:"VND"},{period:{...period,status:"CLOSED"}},{startDate:"2026-09-01T00:00:00Z"},{startDate:"bad"},{endDate:"2026-09-01T00:00:00Z"}]) assert.throws(()=>buildActivityInput({...fields,...patch}));
const requests=[];
const apiClient={post:(url,body)=>{requests.push({url,body});return Promise.resolve({});},get:()=>Promise.resolve({}),patch:()=>Promise.resolve({}),download:()=>Promise.resolve({})};
const modules={"@/shared/lib/api-client":{apiClient}};
async function run() {
  await load(path.join(fe,"features/app/api/recommendations.api.ts"),modules).generateRecommendations({businessId:"business",periodStart:period.startDate,periodEnd:period.endDate});
  assert.ok(schemas("recommendations").generateRecommendationSchema.safeParse(requests.at(-1).body).success);
  for (const format of ["PDF","XLSX","CSV","JSON"]) {
    await load(path.join(fe,"features/app/api/reports.api.ts"),modules).createReport({businessId:"business",reportingPeriodId:"period",title:"Actual report",type:"MONTHLY_EMISSION",format});
    assert.ok(schemas("reports").createReportSchema.safeParse(requests.at(-1).body).success);
  }
  await load(path.join(fe,"features/businesses/api/businesses.api.ts"),modules).subscribeBusiness({name:"Business",planTier:"STARTER"});
  assert.equal(requests.at(-1).url,"/businesses/subscribe");
  console.log("PASS: physical activity validation, scanned confirmation, invalid quantities/units/periods, recommendations and all four report formats match backend contracts.");
}
run().catch(error=>{console.error(error);process.exitCode=1;});
