// Test file to demonstrate the overdue repayment and SMS functionality
// This would normally be part of your test suite

// Sample data showing how the overdue logic works:

const today = new Date('2025-08-25'); // Current date
const overdueRepayment = {
  id: 1,
  dueDate: new Date('2025-08-20'), // 5 days overdue
  amountDue: 1500,
  amountPaid: null,
  paymentDate: null,
  status: 'PENDING',
  loan: {
    borrower: {
      name: 'John Doe',
      contactInfo: '+639123456789'
    }
  }
};

const pendingRepayment = {
  id: 2,
  dueDate: new Date('2025-08-30'), // Future date
  amountDue: 1500,
  amountPaid: null,
  paymentDate: null,
  status: 'PENDING',
  loan: {
    borrower: {
      name: 'Jane Smith',
      contactInfo: '+639987654321'
    }
  }
};

// Function to calculate status (from repayments page)
const calculatePaymentStatus = (dueDate: Date, paymentDate?: Date): 'PENDING' | 'PAID' | 'OVERDUE' => {
  if (paymentDate) {
    return 'PAID';
  }
  
  const now = new Date();
  const dueDateObj = new Date(dueDate);
  
  if (dueDateObj < now) {
    return 'OVERDUE';
  }
  
  return 'PENDING';
};

// Test the logic
console.log('Test Results:');
console.log('=============');
console.log(`Overdue repayment status: ${calculatePaymentStatus(overdueRepayment.dueDate, overdueRepayment.paymentDate || undefined)}`);
console.log(`Pending repayment status: ${calculatePaymentStatus(pendingRepayment.dueDate, pendingRepayment.paymentDate || undefined)}`);

// Expected SMS message format
const smsMessage = `
Dear ${overdueRepayment.loan.borrower.name},

This is a reminder that your loan repayment of ₱${overdueRepayment.amountDue.toLocaleString()} was due on ${overdueRepayment.dueDate.toLocaleDateString()}.

Please contact us to arrange payment.

Thank you,
MFK LMS
`.trim();

console.log('\nSample SMS Message:');
console.log('==================');
console.log(smsMessage);

export {};
