# Chatterbox

Chatterbox is an immersive real-time chat web application that empowers users to personalize their experience by selecting a unique username upon entering. Seamlessly connecting individuals, Chatterbox enables instant communication with other users, creating a vibrant and interactive chat environment. Stay engaged, express yourself, and forge meaningful connections through dynamic conversations with a diverse community of connected users. Experience the thrill of real-time messaging with Chatterbox, where your voice is heard and shared in an instant.

## Important Links

- [Front-end Repository](https://github.com/The-Re-Actors/Chatterbox-client)
- [Deployed Website](https://the-re-actors.github.io/Chatterbox-client/)
- [Entity Relationship Diagram (ERD)](https://imgur.com/0Iwy2xR)

## Collaboration Process

We used a Kanban board on Miro to track and identify each team member's tasks. Whenever issues arose, we addressed them in pairs through Zoom meetings. Our strategy throughout the project was to always approach it from the user's perspective and thoroughly test each user story.

## Technologies Used

- MongoDB
- Mongoose
- Express
- Socket.io (for real-time messaging)

## Routes to API

- `POST /sign-up`: Sign up
- `POST /sign-in`: Sign in
- `PATCH /change-password`: Change password
- `DELETE /sign-out`: Sign out
- `POST /profile`: Create profile
- `PATCH /profile/:id`: Update profile
- `DELETE /profile/:id`: Delete profile

## Unsolved Problems

- Uploading user profile pictures
