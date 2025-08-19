# Database Service Environment Setup

## Required Environment Variables

Create a `.env` file in the `db_service` directory with the following variables:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/art_advisor
# OR use individual variables:
# MONGODB_USERNAME=your_mongodb_username
# MONGODB_PASSWORD=your_mongodb_password
# MONGODB_CLUSTER=your_mongodb_cluster

# Service URLs
FRONTEND_URL=http://localhost:3000
CLIENT_URL=http://localhost:3000
```

## MongoDB Setup Options

### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use: `MONGODB_URI=mongodb://localhost:27017/art_advisor`

### Option 2: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Use: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/art_advisor`

### Option 3: Individual Variables
```env
MONGODB_USERNAME=your_username
MONGODB_PASSWORD=your_password
MONGODB_CLUSTER=your_cluster_name
```

## Quick Setup

1. Copy the example above to `db_service/.env`
2. Replace placeholder values with your actual MongoDB connection details
3. Restart the database service
4. Test connection

## Troubleshooting

- **"Resource not found"**: Usually means MongoDB connection failed
- **"Database connection error"**: Check MongoDB credentials and network
- **"Cannot GET /api/users"**: Database service not running or routes not mounted
