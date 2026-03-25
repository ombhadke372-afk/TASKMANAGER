# Multi-View Project Tracker

A fully functional project management tool built with React + TypeScript for the Velozity Global Solutions Technical Assessment.

## Live Demo


## Features

### Three Synchronized Views
- **Kanban Board**: Drag-and-drop task cards across four columns (To Do, In Progress, In Review, Done)
- **List View**: Sortable table with virtual scrolling for 500+ tasks
- **Timeline View**: Gantt-style visualization of tasks across the current month

All views share the same data state and switch instantly without re-fetching.

### Custom Drag-and-Drop (No Libraries)
Built from scratch using native browser Drag and Drop API:
- Visual feedback with placeholder of same height to prevent layout shift
- Dragged card follows cursor with reduced opacity and drop shadow
- Valid drop zones highlighted with background color change
- Invalid drops snap back to original position with smooth transition
- Full touch and mouse support

### Custom Virtual Scrolling (No Libraries)
Implemented from scratch for the List View:
- Only renders visible rows plus 5-row buffer above and below viewport
- Maintains correct scroll position and total height
- Smooth scrolling with no flickering or gaps
- Tested and optimized for 500+ tasks

### Live Collaboration Indicators
Simulated real-time presence showing 2-4 active users:
- Colored avatar indicators on task cards
- Smooth animations when users move between tasks
- Collaboration bar showing active viewer count
- Stacked avatars with overflow indicator (+N)
- Updates every 5 seconds with simulated user movements

### URL-Synced Filters
All filters are reflected in the URL for shareability:
- Multi-select filters: Status, Priority, Assignee
- Date range filter for due dates
- Instant filtering without submit button
- Browser back/forward navigation restores filter state
- "Clear Filters" button appears when filters are active

### Edge Cases Handled
- Empty states for Kanban columns and filtered results
- Overdue tasks highlighted in red
- "Due Today" label for tasks due today
- Days overdue count for tasks > 7 days overdue
- Timeline tasks without start dates shown as single-day markers
- Today's date marked with vertical line in Timeline

## Setup Instructions

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS (no component libraries)
- **State Management**: Zustand
- **Build Tool**: Vite
- **Icons**: Lucide React

## State Management Decision

**Chosen: Zustand**

Rationale:
- Minimal boilerplate compared to Context + useReducer
- Better performance with selective subscriptions
- TypeScript support out of the box
- Simple API that's easy to reason about
- Perfect for this scale of application without Redux overhead

Alternative considered: Context + useReducer would work but requires more boilerplate and manual optimization to prevent unnecessary re-renders.

## Custom Drag-and-Drop Implementation

### Approach
Used native HTML5 Drag and Drop API with React event handlers:

1. **Drag Start**: Capture the task being dragged and offset from cursor to card origin
2. **Drag**: Update cursor position to render floating preview card
3. **Drag Over**: Track which column is under the cursor and highlight it
4. **Drop**: Update task status if dropped on valid column
5. **Drag End**: Clean up state

### Key Challenges Solved
- **Placeholder without layout shift**: When a card is dragged, render a placeholder div with the same height in its original position
- **Custom drag preview**: Position a semi-transparent card clone at cursor position using fixed positioning
- **Touch support**: Native drag events work on both mouse and touch devices
- **Snap back animation**: On invalid drop, CSS transition returns card to original position

### Code Location
`src/components/views/KanbanView.tsx`

## Custom Virtual Scrolling Implementation

### Approach
Calculated visible range based on scroll position and viewport height:

1. **Calculate visible range**: `startIndex = floor(scrollTop / itemHeight) - overscan`
2. **Render only visible items**: Map over calculated range and render with absolute positioning
3. **Maintain scroll position**: Container height set to `totalItems * itemHeight`
4. **Buffer zone**: Render 5 extra items above and below viewport to smooth fast scrolling

### Key Technical Details
- Fixed row height: 60px per row
- Overscan buffer: 5 rows above and below viewport
- Absolute positioning with calculated `top` offset for each visible row
- Scroll handler updates state to trigger re-render of visible range

### Performance
- Renders ~20-30 rows regardless of total count
- Tested with 500 tasks with no performance degradation
- Smooth scrolling with requestAnimationFrame-based updates

### Code Location
- Hook: `src/hooks/useVirtualScroll.ts`
- Implementation: `src/components/views/ListView.tsx`

## Project Structure

```
src/
├── components/
│   ├── ui/                    # Custom UI components
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Dropdown.tsx
│   │   └── MultiSelect.tsx
│   ├── views/                 # Three main views
│   │   ├── KanbanView.tsx
│   │   ├── ListView.tsx
│   │   └── TimelineView.tsx
│   ├── CollaborationBar.tsx
│   ├── FilterBar.tsx
│   ├── TaskCard.tsx
│   └── ViewSwitcher.tsx
├── hooks/
│   └── useVirtualScroll.ts
├── store/
│   └── useStore.ts            # Zustand store
├── types/
│   └── index.ts               # TypeScript interfaces
├── utils/
│   ├── dataGenerator.ts       # 500+ task generator
│   └── taskUtils.ts           # Filtering, sorting, formatting
├── App.tsx
└── main.tsx
```

## Data Generation

The application generates 500 realistic tasks with:
- 6 predefined users with distinct colors
- Randomized task titles from prefix + subject combinations
- Random status, priority, and assignee assignments
- Dates spanning past 30 days to future 30 days
- ~15% overdue tasks for testing edge cases
- ~10% tasks without start dates

Generator: `src/utils/dataGenerator.ts`

## One Thing I'd Refactor With More Time

**Drag-and-drop touch support enhancement**: While the current implementation works on touch devices via native HTML5 Drag API, the experience could be improved with Pointer Events for better control over touch gestures, custom touch feedback animations, and multi-touch prevention. The native API works but doesn't provide the same level of polish as a dedicated touch implementation.

## Lighthouse Performance

[Screenshot to be added after deployment]

Target: 85+ on Desktop

## Requirements Checklist

### Core Features
-  Three views (Kanban, List, Timeline) with instant switching
-  Custom drag-and-drop (no libraries)
-  Custom virtual scrolling (no libraries)
-  Live collaboration indicators with simulated users
-  URL-synced filters (shareable, browser back/forward support)
-  Empty states for all views
-  Edge cases (overdue, due today, days overdue count)

### Technical Requirements
-  React with TypeScript (strict mode)
-  Tailwind CSS (no component libraries)
-  Zustand for state management
-  Custom UI components (no MUI, Ant Design, etc.)
-  Responsive design (desktop 1280px+, tablet 768px)
-  500+ task dataset
-  Production build successful

### Kanban View
-  Four columns with task counts
-  Cards with title, avatar, priority, due date
-  Overdue highlighting
-  Independent column scrolling
-  Drag-and-drop between columns
-  Placeholder on drag
-  Custom drag preview
-  Drop zone highlighting
-  Snap back on invalid drop

### List View
-  Sortable by title, priority, due date
-  Visual sort direction indicator
-  Inline status dropdown
-  Virtual scrolling (500+ rows)

### Timeline View
-  Current month time axis
-  Task bars from start to due date
- Priority-based color coding
- Today marker line
- Single-day markers for tasks without start date
- Horizontal scrolling

### Filters
- Multi-select: Status, Priority, Assignee
- Date range inputs
- Instant filtering
- URL query parameters
- Clear filters button

## Browser Compatibility

Tested on:
- Chrome 120+
- Firefox 121+
- Safari 17+
- Edge 120+

## License

Built for Velozity Global Solutions Technical Assessment
# TASKMANAGER
