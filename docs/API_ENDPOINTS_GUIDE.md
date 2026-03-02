# API Endpoints Guide - Courses

## 🚨 IMPORTANT: Two Different Course Systems

ZLearn has **TWO SEPARATE** course systems. Make sure you're using the correct one!

---

## 1️⃣ Professional Courses API (`/api/courses/`)
**Use this for:** Professional development, certification programs, exam preparation, hobby courses

### Base URL Pattern
```
https://api.z-learn.app/api/courses/
```

### Key Endpoints

#### List All Professional Courses
```http
GET /api/courses/
```
**Returns:** All published professional courses (regardless of user)
- Professional development courses
- Exam preparation courses (like entrance exams)
- Certification programs
- Hobby/personal interest courses

**Query Parameters:**
- `category` - Filter by category ID
- `level` - Filter by level (beginner, intermediate, advanced, expert)
- `instructor` - Filter by instructor ID
- `is_free` - Filter free/paid (true/false)
- `featured` - Filter featured courses (true/false)
- `min_price` / `max_price` - Price range
- `min_rating` - Minimum rating
- `search` - Search in title/description

**Example:**
```http
GET /api/courses/?featured=true&level=beginner
GET /api/courses/?search=AI&is_free=true
```

#### Featured Courses
```http
GET /api/courses/featured/
```

#### Popular Courses
```http
GET /api/courses/popular/
```

#### Course Detail
```http
GET /api/courses/{slug}/
```
**Example:** `/api/courses/ai-fundamentals:-understand-&-use-modern-ai-in-your-work/`

#### Course Categories
```http
GET /api/courses/categories/
```

#### Enroll in Course
```http
POST /api/courses/enroll/
```
**Body:**
```json
{
  "course": "course-uuid-or-slug"
}
```

#### My Enrollments
```http
GET /api/courses/enrollments/
```

#### Course Progress
```http
GET /api/courses/progress/{course_id}/
```

---

## 2️⃣ Academic Content API (`/api/content/courses/`)
**Use this for:** School/academic courses tied to educational programs

### Base URL Pattern
```
https://api.z-learn.app/api/content/courses/
```

### Key Endpoints

#### List Academic Courses
```http
GET /api/content/courses/
```
**Returns:** Courses filtered by user's educational program
- Automatically filtered by student's curriculum
- Subject-based courses (Math, Physics, English, etc.)
- Exam system specific (GCE, Baccalaureate, etc.)

**Query Parameters:**
- `subject` - Filter by subject code
- `curriculum` - Filter by curriculum ID or exam_system
- `exam_system` - Filter by exam system
- `difficulty` - Filter by difficulty
- `featured` - Featured courses (true/false)

**Example:**
```http
GET /api/content/courses/?subject=MATH&exam_system=GCE_AL
GET /api/content/courses/?featured=true
```

#### Course Detail
```http
GET /api/content/courses/{uuid}/
```

#### Course Modules
```http
GET /api/content/courses/{uuid}/modules/
```

#### Enroll in Academic Course
```http
POST /api/content/courses/{uuid}/enroll/
```

#### Course Reviews
```http
GET /api/content/courses/{uuid}/reviews/
POST /api/content/courses/{uuid}/reviews/create/
```

---

## 🎯 Quick Decision Guide

### When to use `/api/courses/`
✅ Professional development courses  
✅ Exam prep (entrance exams, professional certifications)  
✅ Skill-based learning (AI, Web Dev, etc.)  
✅ Open to all users regardless of educational program  
✅ Browseable course catalog

### When to use `/api/content/courses/`
✅ School/academic courses  
✅ Curriculum-based learning  
✅ Subject-specific (Math, Physics, Chemistry, etc.)  
✅ Tied to student's educational program  
✅ Exam system specific (GCE, CBC, etc.)

---

## 📊 Response Format Differences

