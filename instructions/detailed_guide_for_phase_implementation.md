detailed prompt for Phase 2 (Template System Core) implementation.

**Desired User Workflow for Phase 2:**

1. **Template List View:**

   - User sees grid/list of their templates
   - "Create Template" button prominently displayed
   - Each template card shows:
     - Title
     - Description preview
     - Access type (Public/Restricted)
     - Creation date
     - Action buttons (Edit/Delete)

2. **Template Creation Flow:**

   - Clicks "Create Template"
   - Multi-step form with:
     - Step 1: Basic Info
       - Title
       - Description (with Markdown support)
       - Topic selection
       - Tags (with autocomplete)
     - Step 2: Access Settings
       - Public/Restricted toggle
       - User selection for restricted access
     - Step 3: Questions
       - Add questions (max 4 per type)
       - Question types:
         - Single-line string
         - Multi-line text
         - Positive integer
         - Checkbox
       - Drag-drop reordering
   - Preview capability
   - Save as draft/Publish options

3. **Template Management:**
   - Edit existing templates
   - Delete with confirmation
   - Duplicate template option
   - View template statistics

**Development Prompt for AI:**

"Help me implement Phase 2 of the Forms Web Application project. The implementation should follow these specific requirements:

**1. Database Schema Enhancement:**

```javascript
// Add to existing Prisma schema:
- Template model
- Question model
- Tag model
- UserTemplateAccess model (for restricted access)
```

**2. Component Structure:**

```
app/
  ├── templates/
  │   ├── page.jsx                 # Template list
  │   ├── [id]/
  │   │   ├── page.jsx            # View template
  │   │   └── edit/
  │   │       └── page.jsx        # Edit template
  │   └── create/
  │       └── page.jsx            # Create template
  ├── components/
  │   ├── templates/
  │   │   ├── TemplateCard.jsx
  │   │   ├── TemplateForm/
  │   │   │   ├── BasicInfo.jsx
  │   │   │   ├── AccessSettings.jsx
  │   │   │   └── QuestionBuilder.jsx
  │   │   ├── QuestionTypes/
  │   │   └── DragDropContext.jsx
  │   └── shared/
  │       ├── MarkdownEditor.jsx
  │       └── TagInput.jsx
```

**3. Required Features Implementation:**

A. **Template Management:**

- CRUD operations with server actions
- Optimistic updates
- Real-time validation
- Loading states
- Error handling with toast notifications

B. **Question Management:**

- Question type components
- Drag-drop reordering
- Question limit validation
- Question type validation

C. **Access Control:**

- Public/Restricted toggle
- User selection with autocomplete
- Access validation middleware

**4. Key Packages to Install:**

```bash
npm install @dnd-kit/core @dnd-kit/sortable  # Drag-drop
npm install @uiw/react-md-editor             # Markdown editor
npm install react-select                      # Tag/User selection
```

**5. Implementation Guidelines:**

A. **Template List Page:**

- Server component for initial load
- Client components for interactivity
- Skeleton loading states
- Grid/List view toggle
- Sorting/Filtering options

B. **Template Form:**

- Multi-step form using shadcn components
- Form validation with react-hook-form and zod
- Markdown editor integration
- Tag input with autocomplete
- User selection for restricted access
- Question builder with drag-drop
- Preview mode

C. **Template Actions:**

- Server actions for CRUD operations
- Optimistic updates for better UX
- Toast notifications for success/error
- Confirmation dialogs for destructive actions

**Error Handling:**

- Form validation errors
- Server-side errors
- Network errors
- Access control errors

**Loading States:**

- Skeleton loaders for lists
- Button loading states
- Form submission states
- Optimistic UI updates

**Validation Rules:**

- Title: Required, max length
- Questions: Max 4 per type
- Access settings: Valid user selection
- Tags: Format validation

Please provide step-by-step implementation guidance, starting with database schema enhancements and progressing through each component. Include:

- Server action implementations
- Component code snippets
- Error handling
- Loading states
- Validation logic
- UI/UX considerations"

Would you like me to elaborate on any specific part of this prompt or provide more detailed specifications for any section?
