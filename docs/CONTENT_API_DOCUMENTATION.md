# Content App API Documentation

Complete API reference for the Content App - Academic courses, modules, lessons, and progress tracking.

**Base URL**: `/api/content/`  
**Authentication**: All endpoints require authentication (JWT token)

---

## Table of Contents

1. [Subject Endpoints](#subject-endpoints)
2. [Course Endpoints](#course-endpoints)
3. [Module Endpoints](#module-endpoints)
4. [Lesson Endpoints](#lesson-endpoints)
5. [Enrollment Endpoints](#enrollment-endpoints)
6. [Progress Tracking Endpoints](#progress-tracking-endpoints)
7. [Review Endpoints](#review-endpoints)
8. [Search Endpoints](#search-endpoints)
9. [Admin Endpoints](#admin-endpoints)

---

## Subject Endpoints

### List All Subjects

Retrieve all active subjects for course categorization.

- **URL**: `/api/content/subjects/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Permissions**: Authenticated users

**Response**:
```json
[
  {
    "id": "uuid",
    "name": "Mathematics",
    "code": "MATH",
    "description": "Mathematical subjects",
    "icon": "🔢",
    "color": "#FF5733",
    "course_count": 12
  }
]
```

**Dependencies**: None

---

## Course Endpoints

### 1. List Courses

Get all published courses with filtering options.

- **URL**: `/api/content/courses/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Permissions**: Authenticated users

**Query Parameters**:
- `subject` (string, optional) - Filter by subject code (e.g., "MATH")
- `curriculum` (uuid/string, optional) - Filter by curriculum ID or exam_system
- `exam_system` (string, optional) - Filter by exam system (e.g., "GCE", "WAEC")
- `difficulty` (string, optional) - Filter by difficulty ("beginner", "intermediate", "advanced")
- `featured` (boolean, optional) - Get only featured courses (priority_order < 50)

**Response**:
```json
[
  {
    "id": "uuid",
    "title": "Effective Study Habits and Time Management",
    "description": "Master proven study techniques...",
    "subject": {
      "name": "Academic Skills",
      "code": "ACADEMIC_SK",
      "color": "#4A90E2"
    },
    "curriculum": "General Secondary Education",
    "curriculum_id": "uuid",
    "exam_system": "GCE",
    "difficulty": "beginner",
    "estimated_hours": 30,
    "module_count": 9,
    "lesson_count": 45,
    "thumbnail": "/media/courses/thumb.jpg",
    "created_at": "2026-03-01T10:00:00Z",
    "is_featured": true,
    "priority_order": 10,
    "course_type": "regular",
    "is_free": true,
    "price": "0.00",
    "currency": "XAF",
    "enrollment_deadline": null
  }
]
```

**Dependencies**:
- User's educational path (filters by user's program if available)
- Subject model
- Program model
- Curriculum model

**Features**:
- Auto-filters by user's current program
- Shows only published and active courses
- Supports multiple filter combinations

---

### 2. Course Detail

Get comprehensive course information including all modules and lessons.

- **URL**: `/api/content/courses/{course_id}/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Permissions**: Authenticated users

**URL Parameters**:
- `course_id` (uuid) - Course UUID

**Response**:
```json
{
  "id": "uuid",
  "title": "Effective Study Habits and Time Management",
  "description": "Complete course description...",
  "subject": {
    "name": "Academic Skills",
    "code": "ACADEMIC_SK",
    "color": "#4A90E2"
  },
  "program": {
    "name": "General Secondary",
    "class_level": "Form 5"
  },
  "curriculum": "General Secondary Education",
  "curriculum_id": "uuid",
  "exam_system": "GCE",
  "difficulty": "beginner",
  "estimated_hours": 30,
  "thumbnail": "/media/courses/thumb.jpg",
  "is_enrolled": false,
  "modules": [
    {
      "id": "uuid",
      "title": "Understanding How You Learn",
      "description": "Discover your learning style...",
      "order": 1,
      "lesson_count": 5,
      "lessons": [
        {
          "id": "uuid",
          "title": "What is Your Learning Style?",
          "description": "Identify whether you're visual...",
          "duration": "01:30:00",
          "content_type": "video",
          "is_free": true,
          "resource_count": 3
        }
      ]
    }
  ],
  "created_at": "2026-03-01T10:00:00Z",
  "updated_at": "2026-03-02T15:30:00Z",
  "enrollment_deadline": null
}
```

**Dependencies**:
- CourseEnrollment model (to check if user is enrolled)
- Module model (prefetched)
- Lesson model (prefetched)

---

### 3. Get Course Modules

List all modules for a specific course.

- **URL**: `/api/content/courses/{course_id}/modules/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Permissions**: Authenticated users

**URL Parameters**:
- `course_id` (uuid) - Course UUID

**Response**:
```json
[
  {
    "id": "uuid",
    "title": "Understanding How You Learn",
    "description": "Discover your learning style and preferences",
    "order": 1,
    "estimated_hours": 3,
    "is_optional": false,
    "lesson_count": 5,
    "progress": {
      "is_completed": false,
      "completed_at": null,
      "progress_percentage": 40
    }
  }
]
```

**Dependencies**:
- ModuleProgress model (for user progress)
- Lesson model (for lesson count)

---

### 4. Enroll in Course

Enroll the authenticated user in a course.

- **URL**: `/api/content/courses/{course_id}/enroll/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Permissions**: Authenticated users

**URL Parameters**:
- `course_id` (uuid) - Course UUID

**Request Body**: None (empty POST)

**Response** (Success - 201 Created):
```json
{
  "id": "uuid",
  "student": "user_uuid",
  "course": "course_uuid",
  "course_title": "Effective Study Habits and Time Management",
  "status": "active",
  "progress_percentage": 0,
  "enrolled_at": "2026-03-02T16:45:00Z",
  "last_accessed": null
}
```

**Response** (Error - 400):
```json
{
  "error": "Already enrolled in this course"
}
```

**Side Effects**:
- Creates CourseEnrollment record
- Increments course.enrollment_count
- Sends notification to user via core.utils.send_notification

**Dependencies**:
- Course model
- CourseEnrollment model
- Notification system (core.utils)

---

## Module Endpoints

### 1. Module Detail

Get detailed module information with all lessons.

- **URL**: `/api/content/modules/{module_id}/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Permissions**: Authenticated users

**URL Parameters**:
- `module_id` (uuid) - Module UUID

**Response**:
```json
{
  "id": "uuid",
  "title": "Understanding How You Learn",
  "description": "Discover your learning style...",
  "course": {
    "id": "uuid",
    "title": "Effective Study Habits and Time Management"
  },
  "order": 1,
  "estimated_hours": 3,
  "lesson_count": 5,
  "progress": {
    "is_completed": false,
    "completed_at": null,
    "progress_percentage": 40,
    "lessons_completed": 2,
    "lessons_total": 5
  }
}
```

**Dependencies**:
- ModuleProgress model
- LessonProgress model (for calculating progress)

---

### 2. Get Module Lessons

List all lessons within a module.

- **URL**: `/api/content/modules/{module_id}/lessons/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Permissions**: Authenticated users

**URL Parameters**:
- `module_id` (uuid) - Module UUID

**Response**:
```json
[
  {
    "id": "uuid",
    "title": "What is Your Learning Style?",
    "description": "Identify whether you're visual, auditory...",
    "order": 1,
    "duration": "01:30:00",
    "content_type": "video",
    "difficulty": "beginner",
    "is_free": true,
    "is_preview": true,
    "resource_count": 3,
    "section_count": 5,
    "progress": {
      "is_completed": false,
      "completed_at": null,
      "time_spent_minutes": 45
    }
  }
]
```

**Dependencies**:
- Lesson model
- LessonProgress model
- LearningResource model (for resource count)
- LessonSection model (for section count)

---

### 3. Complete Module

Mark a module as complete (admin/manual completion).

- **URL**: `/api/content/modules/{module_id}/complete/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Permissions**: Authenticated users enrolled in the course

**URL Parameters**:
- `module_id` (uuid) - Module UUID

**Request Body**: None

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Module completed!",
  "xp_awarded": 100
}
```

**Response** (Error - 400):
```json
{
  "error": "Not enrolled in this course"
}
```

**Side Effects**:
- Creates/updates ModuleProgress record
- Sets is_completed = true
- Awards XP (100 points for module completion)

**Dependencies**:
- Module model
- ModuleProgress model
- CourseEnrollment model
- XP system (accounts.views_profile.award_xp)

---

## Lesson Endpoints

### 1. Lesson Detail

Get comprehensive lesson information with all sections, resources, and user progress.

- **URL**: `/api/content/lessons/{lesson_id}/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Permissions**: Authenticated users

**URL Parameters**:
- `lesson_id` (uuid) - Lesson UUID

**Response**:
```json
{
  "id": "uuid",
  "title": "What is Your Learning Style?",
  "description": "Identify your learning style...",
  "module": {
    "id": "uuid",
    "title": "Understanding How You Learn",
    "course": {
      "id": "uuid",
      "title": "Effective Study Habits and Time Management"
    }
  },
  "order": 1,
  "duration": "01:30:00",
  "content_type": "video",
  "difficulty": "beginner",
  "learning_objectives": ["Identify learning styles", "Apply techniques"],
  "keywords": ["visual learning", "auditory learning"],
  "is_free": true,
  "is_preview": true,
  "sections": [
    {
      "id": "uuid",
      "order": 1,
      "section_type": "video",
      "title": "Introduction to Learning Styles",
      "text_content": null,
      "file": null,
      "url": "https://youtube.com/watch?v=...",
      "embed_code": null,
      "image_url": null,
      "content_url": "https://youtube.com/watch?v=...",
      "user_progress": {
        "is_completed": true,
        "progress_percentage": 100,
        "time_spent_seconds": 540
      },
      "quiz_questions": []
    },
    {
      "id": "uuid",
      "order": 2,
      "section_type": "quiz",
      "title": "Check Your Understanding",
      "text_content": null,
      "file": null,
      "url": null,
      "embed_code": null,
      "image_url": null,
      "content_url": null,
      "user_progress": {
        "is_completed": false,
        "progress_percentage": 0,
        "time_spent_seconds": 0
      },
      "quiz_questions": [
        {
          "id": "uuid",
          "text": "What are the three main learning styles?",
          "explanation": "The three main styles are...",
          "order": 1,
          "options": [
            {
              "id": "uuid",
              "text": "Visual, Auditory, Kinesthetic",
              "is_correct": true,
              "explanation": "Correct! These are the primary...",
              "order": 1
            },
            {
              "id": "uuid",
              "text": "Reading, Writing, Speaking",
              "is_correct": false,
              "explanation": "These are learning activities, not styles",
              "order": 2
            }
          ]
        }
      ]
    }
  ],
  "resources": [
    {
      "id": "uuid",
      "title": "Learning Styles Assessment PDF",
      "resource_type": "document",
      "file": "/media/resources/assessment.pdf",
      "url": null,
      "description": "Downloadable assessment tool",
      "order": 1
    }
  ],
  "user_progress": {
    "is_completed": false,
    "completed_at": null,
    "time_spent_minutes": 45
  }
}
```

**Section Types**:
- `video` - Video content (YouTube, Vimeo, or uploaded)
- `text` - Text/reading content
- `quiz` - Quiz questions
- `interactive` - Interactive exercises
- `reading` - Reading materials
- `practice` - Practice problems
- `assignment` - Assignments
- `discussion` - Discussion prompts
- `exam_prep` - Exam preparation materials
- `past_questions` - Past exam questions
- `mock_exam` - Mock exams
- `study_guide` - Study guides
- `exam_tips` - Exam tips
- `image` - Image content
- `audio` - Audio content
- `pdf` - PDF documents
- `embed` - Embedded content

**Dependencies**:
- Lesson model
- LessonSection model
- QuizQuestion model
- QuizOption model
- LearningResource model
- LessonProgress model
- SectionProgress model
- EnhancedLessonSerializer

---

### 2. Create Lesson

Create a new lesson (admin only).

- **URL**: `/api/content/lessons/create/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Permissions**: Admin/Instructor

**Request Body**:
```json
{
  "module": "module_uuid",
  "title": "New Lesson Title",
  "description": "Lesson description",
  "order": 3,
  "content_type": "video",
  "duration": "01:30:00",
  "difficulty": "intermediate",
  "learning_objectives": ["Objective 1", "Objective 2"],
  "keywords": ["keyword1", "keyword2"],
  "is_free": false,
  "is_preview": false
}
```

**Response** (Success - 201 Created):
```json
{
  "id": "uuid",
  "title": "New Lesson Title",
  "description": "Lesson description",
  "module": "module_uuid",
  "order": 3,
  "created_at": "2026-03-02T16:45:00Z"
}
```

**Dependencies**:
- Module model
- Lesson model

---

### 3. Complete Lesson

Mark a lesson as complete with XP rewards and progression tracking.

- **URL**: `/api/content/lessons/{lesson_id}/complete/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Permissions**: Authenticated users enrolled in the course

**URL Parameters**:
- `lesson_id` (uuid) - Lesson UUID

**Request Body**:
```json
{
  "time_spent_minutes": 45,
  "metadata": {
    "quiz_score": 85,
    "attempts": 1,
    "completed_sections": 5
  }
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Lesson completed!",
  "xp_awarded": 50,
  "level_up": false,
  "new_level": null,
  "next_unlocked": {
    "type": "lesson",
    "id": "uuid",
    "title": "Next Lesson Title"
  }
}
```

**Side Effects**:
- Creates/updates LessonProgress record
- Awards XP (50 points for lesson completion via accounts.views_profile.award_xp)
- Auto-completes module if all lessons are complete
- Awards additional module completion XP (100 points)
- Unlocks next lesson/module based on course structure
- Updates CourseEnrollment.last_accessed

**Dependencies**:
- Lesson model
- LessonProgress model
- ModuleProgress model
- CourseEnrollment model
- XP system (accounts.views_profile.award_xp)
- Unlock system (get_next_unlocked_item helper)

---

### 4. Update Lesson Progress

Track lesson progress without completing (for video watch time, reading progress).

- **URL**: `/api/content/lessons/{lesson_id}/progress/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Permissions**: Authenticated users enrolled in the course

**URL Parameters**:
- `lesson_id` (uuid) - Lesson UUID

**Request Body**:
```json
{
  "time_spent_minutes": 15,
  "progress_percentage": 60,
  "metadata": {
    "video_position": 540,
    "sections_viewed": 3
  }
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Progress updated",
  "progress_percentage": 60
}
```

**Dependencies**:
- Lesson model
- LessonProgress model
- CourseEnrollment model

---

## Enrollment Endpoints

### 1. User Enrollments

Get all course enrollments for the authenticated user.

- **URL**: `/api/content/enrollments/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Permissions**: Authenticated users

**Query Parameters**:
- `status` (string, optional) - Filter by enrollment status
  - Values: "active", "completed", "dropped", "suspended"
  - Default: Shows "active" and "completed" only

**Response**:
```json
[
  {
    "id": "uuid",
    "course": {
      "id": "uuid",
      "title": "Effective Study Habits and Time Management",
      "code": "STUDY_HABITS_001",
      "slug": "study-habits-001",
      "description": "Master proven study techniques...",
      "subject": {
        "id": "uuid",
        "name": "Academic Skills",
        "code": "ACADEMIC_SK"
      },
      "curriculum": "General Secondary Education",
      "curriculum_id": "uuid",
      "exam_system": "GCE",
      "difficulty": "beginner",
      "estimated_hours": 30,
      "thumbnail": "/media/courses/thumb.jpg",
      "course_type": "regular"
    },
    "status": "active",
    "progress_percentage": 35,
    "enrolled_at": "2026-03-01T10:00:00Z",
    "last_accessed": "2026-03-02T16:30:00Z",
    "completion_date": null
  }
]
```

**Dependencies**:
- CourseEnrollment model
- Course model
- Subject model

---

### 2. Enrollment Detail

Get detailed information about a specific enrollment.

- **URL**: `/api/content/enrollments/{enrollment_id}/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Permissions**: Authenticated users (own enrollments only)

**URL Parameters**:
- `enrollment_id` (uuid) - Enrollment UUID

**Response**:
```json
{
  "id": "uuid",
  "course": {
    "id": "uuid",
    "title": "Effective Study Habits and Time Management",
    "description": "Complete description..."
  },
  "student": "user_uuid",
  "status": "active",
  "progress_percentage": 35,
  "enrolled_at": "2026-03-01T10:00:00Z",
  "last_accessed": "2026-03-02T16:30:00Z",
  "completion_date": null,
  "certificate_issued": false,
  "final_grade": null
}
```

**Dependencies**:
- CourseEnrollment model
- Course model

---

## Progress Tracking Endpoints

### 1. User Progress Overview

Get overall progress summary across all enrolled courses.

- **URL**: `/api/content/progress/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Permissions**: Authenticated users

**Response**:
```json
{
  "total_courses": 5,
  "active_courses": 3,
  "completed_courses": 2,
  "total_lessons_completed": 127,
  "total_time_spent_hours": 45,
  "current_streak_days": 7,
  "recent_activity": [
    {
      "course_title": "Effective Study Habits",
      "lesson_title": "Time Management Techniques",
      "completed_at": "2026-03-02T16:30:00Z",
      "xp_earned": 50
    }
  ]
}
```

**Dependencies**:
- CourseEnrollment model
- LessonProgress model
- XP system

---

### 2. Course Progress Detail

Get detailed progress for a specific course with module and lesson breakdowns.

- **URL**: `/api/content/progress/courses/{course_id}/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Permissions**: Authenticated users enrolled in the course

**URL Parameters**:
- `course_id` (uuid) - Course UUID

**Response**:
```json
{
  "course": {
    "id": "uuid",
    "title": "Effective Study Habits and Time Management"
  },
  "enrollment": {
    "id": "uuid",
    "status": "active",
    "enrolled_at": "2026-03-01T10:00:00Z"
  },
  "overall_progress": 35,
  "modules_completed": 2,
  "modules_total": 9,
  "lessons_completed": 15,
  "lessons_total": 45,
  "time_spent_hours": 12,
  "current_position": {
    "module": {
      "id": "uuid",
      "title": "Setting Goals and Priorities"
    },
    "lesson": {
      "id": "uuid",
      "title": "SMART Goal Setting"
    }
  },
  "modules": [
    {
      "id": "uuid",
      "title": "Understanding How You Learn",
      "order": 1,
      "is_completed": true,
      "completed_at": "2026-03-01T18:00:00Z",
      "progress_percentage": 100,
      "lessons": [
        {
          "id": "uuid",
          "title": "What is Your Learning Style?",
          "order": 1,
          "is_completed": true,
          "completed_at": "2026-03-01T12:00:00Z",
          "time_spent_minutes": 45
        }
      ]
    }
  ]
}
```

**Dependencies**:
- Course model
- CourseEnrollment model
- ModuleProgress model
- LessonProgress model
- CoursePosition model

---

### 3. Lesson Progress Detail

Get detailed progress for a specific lesson including section-level tracking.

- **URL**: `/api/content/progress/lessons/{lesson_id}/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Permissions**: Authenticated users

**URL Parameters**:
- `lesson_id` (uuid) - Lesson UUID

**Response**:
```json
{
  "lesson": {
    "id": "uuid",
    "title": "What is Your Learning Style?",
    "module": {
      "id": "uuid",
      "title": "Understanding How You Learn"
    }
  },
  "is_completed": false,
  "completed_at": null,
  "time_spent_minutes": 45,
  "progress_percentage": 60,
  "sections_completed": 3,
  "sections_total": 5,
  "sections": [
    {
      "id": "uuid",
      "title": "Introduction to Learning Styles",
      "section_type": "video",
      "order": 1,
      "is_completed": true,
      "progress_percentage": 100,
      "time_spent_seconds": 540
    },
    {
      "id": "uuid",
      "title": "Check Your Understanding",
      "section_type": "quiz",
      "order": 2,
      "is_completed": false,
      "progress_percentage": 0,
      "time_spent_seconds": 0
    }
  ],
  "last_accessed": "2026-03-02T16:30:00Z"
}
```

**Dependencies**:
- Lesson model
- LessonProgress model
- SectionProgress model
- LessonSection model

---

### 4. Complete Section

Mark a lesson section as complete.

- **URL**: `/api/content/sections/{section_id}/complete/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Permissions**: Authenticated users

**URL Parameters**:
- `section_id` (uuid) - Section UUID

**Request Body**:
```json
{
  "time_spent_seconds": 540,
  "metadata": {
    "video_completed": true,
    "quiz_score": 80
  }
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Section completed!",
  "progress_percentage": 100
}
```

**Side Effects**:
- Creates/updates SectionProgress record
- Updates LessonProgress.progress_percentage
- Updates CourseEnrollment.last_accessed

**Dependencies**:
- LessonSection model
- SectionProgress model
- LessonProgress model
- CourseEnrollment model

---

### 5. Update Course Position

Update user's current position in a course (bookmark feature).

- **URL**: `/api/content/progress/courses/{course_id}/update-position/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Permissions**: Authenticated users enrolled in the course

**URL Parameters**:
- `course_id` (uuid) - Course UUID

**Request Body**:
```json
{
  "current_module": "module_uuid",
  "current_lesson": "lesson_uuid"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Position updated"
}
```

**Side Effects**:
- Creates/updates CoursePosition record
- Allows "Continue where you left off" functionality

**Dependencies**:
- Course model
- Module model
- Lesson model
- CoursePosition model
- CourseEnrollment model

---

## Review Endpoints

### 1. List Course Reviews

Get all reviews for a specific course.

- **URL**: `/api/content/courses/{course_id}/reviews/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Permissions**: Authenticated users

**URL Parameters**:
- `course_id` (uuid) - Course UUID

**Response**:
```json
[
  {
    "id": "uuid",
    "student": {
      "id": "uuid",
      "username": "john_doe",
      "full_name": "John Doe",
      "avatar": "/media/avatars/john.jpg"
    },
    "course": "uuid",
    "rating": 5,
    "comment": "Excellent course! Really helped improve my study habits.",
    "created_at": "2026-03-01T14:00:00Z",
    "updated_at": "2026-03-01T14:00:00Z"
  }
]
```

**Dependencies**:
- CourseReview model
- CourseReviewSerializer

---

### 2. Create Course Review

Submit a review for a course.

- **URL**: `/api/content/courses/{course_id}/reviews/create/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Permissions**: Authenticated users (must be enrolled)

**URL Parameters**:
- `course_id` (uuid) - Course UUID

**Request Body**:
```json
{
  "rating": 5,
  "comment": "Excellent course! Really helped improve my study habits."
}
```

**Response** (Success - 201 Created):
```json
{
  "id": "uuid",
  "student": "user_uuid",
  "course": "course_uuid",
  "rating": 5,
  "comment": "Excellent course! Really helped improve my study habits.",
  "created_at": "2026-03-02T16:45:00Z",
  "updated_at": "2026-03-02T16:45:00Z"
}
```

**Validation**:
- Rating must be 1-5
- User must be enrolled in the course
- One review per user per course

**Dependencies**:
- Course model
- CourseReview model
- CourseEnrollment model
- CourseReviewSerializer

---

## Search Endpoints

### Search Content

Search across courses, modules, and lessons.

- **URL**: `/api/content/search/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Permissions**: Authenticated users

**Query Parameters**:
- `q` (string, required) - Search query
- `type` (string, optional) - Filter by type ("course", "module", "lesson")
- `subject` (string, optional) - Filter by subject code
- `difficulty` (string, optional) - Filter by difficulty

**Response**:
```json
{
  "query": "study habits",
  "results": {
    "courses": [
      {
        "id": "uuid",
        "title": "Effective Study Habits and Time Management",
        "description": "Master proven study techniques...",
        "subject": "Academic Skills",
        "difficulty": "beginner",
        "type": "course"
      }
    ],
    "modules": [
      {
        "id": "uuid",
        "title": "Understanding How You Learn",
        "course_title": "Effective Study Habits",
        "type": "module"
      }
    ],
    "lessons": [
      {
        "id": "uuid",
        "title": "What is Your Learning Style?",
        "module_title": "Understanding How You Learn",
        "course_title": "Effective Study Habits",
        "type": "lesson"
      }
    ]
  },
  "total_results": 15
}
```

**Dependencies**:
- Course model
- Module model
- Lesson model
- Django Q objects for complex queries

---

## Admin Endpoints

All admin endpoints are prefixed with `/api/content/admin/` and require admin/instructor permissions.

### Admin Endpoint Structure

The admin API uses Django REST Framework ViewSets providing full CRUD operations:

- **List**: `GET /api/content/admin/{resource}/`
- **Create**: `POST /api/content/admin/{resource}/`
- **Retrieve**: `GET /api/content/admin/{resource}/{id}/`
- **Update**: `PUT /api/content/admin/{resource}/{id}/`
- **Partial Update**: `PATCH /api/content/admin/{resource}/{id}/`
- **Delete**: `DELETE /api/content/admin/{resource}/{id}/`

### Available Admin Resources

1. **Courses** - `/api/content/admin/courses/`
   - Full CRUD for Course model
   - Custom action: `POST /api/content/admin/courses/import_course/` - Import course from JSON
   - Permissions: Admin, Instructor

2. **Subjects** - `/api/content/admin/subjects/`
   - Full CRUD for Subject model
   - Permissions: Admin only

3. **Modules** - `/api/content/admin/modules/`
   - Full CRUD for Module model
   - Filter by course
   - Permissions: Admin, Instructor

4. **Lessons** - `/api/content/admin/lessons/`
   - Full CRUD for Lesson model
   - Filter by module, course
   - Permissions: Admin, Instructor

5. **Sections** - `/api/content/admin/sections/`
   - Full CRUD for LessonSection model
   - Filter by lesson
   - Permissions: Admin, Instructor

6. **Quiz Questions** - `/api/content/admin/quiz-questions/`
   - Full CRUD for QuizQuestion model
   - Filter by section
   - Permissions: Admin, Instructor

7. **Quiz Options** - `/api/content/admin/quiz-options/`
   - Full CRUD for QuizOption model
   - Filter by question
   - Permissions: Admin, Instructor

8. **Resources** - `/api/content/admin/resources/`
   - Full CRUD for LearningResource model
   - Filter by lesson
   - Permissions: Admin, Instructor

### Admin Import Endpoint

**Import Course from JSON**

- **URL**: `/api/content/admin/courses/import_course/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Permissions**: Admin, Instructor

**Request Body**:
```json
{
  "title": "Course Title",
  "code": "COURSE_CODE",
  "description": "Course description",
  "subject": "Subject Name or ID",
  "class_level": "Form 5",
  "instructor": "admin@zlearn.com",
  "difficulty": "beginner",
  "estimated_hours": 30,
  "modules": [
    {
      "title": "Module 1",
      "description": "Module description",
      "order": 1,
      "estimated_hours": 3,
      "lessons": [
        {
          "title": "Lesson 1",
          "description": "Lesson description",
          "order": 1,
          "content_type": "video",
          "duration": "01:30:00",
          "sections": [
            {
              "order": 1,
              "section_type": "video",
              "title": "Introduction",
              "url": "https://youtube.com/watch?v=..."
            }
          ],
          "resources": [
            {
              "title": "Study Guide PDF",
              "resource_type": "document",
              "url": "https://example.com/guide.pdf",
              "order": 1
            }
          ]
        }
      ]
    }
  ]
}
```

**Response** (Success - 201):
```json
{
  "success": true,
  "message": "Course 'Course Title' created successfully",
  "course_id": "uuid",
  "modules_created": 9,
  "lessons_created": 45,
  "sections_created": 150,
  "resources_created": 30
}
```

**Features**:
- Auto-creates Subject if doesn't exist
- Creates complete course hierarchy (modules → lessons → sections → quizzes → resources)
- Resolves instructor by email (falls back to request.user)
- Filters comment fields (fields starting with `_`)
- Validates all fields against model definitions
- Atomic transaction (all or nothing)

**Field Filtering**:
- **Comment fields**: Any field starting with `_` is ignored (e.g., `_comment`, `_NOTE`)
- **Module fields**: title, description, order, estimated_hours, is_optional, unlock_after
- **Lesson fields**: title, description, order, content_type, duration, difficulty, learning_objectives, keywords, is_free, is_preview, unlock_after
- **Section fields**: All LessonSection model fields
- **QuizQuestion fields**: text, explanation, order
- **QuizOption fields**: text, is_correct, explanation, order
- **Resource fields**: All LearningResource model fields (14 fields)

**Dependencies**:
- User model (instructor resolution)
- Subject model (auto-create if name provided)
- ClassLevel model
- Program model
- Curriculum model
- All content models (Course, Module, Lesson, LessonSection, QuizQuestion, QuizOption, LearningResource)

---

## Common Response Codes

- **200 OK** - Request successful
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid request data or validation error
- **401 Unauthorized** - Authentication required
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

---

## Authentication

All endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

**Getting a Token**:
```bash
POST /api/accounts/auth/login/
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response**:
```json
{
  "access": "jwt_access_token",
  "refresh": "jwt_refresh_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "user"
  }
}
```

---

## Filtering and Pagination

Most list endpoints support filtering via query parameters. Examples:

```bash
# Filter courses by subject
GET /api/content/courses/?subject=MATH

# Filter by multiple parameters
GET /api/content/courses/?subject=MATH&difficulty=advanced&featured=true

# Filter enrollments by status
GET /api/content/enrollments/?status=active
```

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- **Anonymous users**: 100 requests/hour
- **Authenticated users**: 1000 requests/hour
- **Admin users**: Unlimited

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1646236800
```

---

## Error Handling

All errors return a consistent JSON format:

```json
{
  "error": "Error message describing what went wrong",
  "code": "ERROR_CODE",
  "details": {
    "field": ["Specific field error"]
  }
}
```

**Common Error Codes**:
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid request data
- `NOT_ENROLLED` - User not enrolled in course
- `ALREADY_ENROLLED` - User already enrolled
- `PERMISSION_DENIED` - Insufficient permissions
- `AUTHENTICATION_REQUIRED` - No valid authentication token

---

## Webhooks (Future)

Planned webhook support for:
- Course enrollment events
- Lesson completion events
- Module completion events
- Course completion events
- Review submission events

---

## SDKs and Libraries

**JavaScript/TypeScript**:
```typescript
import { ContentAPI } from '@zlearn/sdk';

const api = new ContentAPI(API_BASE_URL, authToken);

// List courses
const courses = await api.courses.list({ subject: 'MATH' });

// Get course detail
const course = await api.courses.get(courseId);

// Enroll in course
const enrollment = await api.courses.enroll(courseId);

// Complete lesson
const result = await api.lessons.complete(lessonId, {
  time_spent_minutes: 45,
  metadata: { quiz_score: 85 }
});
```

**Python**:
```python
from zlearn_sdk import ContentAPI

api = ContentAPI(base_url=API_BASE_URL, token=auth_token)

# List courses
courses = api.courses.list(subject='MATH')

# Get course detail
course = api.courses.get(course_id)

# Enroll in course
enrollment = api.courses.enroll(course_id)

# Complete lesson
result = api.lessons.complete(lesson_id, 
    time_spent_minutes=45,
    metadata={'quiz_score': 85}
)
```

---

## Migration Notes

If migrating from the Professional Courses API (`/api/courses/`):

1. **Base URL Change**: `/api/courses/` → `/api/content/`
2. **Model Differences**:
   - `Content.Course` includes academic-specific fields (exam_system, curriculum)
   - `Content.Module` simplified structure (no is_published field)
   - Enhanced progress tracking with section-level granularity
3. **New Features**:
   - Section-level progress tracking
   - Enhanced quiz system with explanations
   - Learning resource management
   - Course position bookmarking
4. **Removed Features**:
   - Certificate generation (moved to separate service)
   - Badge awards (moved to gamification service)

---

## Frontend integration (Z-Learn Web)

The web app uses the Content API when `user_type === 'academic'`. Key mappings:

| Action | Endpoint used |
|--------|----------------|
| List courses | `GET /api/content/courses/` |
| Featured courses | `GET /api/content/courses/?featured=true` |
| Course detail | `GET /api/content/courses/{course_id}/` (UUID only) |
| Enrollments | `GET /api/content/enrollments/` (normalized: `course` object → `id`, `title`, `slug`, `progress_percentage`) |
| Enroll | `POST /api/content/courses/{course_id}/enroll/` (empty body) |
| Course progress | `GET /api/content/progress/courses/{course_id}/` |
| Update position | `POST /api/content/progress/courses/{course_id}/update-position/` (`current_module`, `current_lesson`) |
| Lesson detail | `GET /api/content/lessons/{lesson_id}/` |
| Complete lesson | `POST /api/content/lessons/{lesson_id}/complete/` (`time_spent_minutes`, optional `metadata`) |
| Lesson progress | `POST /api/content/lessons/{lesson_id}/progress/` (optional, for video/reading progress) |
| Create review | `POST /api/content/courses/{course_id}/reviews/create/` (`rating`, `comment`) |
| List reviews | `GET /api/content/courses/{course_id}/reviews/` |
| Subjects | `GET /api/content/subjects/` |
| User progress overview | `GET /api/content/progress/` |

- **Course detail** is requested by UUID; `modules` and `modules[].lessons` are used as-is. Lesson type is taken from `content_type` (e.g. `video`, `text`, `quiz`).
- **Lesson sections**: video URL is taken from `section.video_url` or `section.content_url` or `section.url`.
- **Enrollment list**: when `course` is an object, the frontend normalizes to `{ id: course.id, title: course.title, slug: course.slug, progress_percentage }` for display and enrollment checks.

---

## Support and Feedback

For API support:
- **Documentation**: https://docs.zlearn.com/api/content
- **Email**: api-support@zlearn.com
- **Discord**: https://discord.gg/zlearn-dev
- **GitHub Issues**: https://github.com/zlearn/api/issues

---

**Last Updated**: March 2, 2026  
**API Version**: 1.0  
**Changelog**: https://docs.zlearn.com/api/content/changelog
