# EngineersIQ

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Overview

EngineerIQ Hub is a dynamic full-stack web application designed to help tech enthusiasts navigate and master the ever-evolving world of technology. Users can access expert advice, personal experiences, and user-generated content covering everything from troubleshooting common tech issues to learning about new software, apps, gadgets, and digital tools.

## Features

- **User Authentication**: Secure registration and login with JWT-based authentication.
- **User Profiles**: Personalized profiles with the ability to update information and profile pictures.
- **Rich Content Creation**: Create and edit tech tips and tutorials using a powerful rich text editor.
- **Post Categories**: Easily categorize posts for better organization and discoverability.
  <!-- - **Exclusive Content**: Access exclusive content with a subscription model. -->
  <!-- - **Upvote & Downvote System**: Rate posts and comments based on quality and relevance. -->
- **Commenting System**: Engage in discussions through comments on posts.
<!-- - **Payment Integration**: Seamless integration with Aamarpay/Stripe for premium subscriptions. -->
- **PDF Generation**: Generate PDFs of tech guides for offline reference.
- **News Feed**: Dynamic feed with infinite scroll and sorting options.
- **Search & Filter**: Advanced search functionality with debouncing for optimal performance.
- **Following System**: Follow other tech enthusiasts to stay updated with their content.
- **Micro Animations**: Smooth transitions and effects for an engaging user experience.
- **Responsive Design**: Mobile-friendly interface adapting to various screen sizes.

## Technologies Used

- Frontend: Next.js
- Backend: Next.js API Route
- Database: MongoDB
- Authentication: JWT (JSON Web Tokens)
<!-- - Payment Gateway: Aamarpay / Stripe -->
- Rich Text Editor: TinyMCE
- Styling: Tailwind CSS
- State Management: Redux / Context API
- API: RESTful API

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/sheikhmohdnazmulhasan/engineers-IQ.git
   ```

2. Install dependencies:

   ```
   cd engineers-IQ
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the necessary environment variables (database connection string, JWT secret, payment gateway credentials, etc.).

4. Start the development server:

   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000` to see the application running.

## Project Structure

```
tech-tips-and-tricks-hub/
├── client/                 # Frontend React application
│   ├── components/         # Reusable React components
│   ├── pages/              # Next.js pages
│   ├── styles/             # CSS and styling files
│   └── utils/              # Utility functions and helpers
├── server/                 # Backend Node.js application
│   ├── controllers/        # Request handlers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   └── middleware/         # Custom middleware functions
├── public/                 # Static files
├── config/                 # Configuration files
├── tests/                  # Test files
└── README.md               # Project documentation
```

## API Endpoints

- `/api/auth`: Authentication routes (register, login, logout)
- `/api/users`: User-related routes (profile management, following)
- `/api/posts`: Post-related routes (CRUD operations, upvoting)
- `/api/comments`: Comment-related routes
- `/api/categories`: Category management routes
- `/api/search`: Search functionality routes
<!-- - `/api/payments`: Payment and subscription routes -->

<!-- ## Contributing

We welcome contributions to the Tech Tips & Tricks Hub project. Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License. See the LICENSE file for details. -->
