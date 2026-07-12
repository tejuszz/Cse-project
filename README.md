# 🏫 NIT Delhi Smart Campus Portal

A modern, interactive web-based campus management system designed for NIT Delhi. This portal provides students and professors with centralized access to academic resources, schedules, attendance records, and campus information.

**Live Demo:** [https://tejuszz.github.io/Cse-project/](https://tejuszz.github.io/Cse-project/)

---


## ✨ Features

### 👨‍🎓 Student Portal
- **Dashboard**: Personalized academic overview with welcome greeting
- **Attendance Tracking**: View attendance percentage for all subjects
- **Timetable**: Access class schedule and timings
- **Event Calendar**: Vanilla calendar widget for campus events
- **Study Materials**: Download course materials and resources
- **Campus Map**: Interactive map for campus navigation
- **Statistics**: View class rank, overall performance, and class average

### 👨‍🏫 Professor Portal
- **Dashboard**: Teaching overview with assigned classes
- **Attendance Management**: Track and manage student attendance
- **Material Upload**: Upload and manage study materials
- **Class Schedule**: View professor timetable
- **Campus Map**: Access campus navigation
- **Next Class Alert**: Automatic display of upcoming class with location

### 🔐 Authentication System
- Role-based login (Student/Professor)
- Secure credential validation
- Session management with localStorage
- Auto-logout functionality

### 🎨 General Features
- Responsive design for mobile, tablet, and desktop
- Modern UI with smooth transitions and animations
- Font Awesome icons for intuitive navigation
- Dark-themed dashboard interface
- Fast page load with optimized assets

---

## 📁 Project Structure

```
Cse-project/
├── index.html                    # Landing page with role selection
├── student.html                  # Student dashboard
├── professor.html                # Professor dashboard
├── attendance.html               # Attendance tracking page
├── timetable.html                # Timetable view
├── study-material.html           # Study materials page
├── professor-materials.html      # Professor upload page
├── professor-timetable.html      # Professor schedule page
├── map.html                      # Campus map
│
├── css/                          # Stylesheets directory
│   └── style.css                 # Main stylesheet (19.2%)
│
├── js/                           # JavaScript files directory
│   ├── auth.js                   # Authentication & login logic
│   └── attendance.js             # Attendance calculations
│
├── images/                       # Image assets
│   └── nit-logo.png              # NIT Delhi logo
│
├── icons/                        # Icon assets
│
├── vanilla-calendar/             # Event calendar library
│   └── event calendar.html       # Calendar implementation
│
├── backend/                      # Backend files (placeholder)
│
├── .vscode/                      # VS Code configuration
│
└── README.md                     # This file
```

---

## 🛠 Technologies Used

| Technology | Usage | Percentage |
|-----------|-------|-----------|
| **JavaScript** | Dynamic interactions, form validation, data management | 55.6% |
| **HTML** | Page structure and semantic markup | 25.2% |
| **CSS** | Styling, responsive design, animations | 19.2% |
| **Font Awesome** | Icons and visual elements | CDN |
| **Vanilla Calendar** | Event calendar widget | Local library |

---

## 🚀 Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Git installed on your system
- Text editor or IDE (VS Code recommended)

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/tejuszz/Cse-project.git
   cd Cse-project
   ```

2. **Open Locally**
   - Option A: Open `index.html` directly in your browser
   - Option B: Use a local server
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Python 2
     python -m SimpleHTTPServer 8000
     
     # Using Node.js (with http-server installed)
     http-server
     ```

3. **Access the Application**
   - Open `http://localhost:8000` in your browser
   - Select your role (Student/Professor)
   - Login with credentials

---

## 💻 Usage

### For Students

1. **Login**: Click "Continue as Student" on the landing page
2. **Access Dashboard**: View your academic overview
3. **Check Attendance**: Navigate to Attendance section
4. **View Schedule**: Click on Timetable
5. **Download Materials**: Browse Study Material
6. **Explore Campus**: Use Campus Map for navigation
7. **Calendar**: Check events on Event Calendar

### For Professors

1. **Login**: Click "Continue as Professor" on the landing page
2. **View Dashboard**: See assigned classes and next class details
3. **Manage Attendance**: Track student attendance
4. **Upload Materials**: Add study materials for students
5. **Check Schedule**: View your timetable
6. **Navigate Campus**: Use Campus Map

### Sample Credentials
```
Student:
ID: 12345
Password: student123

Professor:
ID: P001
Password: prof123
```

---

## 📄 File Descriptions

### HTML Pages

| File | Purpose |
|------|---------|
| `index.html` | Landing page with role selection and login form |
| `student.html` | Main student dashboard with stats and overview |
| `professor.html` | Main professor dashboard with class management |
| `attendance.html` | Attendance tracking and statistics page |
| `timetable.html` | Student class schedule display |
| `study-material.html` | Course materials and resources repository |
| `professor-materials.html` | Interface for professors to upload materials |
| `professor-timetable.html` | Professor schedule management |
| `map.html` | Interactive campus map |

### JavaScript Files

| File | Purpose |
|------|---------|
| `js/auth.js` | Handles login/logout and session management |
| `js/attendance.js` | Calculates and displays attendance statistics |

### Styling

| File | Purpose |
|------|---------|
| `css/style.css` | Main stylesheet with responsive design |

---
