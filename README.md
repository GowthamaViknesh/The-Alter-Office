Custom URL Shortener API

Live Demo

Frontend: Live App URL

Backend API: Live API URL

Overview

This project is a scalable URL Shortener API with advanced analytics, user authentication via Google Sign-In, and rate limiting. The system enables users to create short URLs for easier sharing, group them under topics, and access detailed analytics on their performance.

Features

1. User Authentication

Google Sign-In for secure authentication.

JWT-based authentication for API security.

2. Short URL Management

Create Short URL: Users can shorten URLs with optional custom aliases and topic categorization.

Redirect Short URL: Redirects users to the original URL while tracking analytics.

3. Advanced Analytics

URL Analytics: View total clicks, unique users, clicks by date, OS, and device type.

Topic-Based Analytics: Analyze URLs grouped under specific topics.

Overall Analytics: Comprehensive insights for all short URLs created by a user.

4. Performance & Security

Rate Limiting: Restricts the number of URLs created per user within a set time.

Redis Caching: Stores short URLs and analytics to improve performance.

Dockerized Deployment: Containerized for scalability.

API Endpoints

Authentication

POST /api/auth/google - Authenticate using Google OAuth

GET /api/auth/logout - Logout user

URL Management

POST /api/shorten - Create a new short URL

GET /api/shorten/{alias} - Redirect to original URL

Analytics

GET /api/analytics/{alias} - Get analytics for a specific short URL

GET /api/analytics/topic/{topic} - Get topic-based analytics

GET /api/analytics/overall - Get overall analytics for the user

Technologies Used

Backend: Node.js, Express.js, MongoDB

Authentication: Google OAuth, Passport.js, JWT

Caching: Redis

Security: Rate limiting, CORS, Helmet.js

Deployment: Docker, Cloud hosting (Render/Railway/AWS)

Documentation: Swagger

Installation & Setup

Prerequisites

Node.js & npm

Docker (optional)

MongoDB (local or cloud instance)

Redis (for caching)
