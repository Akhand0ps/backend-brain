# Brain Backend

This is the backend API for the Brain application, built with Node.js, Express, TypeScript, and MongoDB.

## Features

- User registration and authentication (JWT, bcrypt)
- Content creation, retrieval, and deletion
- Shareable content links
- Input validation with Zod
- Secure cookie-based authentication
- CORS support for frontend integration

## Project Structure

```
backend/
  ├── .env
  ├── package.json
  ├── tsconfig.json
  └── src/
      ├── index.ts                # Entry point
      ├── config/
      │   └── db.ts               # MongoDB connection
      ├── controllers/
      │   └── UserController.ts   # Route handlers
      ├── middleware/
      │   └── UserAuth.ts         # JWT authentication middleware
      ├── models/
      │   └── User.model.ts       # Mongoose models
      ├── routes/
      │   └── UserRoutes.ts       # Express routes
      ├── services/
      │   └── UserService.ts      # Business logic
      └── utils/
          └── random.ts           # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository:

   ```sh
   git clone <repo-url>
   cd backend
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the `backend/` directory:

   ```
   MONGO_DB_URL=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   PORT=3000
   ```

### Build and Run

To build the TypeScript code:

```sh
npm run build
```

To start the server:

```sh
npm start
```

The server will run on the port specified in your `.env` file (default: 3000).

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Auth & User

- `POST /api/v1/register` — Register a new user
- `POST /api/v1/login` — Login and receive JWT token
- `GET /api/v1/me` — Get current user info (requires authentication)

### Content

- `POST /api/v1/content` — Create new content (requires authentication)
- `GET /api/v1/content` — Get all content for the user (requires authentication)
- `DELETE /api/v1/content` — Delete content by ID (requires authentication)

### Sharing

- `PUT /api/v1/brain/share` — Generate or remove a shareable link (requires authentication)
- `GET /api/v1/brain/:shareLink` — Get shared content by link

## Environment Variables

- `MONGO_DB_URL` — MongoDB connection string
- `JWT_SECRET` — Secret key for JWT signing
- `PORT` — Port for the server (default: 3000)

## Development Notes

- Uses TypeScript strict mode.
- Uses Zod for input validation.
- Uses Mongoose for MongoDB models.
- JWT tokens are stored in HTTP-only cookies.

## License

This project is licensed under the ISC