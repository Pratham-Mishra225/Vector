# Blog Platform

A modern, production-ready full-stack blogging platform built with Next.js. Create, share, and discover engaging content with an intuitive interface and robust backend infrastructure.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Screenshots & Demo](#screenshots--demo)
- [Security Considerations](#security-considerations)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

Blog Platform is a full-stack social blogging application that enables users to create, share, and engage with content. Built on modern web technologies, it provides a seamless experience for both content creators and readers with features like user authentication, post creation, social interactions (likes, follows), and personalized feeds.

The platform is designed with scalability, security, and user experience as core principles, making it production-ready for immediate deployment.

---

## Features

### Core Functionality
- **User Authentication**: Secure registration, login, and session management
- **Post Management**: Create, read, and delete posts with rich text support
- **Social Interactions**: Like posts and follow other users
- **User Profiles**: View user information and post history
- **Personalized Feed**: Timeline showing posts from followed users
- **Search & Discovery**: Find users and content across the platform

### Technical Features
- **Real-time Updates**: Instant feedback on user actions
- **Responsive Design**: Mobile-first UI that works on all devices
- **Server-Side Rendering**: Optimized performance with SSR
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive error management and user feedback

---

## Tech Stack

### Frontend
- **Framework**: [Next.js 15+](https://nextjs.org) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: Tailwind CSS with custom components
- **UI Library**: Custom component library with radix-ui primitives
- **State Management**: React Context API
- **Form Handling**: Native HTML with client-side validation

### Backend
- **Runtime**: Node.js with Next.js API Routes
- **Authentication**: Session-based with secure cookies
- **Database**: Configurable (SQLite/PostgreSQL/MongoDB)
- **ORM/Query**: Native database driver integration
- **Validation**: TypeScript type checking + runtime validation

### DevOps & Tools
- **Package Manager**: npm
- **Linting**: ESLint with Next.js configuration
- **Formatter**: Prettier (configured)
- **Environment Management**: .env.local
- **Version Control**: Git

---

## Architecture

### High-Level Design

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
│  (Next.js Frontend + React Components)                   │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS
┌────────────────────▼────────────────────────────────────┐
│            Next.js Application Server                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Pages (SSR/SSG) - App Router                   │   │
│  │  - (auth): Login, Register                       │   │
│  │  - (main): Feed, Posts, Profiles, Write          │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  API Routes (Backend)                            │   │
│  │  - /api/auth/* (Login, Register, Sessions)       │   │
│  │  - /api/posts/* (Create, Read, Like, Delete)    │   │
│  │  - /api/users/* (Profile, Follow/Unfollow)      │   │
│  │  - /api/feed/* (Personalized Timeline)           │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Middleware (Authentication, Logging)            │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │ SQL/NoSQL Queries
┌────────────────────▼────────────────────────────────────┐
│                   Database Layer                         │
│  - Users (id, email, name, password_hash)               │
│  - Posts (id, content, author_id, created_at)           │
│  - Likes (post_id, user_id)                             │
│  - Follows (follower_id, following_id)                  │
└─────────────────────────────────────────────────────────┘
```

### Directory Structure

```
/app                  # Next.js App Router pages & API routes
├── (auth)            # Authentication pages (login, register)
├── (main)            # Main application pages (protected)
└── api               # Backend API endpoints
/components           # Reusable React components
├── ui                # Base UI components (button, input, card, etc.)
├── Editor.tsx        # Rich text editor for post creation
├── Navbar.tsx        # Navigation component
├── PostCard.tsx      # Individual post display
└── ...
/lib                  # Utility functions & services
├── auth.ts           # Authentication utilities
├── db.ts             # Database connection & queries
├── apiFetch.ts       # API client helper
└── utils.ts          # General utilities
/models              # TypeScript models & database schemas
├── User.ts
├── Post.ts
├── Like.ts
└── Follow.ts
/types               # TypeScript type definitions
├── user.ts
└── post.ts
/contexts            # React Context providers
└── AuthContext.tsx  # Global authentication state
/public              # Static assets
```

---

## Setup Instructions

### Prerequisites
- **Node.js**: v18.17+ (required for Next.js 15)
- **npm**: v9+ (or yarn/pnpm)
- **Database**: SQLite, PostgreSQL, or MongoDB (configured in `.env.local`)
- **Git**: For version control

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/blog-platform.git
   cd blog-platform
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration (see Environment Variables section)
   ```

4. **Initialize Database**
   ```bash
   npm run db:init    # Creates tables if not using migrations
   # or
   npm run migrate    # Run migrations if using them
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at [http://localhost:3000](http://localhost:3000)

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run type checking
npm run type-check

# Format code with Prettier
npm run format
```

---

## Environment Variables

Create a `.env.local` file in the project root with the following configuration:

```env
# Database Configuration
DATABASE_URL=sqlite:./blog.db
# For PostgreSQL: postgres://user:password@localhost:5432/blog_db
# For MongoDB: mongodb://localhost:27017/blog_db

# Authentication
AUTH_SECRET=your-secret-key-here-min-32-characters
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development

# Session Configuration
SESSION_MAX_AGE=2592000  # 30 days in seconds
SESSION_COOKIE_SECURE=false  # Set to true in production with HTTPS

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# Email Configuration (Optional - for future email features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-app-password

# Feature Flags (Optional)
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_SEARCH=true
```

### Environment Variables by Environment

**Development** (`NODE_ENV=development`)
- Debug mode enabled
- Relaxed CORS policies
- Mock/local database

**Production** (`NODE_ENV=production`)
- All security features enabled
- HTTPS enforced (`SESSION_COOKIE_SECURE=true`)
- Optimized performance
- External database required

---

## API Documentation

### Authentication Endpoints

**POST** `/api/auth/register`
- Register a new user
- Body: `{ email, password, name }`
- Returns: User object and session cookie

**POST** `/api/auth/login`
- Authenticate user
- Body: `{ email, password }`
- Returns: User object and session cookie

**POST** `/api/auth/logout`
- Destroy session
- Returns: Success message

**GET** `/api/auth/me`
- Get current authenticated user
- Returns: User object or 401 if not authenticated

### Posts Endpoints

**GET** `/api/posts`
- List all posts (paginated)
- Query: `?page=1&limit=20`
- Returns: Array of posts with author info

**POST** `/api/posts`
- Create a new post (authenticated)
- Body: `{ content }`
- Returns: Created post object

**GET** `/api/posts/[id]`
- Get post by ID with comments and likes
- Returns: Post object with metadata

**DELETE** `/api/posts/[id]`
- Delete post (author only)
- Returns: Success message

**POST** `/api/posts/[id]/like`
- Like/unlike a post (authenticated)
- Returns: Updated post with like count

### User Endpoints

**GET** `/api/users/[id]`
- Get user profile and posts
- Returns: User object with posts array

**POST** `/api/users/[id]/follow`
- Follow/unfollow user (authenticated)
- Returns: Updated relationship status

### Feed Endpoints

**GET** `/api/feed/following`
- Get feed of posts from followed users (authenticated)
- Query: `?page=1&limit=20`
- Returns: Array of posts from following

---

## Screenshots & Demo

### Key Pages

**Home Feed**
- Displays personalized feed of posts from followed users
- Real-time like/follow buttons
- Infinite scroll pagination

**Post Creation**
- Rich text editor for composing posts
- Character count and validation
- Quick publish with instant feedback

**User Profile**
- User information and bio
- Post history
- Follow/unfollow button
- Follower/following counts

**Authentication**
- Clean, minimal login & registration forms
- Email/password validation
- Redirect to home after successful auth

### Demo Credentials (Development)
```
Email: demo@example.com
Password: demo123456
```

---

## Security Considerations

### Authentication & Authorization
- ✅ **Password Hashing**: Passwords hashed with bcrypt (cost factor: 12)
- ✅ **Session Security**: HTTP-only cookies with secure flag (production)
- ✅ **CSRF Protection**: Token-based CSRF prevention on state-changing operations
- ✅ **Authorization Checks**: User ownership verification on sensitive operations

### Data Protection
- ✅ **Input Validation**: All user inputs validated and sanitized
- ✅ **SQL Injection Prevention**: Parameterized queries and prepared statements
- ✅ **XSS Prevention**: React's built-in XSS protection + Content Security Policy headers
- ✅ **Rate Limiting**: API endpoints protected from abuse (implementation in middleware)

### Infrastructure Security
- ✅ **HTTPS Enforcement**: Configured for production deployment
- ✅ **Environment Variables**: Sensitive data stored in `.env.local` (not in version control)
- ✅ **Database Security**: Connection encryption and access controls
- ✅ **Dependency Management**: Regular npm audits and security updates

### Best Practices
- Never commit `.env.local` to version control (use `.env.example`)
- Keep Next.js and dependencies updated
- Use environment-specific configurations
- Implement request logging for audit trails
- Regular security audits and penetration testing recommended

### Compliance
- **Privacy**: GDPR-ready (user data deletion, consent tracking)
- **Data Retention**: Implement appropriate data retention policies
- **Terms of Service**: Required before deployment

---

## Future Improvements

### Phase 2 - Enhanced Engagement
- [ ] Comment system on posts
- [ ] Hashtag support and trending topics
- [ ] User notifications (likes, follows, comments)
- [ ] Real-time updates with WebSockets
- [ ] Post scheduling

### Phase 3 - Content & Discovery
- [ ] Full-text search with filters
- [ ] Trending posts and discover page
- [ ] Content recommendations engine
- [ ] Bookmarks/save posts
- [ ] Post categories/topics

### Phase 4 - Media & Monetization
- [ ] Image & video upload support
- [ ] Rich media editing
- [ ] Creator monetization (subscriptions, tips)
- [ ] Analytics dashboard for creators

### Phase 5 - Community & Moderation
- [ ] Direct messaging
- [ ] Community groups/spaces
- [ ] Content moderation tools
- [ ] Report/flag system
- [ ] User roles and permissions

### Performance & Scalability
- [ ] Database query optimization
- [ ] Redis caching layer
- [ ] CDN for static assets
- [ ] Horizontal scaling setup
- [ ] Microservices architecture (if needed)

---

## Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Write TypeScript with strict mode enabled
- Follow ESLint configuration
- Add tests for new features
- Update documentation

---

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t blog-platform .
docker run -p 3000:3000 blog-platform
```

### Self-hosted
1. Build: `npm run build`
2. Start: `npm start`
3. Configure reverse proxy (nginx/Apache)
4. Set up SSL certificate

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Support & Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/blog-platform/issues)
- **Email**: support@blogplatform.com
- **Documentation**: [Full docs](https://docs.blogplatform.com)

---

**Happy blogging! 🚀**
