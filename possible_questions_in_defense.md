Based on the course project requirements, your examiner might ask questions to assess your understanding of the code and implementation decisions. Here are likely questions categorized by project aspects:

Core Understanding & Architecture
Explain your project architecture and the key components in your codebase.
Why did you choose this particular tech stack (React, Next.js, Prisma, etc.)?
Walk me through your database schema - how do templates, questions, and responses relate?
How did you implement the aggregation of results for different question types?
Specific Implementation Questions
Show me how you implemented response summary aggregation for numeric vs text questions.
Explain how your drag-and-drop question reordering works in the template editor.
How do you ensure that responses are properly associated with their template questions?
How did you implement the case-insensitive question type handling in the response summary?
Technical Decisions
Why did you structure your aggregation data object this way? Were there alternatives?
How do you optimize the performance of the response aggregation for templates with many responses?
What challenges did you face when displaying the response summaries, and how did you solve them?
How did you ensure your component handles edge cases like missing data or unusual inputs?
Security & Best Practices
How do you ensure only authorized users can see response summaries?
How did you prevent database queries in loops when aggregating responses?
What measures did you take to prevent SQL injection or other security issues?
How do you validate input data before processing it in your aggregation functions?
Code Quality & Patterns
What design patterns did you use in your implementation? Why?
How did you ensure your code remains maintainable and extendable?
What would you change if you needed to add a new question type to your system?
How did you organize your UI components to maximize reuse?
Libraries & Integration
Which UI libraries did you use for data visualization in your response summary?
How did you integrate external libraries with your own code?
Why did you choose the specific ORM (likely Prisma) and how did it help your implementation?
Specific to Your Implementation
Explain why you initially had issues with integer questions not showing in the summary.
Walk me through how you implemented the "most common answer" feature for text questions.
How does your checkbox response visualization calculate and display percentages?
Remember to be prepared to modify code on the spot or explain specific implementation details. The examiner will be looking for your understanding of the code rather than just that the features work.
