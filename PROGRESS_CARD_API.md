# ProgressCard Component API Documentation

## Overview
The `ProgressCard` component is a reusable card for displaying learning metrics and statistics with consistent styling across the dashboard.

## Location
`components/dashboard/progress-card.tsx`

---

## Props Interface

```typescript
interface ProgressCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    colorScheme?: 'blue' | 'green' | 'purple' | 'orange' | 'primary';
    className?: string;
}
```

---

## Prop Details

### `label` (required)
- **Type:** `string`
- **Description:** The descriptive label for the metric (e.g., "Study Time", "Completion Rate")
- **Example:** `"Daily Streak"`

### `value` (required)
- **Type:** `string | number`
- **Description:** The main value to display (e.g., "12h", "85%", 42)
- **Example:** `"12h"` or `85`

### `icon` (required)
- **Type:** `LucideIcon`
- **Description:** A Lucide React icon component to display in the card
- **Available icons:** Clock, Target, TrendingUp, Award, BookOpen, etc.
- **Example:** `Clock` (imported from 'lucide-react')

### `trend` (optional)
- **Type:** `'up' | 'down' | 'neutral'`
- **Description:** Indicates the trend direction (currently not visually rendered but available for future use)
- **Default:** `undefined`
- **Example:** `"up"`

### `trendValue` (optional)
- **Type:** `string`
- **Description:** A badge showing change or trend (e.g., "+2h", "-5%", "↑15%")
- **Default:** `undefined`
- **Example:** `"+2h"`

### `colorScheme` (optional)
- **Type:** `'blue' | 'green' | 'purple' | 'orange' | 'primary'`
- **Description:** The color scheme for the card's icon and trend badge
- **Default:** `'primary'`
- **Example:** `"blue"`

### `className` (optional)
- **Type:** `string`
- **Description:** Additional CSS classes to apply to the card
- **Default:** `undefined`
- **Example:** `"col-span-2"`

---

## Color Schemes

Each color scheme provides a cohesive set of colors for the icon background, icon color, and trend badge:

### Blue
```typescript
{
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    iconBg: 'bg-blue-100',
    trendBg: 'bg-blue-50',
    trendText: 'text-blue-700',
}
```
**Use for:** Time-related metrics, study duration, session counts

### Green
```typescript
{
    bg: 'bg-green-50',
    text: 'text-green-600',
    iconBg: 'bg-green-100',
    trendBg: 'bg-green-50',
    trendText: 'text-green-700',
}
```
**Use for:** Completion rates, success metrics, achievements

### Purple
```typescript
{
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    iconBg: 'bg-purple-100',
    trendBg: 'bg-purple-50',
    trendText: 'text-purple-700',
}
```
**Use for:** Performance metrics, scores, grades

### Orange
```typescript
{
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    iconBg: 'bg-orange-100',
    trendBg: 'bg-orange-50',
    trendText: 'text-orange-700',
}
```
**Use for:** Streaks, consistency metrics, engagement

### Primary
```typescript
{
    bg: 'bg-primary-50',
    text: 'text-primary-600',
    iconBg: 'bg-primary-100',
    trendBg: 'bg-primary-50',
    trendText: 'text-primary-700',
}
```
**Use for:** Brand-specific metrics, general purpose

---

## Usage Examples

### Basic Usage
```tsx
import { Clock } from 'lucide-react';
import { ProgressCard } from '@/components/dashboard/progress-card';

<ProgressCard
    label="Study Time"
    value="12h"
    icon={Clock}
    colorScheme="blue"
/>
```

### With Trend Value
```tsx
import { Target } from 'lucide-react';
import { ProgressCard } from '@/components/dashboard/progress-card';

<ProgressCard
    label="Completion Rate"
    value="85%"
    icon={Target}
    colorScheme="green"
    trendValue="+5%"
/>
```

### With Custom Class
```tsx
import { Award } from 'lucide-react';
import { ProgressCard } from '@/components/dashboard/progress-card';

<ProgressCard
    label="Daily Streak"
    value="15 days"
    icon={Award}
    colorScheme="orange"
    className="col-span-2"
/>
```