### Professional Course (`/api/courses/`)
```json
{
  "id": "uuid",
  "title": "AI Fundamentals: Understand & Use Modern AI in Your Work",
  "slug": "ai-fundamentals:-understand-&-use-modern-ai-in-your-work",
  "short_description": "...",
  "instructor_name": "John Doe",
  "category_name": "Artificial Intelligence",
  "level": "beginner",
  "price": "0.00",
  "is_free": true,
  "rating": 4.5,
  "total_ratings": 120,
  "thumbnail": "url",
  "duration_hours": 22,
  "total_lessons": 12,
  "current_enrollments": 350,
  "featured": true,
  "created_at": "2026-03-02T00:16:17Z"
}
```

### Academic Course (`/api/content/courses/`)
```json
{
  "id": "uuid",
  "title": "Advanced Mathematics - Form 5",
  "description": "...",
  "subject": {
    "name": "Mathematics",
    "code": "MATH",
    "color": "#FF5733"
  },
  "curriculum": "GCE Advanced Level",
  "curriculum_id": "uuid",
  "exam_system": "GCE_AL",
  "difficulty": "advanced",
  "estimated_hours": 120,
  "module_count": 8,
  "lesson_count": 45,
  "thumbnail": "url",
  "is_featured": true,
  "course_type": "standard",
  "is_free": true,
  "price": "0.00"
}
```

---

## 🔧 Common Issues

### Issue: "Course not showing on mobile app"
**Check:**
1. ✅ Course `status = 'published'` (for professional courses)
2. ✅ Course `is_published = true` (for academic courses)
3. ✅ `total_lessons > 0` (run `python manage.py update_course_stats`)
4. ✅ Using the correct API endpoint for your course type
5. ✅ User has the right educational program (for academic courses)

### Issue: "Getting empty array from API"
**For Professional Courses:**
- No filters needed, all published courses are returned
- Check if courses exist: `Course.objects.filter(status='published').count()`

**For Academic Courses:**
- User must have an active educational path
- Courses are filtered by user's program
- Use query params to see other programs' courses

---

## 📝 Related Models

### Professional Course Types
```python
COURSE_TYPE_CHOICES = [
    ('professional', 'Professional Development'),
    ('academic', 'Academic/School'),  # Different from content.Course!
    ('exam_prep', 'Exam Preparation'),
    ('hobby', 'Hobby/Personal Interest'),
    ('certification', 'Certification Program'),
]
```

### Course Status
```python
COURSE_STATUS_CHOICES = [
    ('draft', 'Draft'),           # Not visible
    ('published', 'Published'),   # Visible to all
    ('archived', 'Archived'),     # Not visible
    ('suspended', 'Suspended'),   # Not visible
]
```

---

## 🚀 For Frontend Team

### Recommended Implementation

**Professional Course Browser (Anyone can browse):**
```javascript
// List all courses
const response = await fetch('https://api.z-learn.app/api/courses/?featured=true');

// Get specific course
const course = await fetch('https://api.z-learn.app/api/courses/ai-fundamentals:-understand-&-use-modern-ai-in-your-work/');
```

**Academic Course Browser (Student-specific):**
```javascript
// List courses for logged-in student (auto-filtered by program)
const response = await fetch('https://api.z-learn.app/api/content/courses/', {
  headers: { 'Authorization': 'Bearer ' + token }
});

// Filter by subject
const mathCourses = await fetch('https://api.z-learn.app/api/content/courses/?subject=MATH', {
  headers: { 'Authorization': 'Bearer ' + token }
});
```

---

## 📞 Need Help?

Run these commands to check your data:

```bash
# Check professional courses
python manage.py shell -c "from courses.models import Course; print(f'Published: {Course.objects.filter(status=\"published\").count()}')"

# Check academic courses
python manage.py shell -c "from content.models import Course; print(f'Published: {Course.objects.filter(is_published=True).count()}')"

# Update course stats
python manage.py update_course_stats
```
