# NydArt Advisor Database Service

This service handles the database operations for the NydArt Advisor application, managing user profiles, artwork metadata, and analysis results.

## Features

- User profiles storage
- Artwork metadata storage
- Analysis history tracking
- Subscription management
- Generated links management

## Tech Stack

- MongoDB with Mongoose ODM
- Node.js with Express
- JWT for authentication
- CORS enabled

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following content:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5001
JWT_SECRET=your_jwt_secret
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Artworks

- `POST /api/artworks` - Create a new artwork
- `GET /api/artworks/user/:userId` - Get all artworks for a user
- `GET /api/artworks/:id` - Get a single artwork
- `PATCH /api/artworks/:id/analysis` - Update artwork analysis
- `DELETE /api/artworks/:id` - Delete an artwork

## Database Schema

### User Model
- Username
- Email
- Password (hashed)
- Subscription details
- Profile information
- Analysis credits

### Artwork Model
- User reference
- Image metadata
- Analysis history
- Technical assessments
- Learning resources

## Development

Run the development server with hot reload:
```bash
npm run dev
```

## Production

Start the production server:
```bash
npm start
``` 