const studentSelect = document.getElementById('student');
const attendanceList = document.getElementById('attendance-list');
let students = [];


document.getElementById('add-student-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const studentName = document.getElementById('student-name').value.trim();

  if (studentName) {  
    const studentId = `student-${Date.now()}`;
    students.push({ id: studentId, name: studentName });

    
    const option = document.createElement('option');
    option.value = studentId;
    option.textContent = studentName;
    studentSelect.appendChild(option);

    alert(`Student ${studentName} added!`);
    document.getElementById('add-student-form').reset();
  }
});


document.getElementById('attendance-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const data = {
    date: document.getElementById('date').value,
    studentId: studentSelect.value,
    studentName: students.find(s => s.id === studentSelect.value)?.name || 'Unknown',
    subject: document.getElementById('subject').value,
    status: document.getElementById('status').value,
  };

  const attendanceRecords = JSON.parse(localStorage.getItem('attendance')) || [];
  attendanceRecords.push(data);
  localStorage.setItem('attendance', JSON.stringify(attendanceRecords));

  alert('Attendance marked!');
});

document.getElementById('view-attendance').addEventListener('click', () => {
  const studentId = studentSelect.value;
  attendanceList.innerHTML = '';

  const attendanceRecords = JSON.parse(localStorage.getItem('attendance')) || [];
  const studentRecords = attendanceRecords.filter(record => record.studentId === studentId);

  if (studentRecords.length === 0) {
    attendanceList.innerHTML = '<li>No attendance records found for this student.</li>';
    return;
  }

  studentRecords.forEach(record => {
    const li = document.createElement('li');
    li.textContent = `Date: ${record.date}, Subject: ${record.subject}, Status: ${record.status}`;
    attendanceList.appendChild(li);
  });
});

document.getElementById('view-attendance-percentage').addEventListener('click', () => {
  const studentId = studentSelect.value;
  const attendanceRecords = JSON.parse(localStorage.getItem('attendance')) || [];

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const studentRecords = attendanceRecords.filter(record => {
    const recordDate = new Date(record.date);
    return (
      record.studentId === studentId &&
      recordDate.getMonth() === currentMonth &&
      recordDate.getFullYear() === currentYear
    );
  });

  const totalClasses = studentRecords.length;
  const presentCount = studentRecords.filter(record => record.status === 'present').length;
  const attendancePercentage = totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(2) : 0;

  alert(
    `Attendance for this month: ${attendancePercentage}% (${presentCount}/${totalClasses} classes attended)`
  );
});

function initializePage() {
  students.forEach(student => {
    const option = document.createElement('option');
    option.value = student.id;
    option.textContent = student.name;
    studentSelect.appendChild(option);
  });
}

initializePage();
