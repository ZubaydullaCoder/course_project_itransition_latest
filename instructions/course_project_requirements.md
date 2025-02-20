# Course Project Requirements: Customizable Forms Web Application

This document outlines the requirements for the course project, focusing on the development of a web application for customizable forms, similar to Google Forms.

**Project Goal:**

To develop a web application that allows users to create customizable form templates (quizzes, surveys, questionnaires, polls, etc.) and other users to fill out forms based on these templates.

**Technology Stack (Mandatory & Optional):**

- **Choose one of the following primary technology stacks:**
  - **.NET:**
    - Language: C# (Required)
    - Framework: Blazor or MVC (Choose one)
    - Client-side: JavaScript or TypeScript (as needed)
  - **PHP:**
    - Language: PHP 8.2+ (Required)
    - Framework: Symfony 7+ (Required)
    - Client-side: JavaScript or TypeScript (as needed)
  - **JavaScript:**
    - Language: JavaScript or TypeScript (Choose one)
    - Framework: React (Required - Angular replacement possible upon request)
- **Database:** Any relational database (e.g., PostgreSQL, MySQL, SQL Server) or other persistence solution is allowed. Relational databases are recommended for simplicity and safety.
- **ORM (Object-Relational Mapper):** Required (e.g., Sequelize, Prisma, TypeORM, EF).
- **CSS Framework:** Required (e.g., Bootstrap or any other CSS framework).
- **Full-Text Search:** Required (external library or native database features).
- **UI Library/Components:** Use ready-to-use UI components and libraries as much as possible (e.g., for Markdown rendering, image upload, tag input, tag cloud, etc.).

**Core Functionality & Features:**

**1. User Roles and Authentication:**

- **User Registration and Authentication:** Users must be able to register and authenticate via site forms.
- **Non-Authenticated Users:**
  - Can: Search and view public templates in read-only mode.
  - Cannot: Create templates, fill out forms, leave comments or likes.
- **Authenticated Users:** Can perform actions based on permissions outlined below.
- **Admin User:**
  - **User Management:** View, block, unblock, delete users. Add/remove users from admin roles.
  - **Admin Privilege Escalation:** Admin has access to all templates and forms as if they were the owner. Admin can manage (view, edit, delete) any template and form.
  - **Self-Demotion:** Admin can remove their own admin access.
  - **Access to All Pages:** Admin sees all pages and can perform actions as the original author.

**2. Template Management:**

- **Template Creation:** Authenticated users can create templates.
- **Template Editing:** Only the template creator or admin can edit templates (add/delete/edit questions, manage settings).
- **Template Deletion:** Only the template creator or admin can delete templates.
- **Template Viewing (Non-Authenticated):** Public templates can be viewed in read-only mode by everyone.
- **Template Viewing (Authenticated):** Templates can be viewed by authenticated users depending on access settings.
- **Template Access Settings:**
  - **Public:** Accessible and fillable by any authenticated user.
  - **Restricted:** Accessible and fillable only by a selected list of specific registered users.
    - User selection with autocompletion for names and emails.
    - Ability to remove selected users.
    - Sorting of selected users (by name or email).
- **Template Settings:**
  - **Title:** Textual title for the template.
  - **Description:** Textual description with Markdown formatting support.
  - **Topic:** Selectable from a predefined list (e.g., "Education," "Quiz," "Other"). Topic list is managed through the database (no UI required for topic management).
  - **Image/Illustration (Optional):** User-uploaded image stored in the cloud (not on the web server).
  - **Tags:**
    - Multiple tags per template.
    - Tag autocompletion based on existing tags in the database as user types.

**3. Form Management:**

- **Form Filling:** Authenticated users can fill out forms based on templates they have access to (public or restricted access).
- **Form Viewing:**
  - **Form Author:** Can view the forms they have filled out.
  - **Template Creator:** Can view all forms submitted for their templates.
  - **Admin:** Can view all forms.