### Multiple Cards in Grid
```tsx
import { Clock, Target, TrendingUp, Award } from 'lucide-react';
import { ProgressCard } from '@/components/dashboard/progress-card';

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <ProgressCard
        label="Study Time"
        value="12h"
        icon={Clock}
        colorScheme="blue"
        trendValue="+2h"
    />
    <ProgressCard
        label="Completion Rate"
        value="85%"
        icon={Target}
        colorScheme="green"
        trendValue="+5%"
    />
    <ProgressCard
        label="Average Score"
        value="92%"
        icon={TrendingUp}
        colorScheme="purple"
        trendValue="+3%"
    />
    <ProgressCard
        label="Daily Streak"
        value="15 days"
        icon={Award}
        colorScheme="orange"
    />
</div>
```

---

## Component Structure

```tsx
<div className="rounded-xl bg-white border border-gray-200 p-5 hover:shadow-md">
    {/* Icon and trend badge row */}
    <div className="flex items-start justify-between mb-4">
        {/* Icon with colored background */}
        <div className="rounded-lg bg-{color}-100 p-2.5">
            <Icon className="h-5 w-5 text-{color}-600" />
        </div>
        
        {/* Optional trend badge */}
        {trendValue && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-{color}-50 text-{color}-700">
                {trendValue}
            </span>
        )}
    </div>

    {/* Value and label */}
    <div>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm font-medium text-gray-600">{label}</p>
    </div>
</div>
```

---

## Styling Details

### Card Container
- **Border radius:** `rounded-xl` (12px)
- **Background:** White (`bg-white`)
- **Border:** Subtle gray (`border border-gray-200`)
- **Padding:** `p-5` (20px)
- **Hover effect:** Shadow increase (`hover:shadow-md`)
- **Transition:** Smooth (`transition-all` via cn utility)

### Icon Container
- **Border radius:** `rounded-lg` (8px)
- **Padding:** `p-2.5` (10px)
- **Background:** Color-specific light background
- **Icon size:** `h-5 w-5` (20px)
- **Icon color:** Color-specific dark shade

### Value Display
- **Font size:** `text-2xl` (24px)
- **Font weight:** `font-bold`
- **Color:** `text-gray-900`
- **Margin bottom:** `mb-1` (4px)

### Label Display
- **Font size:** `text-sm` (14px)
- **Font weight:** `font-medium`
- **Color:** `text-gray-600`

### Trend Badge (optional)
- **Font size:** `text-xs` (12px)
- **Font weight:** `font-semibold`
- **Padding:** `px-2.5 py-1` (10px horizontal, 4px vertical)
- **Border radius:** `rounded-full`
- **Background:** Color-specific light background
- **Text color:** Color-specific darker shade

---

## Accessibility

### Semantic HTML
- Uses semantic `div` elements with proper structure
- Clear visual hierarchy

### Color Contrast
- All color combinations meet WCAG AA standards
- Text remains readable on all backgrounds
- Icon colors provide sufficient contrast

### Keyboard Navigation
- Card is not inherently interactive
- If wrapped in a button/link, ensure proper focus states

---

## Responsive Behavior

The ProgressCard component is inherently responsive through:

1. **Flexible width:** Adapts to container size
2. **Consistent padding:** Maintains proper spacing at all sizes
3. **Readable text:** Font sizes scale appropriately
4. **Grid compatibility:** Works in any grid system

### Recommended Grid Layouts

**Mobile (< 640px):**
```tsx
<div className="grid grid-cols-1 gap-4">
    {/* Single column */}
</div>
```

**Tablet (640px - 1024px):**
```tsx
<div className="grid grid-cols-2 gap-4">
    {/* Two columns */}
</div>
```

**Desktop (> 1024px):**
```tsx
<div className="grid grid-cols-4 gap-4">
    {/* Four columns */}
</div>
```

