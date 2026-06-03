# instamesh
# Instagram Clone - MERN Stack

A full-featured Instagram Clone built using the MERN Stack (MongoDB, Express.js, React.js, Node.js). This project replicates core social media functionalities such as user authentication, profile management, post sharing, likes, comments, bookmarks, follow/unfollow system, and real-time messaging.

## Features

### Authentication

* User Registration
* User Login & Logout
* JWT Authentication
* Protected Routes

### User Profile

* View User Profile
* Edit Profile
* Upload Profile Picture
* Bio Management

### Posts

* Create Post
* Upload Images
* Delete Post
* View All Posts
* View User Posts

### Social Features

* Like / Unlike Posts
* Add Comments
* View Comments
* Bookmark / Unbookmark Posts
* Follow / Unfollow Users
* Suggested Users

### Messaging

* One-to-One Chat
* Conversation Management
* Message History
* Seen Status Support

### Media Handling

* Cloudinary Image Storage
* Image Optimization with Sharp
* Multer File Uploads

## Tech Stack

### Frontend

* React.js
* Redux Toolkit
* React Router
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Socket.io
* Multer
* Sharp
* Cloudinary

## Project Structure

```bash
client/
├── src/
├── public/

server/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
└── config/
```

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/instagram-clone.git
cd instagram-clone
```

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start Backend Server

```bash
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

## API Endpoints

### User

```http
POST   /api/v1/user/register
POST   /api/v1/user/login
POST   /api/v1/user/logout
GET    /api/v1/user/profile/:id
PUT    /api/v1/user/profile
POST   /api/v1/user/:id/follow
```

### Posts

```http
POST   /api/v1/post/addpost
GET    /api/v1/post/all
GET    /api/v1/post/user/:id
DELETE /api/v1/post/:id
PUT    /api/v1/post/:id/like
PUT    /api/v1/post/:id/dislike
POST   /api/v1/post/:id/comment
GET    /api/v1/post/:id/comments
PUT    /api/v1/post/:id/bookmark
```

### Messages

```http
GET    /api/v1/message/conversations
GET    /api/v1/message/:id
POST   /api/v1/message/send/:id
PUT    /api/v1/message/seen/:id
```

## Future Improvements

* Group Chats
* Push Notifications
* Story Feature
* Reels Feature
* Video Uploads
* Real-Time Online Status
* Message Reactions
* Email Verification

## Author

Rahul Kumar

Computer Science Graduate | MERN Stack Developer

## License

This project is for educational and portfolio purposes.
