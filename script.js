// =====================================================
// Student Registration System – script.js
// Task 6: JavaScript Functionality
// =====================================================

// ---- DOM References ----
const form           = document.getElementById('registrationForm');
const submitBtn      = document.getElementById('submitBtn');
const editIndexInput = document.getElementById('editIndex');
const tableBody      = document.getElementById('studentTableBody');
const tableWrapper   = document.getElementById('tableWrapper');
const emptyMessage   = document.getElementById('emptyMessage');

// Input fields
const nameInput    = document.getElementById('studentName');
const idInput      = document.getElementById('studentId');
const emailInput   = document.getElementById('emailId');
const contactInput = document.getElementById('contactNumber');

// Error message spans
const nameError    = document.getElementById('nameError');
const idError      = document.getElementById('idError');
const emailError   = document.getElementById('emailError');
const contactError = document.getElementById('contactError');

// ---- LocalStorage key ----
const STORAGE_KEY = 'studentRecords';

// ---- Load students from localStorage on page load ----
let students = loadFromStorage();
renderTable();