- **Form Editing:** Only the form creator or admin can edit filled forms (answers).
- **Form Deletion:** Only the form creator or admin can delete filled forms.
- **Form Fields:**
  - **Fixed Fields (Invisible in Template, Visible in Form):**
    - User (automatically filled with the user submitting the form).
    - Date (automatically filled with the submission date).
  - **Custom Questions (Configurable in Template):**
    - **Question Types (Up to 4 of each type allowed per template):**
      - Single-line string
      - Multi-line text
      - Positive integer
      - Checkbox
    - **Question Attributes:**
      - Title
      - Description
      - "Display in Forms Table" (boolean - determines if the question is shown in the template's forms table)
    - **Question Reordering:** Drag-and-drop functionality to reorder questions in the template editor.

**4. User Personal Page:**

- **Template Table:** Sortable table of templates created by the user. Actions: Create new, delete, edit templates. Link to each template's page.
- **Filled Forms Table:** Sortable table of forms filled out by the user (likely on a separate tab). Link to each filled form.

**5. Template Page (Specific Template View):**

- **Tabs:**
  - **General Settings:** Template title, description, access settings.
  - **Questions:** Editable list of questions with management options (add, edit, delete, reorder).
  - **Results:** List of filled-out forms based on the template. Each form is a link to the form itself.
    - Template author can open any form in read-only mode from this list.
  - **Aggregation of Results:** Basic data aggregation for answers from filled forms (e.g., average for numeric, most frequent for string).

**6. Main Page:**

- **Latest Templates Gallery:** Display of recently created templates (name, description/image, author).
- **Top Templates Table:** Table of the 5 most popular templates (based on the number of filled forms).
- **Tag Cloud:** Visual representation of popular tags. Clicking a tag leads to a "search results page" displaying templates associated with that tag.

**7. Search Functionality:**

- **Full-Text Search:** Site-wide search accessible from every page header.
- **Search Scope:** Searches across template content (e.g., question descriptions, template comments, template titles, tags).
- **Search Results:** Always link to templates (not individual questions or comments).
- **Tag Cloud Search:** Clicking a tag in the tag cloud should also use the search functionality to display relevant templates.

**8. Comments and Likes:**

- **Comments Section:** Linear comments section at the bottom of each template page. Comments are added to the end only.
- **Automatic Comment Updates:** New comments should appear automatically (with a 2-5 second delay) on the template page without page reload for other viewers.
- **Likes:** Users can "like" a template (maximum one like per user per template).

**9. Internationalization & Theming:**

- **Language Support:** Support for two languages: English and one other language (e.g., Polish, Spanish, Uzbek, Georgian). User-selectable language preference saved across sessions. UI translation only, not user-generated content.
- **Visual Themes:** Support for two visual themes: Light and Dark. User-selectable theme preference saved across sessions.

**Development Guidelines (DOs and DON'Ts):**

- **DOs:**

  - Use a CSS framework.
  - Ensure responsiveness for different screen resolutions (including mobile).
  - Use an ORM for database interaction.
  - Use a full-text search engine (library or native database features).
  - Use ready-to-use UI components and libraries.
  - Start with a deployable "Hello, world" page and maintain a deployable version throughout development.

- **DON'Ts:**
  - Don't use full database scans with `SELECT` queries.
  - Don't upload images to your web server; use cloud storage.
  - Don't perform database queries in loops.
  - Don't use JSON for persistent storage of forms (client-server communication with JSON is acceptable).
  - Don't generate database tables on the fly.

**Important Notes:**

- **Code Originality:** Avoid copying code from online sources. Focus on understanding and writing your own code. Code modification and understanding will be tested during project defense. Prioritize quality of understanding over the quantity of implemented features.
- **Library Usage:** Utilize ready-made components, libraries, and controls as much as possible. The less custom code, the better.
- **Deployability:** Maintain a deployable version from the start.
- **Project Defense:** Be prepared to defend your project even if all features are not implemented. Project understanding and code quality are prioritized.
- **Data Storage:** Use a relational database approach for structured data storage. Avoid JSON-based persistence and dynamic table generation.

**Optional Requirements (For Separate Grade - Implement only if all core requirements are completed):**

1.  **Social Authentication:** Implement user authentication via social networks.
2.  **"One from List" Question Type:** Add a new question type allowing template creators to define a list of options for single-choice questions (e.g., dropdown or radio buttons).
3.  **Unlimited Questions:** Remove the limit of 4 questions per type. Allow any number of questions of any type in a template.
4.  **"Email Copy of Answers" Checkbox:** Add an option to the form for users to receive a copy of their submitted answers via email.

**Good Luck!**

Remember, focusing on understanding your code and demonstrating a working, deployable application is crucial, even if not all features are implemented. Project defense is a key part of the evaluation.
