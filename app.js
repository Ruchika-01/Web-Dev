const form = document.getElementById('medForm');
const reminderList = document.getElementById('reminderList');

const loggedInUser = localStorage.getItem('loggedInUser');
let reminders = JSON.parse(localStorage.getItem(`reminders_${loggedInUser}`) || '[]');

function saveReminders() {
  localStorage.setItem(`reminders_${loggedInUser}`, JSON.stringify(reminders));
}



function renderReminders() {
  reminderList.innerHTML = '';
  reminders.forEach((rem, index) => {
    const li = document.createElement('li');
    li.textContent = `${rem.name} at ${rem.time} every ${rem.frequency} hrs`;
    reminderList.appendChild(li);
  });
}

function notifyMedicine(medName) {
  if (Notification.permission === 'granted') {
    new Notification(`Time to take your medicine: ${medName}`);
  } else {
    alert(`Time to take your medicine: ${medName}`);
  }
}

// Check reminders every minute
function checkReminders() {
  const now = new Date();
  reminders.forEach(rem => {
    const [hour, minute] = rem.time.split(':').map(Number);
    if (now.getHours() === hour && now.getMinutes() === minute) {
      notifyMedicine(rem.name);
    }
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  
  const medName = document.getElementById('medName').value.trim();
  const doseTime = document.getElementById('doseTime').value;
  const frequency = document.getElementById('frequency').value;
  
  reminders.push({ name: medName, time: doseTime, frequency: Number(frequency) });
  saveReminders();
  renderReminders();
  
  form.reset();
});

// Request notification permission on load
if (Notification.permission !== 'granted') {
  Notification.requestPermission();
}

renderReminders();
setInterval(checkReminders, 60000); // check every minute
