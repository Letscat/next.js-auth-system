# Next.js Authentication Project

## Overview

This project demonstrates a simple yet efficient and secure authentication system for web applications built with Next.js.

## Key Principle

In typical web applications, before a user can read or store data, their information and permissions are verified through database lookups. This process can be time-consuming and costly, especially when such database checks are not immediately relevant to the current user session or use case.

The goal of this project is to reduce the frequency of database queries—ideally to just **one per session**—by leveraging signed certificates for authentication.

### How It Works

Instead of generating a session ID stored both on the client and the server (which requires continuous server-side verification), we issue the client a **signed certificate** that contains all the relevant information about their user session.

As long as the certificate is signed with a secret key, it ensures that only the server can validate or issue it. This makes it practically impossible for third parties to forge a valid certificate.

By using this approach, the system avoids unnecessary database queries for each user action, leading to significant performance improvements.

### Advantages

- **Reduced Database Lookups**: The server only needs to verify user information once per session, instead of repeatedly querying the database on every request.
- **Improved Performance**: With fewer database queries, overall app performance is enhanced, especially for high-traffic applications.
- **Stateless Authentication**: The server does not need to store session data, as all necessary user details are embedded in the certificate.

## Potential Drawbacks

While this approach offers clear benefits, it also has some limitations that developers should consider:

1. **Stale Data**: Since the certificate holds a static snapshot of the user’s information, any updates (e.g., permission changes or role updates) will not be reflected until the session is renewed.
   
2. **Revoking Permissions**: If you need to revoke permissions or update user data in real-time, relying solely on certificates could be problematic. In such cases, consider validating sensitive data directly with the database on every request to ensure the most up-to-date information is used.

3. **Session Expiration**: You should define a reasonable session expiration time, after which the certificate must be renewed, to balance performance with security.

## Conclusion

This project showcases an authentication system that optimizes performance by reducing database load. By using signed certificates, we achieve a balance between performance and security. However, developers must remain mindful of the limitations, especially regarding stale data, and adjust their implementation accordingly depending on the specific use case.

---

## Deep Dive

### Logging In

To log in, a POST request needs to be sent to the server.

```http
### The server should respond with Status 200
POST http://localhost:3000/
{
  "user": "michael",
  "email": "1234" 
}
```
If the login attempt is successful, the server will provide a session cookie. This cookie contains the following information:
```typescript
    export type SessionData={
        id:string,
        userId:string,
        perms:string[]
    }
```
This data is then converted into a signed JWT token, which also includes additional metadata such as expiration time, SSL settings, valid domains, and paths where the cookie can be used. The cryptography implementation is found [here](app/lib/crypto.ts).

Once the session cookie is generated, it is returned to the client. The cookie is flagged as HTTPOnly, meaning it is inaccessible to JavaScript APIs in modern browsers (even though it's stored client-side). This adds an extra layer of security, making it harder for attackers to manipulate.
Using the Session Cookie

As mentioned earlier, the session cookie sent from the server is not accessible via the JavaScript API, but trust me, it's there, stored within the HTTP agent of the browser.

Here’s an example of how to use it:

javascript
```
const response = await fetch('http://localhost:3000/api/users', {
    method: 'GET',
    credentials: 'include', // Enables sending the HttpOnly cookie
});
```
### Managing Permissions

We’ve covered how to verify user sessions, but what about managing permissions? Since we can store arbitrary data in our session cookie, we can include an array of permissionNames.

In this simple example, API endpoints or pages are named the same as the permissions. A middleware can then be set up to match the requested path with the permissions stored in the session cookie.

For instance, if a user requests a path, the middleware can check whether the user's stored permissions include access to that path.
### Starting the Project
Firstly some environment variables have to be set. For that a .env needs to be created in the root directory of the project.
```env
SESSION_SECRET=ce317ce3-fad7-4529-af02-07631cd09fd1
SESSION_DURATION=24
NODE_ENV=development
```
Make sure to replace the Session Secret with something of your own.
The Session Duration is in hours and can be changed as needed.


To start the project, run the following commands in the root directory:

```bash
npm install
npm run dev
```
You can add new .tsx pages to this project or use tools like Curl, Postman, or any other API testing tool to access the API endpoints.
### Testing the API Endpoints

Once the project is up and running, you can test the API endpoints using:

```bash
npm run test
```
The .test.js file provides additional examples on how to use the [API Endpoints](test/.test.js).

