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

// =====================================================
// Form Submission — Add or Update
// =====================================================
form.addEventListener('submit', function (e) {
  e.preventDefault();

  // Clear previous errors
  clearErrors();

  const name    = nameInput.value.trim();
  const id      = idInput.value.trim();
  const email   = emailInput.value.trim();
  const contact = contactInput.value.trim();

  // Validate all fields; stop if any fail
  if (!validateAll(name, id, email, contact)) return;

  const index = parseInt(editIndexInput.value);

  if (index === -1) {
    // Add new record
    students.push({ name, id, email, contact });
  } else {
    // Update existing record
    students[index] = { name, id, email, contact };
    // Reset edit state
    editIndexInput.value = '-1';
    submitBtn.textContent = 'Add Student';
  }

  saveToStorage();
  renderTable();
  form.reset();
});

// =====================================================
// Validation Logic
// Returns true if all fields are valid, false otherwise
// =====================================================
function validateAll(name, id, email, contact) {
  let valid = true;

  // Student name: letters and spaces only, must not be empty
  if (!name) {
    showError(nameInput, nameError, 'Name is required.');
    valid = false;
  } else if (!/^[A-Za-z\s]+$/.test(name)) {
    showError(nameInput, nameError, 'Name must contain letters only.');
    valid = false;
  }

  // Student ID: numbers only, must not be empty
  if (!id) {
    showError(idInput, idError, 'Student ID is required.');
    valid = false;
  } else if (!/^\d+$/.test(id)) {
    showError(idInput, idError, 'Student ID must contain numbers only.');
    valid = false;
  }

  // Email: must match standard email pattern
  if (!email) {
    showError(emailInput, emailError, 'Email is required.');
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError(emailInput, emailError, 'Enter a valid email address.');
    valid = false;
  }

  // Contact: numbers only, minimum 10 digits
  if (!contact) {
    showError(contactInput, contactError, 'Contact number is required.');
    valid = false;
  } else if (!/^\d+$/.test(contact)) {
    showError(contactInput, contactError, 'Contact must contain numbers only.');
    valid = false;
  } else if (contact.length < 10) {
    showError(contactInput, contactError, 'Contact must be at least 10 digits.');
    valid = false;
  }

  return valid;
}

// Show an error message and mark the input as invalid
function showError(inputEl, errorEl, message) {
  errorEl.textContent = message;
  inputEl.classList.add('invalid');
}

// Clear all error messages and invalid styles
function clearErrors() {
  [nameInput, idInput, emailInput, contactInput].forEach(el => el.classList.remove('invalid'));
  [nameError, idError, emailError, contactError].forEach(el => el.textContent = '');
}

// =====================================================
// Render Table
// Builds table rows from the students array
// =====================================================
function renderTable() {
  tableBody.innerHTML = '';

  if (students.length === 0) {
    // Show empty state message; hide the table head visually
    emptyMessage.style.display = 'block';
    document.getElementById('studentTable').style.display = 'none';
  } else {
    emptyMessage.style.display = 'none';
    document.getElementById('studentTable').style.display = 'table';

    students.forEach(function (student, index) {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${escapeHTML(student.name)}</td>
        <td>${escapeHTML(student.id)}</td>
        <td>${escapeHTML(student.email)}</td>
        <td>${escapeHTML(student.contact)}</td>
        <td>
          <div class="action-cell">
            <button class="btn btn-edit"   onclick="editStudent(${index})">Edit</button>
            <button class="btn btn-delete" onclick="deleteStudent(${index})">Delete</button>
          </div>
        </td>
      `;

      tableBody.appendChild(row);
    });
  }

  // Dynamically manage the vertical scrollbar (Task 6 requirement)
  updateScrollbar();
}

// =====================================================
// Dynamic Scrollbar — added via JavaScript
// Applies overflow-y: scroll only when content overflows
// =====================================================
function updateScrollbar() {
  // Max height is defined in CSS (420px desktop / 300px mobile)
  const maxHeight = parseInt(getComputedStyle(tableWrapper).maxHeight) || 420;

  if (tableWrapper.scrollHeight > maxHeight) {
    // Content overflows — enable vertical scrollbar
    tableWrapper.style.overflowY = 'scroll';
  } else {
    // No overflow — remove scrollbar to avoid empty gutter
    tableWrapper.style.overflowY = 'hidden';
  }
}

// =====================================================
// Edit Student
// Populates the form with the selected student's data
// =====================================================
function editStudent(index) {
  const student = students[index];

  nameInput.value    = student.name;
  idInput.value      = student.id;
  emailInput.value   = student.email;
  contactInput.value = student.contact;

  // Store which record we're editing
  editIndexInput.value    = index;
  submitBtn.textContent   = 'Update Student';

  // Scroll to form on mobile so the user can see it
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });

  clearErrors();
}

// =====================================================
// Delete Student
// Removes the record at the given index
// =====================================================
function deleteStudent(index) {
  // If we were editing this record, reset the form
  if (parseInt(editIndexInput.value) === index) {
    form.reset();
    editIndexInput.value  = '-1';
    submitBtn.textContent = 'Add Student';
    clearErrors();
  }

  students.splice(index, 1);
  saveToStorage();
  renderTable();
}
