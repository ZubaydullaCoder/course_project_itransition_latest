@everyone

Below I will post the 3 sets of requirements (one right away, two other a bit later). The goal is "to do all of them", not "select only one". But of course, it's better to implement part than do nothing. 

These products are selected because:

1. these are very popular products, and the demand for corresponding knowledge/skills is high;

2. we have quite a number of projects with them; 

3. it seems that the trend "more integration, less developing from scratch" it with us for a long time.

In theory, everybody who defended their project can work on these, however, it has sense only for people who implemented the majority of requirements in the "main" project. 

As I said before, these "integration" tasks are kinda optional, but they can help us to find your suitable projects. Consider it as a "specialization", like math test or neural networks task (and _it's a good time to work on these right now_ — check posts above in this channel). 

How you work on these "integrations". The absolute unmovable deadline is the **_next Thursday, 06.03.2025, 14:00 UTC_**. You need to compose **_a single_** e-mail to p.lebedev@itransition.com with links to everything you plan to submit (check everything twice, the only one letter will be accepted as a submission). Of course, you may skip some integration, e.g. implement one or two. But don't send letter something to send after that "I did one more" – _only the first submit_ will be processes. Also, don't submit your implementations before Thursday, it's better to "polish" implementation if you have free time.

Your e-mail must consist of several (from 1 to 3) parts of the following structure:

- What is the integration (app name, e.g. Salesforce).

- A link to your deployed application (in some integrations it's your main app, in some it's a separate trivial app).

- Recorded video with the detailed demonstration of the functionality described above (**_without voice narration_**; but you are welcomed to add some notes or comments on the implementation if you find it necessary in the e-mail body).

- Please, specify also _your full name_ in the e-mail body.

**ADD INTEGRATION WITH SALESFORCE**

Imagine that you want to perform some customer relationship management with the user of your site (e.g., you want to send marketing newsletter, sell some additional services, etc.). So, you want to manage site users in the CRM.

The integration task: add a separate action to the user profile page, available only for the user itself (or admins, of course). This action should open a form that collect some additional information about current user and create an Account with linked Contact in the Salesforce via REST API. 

To do so, you need to create [Developer org](https://developer.salesforce.com/signup) and study the [documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_rest.htm). Also, you can use [studying materials from SF on Trailhead](https://trailhead.salesforce.com/content/learn/modules/api_basics/api_basics_rest), this is a great resource.

@everyone

**ADD INTEGRATION WITH ODOO**

Inside of your course project:

1. Implement some kind of externally accessible API that allows to access aggregated results from filled out forms by template. Access to the data should be provided via "api token" (token is generated per user; only data from the forms based on this user's templates are accessible).

1. Add a link inside user profile that return a generated api token.

Then implement an external Odoo application that allow to store information about templates and aggregated results (ot separate filled out forms, only "average"). Odoo should store the following: template author, template title, set of questions –question text, question type, number of answers as well as some aggregated result (average /min/max for numbers, few most popular answers for text, etc.). The user can view the list of templates, and can view "detailed" information for each of them.

Add an action to the Odoo that will import results from your course project by the provided "api token".

Generally, Odoo app should work as a read-only viewer.

As a  result, you need to demosntrate a rolled out Odoo instance with your application and show how import works.

**_Optionally_** (not easy): add capability to create templates in Odoo and export them to your app.

Our curator mentioned this in public chat. What is he going to mean? Explain in friendly way
