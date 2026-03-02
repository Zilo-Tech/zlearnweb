# Courses App API Documentation

## 🎯 Base URL
```
https://api.z-learn.app/api/courses/
```

---

## 📚 Table of Contents
1. [Course Catalog](#course-catalog)
2. [Course Details](#course-details)
3. [Course Enrollment](#course-enrollment)
4. [Course Progress](#course-progress)
5. [Course Reviews](#course-reviews)
6. [Course Wishlist](#course-wishlist)
7. [Modules & Lessons](#modules--lessons)
8. [Getting Individual Lessons](#getting-individual-lessons)
9. [Lesson Progress & Navigation](#lesson-progress--navigation)
10. [Interactive Elements](#interactive-elements)
11. [Sections & Resources](#sections--resources)
12. [Course Progress Tracking](#course-progress-tracking)
13. [Course Certificates](#course-certificates)
14. [Common Mistakes](#common-mistakes)
15. [Complete Frontend Example](#complete-frontend-example)

---

## Course Catalog

### List All Courses
Get all published professional courses.

```http
GET /api/courses/
```

**Authentication:** Not required (public)

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `category` | UUID | Filter by category ID | `?category=uuid` |
| `level` | string | beginner, intermediate, advanced, expert | `?level=beginner` |
| `instructor` | UUID | Filter by instructor ID | `?instructor=uuid` |
| `is_free` | boolean | true/false | `?is_free=true` |
| `featured` | boolean | true/false | `?featured=true` |
| `min_price` | decimal | Minimum price | `?min_price=0` |
| `max_price` | decimal | Maximum price | `?max_price=100` |
| `min_rating` | decimal | Minimum rating (0-5) | `?min_rating=4.0` |
| `search` | string | Search in title/description | `?search=AI` |
| `ordering` | string | Sort field | `?ordering=-created_at` |

**Available Ordering Fields:**
- `created_at` (newest first: `-created_at`)
- `rating` (highest first: `-rating`)
- `price` (lowest first: `price`)
- `total_ratings` (most reviewed: `-total_ratings`)
- `current_enrollments` (most popular: `-current_enrollments`)

**Response Example:**
```json
{
  "count": 6,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "3510de7a-e680-4717-9aec-1c67b2341131",
      "title": "AI Fundamentals: Understand & Use Modern AI in Your Work",
      "slug": "ai-fundamentals:-understand-&-use-modern-ai-in-your-work",
      "short_description": "Go from AI-curious to AI-confident...",
      "instructor_name": "John Doe",
      "category_name": "Artificial Intelligence",
      "level": "beginner",
      "price": "0.00",
      "is_free": true,
      "rating": 4.5,
      "total_ratings": 120,
      "thumbnail": "https://...",
      "duration_hours": 22,
      "total_lessons": 12,
      "current_enrollments": 350,
      "featured": true,
      "created_at": "2026-03-02T00:16:17Z"
    }
  ]
}
```

**Frontend Example:**
```javascript
// Get all courses
const response = await fetch('https://api.z-learn.app/api/courses/');
const data = await response.json();

// Get featured beginner courses
const featured = await fetch('https://api.z-learn.app/api/courses/?featured=true&level=beginner');

// Search for AI courses
const aiCourses = await fetch('https://api.z-learn.app/api/courses/?search=AI&is_free=true');

// Get courses sorted by rating
const topRated = await fetch('https://api.z-learn.app/api/courses/?ordering=-rating&min_rating=4.0');
```

---

### Featured Courses
Get featured courses with reduced response (faster).

```http
GET /api/courses/featured/
```

**Authentication:** Not required

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | integer | Number of courses (default: 10) |

**Response Example:**
```json
[
  {
    "id": "uuid",
    "title": "AI Fundamentals",
    "slug": "ai-fundamentals:-understand-&-use-modern-ai-in-your-work",
    "thumbnail": "https://...",
    "instructor_name": "John Doe",
    "rating": 4.5,
    "price": "0.00",
    "is_free": true
  }
]
```

---

### Popular Courses
Get most enrolled courses.

```http
GET /api/courses/popular/
```

**Authentication:** Not required

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | integer | Number of courses (default: 10) |

---

### Course Categories
Get all active course categories.

```http
GET /api/courses/categories/
```

**Authentication:** Not required

**Response Example:**
```json
[
  {
    "id": "uuid",
    "name": "Artificial Intelligence",
    "slug": "artificial-intelligence",
    "description": "AI and machine learning courses",
    "icon": "robot",
    "color": "#FF5733",
    "course_count": 15
  }
]
```

---

## Course Details

### Get Course by Slug
Get full course details with modules and lessons.

```http
GET /api/courses/{slug}/
```

**Authentication:** Not required

**URL Parameters:**
- `slug` (string) - Course slug (from course list)

**Response Example:**
```json
{
  "id": "3510de7a-e680-4717-9aec-1c67b2341131",
  "title": "AI Fundamentals: Understand & Use Modern AI in Your Work",
  "slug": "ai-fundamentals:-understand-&-use-modern-ai-in-your-work",
  "description": "Full description...",
  "short_description": "Short description...",
  "course_code": "AI-FUND-001",
  "course_type": "professional",
  "instructor": {
    "id": "uuid",
    "email": "instructor@example.com",
    "full_name": "John Doe",
    "bio": "..."
  },
  "category": {
    "id": "uuid",
    "name": "Artificial Intelligence",
    "slug": "artificial-intelligence"
  },
  "level": "beginner",
  "status": "published",
  "thumbnail": "https://...",
  "banner_image": "https://...",
  "price": "0.00",
  "currency": "USD",
  "is_free": true,
  "discount_price": null,
  "duration_hours": 22,
  "duration_weeks": 8,
  "total_lessons": 12,
  "rating": 4.5,
  "total_ratings": 120,
  "current_enrollments": 350,
  "max_enrollments": null,
  "featured": true,
  "tags": ["AI", "Machine Learning", "ChatGPT"],
  "prerequisites": [],
  "modules": [
    {
      "id": "uuid",
      "title": "Module 1: Welcome to the Age of AI",
      "description": "...",
      "order": 1,
      "is_published": true,
      "duration_minutes": 120,
      "lessons": [
        {
          "id": "uuid",
          "title": "Introduction to AI",
          "lesson_type": "video",
          "order": 1,
          "duration_minutes": 30,
          "is_free_preview": true
        }
      ]
    }
  ],
  "created_at": "2026-03-02T00:16:17Z"
}
```

**Frontend Example:**
```javascript
// CORRECT - Use slug
const slug = 'ai-fundamentals:-understand-&-use-modern-ai-in-your-work';
const response = await fetch(`https://api.z-learn.app/api/courses/${slug}/`);
const course = await response.json();

// WRONG - Don't use UUID from course list
// const response = await fetch(`https://api.z-learn.app/api/courses/${course.id}/`); // ❌ 404 Error
```

---

### Course Statistics
Get detailed course statistics (for instructors/admins).

```http
GET /api/courses/{course_id}/stats/
```

**Authentication:** Required (instructor or admin)

**URL Parameters:**
- `course_id` (UUID) - Course ID

**Response Example:**
```json
{
  "total_enrollments": 350,
  "active_students": 280,
  "completion_rate": 45.5,
  "average_progress": 62.3,
  "total_reviews": 120,
  "average_rating": 4.5,
  "revenue": "0.00",
  "popular_lessons": [...]
}
```

---

## Course Enrollment

### Enroll in Course
Enroll the authenticated user in a course.

```http
POST /api/courses/enroll/
```

**Authentication:** Required

**Request Body:**
```json
{
  "course": "course-slug-here"
}
```

**Response Example:**
```json
{
  "id": "uuid",
  "course": {
    "id": "uuid",
    "title": "AI Fundamentals",
    "slug": "ai-fundamentals:-understand-&-use-modern-ai-in-your-work"
  },
  "student": {
    "id": "uuid",
    "email": "student@example.com"
  },
  "enrollment_date": "2026-03-02T10:30:00Z",
  "status": "active",
  "progress_percentage": 0,
  "is_completed": false
}
```

**Frontend Example:**
```javascript
const enrollCourse = async (courseSlug, token) => {
  const response = await fetch('https://api.z-learn.app/api/courses/enroll/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      course: courseSlug
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Enrollment failed');
  }
  
  return await response.json();
};

// Usage
try {
  const enrollment = await enrollCourse('ai-fundamentals:-understand-&-use-modern-ai-in-your-work', userToken);
  console.log('Successfully enrolled!', enrollment);
} catch (error) {
  console.error('Enrollment error:', error.message);
}
```

---

### My Enrollments
Get all courses the authenticated user is enrolled in.

```http
GET /api/courses/enrollments/
```

**Authentication:** Required

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | active, completed, suspended | 
| `ordering` | string | enrollment_date, progress_percentage |

**Response Example:**
```json
[
  {
    "id": "uuid",
    "course": {
      "id": "uuid",
      "title": "AI Fundamentals",
      "slug": "ai-fundamentals:-understand-&-use-modern-ai-in-your-work",
      "thumbnail": "https://..."
    },
    "enrollment_date": "2026-03-02T10:30:00Z",
    "status": "active",
    "progress_percentage": 35.5,
    "lessons_completed": 4,
    "total_lessons": 12,
    "last_accessed": "2026-03-02T15:20:00Z",
    "is_completed": false,
    "completion_date": null
  }
]
```

**Frontend Example:**
```javascript
// Get all enrollments
const response = await fetch('https://api.z-learn.app/api/courses/enrollments/', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const enrollments = await response.json();

// Get only active enrollments
const active = await fetch('https://api.z-learn.app/api/courses/enrollments/?status=active', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## Course Progress

### Get Course Progress
Get detailed progress for a specific course enrollment.

```http
GET /api/courses/progress/{course_id}/
```

**Authentication:** Required

**URL Parameters:**
- `course_id` (UUID) - Course ID

**Response Example:**
```json
{
  "course": {
    "id": "uuid",
    "title": "AI Fundamentals",
    "total_lessons": 12,
    "total_modules": 9
  },
  "progress_percentage": 35.5,
  "lessons_completed": 4,
  "modules_completed": 1,
  "sections_completed": 8,
  "current_position": {
    "module": "uuid",
    "lesson": "uuid",
    "section": "uuid"
  },
  "time_spent_minutes": 180,
  "last_accessed": "2026-03-02T15:20:00Z",
  "completed_lessons": ["uuid1", "uuid2", ...],
  "completed_modules": ["uuid1"],
  "completed_sections": ["uuid1", "uuid2", ...]
}
```

---

### Update Course Position
Update the user's current position in the course (last viewed lesson/module).

```http
POST /api/courses/progress/{course_id}/update-position/
```

**Authentication:** Required

**Request Body:**
```json
{
  "module_id": "uuid",
  "lesson_id": "uuid",
  "section_id": "uuid"  // optional
}
```

**Response:**
```json
{
  "message": "Position updated successfully",
  "current_module": "uuid",
  "current_lesson": "uuid",
  "current_section": "uuid"
}
```

---

### Mark Lesson Complete
Mark a lesson as completed.

```http
POST /api/courses/lessons/{lesson_id}/complete/
```

**Authentication:** Required

**Request Body:**
```json
{
  "time_spent_minutes": 30,
  "notes": "Optional user notes"
}
```

**Response:**
```json
{
  "message": "Lesson marked as complete",
  "lesson_id": "uuid",
  "completed_at": "2026-03-02T16:00:00Z",
  "progress_percentage": 40.0,
  "xp_earned": 50
}
```

---

### Mark Module Complete
Mark an entire module as completed.

```http
POST /api/courses/modules/{module_id}/complete/
```

**Authentication:** Required

**Response:**
```json
{
  "message": "Module marked as complete",
  "module_id": "uuid",
  "completed_at": "2026-03-02T16:30:00Z",
  "xp_earned": 200
}
```

---

### Mark Section Complete
Mark a lesson section as completed.

```http
POST /api/courses/sections/{section_id}/complete/
```

**Authentication:** Required

**Request Body:**
```json
{
  "time_spent_seconds": 300,
  "video_progress_seconds": 280,
  "quiz_score": 85.5,
  "notes": "Optional notes"
}
```

---

## Course Reviews

### List Reviews
Get all reviews for a course.

```http
GET /api/courses/{course_id}/reviews/
```

**Authentication:** Not required

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `rating` | integer | Filter by rating (1-5) |
| `ordering` | string | -created_at, rating, -rating |

**Response Example:**
```json
[
  {
    "id": "uuid",
    "student": {
      "id": "uuid",
      "full_name": "Jane Doe",
      "avatar": "https://..."
    },
    "rating": 5,
    "comment": "Excellent course! Very practical and easy to follow.",
    "created_at": "2026-03-01T12:00:00Z",
    "helpful_count": 15,
    "is_verified_purchase": true
  }
]
```

---

### Create Review
Create a review for a course you're enrolled in.

```http
POST /api/courses/reviews/create/
```

**Authentication:** Required

**Request Body:**
```json
{
  "course": "course-uuid-here",
  "rating": 5,
  "comment": "This course was amazing! I learned so much about AI."
}
```

**Validation:**
- Must be enrolled in the course
- Can only review once per course
- Rating must be 1-5

**Response:**
```json
{
  "id": "uuid",
  "course": "uuid",
  "rating": 5,
  "comment": "This course was amazing!...",
  "created_at": "2026-03-02T17:00:00Z"
}
```

---

## Course Wishlist

### Get My Wishlist
Get all courses in authenticated user's wishlist.

```http
GET /api/courses/wishlist/
```

**Authentication:** Required

**Response Example:**
```json
[
  {
    "id": 1,
    "course": {
      "id": "uuid",
      "title": "Advanced Python Programming",
      "slug": "advanced-python-programming",
      "thumbnail": "https://...",
      "price": "49.99",
      "is_free": false
    },
    "added_at": "2026-03-01T10:00:00Z"
  }
]
```

---

### Toggle Wishlist
Add or remove a course from wishlist.

```http
POST /api/courses/{course_id}/wishlist/toggle/
```

**Authentication:** Required

**Response:**
```json
{
  "added": true,
  "message": "Course added to wishlist"
}
```

Or if removing:
```json
{
  "added": false,
  "message": "Course removed from wishlist"
}
```

**Frontend Example:**
```javascript
const toggleWishlist = async (courseId, token) => {
  const response = await fetch(
    `https://api.z-learn.app/api/courses/${courseId}/wishlist/toggle/`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  const result = await response.json();
  console.log(result.message); // "Course added to wishlist" or "Course removed..."
  return result.added; // true or false
};
```

---

## Modules & Lessons

Modules and lessons are included in the course detail response, but you can also access them directly.

### Module Structure (from course detail)
```json
{
  "id": "uuid",
  "title": "Module 1: Introduction",
  "description": "Learn the basics",
  "order": 1,
  "is_published": true,
  "duration_minutes": 120,
  "lesson_count": 5
}
```

---

## Getting Individual Lessons

### Get All Lessons
Get all published lessons, optionally filtered by module.

```http
GET /api/courses/enhanced/lessons/
GET /api/courses/enhanced/lessons/?module={module_id}
```

**Authentication:** Optional (returns more data if authenticated)

**Query Parameters:**
- `module` - Filter by module UUID

**Response Example:**
```json
[
  {
    "id": "uuid",
    "module": "module-uuid",
    "title": "Introduction to Neural Networks",
    "description": "Learn the basics of neural networks",
    "lesson_type": "video",
    "order": 1,
    "content": "<p>Lesson content HTML...</p>",
    "video_url": "https://example.com/video.mp4",
    "video_file": null,
    "duration_minutes": 45,
    "video_qualities": {
      "1080p": "https://...",
      "720p": "https://...",
      "480p": "https://..."
    },
    "video_thumbnail": "https://...",
    "video_subtitles": {
      "en": "https://...",
      "es": "https://..."
    },
    "video_transcript": "Full transcript text...",
    "video_duration_seconds": 2700,
    "learning_objectives": [
      "Understand neural network basics",
      "Identify key components"
    ],
    "completion_criteria": {
      "min_time_spent": 30,
      "video_percentage": 95,
      "quiz_pass_score": 80
    },
    "difficulty": "intermediate",
    "estimated_time_minutes": 45,
    "attachments": ["https://..."],
    "external_links": {
      "research_paper": "https://...",
      "code_repo": "https://github.com/..."
    },
    "is_published": true,
    "is_preview": false,
    "requires_completion": true,
    "is_completed": false,
    "progress": {
      "status": "in_progress",
      "progress_percentage": 45,
      "time_spent_minutes": 20,
      "resources_viewed": 2,
      "total_resources": 5,
      "quiz_score": null,
      "quiz_passed": false,
      "video_progress_seconds": 1200,
      "video_completed": false,
      "last_accessed": "2024-01-15T10:30:00Z"
    },
    "interactive_elements": [],
    "navigation": {
      "previous_lesson": "previous-lesson-uuid",
      "next_lesson": "next-lesson-uuid",
      "related_lessons": ["uuid1", "uuid2", "uuid3"]
    },
    "resources": [
      {
        "id": "uuid",
        "title": "Neural Networks Cheat Sheet",
        "type": "pdf",
        "url": "https://...",
        "size_mb": 2.5
      }
    ],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-10T00:00:00Z"
  }
]
```

**Frontend Example:**
```javascript
const getModuleLessons = async (moduleId, token = null) => {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(
    `https://api.z-learn.app/api/courses/enhanced/lessons/?module=${moduleId}`,
    { headers }
  );
  
  const lessons = await response.json();
  return lessons;
};
```

---

### Get Lesson Detail
Get detailed information about a specific lesson.

```http
GET /api/courses/enhanced/lessons/{lesson_id}/
```

**Authentication:** Optional (returns progress if authenticated)

**Response:** Same as lesson object above

**Frontend Example:**
```javascript
const getLessonDetail = async (lessonId, token = null) => {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(
    `https://api.z-learn.app/api/courses/enhanced/lessons/${lessonId}/`,
    { headers }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch lesson');
  }
  
  return await response.json();
};
```

---

### Lesson Types
- `video` - Video lesson
- `text` - Text-based lesson  
- `quiz` - Quiz/assessment
- `assignment` - Assignment/project
- `interactive` - Interactive content
- `live` - Live session
- `reading` - Reading material
- `exercise` - Practice exercise

---

## Lesson Progress & Navigation

### Start Lesson Progress
Mark a lesson as started and begin tracking progress.

```http
POST /api/courses/lessons/{lesson_id}/start-progress/
```

**Authentication:** Required

**Response:**
```json
{
  "message": "Lesson progress started",
  "progress": {
    "status": "in_progress",
    "progress_percentage": 0
  }
}
```

**Frontend Example:**
```javascript
const startLesson = async (lessonId, token) => {
  const response = await fetch(
    `https://api.z-learn.app/api/courses/lessons/${lessonId}/start-progress/`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  return await response.json();
};
```

---

### Update Lesson Progress
Update progress metrics (time spent, video progress, resources viewed).

```http
POST /api/courses/lessons/{lesson_id}/update-progress/
```

**Authentication:** Required

**Request Body:**
```json
{
  "time_spent_minutes": 15,
  "video_progress_seconds": 900,
  "resources_viewed": 3
}
```

**Response:**
```json
{
  "message": "Progress updated",
  "progress": {
    "status": "in_progress",
    "progress_percentage": 65,
    "time_spent_minutes": 35,
    "video_completed": true
  }
}
```

**Frontend Example:**
```javascript
const updateLessonProgress = async (lessonId, progressData, token) => {
  const response = await fetch(
    `https://api.z-learn.app/api/courses/lessons/${lessonId}/update-progress/`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(progressData)
    }
  );
  
  return await response.json();
};

// Usage example:
await updateLessonProgress('lesson-uuid', {
  time_spent_minutes: 10,
  video_progress_seconds: 600,
  resources_viewed: 2
}, userToken);
```

---

### Complete Lesson
Mark lesson as completed (legacy endpoint, prefer using update-progress).

```http
POST /api/courses/lessons/{lesson_id}/complete/
```

**Authentication:** Required

**Response:**
```json
{
  "message": "Lesson marked as complete",
  "next_lesson_id": "next-lesson-uuid"
}
```

---

### Get Lesson Navigation
Get previous, next, and related lessons.

```http
GET /api/courses/lessons/{lesson_id}/navigation/
```

**Authentication:** Optional

**Response:**
```json
{
  "previous_lesson": "previous-lesson-uuid",
  "next_lesson": "next-lesson-uuid",
  "related_lessons": ["uuid1", "uuid2", "uuid3"]
}
```

**Frontend Example:**
```javascript
const getLessonNavigation = async (lessonId, token = null) => {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(
    `https://api.z-learn.app/api/courses/lessons/${lessonId}/navigation/`,
    { headers }
  );
  
  return await response.json();
};

// Usage:
const nav = await getLessonNavigation('lesson-uuid');
if (nav.next_lesson) {
  // Navigate to next lesson
  window.location.href = `/lessons/${nav.next_lesson}`;
}
```

---

## Interactive Elements

### Get Lesson Interactive Elements
Get all interactive elements (quizzes, code exercises, etc.) for a lesson.

```http
GET /api/courses/lessons/{lesson_id}/interactive/
```

**Authentication:** Optional

**Response:**
```json
[
  {
    "id": "uuid",
    "lesson": "lesson-uuid",
    "element_type": "quiz",
    "title": "Quick Knowledge Check",
    "order": 1,
    "content": {
      "questions": [
        {
          "question": "What is a neural network?",
          "options": ["A", "B", "C", "D"],
          "correct_answer": "B"
        }
      ]
    },
    "settings": {
      "max_attempts": 3,
      "time_limit_minutes": 10,
      "pass_score": 70
    },
    "is_required": true,
    "points": 10
  }
]
```

**Element Types:**
- `quiz` - Multiple choice quiz
- `code_challenge` - Coding exercise
- `flashcards` - Flashcard deck
- `poll` - Interactive poll
- `discussion` - Discussion prompt
- `simulation` - Interactive simulation

---

## Sections & Resources

### Get Lesson Sections
Sections are parts of a lesson (video, text, code, quiz, etc.).

```http
GET /api/courses/sections/?lesson={lesson_id}
```

**Authentication:** Required if course is not free

**Response Example:**
```json
[
  {
    "id": "uuid",
    "lesson": "uuid",
    "title": "Introduction Video",
    "section_type": "video",
    "order": 1,
    "video_url": "https://...",
    "video_duration_seconds": 600,
    "is_required": true,
    "is_published": true,
    "estimated_time_minutes": 10
  },
  {
    "id": "uuid",
    "lesson": "uuid",
    "title": "Practice Quiz",
    "section_type": "quiz",
    "order": 2,
    "quiz_questions": [...],
    "is_required": true
  }
]
```

**Section Types:**
- `video` - Video content
- `text` - Text/article
- `code` - Code snippet/editor
- `quiz` - Quiz questions
- `image` - Image with caption
- `audio` - Audio content
- `file` - Downloadable file
- `embed` - Embedded content (YouTube, etc.)

---

### Learning Resources
Additional resources attached to lessons.

```http
GET /api/courses/resources/?lesson={lesson_id}
```

**Response Example:**
```json
[
  {
    "id": "uuid",
    "title": "AI Fundamentals Cheat Sheet",
    "description": "Quick reference guide",
    "resource_type": "pdf",
    "file": "https://...",
    "file_size_mb": 2.5,
    "download_allowed": true,
    "is_required": false
  }
]
```

---

## Common Mistakes

### ❌ MISTAKE 1: Using Wrong Base URL
```javascript
// WRONG - This is for academic/school courses
fetch('https://api.z-learn.app/api/content/courses/');

// CORRECT - For professional courses
fetch('https://api.z-learn.app/api/courses/');
```

---

### ❌ MISTAKE 2: Using UUID Instead of Slug
```javascript
// WRONG - Course detail requires slug, not UUID
const course = await fetch(`https://api.z-learn.app/api/courses/${courseId}/`);

// CORRECT - Use the slug field
const course = await fetch(`https://api.z-learn.app/api/courses/${courseSlug}/`);
```

---

### ❌ MISTAKE 3: Not URL-Encoding Slug
```javascript
// WRONG - Special characters not encoded
fetch(`https://api.z-learn.app/api/courses/ai-fundamentals:-understand-&-use-modern-ai-in-your-work/`);

// CORRECT - Use encodeURIComponent
const slug = 'ai-fundamentals:-understand-&-use-modern-ai-in-your-work';
fetch(`https://api.z-learn.app/api/courses/${encodeURIComponent(slug)}/`);
```

---

### ❌ MISTAKE 4: Missing Authentication
```javascript
// WRONG - Enrollment requires authentication
fetch('https://api.z-learn.app/api/courses/enroll/', {
  method: 'POST',
  body: JSON.stringify({ course: 'slug' })
});

// CORRECT - Include Authorization header
fetch('https://api.z-learn.app/api/courses/enroll/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ course: 'slug' })
});
```

---

### ❌ MISTAKE 5: Wrong Field Names in Enrollment
```javascript
// WRONG - Using course ID instead of slug
{
  "course": "3510de7a-e680-4717-9aec-1c67b2341131"  // UUID
}

// CORRECT - Use course slug
{
  "course": "ai-fundamentals:-understand-&-use-modern-ai-in-your-work"  // Slug
}
```

---

### ❌ MISTAKE 6: Expecting Lessons in Course List
```javascript
// WRONG - Lessons are NOT in the list response
fetch('/api/courses/')
  .then(r => r.json())
  .then(courses => {
    courses.forEach(course => {
      console.log(course.modules); // ❌ undefined in list!
    });
  });

// CORRECT - Get lessons from course detail OR use enhanced/lessons endpoint
// Option 1: From course detail (nested in modules)
const course = await fetch(`/api/courses/${slug}/`).then(r => r.json());
course.modules.forEach(module => {
  console.log(module.lessons); // ✅ Available in detail
});

// Option 2: Directly fetch lessons for a module
const lessons = await fetch(
  `/api/courses/enhanced/lessons/?module=${moduleId}`
).then(r => r.json());
```

---

### ❌ MISTAKE 7: Not Using Enhanced Lesson Endpoint
```javascript
// WRONG - Trying to get individual lesson without proper endpoint
// (There's no /api/courses/lessons/{id}/ endpoint)
fetch(`/api/courses/lessons/${lessonId}/`) // ❌ 404 Error

// CORRECT - Use enhanced lessons endpoint
fetch(`/api/courses/enhanced/lessons/${lessonId}/`) // ✅ Works!
  .then(r => r.json())
  .then(lesson => {
    console.log(lesson.title);
    console.log(lesson.progress); // Includes progress if authenticated
    console.log(lesson.navigation); // Previous/next lessons
  });
```

---

## Complete Frontend Example

```javascript
// ====================================
// Course Catalog Component
// ====================================
class CourseCatalog {
  constructor(baseURL = 'https://api.z-learn.app') {
    this.baseURL = baseURL;
  }

  async getAllCourses(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${this.baseURL}/api/courses/?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    
    return await response.json();
  }

  async getCourseDetail(slug) {
    const encodedSlug = encodeURIComponent(slug);
    const response = await fetch(`${this.baseURL}/api/courses/${encodedSlug}/`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Course not found');
      }
      throw new Error('Failed to fetch course details');
    }
    
    return await response.json();
  }

  async enrollCourse(slug, token) {
    const response = await fetch(`${this.baseURL}/api/courses/enroll/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ course: slug })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Enrollment failed');
    }

    return await response.json();
  }

  async getMyEnrollments(token) {
    const response = await fetch(`${this.baseURL}/api/courses/enrollments/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch enrollments');
    }

    return await response.json();
  }

  async getCourseProgress(courseId, token) {
    const response = await fetch(`${this.baseURL}/api/courses/progress/${courseId}/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch progress');
    }

    return await response.json();
  }

  async markLessonComplete(lessonId, token, timeSpent) {
    const response = await fetch(
      `${this.baseURL}/api/courses/lessons/${lessonId}/complete/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          time_spent_minutes: timeSpent
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to mark lesson complete');
    }

    return await response.json();
  }

  async toggleWishlist(courseId, token) {
    const response = await fetch(
      `${this.baseURL}/api/courses/${courseId}/wishlist/toggle/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to toggle wishlist');
    }

    return await response.json();
  }
}

// ====================================
// Usage Examples
// ====================================
const api = new CourseCatalog();

// 1. Get all courses
const courses = await api.getAllCourses();
console.log(`Found ${courses.count} courses`);

// 2. Filter courses
const aiCourses = await api.getAllCourses({
  search: 'AI',
  is_free: true,
  level: 'beginner'
});

// 3. Get course details
const course = await api.getCourseDetail('ai-fundamentals:-understand-&-use-modern-ai-in-your-work');
console.log(`Course: ${course.title}`);
console.log(`Modules: ${course.modules.length}`);

// 4. Enroll in course (requires user to be logged in)
try {
  const enrollment = await api.enrollCourse(course.slug, userToken);
  console.log('Successfully enrolled!');
} catch (error) {
  console.error('Enrollment failed:', error.message);
}

// 5. Get my enrollments
const myEnrollments = await api.getMyEnrollments(userToken);
console.log(`You are enrolled in ${myEnrollments.length} courses`);

// 6. Track progress
const progress = await api.getCourseProgress(course.id, userToken);
console.log(`Progress: ${progress.progress_percentage}%`);

// 7. Mark lesson complete
const result = await api.markLessonComplete(lessonId, userToken, 30);
console.log(`XP earned: ${result.xp_earned}`);

// 8. Toggle wishlist
const wishlist = await api.toggleWishlist(course.id, userToken);
console.log(wishlist.message);
```

---

### Lesson Player Component Example

```javascript
// ====================================
// Lesson Player with Navigation
// ====================================
class LessonPlayer {
  constructor(baseURL = 'https://api.z-learn.app') {
    this.baseURL = baseURL;
    this.currentLesson = null;
    this.progressInterval = null;
  }

  async getModuleLessons(moduleId, token = null) {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${this.baseURL}/api/courses/enhanced/lessons/?module=${moduleId}`,
      { headers }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch lessons');
    }

    return await response.json();
  }

  async getLessonDetail(lessonId, token = null) {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${this.baseURL}/api/courses/enhanced/lessons/${lessonId}/`,
      { headers }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch lesson');
    }

    this.currentLesson = await response.json();
    return this.currentLesson;
  }

  async startLesson(lessonId, token) {
    const response = await fetch(
      `${this.baseURL}/api/courses/lessons/${lessonId}/start-progress/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to start lesson');
    }

    return await response.json();
  }

  async updateProgress(lessonId, progressData, token) {
    const response = await fetch(
      `${this.baseURL}/api/courses/lessons/${lessonId}/update-progress/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(progressData)
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update progress');
    }

    return await response.json();
  }

  async getNavigation(lessonId, token = null) {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${this.baseURL}/api/courses/lessons/${lessonId}/navigation/`,
      { headers }
    );

    if (!response.ok) {
      throw new Error('Failed to get navigation');
    }

    return await response.json();
  }

  startProgressTracking(lessonId, token, videoElement = null) {
    // Update progress every 30 seconds
    this.progressInterval = setInterval(async () => {
      const progressData = {
        time_spent_minutes: 0.5 // 30 seconds
      };

      if (videoElement) {
        progressData.video_progress_seconds = Math.floor(videoElement.currentTime);
      }

      try {
        await this.updateProgress(lessonId, progressData, token);
      } catch (error) {
        console.error('Failed to update progress:', error);
      }
    }, 30000); // Every 30 seconds
  }

  stopProgressTracking() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  async goToNextLesson(token) {
    if (!this.currentLesson) {
      throw new Error('No current lesson loaded');
    }

    const nav = this.currentLesson.navigation;
    if (!nav.next_lesson) {
      return null; // No next lesson
    }

    // Stop tracking current lesson
    this.stopProgressTracking();

    // Load next lesson
    return await this.getLessonDetail(nav.next_lesson, token);
  }

  async goToPreviousLesson(token) {
    if (!this.currentLesson) {
      throw new Error('No current lesson loaded');
    }

    const nav = this.currentLesson.navigation;
    if (!nav.previous_lesson) {
      return null; // No previous lesson
    }

    // Stop tracking current lesson
    this.stopProgressTracking();

    // Load previous lesson
    return await this.getLessonDetail(nav.previous_lesson, token);
  }
}

// ====================================
// Lesson Player Usage
// ====================================
const player = new LessonPlayer();

// 1. Get all lessons for a module
const moduleLessons = await player.getModuleLessons('module-uuid', userToken);
console.log(`Module has ${moduleLessons.length} lessons`);

// 2. Load first lesson
const firstLesson = await player.getLessonDetail(moduleLessons[0].id, userToken);
console.log(`Now playing: ${firstLesson.title}`);
console.log(`Duration: ${firstLesson.duration_minutes} minutes`);
console.log(`Progress: ${firstLesson.progress?.progress_percentage}%`);

// 3. Start the lesson
await player.startLesson(firstLesson.id, userToken);

// 4. Start automatic progress tracking (assuming you have a video element)
const videoElement = document.querySelector('video');
player.startProgressTracking(firstLesson.id, userToken, videoElement);

// 5. Manual progress update (for text lessons or milestones)
await player.updateProgress(firstLesson.id, {
  time_spent_minutes: 10,
  resources_viewed: 3
}, userToken);

// 6. Navigate to next lesson
const nextLesson = await player.goToNextLesson(userToken);
if (nextLesson) {
  console.log(`Moving to: ${nextLesson.title}`);
  // Start tracking next lesson
  await player.startLesson(nextLesson.id, userToken);
  player.startProgressTracking(nextLesson.id, userToken, videoElement);
} else {
  console.log('Module completed! 🎉');
}

// 7. Check navigation options
const navigation = await player.getNavigation(firstLesson.id, userToken);
console.log('Previous:', navigation.previous_lesson ? 'Available' : 'First lesson');
console.log('Next:', navigation.next_lesson ? 'Available' : 'Last lesson');
console.log('Related lessons:', navigation.related_lessons.length);

// 8. Clean up when user leaves the page
window.addEventListener('beforeunload', () => {
  player.stopProgressTracking();
});
```

---

## Course Progress Tracking

### Get Course Progress
Get detailed progress for a specific course including completed items and current position.

```http
GET /api/courses/progress/{course_id}/
```

**Authentication:** Required

**Response:**
```json
{
  "completed_lessons": ["uuid1", "uuid2", "uuid3"],
  "completed_modules": ["module-uuid1"],
  "completed_sections": ["section-uuid1", "section-uuid2"],
  "current_module": "current-module-uuid",
  "current_lesson": "current-lesson-uuid",
  "completion_percentage": 65.5,
  "time_spent_minutes": 420
}
```

**Frontend Example:**
```javascript
const getCourseProgress = async (courseId, token) => {
  const response = await fetch(
    `https://api.z-learn.app/api/courses/progress/${courseId}/`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  if (!response.ok) {
    throw new Error('Not enrolled in this course');
  }
  
  const progress = await response.json();
  
  // Update UI
  console.log(`Course ${progress.completion_percentage}% complete`);
  console.log(`Time spent: ${progress.time_spent_minutes} minutes`);
  console.log(`Completed: ${progress.completed_lessons.length} lessons`);
  
  return progress;
};
```

---

### Update Course Position
Track user's current position in a course (current module and lesson).

```http
POST /api/courses/progress/{course_id}/update-position/
```

**Authentication:** Required

**Request Body:**
```json
{
  "current_module": "module-uuid",
  "current_lesson": "lesson-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Position updated"
}
```

**Frontend Example:**
```javascript
const updateCoursePosition = async (courseId, moduleId, lessonId, token) => {
  const response = await fetch(
    `https://api.z-learn.app/api/courses/progress/${courseId}/update-position/`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        current_module: moduleId,
        current_lesson: lessonId
      })
    }
  );
  
  return await response.json();
};

// Usage: Save user's position when they switch lessons
await updateCoursePosition(courseId, moduleId, lessonId, userToken);
```

---

## Course Certificates

### Get My Certificates
List all certificates earned by the authenticated user.

```http
GET /api/courses/certificates/
```

**Authentication:** Required

**Response:**
```json
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "student": "user-uuid",
      "student_name": "John Doe",
      "course": "course-uuid",
      "course_title": "AI Fundamentals: Understand & Use Modern AI in Your Work",
      "certificate_number": "CERT-A1B2C3D4E5F6",
      "issued_date": "2024-02-15T10:30:00Z",
      "pdf_file": "https://example.com/certificates/cert.pdf",
      "is_verified": true,
      "created_at": "2024-02-15T10:30:00Z",
      "updated_at": "2024-02-15T10:30:00Z"
    }
  ]
}
```

**Frontend Example:**
```javascript
const getMyCertificates = async (token) => {
  const response = await fetch(
    'https://api.z-learn.app/api/courses/certificates/',
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  const data = await response.json();
  
  // Display certificates
  data.results.forEach(cert => {
    console.log(`Certificate: ${cert.certificate_number}`);
    console.log(`Course: ${cert.course_title}`);
    console.log(`Issued: ${new Date(cert.issued_date).toLocaleDateString()}`);
  });
  
  return data.results;
};
```

---

### Get Certificate Detail
Get details of a specific certificate.

```http
GET /api/courses/certificates/{certificate_id}/
```

**Authentication:** Required

**Response:** Same as certificate object above

---

### Request Course Certificate
Request a completion certificate after finishing a course.

```http
POST /api/courses/{course_id}/request-certificate/
```

**Authentication:** Required

**Response (Success):**
```json
{
  "message": "Certificate issued successfully",
  "certificate": {
    "id": "uuid",
    "student_name": "John Doe",
    "course_title": "AI Fundamentals",
    "certificate_number": "CERT-A1B2C3D4E5F6",
    "issued_date": "2024-02-15T10:30:00Z",
    "is_verified": true
  },
  "xp_earned": 500
}
```

**Response (Already Issued):**
```json
{
  "message": "Certificate already issued",
  "certificate": { ... }
}
```

**Response (Not Completed):**
```json
{
  "error": "Course not completed",
  "completion_percentage": 75.5,
  "completed_lessons": 10,
  "total_lessons": 12,
  "message": "You must complete all lessons before requesting a certificate"
}
```

**Frontend Example:**
```javascript
const requestCertificate = async (courseId, token) => {
  const response = await fetch(
    `https://api.z-learn.app/api/courses/${courseId}/request-certificate/`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  const result = await response.json();
  
  if (response.status === 201) {
    // Certificate issued
    console.log('🎉 Certificate issued!');
    console.log(`Certificate #: ${result.certificate.certificate_number}`);
    console.log(`XP Earned: ${result.xp_earned}`);
    return result.certificate;
  } else if (response.status === 200) {
    // Already had certificate
    console.log('Certificate was already issued');
    return result.certificate;
  } else {
    // Not completed
    console.log(result.message);
    console.log(`Progress: ${result.completion_percentage}%`);
    throw new Error(result.error);
  }
};
```

---

### Verify Certificate
Verify a certificate's authenticity using the certificate number (public endpoint).

```http
GET /api/courses/certificates/verify/{certificate_number}/
```

**Authentication:** Not required (public)

**Response (Valid):**
```json
{
  "valid": true,
  "is_verified": true,
  "student_name": "John Doe",
  "course_title": "AI Fundamentals: Understand & Use Modern AI in Your Work",
  "issued_date": "2024-02-15T10:30:00Z",
  "certificate_number": "CERT-A1B2C3D4E5F6"
}
```

**Response (Invalid):**
```json
{
  "valid": false,
  "message": "Certificate not found"
}
```

**Frontend Example:**
```javascript
const verifyCertificate = async (certificateNumber) => {
  const response = await fetch(
    `https://api.z-learn.app/api/courses/certificates/verify/${certificateNumber}/`
  );
  
  const result = await response.json();
  
  if (result.valid) {
    console.log('✅ Valid Certificate');
    console.log(`Student: ${result.student_name}`);
    console.log(`Course: ${result.course_title}`);
    console.log(`Issued: ${new Date(result.issued_date).toLocaleDateString()}`);
  } else {
    console.log('❌ Invalid Certificate');
  }
  
  return result;
};

// Usage:
await verifyCertificate('CERT-A1B2C3D4E5F6');
```

---

### Automatic Certificate Generation

**Note:** Certificates are automatically generated when you complete the last lesson of a course.

When completing a lesson returns:
```json
{
  "success": true,
  "message": "Lesson completed and course certificate earned! 🎉",
  "xp_awarded": 50,
  "course_completed": true,
  "certificate_issued": true,
  "certificate_number": "CERT-A1B2C3D4E5F6"
}
```

**Frontend handling:**
```javascript
const completeLesson = async (lessonId, token) => {
  const response = await fetch(
    `https://api.z-learn.app/api/courses/lessons/${lessonId}/complete/`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        time_spent_minutes: 30
      })
    }
  );
  
  const result = await response.json();
  
  // Check if course completed and certificate issued
  if (result.certificate_issued) {
    // Show celebration modal
    showCelebrationModal({
      title: 'Course Completed! 🎉',
      message: 'Congratulations! You earned a certificate!',
      certificateNumber: result.certificate_number,
      xpEarned: 500  // Course completion XP
    });
    
    // Navigate to certificate page
    navigate(`/certificates/${result.certificate_number}`);
  }
  
  return result;
};
```

---

## Response Status Codes

| Code | Meaning | Common Cause |
|------|---------|--------------|
| 200 | Success | Request completed successfully |
| 201 | Created | Resource created (enrollment, review) |
| 400 | Bad Request | Invalid data (missing fields, wrong format) |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | No permission (e.g., not enrolled in course) |
| 404 | Not Found | Course/lesson not found, or wrong URL |
| 409 | Conflict | Already enrolled, or already reviewed |
| 500 | Server Error | Backend error (contact support) |

---

## Rate Limiting

- **Public endpoints** (course list, detail): No rate limit
- **Authenticated endpoints**: 100 requests/minute per user
- **Enrollment/Payment**: 10 requests/minute per user

---

## Support

If you encounter issues:

1. **Check the slug format** - Use the exact slug from the course list
2. **Verify authentication** - Include `Authorization: Bearer {token}` header
3. **URL-encode special characters** - Use `encodeURIComponent(slug)`
4. **Check base URL** - Use `/api/courses/` not `/api/content/courses/`
5. **Review error messages** - They usually indicate the exact problem

For additional help, contact the backend team with:
- Full request URL
- Request headers
- Request body (if POST/PUT)
- Complete error response
