import mongoose from 'mongoose';
import connectDB from '../src/config/db';
import Department from '../src/models/Department';
import Designation from '../src/models/Designation';
import Employee from '../src/models/Employee';
import User from '../src/models/User';

async function main() {
  await connectDB();
  
  const depts = await Department.find({});
  console.log('\n--- DEPARTMENTS ---');
  depts.forEach(d => console.log(`Name: ${d.name}, Code: ${d.code}, ID: ${d._id}, CompanyID: ${d.companyId}`));

  const desigs = await Designation.find({ deletedAt: null });
  console.log('\n--- DESIGNATIONS ---');
  desigs.forEach(d => console.log(`Name: ${d.name}, Code: ${d.designationCode}, ID: ${d._id}, CompanyID: ${d.companyId}`));

  const emps = await Employee.find({});
  console.log('\n--- EMPLOYEES ---');
  emps.forEach(e => console.log(`Name: ${e.firstName} ${e.lastName}, Code: ${e.employeeCode}, Email: ${e.email}, CompanyID: ${e.companyId}`));

  const users = await User.find({});
  console.log('\n--- USERS ---');
  users.forEach((u: any) => console.log(`Name: ${u.firstName} ${u.lastName}, Email: ${u.email}, ID: ${u._id}, CompanyID: ${u.companyId}`));

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