**Responsive:**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* Adapts based on screen size */}
</div>
```

---

## Best Practices

### DO ✅
- Use descriptive labels that clearly indicate what the metric represents
- Choose appropriate color schemes that match the metric type
- Keep values concise and easy to scan (use abbreviations like "h" for hours)
- Use trend values to show change over time when available
- Maintain consistent icon sizes and styles
- Group related metrics together

### DON'T ❌
- Use extremely long labels that wrap to multiple lines
- Mix different units without clear indication (e.g., "12" without "h" or "hours")
- Overuse trend badges when data isn't available
- Use color schemes inconsistently across similar metrics
- Add interactive elements without proper accessibility support
- Create cards with empty or placeholder content

---

## Common Use Cases

### Learning Dashboard
```tsx
<ProgressCard label="Study Time" value="12h" icon={Clock} colorScheme="blue" />
<ProgressCard label="Lessons Completed" value="24" icon={BookOpen} colorScheme="green" />
<ProgressCard label="Average Score" value="85%" icon={TrendingUp} colorScheme="purple" />
<ProgressCard label="Current Streak" value="7 days" icon={Award} colorScheme="orange" />
```

### Course Analytics
```tsx
<ProgressCard label="Enrolled Students" value="1,234" icon={Users} colorScheme="primary" />
<ProgressCard label="Completion Rate" value="78%" icon={Target} colorScheme="green" />
<ProgressCard label="Average Rating" value="4.8" icon={Star} colorScheme="orange" />
<ProgressCard label="Total Hours" value="5,678h" icon={Clock} colorScheme="blue" />
```

### Performance Metrics
```tsx
<ProgressCard label="Quiz Average" value="92%" icon={TrendingUp} colorScheme="purple" trendValue="+3%" />
<ProgressCard label="Practice Time" value="8h" icon={Clock} colorScheme="blue" trendValue="+1h" />
<ProgressCard label="Mastery Level" value="Advanced" icon={Award} colorScheme="green" />
```

---

## Integration with Existing Code

### In StudyInsights Component
```tsx
import { ProgressCard } from '@/components/dashboard/progress-card';

const stats = [
    { label: 'Study Time', value: `${studyTime}h`, icon: Clock, colorScheme: 'blue' as const },
    { label: 'Completion Rate', value: `${completionRate}%`, icon: Target, colorScheme: 'green' as const },
    { label: 'Average Score', value: `${avgScore}%`, icon: TrendingUp, colorScheme: 'purple' as const },
    { label: 'Daily Streak', value: `${streak} days`, icon: Award, colorScheme: 'orange' as const },
];

return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
            <ProgressCard key={stat.label} {...stat} />
        ))}
    </div>
);
```

---

## Future Enhancements

### Potential Features
1. **Click handler:** Make cards interactive with onClick prop
2. **Loading state:** Built-in skeleton loader
3. **Animated values:** Count-up animation for numbers
4. **Comparison mode:** Show previous period comparison
5. **Tooltip:** Detailed information on hover
6. **Size variants:** sm, md, lg options
7. **Dark mode:** Dark theme support
8. **Custom icons:** Allow custom icon components

### Example Future API
```tsx
<ProgressCard
    label="Study Time"
    value={12}
    previousValue={10}
    icon={Clock}
    colorScheme="blue"
    size="lg"
    animated
    onClick={() => handleCardClick()}
    tooltip="Total study time this week"
/>
```

---

## Testing

### Unit Test Example
```tsx
import { render, screen } from '@testing-library/react';
import { Clock } from 'lucide-react';
import { ProgressCard } from './progress-card';

describe('ProgressCard', () => {
    it('renders with required props', () => {
        render(
            <ProgressCard
                label="Study Time"
                value="12h"
                icon={Clock}
                colorScheme="blue"
            />
        );
        
        expect(screen.getByText('Study Time')).toBeInTheDocument();
        expect(screen.getByText('12h')).toBeInTheDocument();
    });
    
    it('renders trend value when provided', () => {
        render(
            <ProgressCard
                label="Study Time"
                value="12h"
                icon={Clock}
                colorScheme="blue"
                trendValue="+2h"
            />
        );
        
        expect(screen.getByText('+2h')).toBeInTheDocument();
    });
});
```

---

## Changelog

### Version 1.0.0 (Current)
- Initial release
- Five color schemes: blue, green, purple, orange, primary
- Optional trend value badge
- Hover effects
- Fully responsive

---

This documentation provides everything needed to use and extend the ProgressCard component effectively.
