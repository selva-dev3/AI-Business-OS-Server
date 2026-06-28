import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import connectDB from '../src/config/db';
import User from '../src/models/User';
import Employee from '../src/models/Employee';
import env from '../src/config/env';

async function main() {
  await connectDB();

  // Find user selvakumar152000@gmail.com
  const user = await User.findOne({ email: 'selvakumar152000@gmail.com' });
  if (!user) {
    console.error('User selvakumar152000@gmail.com not found. Cannot generate token.');
    await mongoose.disconnect();
    process.exit(1);
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      userId: String(user._id),
      companyId: String(user.companyId),
      roleId: String(user.roleId),
    },
    env.jwt.secret,
    { expiresIn: '1h' }
  );

  console.log('Generated Token successfully.');

  // Create temporary CSV content with 10 valid records
  const csvContent = [
    'Employee Code,First Name,Last Name,Email,Designation,Employment Type,Phone,Department,Manager,Date of Joining',
    'EMP-1001,John,Doe,john.doe@example.com,Software Developer,Full-Time,1234567890,Engineering,,2026-06-01',
    'EMP-1002,Jane,Smith,jane.smith@example.com,Senior Software Developer,Part-Time,0987654321,Engineering,,2026-06-02',
    'EMP-1003,Bob,Johnson,bob.johnson@example.com,Software Developer,Contract,1112223333,,,',
    'EMP-1004,Alice,Williams,alice.williams@example.com,Software Developer,Full-Time,,Engineering,,',
    'EMP-1005,Charlie,Brown,charlie.brown@example.com,Senior Software Developer,Full-Time,,,',
    'EMP-1006,David,Jones,david.jones@example.com,Software Developer,Full-Time,,,,,',
    'EMP-1007,Emma,Miller,emma.miller@example.com,Senior Software Developer,Full-Time,,,',
    'EMP-1008,Frank,Davis,frank.davis@example.com,Software Developer,Full-Time,,,',
    'EMP-1009,Grace,Garcia,grace.garcia@example.com,Software Developer,Full-Time,,,',
    'EMP-1010,Henry,Rodriguez,henry.rodriguez@example.com,Software Developer,Full-Time,,,'
  ].join('\n');

  const csvPath = path.join(__dirname, 'temp_employees.csv');
  fs.writeFileSync(csvPath, csvContent);
  console.log(`Temporary CSV file created at: ${csvPath}`);

  // We will perform the HTTP request to the local server
  // Wait, let's use Form-Data payload manually or via dynamic import if form-data exists,
  // or construct a simple boundary string multipart request manually to avoid dependencies!
  // Multipart parser format:
  // --boundary
  // Content-Disposition: form-data; name="file"; filename="temp_employees.csv"
  // Content-Type: text/csv
  //
  // <content>
  // --boundary--
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  const headerPart = [
    `--${boundary}`,
    `Content-Disposition: form-data; name="file"; filename="temp_employees.csv"`,
    `Content-Type: text/csv`,
    '',
    ''
  ].join('\r\n');
  const footerPart = `\r\n--${boundary}--\r\n`;

  const payload = Buffer.concat([
    Buffer.from(headerPart, 'utf8'),
    Buffer.from(csvContent, 'utf8'),
    Buffer.from(footerPart, 'utf8')
  ]);

  console.log('Sending bulk import request...');
  const response = await fetch(`http://localhost:${env.port}/api/v1/hrms/employees/bulk-import`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': String(payload.length)
    },
    body: payload
  });

  const status = response.status;
  const jsonResponse = await response.json().catch(() => null);

  console.log(`Response Status: ${status}`);
  console.log('Response JSON:', JSON.stringify(jsonResponse, null, 2));

  // Clean up temp file
  try {
    fs.unlinkSync(csvPath);
  } catch (_) { }

  // Verify in MongoDB that employees were created
  const companyId = user.companyId;
  const count = await Employee.countDocuments({ companyId, employeeCode: { $in: ['EMP-1001', 'EMP-1002', 'EMP-1003', 'EMP-1004', 'EMP-1005', 'EMP-1006', 'EMP-1007', 'EMP-1008', 'EMP-1009', 'EMP-1010'] } });
  console.log(`Verification: Found ${count}/10 bulk-imported employees in database.`);

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
