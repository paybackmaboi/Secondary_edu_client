# Backend API Implementation Guide

> **Reference Document for Backend Development**  
> This document lists all missing API endpoints, action column functionality, and analytics features that need to be implemented in the backend to fully support the frontend application.

---

## Table of Contents

1. [Overview](#overview)
2. [Current API Endpoints](#current-api-endpoints)
3. [Missing API Endpoints](#missing-api-endpoints)
4. [Action Column Icons - Lacking Functionality](#action-column-icons---lacking-functionality)
5. [Super Admin Analytics (ApexChart)](#super-admin-analytics-apexchart)
6. [Reports Module - Backend Requirements](#reports-module---backend-requirements)
7. [Authentication & Authorization](#authentication--authorization)
8. [Implementation Priority](#implementation-priority)

---

## Overview

The frontend application (`tech_client`) is built with **Next.js** and contains role-based dashboards for:
- **Super Admin** - Full system access including account management and analytics
- **Admin** - Student and subject management, grades, attendance
- **Teacher** - Grades, attendance, observed values for assigned students
- **User** - Basic view access

The backend API base URL is configured as: `http://localhost:3001/api`

---

## ⚠️ CRITICAL: Analytics Endpoints Return 500 Errors

### Current Issue

When logging into the Super Admin dashboard, the browser console shows the following errors:

```
GET http://localhost:3001/api/analytics/dashboard-stats 500 (Internal Server Error)
GET http://localhost:3001/api/analytics/student-distribution 500 (Internal Server Error)
GET http://localhost:3001/api/analytics/grade-performance 500 (Internal Server Error)
GET http://localhost:3001/api/analytics/attendance-trend?year=2026 500 (Internal Server Error)
GET http://localhost:3001/api/analytics/grade-distribution 500 (Internal Server Error)
```

### Why This Happens

The frontend analytics dashboard (for Super Admin role) calls these 5 API endpoints to display real-time data in ApexCharts. These endpoints are **not yet implemented** in the backend, causing 500 Internal Server Errors.

### Current Workaround: Mock Data

The frontend charts **automatically fall back to mock/demo data** when the API calls fail:

| Chart Component | Fallback Data |
|-----------------|---------------|
| `StudentDistributionChart.js` | Demo: 25-32 students per grade |
| `GradePerformanceChart.js` | Demo: 82-90% average per subject |
| `AttendanceTrendChart.js` | Demo: 450-495 present, 8-25 absent per month |
| `GradeDistributionChart.js` | Demo: 5-35% per grade bracket |

**The charts will display properly with demo data, but show errors in the console.**

### Why These Endpoints Must Be Implemented

| Priority | Reason |
|----------|--------|
| **Data Accuracy** | Mock data doesn't reflect actual student performance, attendance, or enrollment |
| **Admin Decision Making** | Super Admins need real analytics to identify struggling students and optimize resources |
| **Console Errors** | 500 errors in production are unprofessional and may mask real issues |
| **Reporting Integration** | The Reports module also depends on aggregated analytics data |

### Required Implementation

Create these 5 endpoints in the backend:

```javascript
// 1. Dashboard Stats
GET /api/analytics/dashboard-stats
// Returns: { totalStudents, attendanceRate, averageGrades }

// 2. Student Distribution  
GET /api/analytics/student-distribution
// Returns: [{ gradeLevel: 1, count: 25 }, ...]

// 3. Grade Performance
GET /api/analytics/grade-performance
// Returns: [{ subject: "Math", average: 85 }, ...]

// 4. Attendance Trend
GET /api/analytics/attendance-trend?year=2026
// Returns: [{ month: "Jan", present: 450, absent: 20, tardy: 15 }, ...]

// 5. Grade Distribution
GET /api/analytics/grade-distribution
// Returns: [{ grade: "Outstanding (90-100)", count: 50 }, ...]
```

See [Super Admin Analytics (ApexChart)](#super-admin-analytics-apexchart) section for detailed implementation specs.

---

## Current API Endpoints

These endpoints are already defined in `src/services/api.js`:

### Students API
| Method | Endpoint | Status | Notes |
|--------|----------|--------|-------|
| GET | `/students` | ✅ Working | Fetches all students. **SECURITY UPDATE:** If role is 'user', must filter to return ONLY the student record where `lrn === user.username`. |
| GET | `/students/:id` | ✅ Working | Get single student |
| POST | `/students` | ✅ Working | Create new student |
| GET | `/students/:id/report-card` | ✅ Working | Get report card |
| PUT | `/students/:id` | ❌ Missing | Update student |
| DELETE | `/students/:id` | ❌ Missing | Delete student |

### Grades API
| Method | Endpoint | Status | Notes |
|--------|----------|--------|-------|
| GET | `/grades/student/:studentId` | ✅ Working | Get grades by student |
| POST | `/grades` | ✅ Working | Create grade |
| PUT | `/grades/:id` | ✅ Working | Update grade |
| DELETE | `/grades/:id` | ❌ Missing | Delete grade |

### Attendance API
| Method | Endpoint | Status | Notes |
|--------|----------|--------|-------|
| GET | `/attendance/student/:studentId` | ✅ Working | Get attendance by student |
| POST | `/attendance` | ✅ Working | Create attendance record |
| PUT | `/attendance/:id` | ✅ Working | Update attendance |
| DELETE | `/attendance/:id` | ❌ Missing | Delete attendance |

### Observed Values API
| Method | Endpoint | Status | Notes |
|--------|----------|--------|-------|
| GET | `/observed-values/student/:studentId` | ✅ Working | Get values by student |
| POST | `/observed-values` | ✅ Working | Create observed value |
| PUT | `/observed-values/:id` | ❌ Missing | Update observed value |
| DELETE | `/observed-values/:id` | ❌ Missing | Delete observed value |

### Subjects API
| Method | Endpoint | Status | Notes |
|--------|----------|--------|-------|
| GET | `/subjects` | ✅ Working | Fetches all subjects |
| GET | `/subjects/:id` | ✅ Working | Get single subject |
| POST | `/subjects` | ✅ Working | Create subject |
| PUT | `/subjects/:id` | ✅ Working | Update subject |
| DELETE | `/subjects/:id` | ✅ Working | Delete subject |

### Accounts API
| Method | Endpoint | Status | Notes |
|--------|----------|--------|-------|
| GET | `/accounts` | ✅ Working | Fetches all accounts |
| GET | `/accounts/:id` | ⚠️ Needs Page | Backend ready, frontend page missing |
| POST | `/accounts` | ✅ Working | Create account |
| PUT | `/accounts/:id` | ⚠️ Needs Page | Backend ready, frontend page missing |
| DELETE | `/accounts/:id` | ✅ Working | Delete account |

---

## Missing API Endpoints

### 1. Student Management

```javascript
// DELETE /api/students/:id
// Delete a student and all associated data
// Response: { success: true, message: "Student deleted successfully" }

// PUT /api/students/:id
// Update student information
// Body: { firstName, lastName, lrn, gradeLevel, section, ... }
// Response: { success: true, data: updatedStudent }
```

### 2. Analytics Endpoints (NEW - For Super Admin)

```javascript
// GET /api/analytics/dashboard-stats
// Returns aggregated statistics for super admin dashboard
// Response: {
//   totalStudents: number,
//   totalAccounts: number,
//   totalSubjects: number,
//   studentGrowth: number (percentage),
//   attendanceRate: number (percentage),
//   averageGrades: number
// }

// GET /api/analytics/student-distribution
// Returns student count by grade level for pie/donut chart
// Response: [
//   { gradeLevel: 1, count: 25 },
//   { gradeLevel: 2, count: 30 },
//   ...
// ]

// GET /api/analytics/grade-performance
// Returns average grades per subject for bar chart
// Response: [
//   { subject: "Math", average: 85 },
//   { subject: "Science", average: 82 },
//   ...
// ]

// GET /api/analytics/attendance-trend
// Returns monthly attendance data for line chart
// Query params: ?year=2024
// Response: [
//   { month: "January", present: 450, absent: 20, tardy: 15 },
//   { month: "February", present: 460, absent: 18, tardy: 12 },
//   ...
// ]

// GET /api/analytics/grade-distribution
// Returns grade distribution (A, B, C, D, F) for pie chart
// Response: [
//   { grade: "A (90-100)", count: 50 },
//   { grade: "B (80-89)", count: 80 },
//   ...
// ]
```

### 3. Reports Endpoints (NEW)

```javascript
// GET /api/reports/class-summary
// Returns class-wide performance summary
// Query params: ?gradeLevel=6&section=A
// Response: {
//   totalStudents: number,
//   averageGrade: number,
//   attendanceRate: number,
//   students: [{ id, name, averageGrade, attendanceRate }]
// }

// GET /api/reports/grade-analytics
// Statistical analysis of grades across subjects
// Query params: ?quarter=1&gradeLevel=6
// Response: {
//   subjects: [{ name, average, highest, lowest, passRate }],
//   overallAverage: number
// }

// GET /api/reports/attendance-summary
// Monthly and quarterly attendance reports
// Query params: ?startDate=2024-01-01&endDate=2024-03-31
// Response: {
//   totalDays: number,
//   presentRate: number,
//   absentRate: number,
//   tardyRate: number,
//   monthlyBreakdown: [...]
// }
```

---

## Action Column Icons - Lacking Functionality

### Students Table (`src/app/dashboard/students/page.js`)

| Icon | Action | Current Status | Backend Requirement |
|------|--------|----------------|---------------------|
| 👁️ Eye | View Student | ✅ Working | Navigates to `/dashboard/students/:id` |
| 📄 FileText | Report Card | ✅ Working | Navigates to `/dashboard/students/:id/report-card` |
| 🗑️ Trash2 | Delete Student | ❌ Not Working | **Needs `DELETE /api/students/:id` endpoint** |

**TODO: Frontend file location**: `src/app/dashboard/students/page.js` (line 48-52)
```javascript
const handleDelete = async () => {
    // TODO: Implement delete when API supports it
    setDeleteModal({ open: false, student: null });
    loadStudents();
};
```

**Backend Implementation Required:**
```javascript
// DELETE /api/students/:id
router.delete('/students/:id', async (req, res) => {
    const { id } = req.params;
    // Delete associated grades, attendance, observed values
    // Then delete student
    // Return success response
});
```

---

### Accounts Table (`src/app/dashboard/accounts/page.js`)

| Icon | Action | Current Status | Backend Requirement |
|------|--------|----------------|---------------------|
| 👁️ Eye | View Account | ⚠️ Route exists, page missing | Create `/dashboard/accounts/[id]/page.js` |
| ✏️ Edit | Edit Account | ⚠️ Route exists, page missing | Create `/dashboard/accounts/[id]/edit/page.js` |
| 🗑️ Trash2 | Delete Account | ✅ Working | Uses `DELETE /api/accounts/:id` |

**Frontend Pages Needed:**
1. `src/app/dashboard/accounts/[id]/page.js` - View account details
2. `src/app/dashboard/accounts/[id]/edit/page.js` - Edit account form

---

### Subjects Table (`src/app/dashboard/subjects/page.js`)

| Icon | Action | Current Status | Backend Requirement |
|------|--------|----------------|---------------------|
| ✏️ Edit | Edit Subject | ⚠️ Route exists, page missing | Create `/dashboard/subjects/[id]/edit/page.js` |
| 🗑️ Trash2 | Delete Subject | ✅ Working | Uses `DELETE /api/subjects/:id` |

**Frontend Page Needed:**
1. `src/app/dashboard/subjects/[id]/edit/page.js` - Edit subject form

---

## Super Admin Analytics (ApexChart)

The Super Admin dashboard needs analytics charts using **ApexCharts**. Here are the recommended charts and their backend data requirements:

### Installation
```bash
npm install recharts
```

### 1. Student Distribution by Grade Level (Donut Chart)

**API Endpoint:** `GET /api/analytics/student-distribution`

```javascript
// ApexChart Configuration
const options = {
    chart: { type: 'donut' },
    labels: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
    colors: ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
    legend: { position: 'bottom' }
};
const series = [25, 30, 28, 32, 27, 29]; // Student counts per grade
```

---

### 2. Monthly Attendance Trend (Area Chart)

**API Endpoint:** `GET /api/analytics/attendance-trend`

```javascript
const options = {
    chart: { type: 'area', height: 350 },
    xaxis: { categories: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'] },
    colors: ['#22c55e', '#ef4444', '#f59e0b'],
    stroke: { curve: 'smooth' }
};
const series = [
    { name: 'Present', data: [450, 460, 470, 455, 480, 475, 465, 490, 485, 495] },
    { name: 'Absent', data: [20, 18, 15, 25, 12, 16, 22, 10, 14, 8] },
    { name: 'Tardy', data: [15, 12, 10, 18, 8, 9, 13, 5, 6, 4] }
];
```

---

### 3. Subject Performance Comparison (Bar Chart)

**API Endpoint:** `GET /api/analytics/grade-performance`

```javascript
const options = {
    chart: { type: 'bar', height: 350 },
    xaxis: { categories: ['Math', 'Science', 'English', 'Filipino', 'AP', 'MAPEH', 'ESP', 'TLE'] },
    colors: ['#6366f1'],
    plotOptions: { bar: { borderRadius: 8, columnWidth: '60%' } }
};
const series = [{ name: 'Average Grade', data: [85, 82, 88, 86, 84, 90, 87, 83] }];
```

---

### 4. Grade Distribution (Radial Bar Chart)

**API Endpoint:** `GET /api/analytics/grade-distribution`

```javascript
const options = {
    chart: { type: 'radialBar' },
    labels: ['Outstanding (90-100)', 'Very Satisfactory (85-89)', 'Satisfactory (80-84)', 
             'Fairly Satisfactory (75-79)', 'Did Not Meet (Below 75)'],
    colors: ['#22c55e', '#6366f1', '#f59e0b', '#f97316', '#ef4444'],
    plotOptions: {
        radialBar: {
            dataLabels: {
                total: { show: true, label: 'Total Students' }
            }
        }
    }
};
const series = [35, 28, 20, 12, 5]; // Percentage of students in each bracket
```

---

### 5. System Activity Timeline (Timeline/Heatmap)

**API Endpoint:** `GET /api/analytics/activity-log`

```javascript
// Returns recent system activities
// Response: [
//   { timestamp: "2024-02-04T10:30:00", action: "New Student Added", user: "admin" },
//   { timestamp: "2024-02-04T09:15:00", action: "Grades Updated", user: "teacher1" },
//   ...
// ]
```

---

## Reports Module - Backend Requirements

The Reports page (`src/app/dashboard/reports/page.js`) has these features marked as "Coming Soon":

### 1. Class Summary Report
```javascript
// GET /api/reports/class-summary
// Query: ?gradeLevel=6&section=A
{
    className: "Grade 6 - Section A",
    totalStudents: 35,
    topPerformers: [...],
    strugglingStudents: [...],
    subjectSummary: [...],
    attendanceSummary: {...}
}
```

### 2. Grade Analytics Report
```javascript
// GET /api/reports/grade-analytics
// Query: ?quarter=all&year=2024
{
    quarterlyTrends: [...],
    subjectComparison: [...],
    passingRate: 92,
    failureRate: 8
}
```

### 3. Attendance Summary Report
```javascript
// GET /api/reports/attendance-summary
// Query: ?startDate=2024-06-01&endDate=2025-03-31
{
    schoolYear: "2024-2025",
    totalSchoolDays: 180,
    averageAttendance: 94.5,
    monthlyBreakdown: [...],
    perfectAttendanceStudents: [...]
}
```

---

## Authentication & Authorization

Currently, the frontend stores user info in `localStorage` with a future placeholder for JWT tokens.

### Backend Requirements:

```javascript
// POST /api/auth/login
// Body: { username, password }
// Response: { token: "jwt-token", user: { id, username, role } }

// POST /api/auth/logout
// Invalidate token

// GET /api/auth/me
// Returns current user info from token

// Middleware for role-based access
const requireRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    next();
};
```

---

## Implementation Priority

### 🔴 High Priority (Blocking Features)
1. `DELETE /api/students/:id` - Student delete functionality
2. Account view/edit pages (frontend)
3. Subject edit page (frontend)
4. `PUT /api/students/:id` - Student update functionality

### 🟡 Medium Priority (Super Admin Analytics)
1. `GET /api/analytics/dashboard-stats`
2. `GET /api/analytics/student-distribution`
3. `GET /api/analytics/attendance-trend`
4. `GET /api/analytics/grade-performance`
5. ApexChart component integration

### 🟢 Lower Priority (Reports Enhancement)
1. `GET /api/reports/class-summary`
2. `GET /api/reports/grade-analytics`
3. `GET /api/reports/attendance-summary`
4. PDF/Excel export functionality

### ⚪ Future Enhancements
1. JWT Authentication implementation
2. Real-time notifications (WebSocket)
3. Activity logging system
4. Audit trail for data changes

---

## Frontend Files Reference

| Module | List Page | Create Page | View Page | Edit Page |
|--------|-----------|-------------|-----------|-----------|
| Students | ✅ `dashboard/students/page.js` | ✅ `dashboard/students/create/page.js` | ✅ `dashboard/students/[id]/page.js` | ❌ Missing |
| Accounts | ✅ `dashboard/accounts/page.js` | ✅ `dashboard/accounts/create/page.js` | ❌ Missing | ❌ Missing |
| Subjects | ✅ `dashboard/subjects/page.js` | ✅ `dashboard/subjects/create/page.js` | ❌ N/A | ❌ Missing |
| Grades | ✅ `dashboard/grades/page.js` | ✅ `dashboard/grades/create/page.js` | N/A | N/A |
| Attendance | ✅ `dashboard/attendance/page.js` | ✅ `dashboard/attendance/create/page.js` | N/A | N/A |
| Values | ✅ `dashboard/values/page.js` | ✅ `dashboard/values/create/page.js` | N/A | N/A |
| Reports | ✅ `dashboard/reports/page.js` | N/A | N/A | N/A |

---

## Quick Start Checklist

- [ ] Implement `DELETE /api/students/:id` endpoint
- [ ] Implement `PUT /api/students/:id` endpoint  
- [ ] Create account view page
- [ ] Create account edit page
- [ ] Create subject edit page
- [ ] Install ApexCharts: `npm install apexcharts react-apexcharts`
- [ ] Create analytics endpoints
- [ ] Build analytics dashboard component
- [ ] Implement report generation endpoints
- [ ] Add JWT authentication

---

*Last Updated: February 2026*
