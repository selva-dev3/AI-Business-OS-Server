import mongoose from 'mongoose';
import connectDB from '../src/config/db';
import * as hrmsService from '../src/services/hrms.service';
import Employee from '../src/models/Employee';

async function main() {
  await connectDB();
  
  // Find a valid employee to get their company ID
  const emp = await Employee.findOne({});
  if (!emp) {
    console.log("No employees found in DB!");
    await mongoose.disconnect();
    return;
  }

  const companyId = emp.companyId.toString();
  console.log(`Testing listEmployees for Company ID: ${companyId}`);

  const result = await hrmsService.listEmployees(companyId, {});
  console.log("\n--- AGGREGATED SUMMARY ---");
  console.log(JSON.stringify(result.summary, null, 2));

  console.log("\n--- TOTAL EMPLOYEES COUNT ---");
  console.log(`Employees array length: ${result.employees.length}`);

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
