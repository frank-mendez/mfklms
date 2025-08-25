import { calculateRepaymentSchedule, validateRepaymentParams } from './repayment-calculator';

// Test the repayment calculator with your example scenario
function testRepaymentCalculator() {
  console.log('=== Testing Repayment Calculator ===\n');
  
  // Your example: Start Date 23/08/2025, Expected Return Date 23/12/2025
  const principal = 10000; // ₱10,000
  const interestRate = 20; // 20% annual interest
  const startDate = new Date('2025-08-23');
  const maturityDate = new Date('2025-12-23');
  
  console.log('Loan Details:');
  console.log(`Principal: ₱${principal.toLocaleString()}`);
  console.log(`Interest Rate: ${interestRate}%`);
  console.log(`Start Date: ${startDate.toISOString().split('T')[0]}`);
  console.log(`Maturity Date: ${maturityDate.toISOString().split('T')[0]}`);
  console.log('');
  
  // Validate parameters
  const validationError = validateRepaymentParams(principal, interestRate, startDate, maturityDate);
  if (validationError) {
    console.error('Validation Error:', validationError);
    return;
  }
  
  // Calculate repayment schedule
  const schedule = calculateRepaymentSchedule(principal, interestRate, startDate, maturityDate);
  
  console.log('Repayment Schedule:');
  console.log('===================');
  
  let totalPayments = 0;
  schedule.forEach((payment, index) => {
    const paymentNum = index + 1;
    const dueDate = payment.dueDate.toISOString().split('T')[0];
    const amount = payment.amountDue;
    const type = payment.isLastPayment ? '(Principal + Final Interest)' : '(Monthly Interest)';
    
    console.log(`Payment ${paymentNum}: ${dueDate} - ₱${amount.toFixed(2)} ${type}`);
    totalPayments += amount;
  });
  
  console.log('');
  console.log('Summary:');
  console.log(`Total Payments: ₱${totalPayments.toFixed(2)}`);
  console.log(`Total Interest: ₱${(totalPayments - principal).toFixed(2)}`);
  console.log(`Number of Payments: ${schedule.length}`);
  
  return schedule;
}

// Run the test
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testRepaymentCalculator };
} else {
  testRepaymentCalculator();
}
