Link Namespace error=invalid_client_id&error_description=client%20identifier%20invalid
Asked 4 years, 9 months ago
Modified 3 years, 11 months ago
Viewed 7k times
8

Following occurred while executing this Build First Generation Managed Packages with Salesforce CLI - Setup your Dev Hub Playground Trailhead

error=invalid_client_id&error_description=client%20identifier%20invalid

which appears in popup authorization window upon clicking Link Namespace in Dev Hub org

managed-packagetrailheadnamespace
Share
Improve this question
Follow
asked May 23, 2020 at 16:09
cropredy's user avatar
cropredy
73.9k99 gold badges128128 silver badges289289 bronze badges
I think that you should accept your own answer. It was useful for me. –
gvgramazio
CommentedJun 28, 2020 at 16:50
Add a comment
2 Answers
Sorted by:

Highest score (default)
12

This is a timing issue. After setting up the

Dev Hub playground
Packaging Playground
and enabling the Dev Hub in the Dev Hub playground ...

you may need to wait a few minutes for the credentials to propagate in the SFDC backend. For me, it was the length of time to

Google around to see if this error had been previously reported
Log off/login and try again
Attend to some personal needs
basically 10-15 mins and after the above, Link Namespaces presented a proper login window.

Note there is a Known Issue related to opening a blank authorization window upon clicking Link Namespace (which was not my issue)

Share
Improve this answer
Follow
answered May 23, 2020 at 16:09
cropredy's user avatar
cropredy
73.9k99 gold badges128128 silver badges289289 bronze badges
I've been having this issue every time I set up a new dev hub. I recommend you waiting for not only a couple of minutes but an entire day! –
Saulo
CommentedMar 13, 2024 at 12:53
Add a comment
3

The problem appears to be related to the generated connected app not getting figured fully or correctly (and it appears very slow to deploy updates -- more than the standard 10 minute upperbound).

The open issue has a work around that involves replacing the app, but you should be able to fix it if just waiting 10-15 minutes as the accepted answer suggests does not resolve this.

Go to Setup --> Manage Connected Apps.
Find the app that start with: DEVHUB\_
Edit the App and make sure the callback URL's domain matches your My Domain setup.
Save the changes and wait -- really wait. It'll say 2-10 minutes but think 4-20.
Retry.
