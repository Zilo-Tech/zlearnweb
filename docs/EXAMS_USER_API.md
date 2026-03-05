# Exam Package User API Documentation

This document provides a comprehensive guide to all user-facing API endpoints for exam packages. These endpoints are designed for students using mobile and web applications to discover, enroll in, and learn from exam preparation packages.

**Base URL:** `/api/exams/`

**Authentication:** Most endpoints require authentication via JWT token in the `Authorization` header. Public browsing endpoints allow anonymous access.

**Pagination:** List endpoints return paginated results with the following format:
```json
{
  "pagination": {
    "count": 150,
    "total_pages": 8,
    "current_page": 1,
    "page_size": 20,
    "has_next": true,
    "has_previous": false,
    "next_page": 2,
    "previous_page": null
  },
  "results": [...]
}
```
Default: 20 items per page. Maximum: 100 items per page using `?page_size=100`.

---

## Table of Contents

1. [Exam Discovery & Browsing](#1-exam-discovery--browsing)
2. [Enrollment Management](#2-enrollment-management)
3. [Learning Content Access](#3-learning-content-access)
4. [Mock Exams & Practice](#4-mock-exams--practice)
5. [Past Papers](#5-past-papers)
6. [Study Tools](#6-study-tools)
7. [Achievements & Leaderboards](#7-achievements--leaderboards)
8. [Reminders](#8-reminders)

---

## 1. Exam Discovery & Browsing

### 1.1 List All Exams

**Endpoint:** `GET /api/exams/`

**Authentication:** Not required (public access)

**Description:** Browse all published exam packages with advanced filtering, searching, and sorting capabilities.

**Query Parameters:**
- `exam_type` - Filter by exam type (e.g., "entrance", "standardized", "certification")
- `exam_board` - Filter by exam board (e.g., "JAMB", "GCE", "SAT")
- `is_free` - Filter free exams (`true` or `false`)
- `featured` - Show only featured exams (`true` or `false`)
- `country` - Filter by country ID
- `status` - Filter by status ("upcoming", "ongoing", "completed")
- `min_price` - Filter by minimum price
- `max_price` - Filter by maximum price
- `upcoming` - Show only upcoming exams (`true` or `false`)
- `year` - Filter by exam year
- `search` - Search in title, description, exam_board, exam_code
- `ordering` - Sort results (options: `created_at`, `-created_at`, `exam_date`, `-exam_date`, `price`, `-price`, `enrollment_count`, `-enrollment_count`)
- `page` - Page number for pagination
- `page_size` - Items per page (max 100)

**Response:** Paginated list of exams with basic information including title, description, exam type, exam board, price, exam date, enrollment count, course count, mock exam count, past paper count, and thumbnail.

**Use Cases:**
- Display exam catalog on home page
- Filter exams by type or board for specific preparation needs
- Show free exams to non-paying users
- Display upcoming exams with countdown timers
- Search for specific exam packages by name or code

---

### 1.2 Get Exam Details

**Endpoint:** `GET /api/exams/<slug>/` or `GET /api/exams/<uuid>/`

**Authentication:** Not required (public access)

**Description:** Retrieve detailed information about a specific exam package. Supports lookup by both slug (user-friendly URL) and UUID (programmatic access). Includes complete course structure with modules and lessons.

**URL Parameters:**
- `slug` - Exam slug (e.g., "jamb-2024-exam")
- OR `uuid` - Exam UUID

**Response:** Complete exam details including all courses, modules, lessons, mock exams, past papers, enrollment information, instructor details, prerequisites, requirements, and learning outcomes.

**Use Cases:**
- Display exam package details page
- Show complete course curriculum before enrollment
- Preview exam structure and content
- Display instructor information and credentials
- Show pricing and enrollment deadlines

---

### 1.3 List Courses in Exam

**Endpoint:** `GET /api/exams/<exam_id>/courses/`

**Authentication:** Not required (public access)

**Description:** List all courses (subjects) within an exam package. Courses represent major subject areas like Mathematics, English, Physics, etc.

**URL Parameters:**
- `exam_id` - UUID of the exam

**Response:** List of courses with basic information including title, description, duration estimates, module count, and lesson count.

**Use Cases:**
- Display course overview in exam details
- Show subject breakdown for exam preparation
- Navigate to specific subject areas

---

### 1.4 Get Course Details

**Endpoint:** `GET /api/exams/<exam_id>/courses/<slug>/` or `GET /api/exams/<exam_id>/courses/<uuid>/`

**Authentication:** Not required (public access)

**Description:** Retrieve detailed information about a specific course within an exam. Includes complete module structure and lesson breakdown.

**URL Parameters:**
- `exam_id` - UUID of the exam
- `slug` - Course slug OR `uuid` - Course UUID

**Response:** Complete course details including all modules, lessons within each module, learning objectives, estimated duration, and progress tracking information.

**Use Cases:**
- Display course details page
- Show module and lesson structure
- Preview course content before enrollment
- Navigate to specific modules within a course

---

### 1.5 List Modules in Course

**Endpoint:** `GET /api/exams/courses/<course_id>/modules/`

**Authentication:** Not required (public access)

**Description:** List all modules (topics) within a course. Modules represent major topics within a subject.

**URL Parameters:**
- `course_id` - UUID of the course

**Response:** List of modules with basic information including title, description, order, lesson count, and estimated duration.

**Use Cases:**
- Display module list for a course
- Show topic breakdown
- Navigate to specific topics

---

### 1.6 Get Module Details

**Endpoint:** `GET /api/exams/courses/<course_id>/modules/<module_id>/`

**Authentication:** Not required (public access)

**Description:** Retrieve detailed information about a specific module including all lessons, sections, and resources.

**URL Parameters:**
- `course_id` - UUID of the course
- `module_id` - UUID of the module

**Response:** Complete module details including all lessons, lesson sections, learning objectives, and available resources.

**Use Cases:**
- Display module details page
- Show lesson breakdown within a topic
- Preview module content

---

### 1.7 Get Lesson Details

**Endpoint:** `GET /api/exams/modules/<module_id>/lessons/<lesson_id>/`

**Authentication:** Required

**Description:** Retrieve detailed information about a specific lesson including all sections (text, video, quiz) and downloadable resources. Access requires enrollment in the exam package.

**URL Parameters:**
- `module_id` - UUID of the module
- `lesson_id` - UUID of the lesson

**Response:** Complete lesson details including all sections with content (text, video URLs, quiz questions), resources with download links, estimated duration, and completion status.

**Use Cases:**
- Display lesson content page
- Stream video lessons
- Show interactive quizzes
- Provide downloadable study materials
- Track lesson completion status

---

### 1.8 List Lesson Resources

**Endpoint:** `GET /api/exams/lessons/<lesson_id>/resources/`

**Authentication:** Required

**Description:** List all downloadable resources for a specific lesson (PDFs, documents, slides, etc.).

**URL Parameters:**
- `lesson_id` - UUID of the lesson

**Response:** List of resources with title, description, resource type, file URL, file size, and download count.

**Use Cases:**
- Display downloadable materials for a lesson
- Provide supplementary study resources
- Track resource download counts

---

## 2. Enrollment Management

### 2.1 Enroll in Exam

**Endpoint:** `POST /api/exams/<exam_id>/enroll/`

**Authentication:** Required

**Description:** Enroll the current user in an exam package. Validates payment requirements, enrollment deadlines, prerequisites, and availability.

**URL Parameters:**
- `exam_id` - UUID of the exam

**Request Body:**
```json
{
  "payment_method": "card",
  "payment_reference": "PAY-123456789"
}
```

**Response:** Created enrollment with enrollment ID, status, exam details, and access information.

**Validation:**
- Checks if exam requires payment and validates payment
- Verifies enrollment deadline has not passed
- Ensures user hasn't already enrolled
- Validates exam availability and capacity

**Use Cases:**
- Process exam package enrollment
- Verify payment before granting access
- Create enrollment record for progress tracking
- Grant access to exam content and features

---

### 2.2 Unenroll from Exam

**Endpoint:** `DELETE /api/exams/<exam_id>/unenroll/`

**Authentication:** Required

**Description:** Unenroll the current user from an exam package. Enforces unenrollment policies and deadlines.

**URL Parameters:**
- `exam_id` - UUID of the exam

**Response:** Success message confirming unenrollment.

**Validation:**
- Ensures user is currently enrolled
- Prevents unenrollment within 7 days of enrollment deadline
- Validates enrollment status allows unenrollment

**Use Cases:**
- Allow users to withdraw from exam packages
- Process refund requests
- Remove access to exam content

---

### 2.3 View My Enrollments

**Endpoint:** `GET /api/exams/enrollments/my/`

**Authentication:** Required

**Description:** List all exam enrollments for the current user with progress information.

**Query Parameters:**
- `status` - Filter by enrollment status (e.g., "active", "completed", "exam_taken", "suspended")

**Response:** List of enrollments with exam details, progress percentage, lessons completed, courses completed, mock exam statistics, study hours, study streak, and enrollment date.

**Use Cases:**
- Display user dashboard with all enrolled exams
- Show progress across multiple exam packages
- Filter active vs completed enrollments
- Display study statistics and achievements

---

### 2.4 Get Enrollment Analytics

**Endpoint:** `GET /api/exams/enrollments/<enrollment_id>/analytics/`

**Authentication:** Required

**Description:** Retrieve comprehensive analytics for a specific enrollment including progress, performance, weak areas, strong areas, and personalized recommendations.

**URL Parameters:**
- `enrollment_id` - UUID of the enrollment (must belong to current user)

**Response:** Detailed analytics including:
- Overall progress percentage
- Courses and lessons completed
- Mock exam statistics (attempts, passes, average score, best score)
- Total study hours and current streak
- Days until exam date
- Performance breakdown by course/subject
- Weak areas needing improvement (accuracy below 60%)
- Strong areas (accuracy above 75%)
- Recent mock exam attempts
- Personalized study recommendations

**Use Cases:**
- Display comprehensive progress dashboard
- Identify areas needing improvement
- Provide personalized study recommendations
- Track performance trends over time
- Motivate users with achievement metrics

---

## 3. Learning Content Access

### 3.1 Mark Lesson as Complete

**Endpoint:** `POST /api/exams/lessons/<lesson_id>/complete/`

**Authentication:** Required

**Description:** Mark a lesson as completed for progress tracking. Updates enrollment progress, study streak, and awards XP. Checks for achievement unlocks.

**URL Parameters:**
- `lesson_id` - UUID of the lesson

**Request Body (Optional):**
```json
{
  "time_spent_minutes": 45
}
```

**Response:** Success confirmation with updated progress percentage, lessons completed count, streak information, and any newly unlocked achievements.

**Side Effects:**
- Adds lesson to completed lessons
- Recalculates enrollment progress percentage
- Updates study streak across all tracking systems
- Awards 15 XP for lesson completion
- Tracks study time if provided
- Checks and unlocks relevant achievements
- Increments total lesson completion count

**Use Cases:**
- Track student progress through course content
- Update progress bars and completion indicators
- Maintain study streaks for engagement
- Award achievements for milestones
- Collect study time analytics

---

## 4. Mock Exams & Practice

### 4.1 List Mock Exams

**Endpoint:** `GET /api/exams/<exam_id>/mock-exams/`

**Authentication:** Required

**Description:** List all mock exams available for an exam package. Shows attempt history and performance statistics.

**URL Parameters:**
- `exam_id` - UUID of the exam

**Response:** List of mock exams with title, description, total questions, duration, passing marks, difficulty level, exam type (practice, full mock, timed), user's attempt count, best score, and last attempt date.

**Use Cases:**
- Display available practice tests
- Show mock exam catalog
- Display attempt history and best scores
- Filter by difficulty or exam type

---

### 4.2 Get Mock Exam Details

**Endpoint:** `GET /api/exams/<exam_id>/mock-exams/<mock_exam_id>/`

**Authentication:** Required

**Description:** Retrieve detailed information about a specific mock exam including question breakdown by subject, instructions, and user's attempt history.

**URL Parameters:**
- `exam_id` - UUID of the exam
- `mock_exam_id` - UUID of the mock exam

**Response:** Complete mock exam details including instructions, total questions, duration, passing marks, question distribution by course/subject, user's previous attempts, and best score.

**Use Cases:**
- Display mock exam details before starting
- Show attempt history and performance
- Preview exam structure and duration
- Display instructions and passing criteria

---

### 4.3 Start Mock Exam Attempt

**Endpoint:** `POST /api/exams/mock-exams/<mock_exam_id>/start/`

**Authentication:** Required

**Description:** Start a new mock exam attempt. Creates attempt record and returns all questions. Validates enrollment and exam availability.

**URL Parameters:**
- `mock_exam_id` - UUID of the mock exam

**Response:** Created attempt with attempt ID, attempt number, start time, all questions (without correct answers visible), total questions, and duration limits.

**Validation:**
- Verifies user is enrolled in the exam
- Checks enrollment is active
- Validates mock exam is published and active
- Creates new attempt record with "in_progress" status
- Calculates attempt number based on previous attempts

**Use Cases:**
- Begin a timed practice test
- Load all questions for the exam
- Start timer for timed exams
- Track attempt history

---

### 4.4 Submit Mock Exam Attempt

**Endpoint:** `POST /api/exams/mock-exam-attempts/<attempt_id>/submit/`

**Authentication:** Required

**Description:** Submit completed mock exam attempt with answers. Calculates score, updates statistics, awards XP, checks achievements, and updates study streak.

**URL Parameters:**
- `attempt_id` - UUID of the attempt (must belong to current user and be "in_progress")

**Request Body:**
```json
{
  "answers": {
    "question_uuid": "selected_answer",
    "another_question_uuid": "selected_answer"
  }
}
```

**Response:** Submitted attempt with score, pass/fail status, correct answers count, time taken, detailed results, and any newly unlocked achievements.

**Scoring & Side Effects:**
- Compares submitted answers against correct answers
- Calculates score percentage and pass/fail status
- Records time taken from start to submission
- Updates enrollment mock exam statistics (attempts, passes, average score, best score)
- Awards XP based on performance (25-100 XP)
- Updates study streak across all systems
- Checks and unlocks mock exam achievements
- Returns list of newly unlocked achievements

**Use Cases:**
- Grade practice tests automatically
- Provide immediate feedback and results
- Update performance statistics
- Award achievements for milestones
- Maintain engagement with XP and streaks

---

### 4.5 View My Mock Exam Attempts

**Endpoint:** `GET /api/exams/mock-exam-attempts/my/`

**Authentication:** Required

**Description:** List all mock exam attempts by the current user across all exams or filtered by specific exam.

**Query Parameters:**
- `exam_id` - Filter attempts for specific exam (optional)

**Response:** List of attempts with mock exam title, score, pass/fail status, time taken, attempt number, submission date, and exam information.

**Use Cases:**
- Display attempt history
- Show performance over time
- Track improvement across multiple attempts
- Filter attempts by exam package

---

### 4.6 Get Mock Exam Attempt Details

**Endpoint:** `GET /api/exams/mock-exam-attempts/<attempt_id>/`

**Authentication:** Required

**Description:** Retrieve detailed information about a specific mock exam attempt. Shows questions with correct answers if completed, or just questions if still in progress.

**URL Parameters:**
- `attempt_id` - UUID of the attempt (must belong to current user)

**Response:** 
- **If in progress:** Questions without correct answers visible
- **If completed:** Complete results with all questions, correct answers, user's answers, explanations, score breakdown, and performance analysis

**Use Cases:**
- Continue incomplete attempt
- Review completed attempt with detailed feedback
- Study from mistakes with explanations
- Analyze performance by question type or subject

---

## 5. Past Papers

### 5.1 List Past Papers

**Endpoint:** `GET /api/exams/<exam_id>/past-papers/`

**Authentication:** Required

**Description:** List all past examination papers for an exam package. Includes real exam papers from previous years with question papers, answer keys, marking schemes, and solutions.

**URL Parameters:**
- `exam_id` - UUID of the exam

**Query Parameters:**
- `ordering` - Sort by `year` or `-year` (default: `-year` for newest first)

**Response:** List of past papers with title, year, exam session (e.g., "May/June"), question paper availability, answer key availability, marking scheme availability, solutions PDF availability, file sizes, download count, and free/paid status.

**Use Cases:**
- Browse historical exam papers
- Filter by year or session
- Check availability of answer keys and solutions
- Display download counts for popular papers

---

### 5.2 Get Past Paper Details

**Endpoint:** `GET /api/exams/<exam_id>/past-papers/<past_paper_id>/`

**Authentication:** Required

**Description:** Retrieve detailed information about a specific past paper including all available files and metadata.

**URL Parameters:**
- `exam_id` - UUID of the exam
- `past_paper_id` - UUID of the past paper

**Response:** Complete past paper details including:
- Question paper file (PDF)
- Answer key file (PDF)
- Marking scheme file (PDF)
- Solutions PDF with explanations
- File sizes for each document
- Year and exam session
- Total marks and duration
- Download count
- Free/paid status

**Use Cases:**
- Display past paper details page
- Show all available files for download
- Preview file information before downloading
- Check if solutions are available

---

### 5.3 Download Past Paper File

**Endpoint:** `POST /api/exams/past-papers/<past_paper_id>/download/`

**Authentication:** Required

**Description:** Authorize and track download of a past paper file. Validates access permissions and generates secure download token with 24-hour expiry.

**URL Parameters:**
- `past_paper_id` - UUID of the past paper

**Request Body:**
```json
{
  "file_type": "question_paper",
  "device_id": "device-unique-id"
}
```

**File Type Options:**
- `question_paper` - The exam question paper
- `answer_key` - Answer key with correct answers
- `marking_scheme` - Detailed marking scheme
- `solutions_pdf` - Solutions with explanations

**Response:** Download authorization with download ID, secure download token, file URL, expiry time (24 hours), and success message.

**Validation:**
- Verifies user is enrolled in exam (or past paper is free)
- Checks past paper is published
- Validates requested file type exists

**Side Effects:**
- Creates download tracking record
- Increments past paper download count
- Generates secure 24-hour download token
- Records device ID for analytics

**Use Cases:**
- Provide secure file downloads
- Track download analytics
- Prevent unauthorized access
- Enable offline study with downloaded materials
- Monitor popular past papers

---

### 5.4 View My Downloads

**Endpoint:** `GET /api/exams/downloads/my/`

**Authentication:** Required

**Description:** Retrieve download history for past papers by the current user.

**Query Parameters:**
- `exam_id` - Filter downloads for specific exam (optional)

**Response:** List of downloads (up to 50 most recent) with past paper title, file type, download date, exam information, and download token expiry.

**Use Cases:**
- Display download history
- Re-access recently downloaded files
- Track study material usage
- Filter downloads by exam package

---

## 6. Study Tools

### 6.1 Bookmark Question

**Endpoint:** `POST /api/exams/questions/<question_id>/bookmark/`

**Authentication:** Required

**Description:** Bookmark a mock exam question for later review. Allows labeling and color-coding for organization.

**URL Parameters:**
- `question_id` - UUID of the question

**Request Body (Optional):**
```json
{
  "label": "Review later",
  "color": "yellow"
}
```

**Color Options:** yellow, blue, green, red, purple, orange

**Response:** Created bookmark with bookmark ID, label, color, question details, and creation timestamp.

**Validation:**
- Verifies user is enrolled in the exam containing this question
- Checks enrollment is active

**Use Cases:**
- Mark difficult questions for review
- Organize questions by color categories
- Create personal study lists
- Tag questions with custom labels

---

### 6.2 Remove Bookmark

**Endpoint:** `DELETE /api/exams/questions/<question_id>/bookmark/`

**Authentication:** Required

**Description:** Remove bookmark from a question.

**URL Parameters:**
- `question_id` - UUID of the question

**Response:** Success message confirming bookmark removal.

**Use Cases:**
- Un-bookmark questions after review
- Clean up bookmark list
- Remove outdated markers

---

### 6.3 List My Bookmarks

**Endpoint:** `GET /api/exams/bookmarks/`

**Authentication:** Required

**Description:** Retrieve all bookmarked questions for the current user.

**Query Parameters:**
- `exam_id` - Filter bookmarks for specific exam (optional)
- `mock_exam_id` - Filter bookmarks for specific mock exam (optional)

**Response:** List of bookmarks with count, question details, labels, colors, mock exam information, and bookmark timestamps.

**Use Cases:**
- Display all bookmarked questions
- Filter bookmarks by exam or mock test
- Create review session from bookmarks
- Study from marked questions

---

### 6.4 Add or Update Note on Question

**Endpoint:** 
- `POST /api/exams/questions/<question_id>/notes/` (create)
- `PUT /api/exams/questions/<question_id>/notes/` (update)

**Authentication:** Required

**Description:** Add or update a personal note on a mock exam question.

**URL Parameters:**
- `question_id` - UUID of the question

**Request Body:**
```json
{
  "content": "Remember: this formula applies when velocity is constant"
}
```

**Response:** Created or updated note with note ID, content, question details, and timestamps.

**Validation:**
- Verifies user is enrolled in the exam containing this question
- Checks note content is provided
- Ensures enrollment is active

**Use Cases:**
- Take notes on difficult questions
- Record insights and explanations
- Document study observations
- Create personalized study material

---

### 6.5 Delete Note

**Endpoint:** `DELETE /api/exams/questions/<question_id>/notes/`

**Authentication:** Required

**Description:** Delete a note from a question.

**URL Parameters:**
- `question_id` - UUID of the question

**Response:** Success message confirming note deletion.

**Use Cases:**
- Remove outdated notes
- Clean up notes list
- Delete incorrect annotations

---

### 6.6 List My Notes

**Endpoint:** `GET /api/exams/notes/`

**Authentication:** Required

**Description:** Retrieve all notes created by the current user.

**Query Parameters:**
- `exam_id` - Filter notes for specific exam (optional)
- `mock_exam_id` - Filter notes for specific mock exam (optional)

**Response:** List of notes with count, note content, question details, mock exam information, and creation/update timestamps.

**Use Cases:**
- Display all personal notes
- Filter notes by exam or mock test
- Create study guide from notes
- Review documented insights

---

## 7. Achievements & Leaderboards

### 7.1 List All Achievements

**Endpoint:** `GET /api/exams/achievements/`

**Authentication:** Required

**Description:** List all available exam achievements with current user's progress toward unlocking each one.

**Query Parameters:**
- `exam_id` - Filter achievements for specific exam (optional)

**Response:** List of all achievements including:
- Achievement name and description
- Achievement type (mock_exam, lesson_complete, streak, score, etc.)
- Icon and badge image
- Color theme
- Rarity level (common, rare, epic, legendary)
- Requirement type and value (e.g., "Complete 10 mock exams")
- XP reward
- User's current progress count and percentage
- Unlock status and unlock date if achieved

**Plus Summary:**
- Total achievements available
- Total achievements unlocked by user

**Use Cases:**
- Display achievement gallery
- Show progress toward locked achievements
- Motivate users with unlockable rewards
- Display achievement requirements
- Track completion percentage

---

### 7.2 View My Achievements

**Endpoint:** `GET /api/exams/achievements/my/`

**Authentication:** Required

**Description:** Retrieve all achievements earned by the current user.

**Response:** List of earned achievements with:
- Achievement details (name, description, icon, badge, color, rarity)
- Unlock date and time
- Associated enrollment and exam
- Progress count at unlock
- XP earned

**Plus Summary:**
- Total achievements unlocked
- Total XP earned from achievements

**Use Cases:**
- Display user's achievement showcase
- Show unlocked badges and rewards
- Track achievement history
- Display total XP from achievements

---

### 7.3 View Exam Leaderboard

**Endpoint:** `GET /api/exams/<exam_id>/leaderboard/`

**Authentication:** Required

**Description:** View leaderboard rankings for an exam package. Shows top performers based on mock exam scores. Requires active enrollment to access.

**URL Parameters:**
- `exam_id` - UUID of the exam

**Query Parameters:**
- `type` - Leaderboard type: `best_score` (default) or `average_score`
- `limit` - Number of entries to return (default: 50, max: 100)

**Response:** List of leaderboard entries ranked by performance:
- Rank number
- Username and user ID
- Avatar image
- Best score or average score (based on type)
- Total mock exams attempted
- Mocks passed count
- Study streak in days

**Plus User's Own Position:**
- Current rank
- Performance stats

**Validation:**
- Verifies user is enrolled in exam
- Checks enrollment is active

**Use Cases:**
- Display competitive rankings
- Show top performers
- Motivate users with leaderboards
- Compare performance with peers
- Highlight achievement leaders

---

## 8. Reminders

The Exam Reminder endpoints follow standard REST patterns for a ViewSet resource.

### 8.1 Create Reminder

**Endpoint:** `POST /api/exams/reminders/`

**Authentication:** Required

**Description:** Create a study reminder or exam date reminder.

**Request Body:**
```json
{
  "exam": "exam-uuid",
  "reminder_type": "study_time",
  "reminder_time": "18:00:00",
  "reminder_date": "2024-01-15",
  "frequency": "daily",
  "message": "Time for your daily study session!",
  "is_active": true
}
```

**Reminder Types:**
- `study_time` - Daily study reminders
- `exam_date` - Exam date approaching reminder
- `custom` - Custom reminder message

**Frequency Options:**
- `once` - One-time reminder
- `daily` - Repeat daily
- `weekly` - Repeat weekly
- `weekdays` - Monday to Friday only

**Response:** Created reminder with ID, exam details, reminder settings, and activation status.

**Use Cases:**
- Set daily study time reminders
- Create exam countdown reminders
- Schedule practice test reminders
- Build consistent study habits

---

### 8.2 List My Reminders

**Endpoint:** `GET /api/exams/reminders/`

**Authentication:** Required

**Description:** List all reminders created by the current user.

**Response:** List of reminders with reminder settings, exam information, next trigger time, and active status.

**Use Cases:**
- Display all active reminders
- Manage reminder schedule
- View upcoming notifications

---

### 8.3 Get Reminder Details

**Endpoint:** `GET /api/exams/reminders/<reminder_id>/`

**Authentication:** Required

**Description:** Retrieve details of a specific reminder. Only accessible to the reminder owner.

**URL Parameters:**
- `reminder_id` - UUID of the reminder

**Response:** Complete reminder details with all settings and exam information.

**Use Cases:**
- View reminder configuration
- Check reminder schedule
- Verify reminder settings before editing

---

### 8.4 Update Reminder

**Endpoint:** `PUT /api/exams/reminders/<reminder_id>/` or `PATCH /api/exams/reminders/<reminder_id>/`

**Authentication:** Required

**Description:** Update reminder settings. Use PUT for full update or PATCH for partial update.

**URL Parameters:**
- `reminder_id` - UUID of the reminder (must belong to current user)

**Request Body:** Same as create, all fields optional for PATCH.

**Response:** Updated reminder with new settings.

**Use Cases:**
- Change reminder time
- Update frequency
- Modify reminder message
- Activate or deactivate reminder

---

### 8.5 Delete Reminder

**Endpoint:** `DELETE /api/exams/reminders/<reminder_id>/`

**Authentication:** Required

**Description:** Delete a reminder permanently.

**URL Parameters:**
- `reminder_id` - UUID of the reminder (must belong to current user)

**Response:** 204 No Content on successful deletion.

**Use Cases:**
- Remove unwanted reminders
- Clean up old reminders after exam completion
- Cancel notification schedules

---

## General Notes

### URL Conventions
- All list endpoints use hyphens in URLs (e.g., `/mock-exams/`, `/past-papers/`)
- Detail endpoints support both UUID and slug lookup where applicable
- Nested resources use parent IDs (e.g., `/exams/<exam_id>/courses/`)

### Error Responses
All endpoints return standard HTTP error responses:
- `400 Bad Request` - Invalid request data or parameters
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions (e.g., not enrolled)
- `404 Not Found` - Resource does not exist
- `500 Internal Server Error` - Server error

### Performance Optimization
- List endpoints use pagination to reduce response size
- Detail endpoints prefetch related data to minimize database queries
- Filters use database indexes for fast searching
- Images and files are served through CDN when available

### Data Privacy
- Users can only access their own enrollments, attempts, bookmarks, notes, and reminders
- Leaderboards only show public profile information
- Download tracking respects user privacy

### Mobile App Recommendations
- Cache exam details and course structure locally
- Sync progress and completed lessons periodically
- Download past papers for offline study
- Pre-load mock exam questions before starting timer
- Store bookmarks and notes locally with cloud sync
- Display achievement progress for engagement
- Show leaderboard for competitive motivation

### Web App Recommendations
- Implement lazy loading for course content
- Use pagination for large lists
- Display real-time progress updates
- Enable bulk bookmark and note management
- Provide advanced filtering in dashboards
- Show visual analytics from enrollment analytics endpoint

---

## ZlearnWeb Frontend Implementation

The ZlearnWeb app wires the Exam User API for **exams** user type as follows:

| Area | Implementation |
|------|----------------|
| **List exams** | `GET /exams/` with optional `featured`, `search`, etc. — Exams list page with search and featured filter. |
| **Exam detail** | `GET /exams/<slug\|uuid>/` — Markdown description, enroll button, course list, mock exams list. |
| **Enroll** | `POST /exams/<exam_id>/enroll/` — Enroll button on exam detail. |
| **My enrollments** | `GET /exams/enrollments/my/` — Used for “Enrolled” badge and enrollment checks. |
| **Courses in exam** | Exam detail includes courses; `GET /exams/<exam_id>/courses/<course_id>/` for course page with modules/lessons. |
| **Lesson detail** | `GET /exams/modules/<module_id>/lessons/<lesson_id>/` — Lesson viewer with sections (text, video, quiz) via `LessonSectionBlock`, markdown parsing, video playback, resources. |
| **Complete lesson** | `POST /exams/lessons/<lesson_id>/complete/` — “Mark as Complete” on lesson page. |
| **Mock exams** | `GET /exams/<exam_id>/mock-exams/` — Listed on exam detail when enrolled; “Start” links to take page. |
| **Start attempt** | `POST /exams/mock-exams/<mock_exam_id>/start/` — Called when entering take page. |
| **Submit attempt** | `POST /exams/mock-exam-attempts/<attempt_id>/submit/` — Submit with `answers` map; redirect to results. |
| **Results** | State from submit or `GET /exams/mock-exam-attempts/<attempt_id>/` — Score, pass/fail, time, correct count. |

Lesson content uses the same markdown parser, video embed (YouTube), and quiz UX as professional and academic flows. All exam API paths use base path `/exams/` (no `/api` prefix; base URL already includes `/api`).

---

## Support

For technical support, API issues, or feature requests, contact the development team or refer to the main API documentation.

**Last Updated:** January 2024  
**API Version:** 1.0
