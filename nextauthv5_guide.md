signIn redirects to http://localhost:3000/api/auth/error in development immediately. #7985
Unanswered
OgLuka asked this question in Help
signIn redirects to http://localhost:3000/api/auth/error in development immediately.
#7985
@OgLuka
OgLuka
on Jul 9, 2023 · 5 comments · 11 replies
Return to top

OgLuka
on Jul 9, 2023
next - 13.3.2
node - 20.2.5
next-auth - 4.22.1
hi, i have been using next auth in my many projects and it worked fine, but recently for some reason it just stoped working in my latest next 13 version, i am using pages directory. when i call signIn function for credentials it instantly redirects to http://localhost:3000/api/auth/error , no errors in console or terminal, i have set secret and URL in env file. only error i could get from next auth logger callback is following:

CLIENT_FETCH_ERROR {
error: '[object Object]',
url: '/api/auth/providers',
message: 'Failed to fetch',
client: 'true'
}
. the problem is unclear because it was working just fine, maybe something got updated and that's the problem? i don't know please help.

my [...nextauth].js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
secret: process.env.NEXTAUTH_SECRET,
providers: [
CredentialsProvider({
id: "credentials",
name: "credentials",
type: "credentials",
credentials: {
email: {
label: "Email",
type: "text",
},
password: {
label: "Password",
type: "password",
},
},
async authorize(credentials) {
//databaselookup
const response = await fetch(
"https://app.propertyview.co/api/user/login/",
{
method: "POST",
credentials: "include",
body: JSON.stringify({
username: credentials.email,
password: credentials.password,
}),
headers: { "Content-Type": "application/json" },
}
);
const data = await response.json();
if (response.status == 200) {
return {
token: data.access,
name: credentials.email,
email: credentials.email,
};
}
return null;
},
}),
],
logger: {
error(code, metadata) {
console.error(code, metadata);
},
warn(code) {
console.warn(code);
},
debug(code, metadata) {
console.debug(code, metadata);
},
},
callbacks: {
signIn: async ({ account, profile }) => {
if (account.provider == "credentials") return true;
},
jwt: async ({ token, user, account }) => {
if (user && account.provider == "credentials") {
token.accessToken = user.token;
token.provider = account.provider;
}
return token;
},
session: async ({ session, token }) => {
if (token) {
session.accessToken = token.accessToken;
session.provider = token.provider;
}
return session;
},
},
});
signIn in login:

signIn("credentials", {
redirect: false,
email: email.current.value,
password: pass.current.value,
callbackUrl: `${window.location.origin}/dashboard/`,
})
.then((response) => {
if (response.ok) {
redirectdashboard();
} else {
SetError("Email or password you entered is incorrect.");
SetLoading(false);
}
})
.catch(() => {
SetLoading(false);
SetError("Email or password you entered is incorrect.");
});
Replies:5 comments · 11 replies

rishabhverma-kiwi
on Jul 13, 2023
I am also facing the same issue, did it resolved ?

6 replies
@nhuethmayr
nhuethmayr
on Jul 13, 2023
yes, problem was chrome was chaching my localhost login page and imediately redirecting to error, i disabled chache from devtools and it resolved.

Don't forget to mark this question as answered then 😉

@PtradeLLC
PtradeLLC
on Dec 5, 2023
Same issue here... Always something wth NextAuth, even if and when you think you get it right it somehow still goes wrong smh.

@huboh
huboh
on Dec 13, 2023
have you gotten any fix? i've disabled cache and did every thing correct, yet i'm instantly redirected

@joseff-regmi
joseff-regmi
on Jan 3, 2024
Two things to check:

.env file:
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret

Folder structure:
app>api>auth>[...nextauth]

@NurullahDnc
NurullahDnc
on Mar 7, 2024
chache'yi devtools'tan devre dısı bıraktım ama cozulmedi baska birsey yaptınız mı

muhaimincs
on Jul 31, 2023
on version: 4.22.3 it just redirect to default login page which something I do not expect

0 replies

chinmayee-kc
on May 1, 2024
im facing same issue someone please help

2 replies
@loloDawit
loloDawit
on May 4, 2024
Looks like you are requiring a password in your model but not passing the value. thats why you are getting this error

@amirzack
amirzack
on Aug 19, 2024
Thanks work for me.

nerdalert
on May 20, 2024
Might be worth making sure the callback url in the GitHub/Google Oauth settings, matches the NEXTAUTH_URL .env in your stack.

0 replies

Icegreeen
on Jun 10, 2024
After spending days digging into the issue, I found a solution that worked for me:

The Problem:

The error [next-auth][error][CLIENT_FETCH_ERROR] Unexpected token '<', "<DOCTYPE "... is not valid JSON indicated that an API response is returning HTML instead of JSON. This typically happens when the API request is not being handled correctly and instead returns an HTML page (such as index.html) that starts with .

Diagnosis:

The most common cause for this is a misconfiguration of routing with Vercel's production environment, where API requests are treated the same way as regular page requests. In your case, the rewrites configuration in vercel.json was redirecting API requests to the application root instead of letting them reach the API endpoints properly.

Solution:

In my vercel.json file, I had the following code:

{
"rewrites": [
{
"source": "/(.*)",
"destination": "/"
}
]
}

I changed it to:

{
"rewrites": [
{
"source": "/api/:path*",
"destination": "/api/:path*"
},
{
"source": "/(.*)",
"destination": "/"
}
]
}

Report:

The solution is to adjust the rewrite configuration to ensure that requests to the API endpoints are not redirected to the application root.

This configuration ensures that all requests that begin with /api are forwarded to the appropriate API endpoints without redirection, while all other requests continue to be redirected to the application root.

3 replies
@afhiya
afhiya
on Jul 9, 2024
Thanks you bro your solution its work

@Albosonic
Albosonic
on Aug 9, 2024
I did this and npm install and that worked for me

@kenziedeschepper
kenziedeschepper
on Aug 23, 2024
