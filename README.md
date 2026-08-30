# CPS Academy LMS project

CPS Academy LMS is a learning management system built for the submission for CPS Academy.

The project features a  complete learning journey starting from browsing and enrolling in courses to managing lessons, tracking progress, and publishing educational content. It combines a modern frontend using ```Next.js``` with a flexible content management backend ```Strapi V5``` to create a scalable and maintainable LMS solution.

## Overview

The system is built for educational institutions and digital learning environments that need a central place to manage learning content and learner engagement. It provides a unified platform for:

- Course discovery and enrollment
- Instructor-led content creation
- Student learning dashboards
- Lesson and progress tracking
- Blog and educational content publishing
- Administrative oversight and content management

## Key Features

### Student Experience
- Browse available courses
- Enroll in programs and learning paths
- Access lesson materials and course content
- Track overall learning progress
- View personalized dashboard insights

### Instructor Experience
- Create and manage courses
- Add and edit lessons
- Update course material and content structure
- Monitor learner activity and engagement
- Manage teaching-related resources in one place

### Administrative Experience
- Manage users and platform roles
- Review course and content operations
- Oversee platform activity across departments
- Control educational material and access levels

### Content Management
- Manage blog content and educational articles
- Organize structured course information
- Support scalable content publishing workflows
- Keep course and learning materials centralized

## Tech Stack

- Next.js for the frontend application
- React and TypeScript for modular, type-safe UI development
- Tailwind CSS for responsive, modern styling
- Strapi as the content management backend
- PostgreSQL for data persistence
- REST API-driven communication between the frontend and backend

## Architecture

The project is structured as a full-stack application with a clear separation between the presentation layer and content management layer.

- The frontend delivers the user-facing experience for students, instructors, and admins.
- The backend provides CMS capabilities, API endpoints, and data management.
- Role-based dashboards and workflows help ensure the right users access the right tools and information.
- The system is designed to scale as more courses, content, and users are added.

## API Endpoints

The backend exposes a range of REST endpoints used by the frontend.

### Authentication
- POST /api/auth/local
- POST /api/auth/local/register
- GET /api/auth-user

### Courses
- GET /api/courses
- GET /api/courses/:id
- POST /api/courses
- DELETE /api/courses/:id
- GET /api/courses/student-courses

### Lessons
- GET /api/lessons
- POST /api/lessons
- DELETE /api/lessons/:id

### Enrollments
- GET /api/enrollments
- POST /api/enrollments

### Blog Posts
- GET /api/blog-posts
- GET /api/blog-posts/:id
- POST /api/blog-posts
- DELETE /api/blog-posts/:id

### Quizzes and Attempts
- GET /api/quizzes/:id
- POST /api/quiz-attempts/submit
- GET /api/quiz-attempts/instructor-results

### Lesson Progress
- POST /api/lesson-progresses/:id/complete

### Dashboard APIs
- GET /api/instructor/dashboard
- GET /api/student/dashboard
- GET /api/content-manager/dashboard
- GET /api/admin/dashboard
- POST /api/admin/dashboard/users/:id/role

These endpoints are implemented through the Strapi content-types and custom service logic used by the LMS workflows.

## Conclusion

CPS Academy LMS is a practical, scalable learning management system designed for modern education delivery. By combining a responsive frontend, flexible CMS backend, and role-based learning workflows, it provides a strong foundation for online teaching and learning.

This project reflects a modern approach to digital education—organized, user-friendly, and built around the real needs of students, instructors, and administrators.