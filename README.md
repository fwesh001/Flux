# Flux - Full-Stack Social Media Application

## Project Overview
Flux is a real-time social media platform with messaging, status updates, and post sharing capabilities.

## Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Python (Flask/FastAPI)
- **Database**: MongoDB
- **Real-time Communication**: WebSocket (Python socket server)

## Project Structure

### Frontend
- Pages for login, registration, chat, timeline, profile, and status management
- Organized CSS with base styles, layout, components, and themes
- Modular JavaScript files for different features
- Reusable UI components (navbar, sidebar, message bubbles, etc.)

### Backend
- Modular architecture with separate controllers, services, models, and routes
- Database connection management
- WebSocket server for real-time chat
- Configuration management
- Utilities for helpers, decorators, and error handling

## Setup Instructions
[Installation and setup steps to be added]

## API Endpoints

### Authentication Module
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
GET    /api/auth/verify
```

### Users Module
```
GET    /api/users/:id
PUT    /api/users/:id
GET    /api/users/:id/profile
PUT    /api/users/:id/profile
GET    /api/users/search?q=query
GET    /api/users/:id/followers
GET    /api/users/:id/following
POST   /api/users/:id/follow
DELETE /api/users/:id/unfollow
```

### Posts Module
```
POST   /api/posts
GET    /api/posts
GET    /api/posts/:id
PUT    /api/posts/:id
DELETE /api/posts/:id
POST   /api/posts/:id/like
DELETE /api/posts/:id/like
POST   /api/posts/:id/comments
GET    /api/posts/:id/comments
DELETE /api/posts/:id/comments/:comment_id
```

### Chats Module
```
GET    /api/chats
GET    /api/chats/:id
POST   /api/chats
POST   /api/chats/:id/messages
GET    /api/chats/:id/messages
DELETE /api/chats/:id
```

### Status Module
```
POST   /api/status
GET    /api/status
GET    /api/status/:id
DELETE /api/status/:id
GET    /api/status/:id/views
```

### Uploads Module
```
POST   /api/uploads/image
POST   /api/uploads/video
POST   /api/uploads/document
DELETE /api/uploads/:id
GET    /api/uploads/:id
```

## WebSocket Events

### Connection Events
```
connect
disconnect
```

### Chat Events
```
message:send
message:receive
user:typing
user:stopped-typing
chat:created
chat:deleted
```

### Status Events
```
status:created
status:viewed
status:deleted
```

### Notification Events
```
notification:new
notification:read
notification:cleared
```

### Presence Events
```
user:online
user:offline
user:away
```

## Environment Variables
See `.env.example` for required environment configuration.

## Installation
[Instructions to be added]

## Usage
[Usage instructions to be added]

## Contributing
[Guidelines to be added]

## License
[License information to be added]
