# Database Service - Technical Documentation

## Table of Contents
1. [Service Overview](#service-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Installation & Setup](#installation--setup)
5. [Configuration](#configuration)
6. [API Reference](#api-reference)
7. [Deployment Guide](#deployment-guide)
8. [User Manual](#user-manual)
9. [Update Manual](#update-manual)
10. [Monitoring & Troubleshooting](#monitoring--troubleshooting)
11. [Security Considerations](#security-considerations)
12. [Testing](#testing)

## Service Overview

The Database Service is a microservice responsible for data persistence and management in the NydArt Advisor application. It provides a centralized data layer for user management, art analysis data, payment records, and application metrics.

### Key Features
- User data management (CRUD operations)
- Art analysis data storage
- Payment and subscription records
- User preferences and settings
- Data validation and sanitization
- Database connection management
- Data backup and recovery
- Query optimization and indexing

### Service Responsibilities
- Data persistence and retrieval
- Database schema management
- Data validation and integrity
- Connection pooling and optimization
- Backup and recovery procedures
- Data migration and versioning
- Query performance optimization

## Technology Stack

### Core Technologies
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js (v4.18.2)
- **Database**: MongoDB (v6.0+)
- **ORM**: Mongoose (v7.0.3)
- **Validation**: Express Validator

### Key Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.0.3",
  "cors": "^2.8.5",
  "dotenv": "^16.5.0",
  "jsonwebtoken": "^9.0.2",
  "express-validator": "^7.0.1",
  "prom-client": "^15.1.3"
}
```

### Development Tools
- **Testing**: Mocha, Chai, Sinon, Supertest
- **Code Coverage**: NYC
- **Development Server**: Nodemon
- **Environment Management**: dotenv

## Architecture

### Service Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Auth Service  │    │ Database Service│    │   MongoDB       │
│   (Express.js)  │◄──►│   (Express.js)  │◄──►│   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI Service    │    │ Payment Service │    │   Metrics       │
│   (Express.js)  │    │   (Express.js)  │    │   Service       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Models

#### User Model
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed),
  firstName: String,
  lastName: String,
  profile: {
    avatar: String,
    bio: String,
    preferences: Object
  },
  subscription: {
    plan: String,
    status: String,
    startDate: Date,
    endDate: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Art Analysis Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  imageUrl: String,
  analysis: {
    description: String,
    style: String,
    period: String,
    artist: String,
    confidence: Number
  },
  metadata: {
    filename: String,
    size: Number,
    mimeType: String
  },
  createdAt: Date
}
```

#### Payment Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  amount: Number,
  currency: String,
  status: String,
  provider: String,
  transactionId: String,
  metadata: Object,
  createdAt: Date
}
```

### Data Flow
1. **Read Operations**: Service request → Database Service → MongoDB query → Data validation → Response
2. **Write Operations**: Service request → Data validation → Database Service → MongoDB write → Response
3. **Update Operations**: Service request → Data validation → Database Service → MongoDB update → Response
4. **Delete Operations**: Service request → Authorization check → Database Service → MongoDB delete → Response

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or Atlas cloud)
- Network access to MongoDB instance

### Installation Steps

1. **Clone and Navigate**
   ```bash
   cd db_service
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   # Edit .env with your MongoDB configuration
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Run Tests**
   ```bash
   npm test
   ```

### MongoDB Setup

#### Option 1: Local MongoDB Installation
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Verify installation
mongo --version
```

#### Option 2: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Configure network access (IP whitelist)
4. Create database user
5. Get connection string

#### Option 3: Docker MongoDB
```bash
# Run MongoDB container
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:latest
```

## Configuration

### Environment Variables

Create a `.env` file in the `db_service` directory:

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

# Security
JWT_SECRET=your-jwt-secret-for-service-communication
TRUST_PROXY=1

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
LOG_FILE=logs/db-service.log

# Connection Pool
MONGODB_POOL_SIZE=10
MONGODB_SERVER_SELECTION_TIMEOUT=5000
MONGODB_SOCKET_TIMEOUT=45000

# Monitoring
PROMETHEUS_PORT=9090
METRICS_ENDPOINT=/metrics
```

### Critical Configuration Notes

#### MongoDB Connection
- **MONGODB_URI**: Complete connection string including database name
- **Connection Pool**: Configure based on expected load
- **Timeouts**: Set appropriate timeouts for your network

#### Security Configuration
- **JWT_SECRET**: Required for inter-service communication
- **CORS_ORIGIN**: Configure for your frontend domain
- **TRUST_PROXY**: Enable for production behind reverse proxy

## API Reference

### User Management Endpoints

#### GET /api/users
Get all users (with pagination and filtering).

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term for email/name
- `sort`: Sort field (default: createdAt)
- `order`: Sort order (asc/desc, default: desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

#### GET /api/users/:id
Get user by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "profile": {
      "avatar": "avatar_url",
      "bio": "User bio"
    },
    "subscription": {
      "plan": "premium",
      "status": "active"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/users/email/:email
Get user by email address.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### POST /api/users
Create a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "hashedPassword",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### PUT /api/users/:id
Update user information.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "profile": {
    "bio": "Updated bio"
  }
}
```

#### DELETE /api/users/:id
Delete user account.

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Art Analysis Endpoints

#### GET /api/analyses
Get art analyses (with pagination and filtering).

**Query Parameters:**
- `userId`: Filter by user ID
- `page`: Page number
- `limit`: Items per page
- `sort`: Sort field
- `order`: Sort order

#### POST /api/analyses
Create new art analysis record.

**Request Body:**
```json
{
  "userId": "user_id",
  "imageUrl": "image_url",
  "analysis": {
    "description": "Art description",
    "style": "Impressionism",
    "period": "19th Century",
    "artist": "Claude Monet",
    "confidence": 0.95
  },
  "metadata": {
    "filename": "artwork.jpg",
    "size": 1024000,
    "mimeType": "image/jpeg"
  }
}
```

### Payment Endpoints

#### GET /api/payments
Get payment records.

#### POST /api/payments
Create payment record.

**Request Body:**
```json
{
  "userId": "user_id",
  "amount": 29.99,
  "currency": "USD",
  "status": "completed",
  "provider": "stripe",
  "transactionId": "txn_123456789"
}
```

### Health Check Endpoints

#### GET /health
Service health check.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "database-service",
  "version": "1.0.0",
  "database": "connected"
}
```

#### GET /api/health/detailed
Detailed health check including database status.

**Response:**
```json
{
  "status": "healthy",
  "database": {
    "status": "connected",
    "collections": 5,
    "documents": 1250,
    "size": "15.2MB"
  },
  "memory": {
    "used": "45.2MB",
    "free": "1.2GB"
  },
  "uptime": "2h 15m 30s"
}
```

## Deployment Guide

### Production Deployment

#### 1. Environment Preparation
```bash
# Set production environment
NODE_ENV=production

# Update MongoDB connection for production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/art_advisor?retryWrites=true&w=majority
```

#### 2. Security Configuration
```env
# Production security settings
JWT_SECRET=your-production-jwt-secret-32-chars-minimum
CORS_ORIGIN=https://yourdomain.com
TRUST_PROXY=1

# MongoDB production settings
MONGODB_POOL_SIZE=20
MONGODB_SERVER_SELECTION_TIMEOUT=30000
MONGODB_SOCKET_TIMEOUT=60000
```

#### 3. Deployment Options

**Option A: Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

**Option B: Direct Deployment**
```bash
# Install dependencies
npm ci --only=production

# Start service
npm start
```

**Option C: PM2 Deployment**
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start src/server.js --name "database-service"

# Save PM2 configuration
pm2 save
pm2 startup
```

#### 4. Reverse Proxy Configuration (Nginx)
```nginx
server {
    listen 80;
    server_name db.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Database Backup Strategy

#### Automated Backups
```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongodb"
mkdir -p $BACKUP_DIR

# MongoDB backup
mongodump --uri="mongodb://localhost:27017/art_advisor" \
  --out="$BACKUP_DIR/backup_$DATE"

# Compress backup
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" -C "$BACKUP_DIR" "backup_$DATE"

# Clean old backups (keep last 7 days)
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: backup_$DATE.tar.gz"
```

#### Backup Restoration
```bash
# Restore from backup
tar -xzf backup_20240101_120000.tar.gz
mongorestore --uri="mongodb://localhost:27017/art_advisor" backup_20240101_120000/
```

## User Manual

### For Developers

#### Starting the Service
```bash
# Development mode
npm run dev

# Production mode
npm start
```

#### Database Operations
```bash
# Connect to MongoDB shell
mongo art_advisor

# View collections
show collections

# Query users
db.users.find().pretty()

# Query analyses
db.analyses.find().pretty()
```

#### Testing the Service
```bash
# Run all tests
npm test

# Run specific test categories
npm run test:unit
npm run test:integration
npm run test:performance
```

#### API Testing
```bash
# Test health endpoint
curl http://localhost:5001/health

# Test user creation
curl -X POST http://localhost:5001/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"hashedPassword","firstName":"Test","lastName":"User"}'

# Test user retrieval
curl http://localhost:5001/api/users/email/test@example.com
```

### For System Administrators

#### Service Management
```bash
# Check service status
pm2 status

# Restart service
pm2 restart database-service

# View logs
pm2 logs database-service

# Monitor resources
pm2 monit
```

#### Database Management
```bash
# Check database connectivity
curl http://localhost:5001/health

# Monitor database performance
mongo art_advisor --eval "db.stats()"

# Check collection sizes
mongo art_advisor --eval "db.getCollectionNames().forEach(function(c) { print(c + ': ' + db.getCollection(c).count() + ' documents') })"
```

#### Backup Management
```bash
# Create manual backup
./backup.sh

# List available backups
ls -la /backups/mongodb/

# Restore from backup
./restore.sh backup_20240101_120000.tar.gz
```

## Update Manual

### Version Update Process

#### 1. Pre-Update Checklist
- [ ] Backup current database
- [ ] Review changelog and breaking changes
- [ ] Test in staging environment
- [ ] Notify stakeholders of maintenance window

#### 2. Update Steps
```bash
# 1. Stop service
pm2 stop database-service

# 2. Backup database
./backup.sh

# 3. Backup current version
cp -r /app/database-service /app/database-service-backup-$(date +%Y%m%d)

# 4. Pull latest code
git pull origin main

# 5. Install dependencies
npm ci --only=production

# 6. Run database migrations (if any)
npm run migrate

# 7. Start service
pm2 start database-service

# 8. Verify health
curl http://localhost:5001/health
```

#### 3. Rollback Procedure
```bash
# If update fails, rollback
pm2 stop database-service
rm -rf /app/database-service
mv /app/database-service-backup-$(date +%Y%m%d) /app/database-service
pm2 start database-service

# Restore database if needed
./restore.sh backup_20240101_120000.tar.gz
```

#### 4. Post-Update Verification
- [ ] Health check passes
- [ ] Database connections stable
- [ ] All API endpoints functional
- [ ] Data integrity verified
- [ ] Performance metrics normal

### Database Migrations

#### Schema Updates
```javascript
// Example migration script
const mongoose = require('mongoose');

async function migrateUserSchema() {
  // Add new field to users collection
  await mongoose.connection.db.collection('users').updateMany(
    { profile: { $exists: false } },
    { $set: { profile: {} } }
  );
  
  console.log('User schema migration completed');
}

// Run migration
migrateUserSchema().catch(console.error);
```

## Monitoring & Troubleshooting

### Health Monitoring

#### Key Metrics to Monitor
- **Response Time**: < 100ms for database queries
- **Error Rate**: < 0.1% for all endpoints
- **Uptime**: > 99.9%
- **Memory Usage**: < 80% of allocated memory
- **Database Connections**: < 80% of pool size
- **Disk Space**: > 20% free space

#### Monitoring Commands
```bash
# Check service health
curl http://localhost:5001/health

# Check detailed health
curl http://localhost:5001/api/health/detailed

# Monitor memory usage
pm2 monit

# Check database status
mongo art_advisor --eval "db.serverStatus()"
```

### Common Issues & Solutions

#### 1. Database Connection Errors
**Symptoms**: Service fails to start, connection timeout errors
**Causes**: MongoDB not running, incorrect connection string, network issues
**Solutions**:
```bash
# Check MongoDB status
sudo systemctl status mongodb

# Test connection string
mongo "mongodb://localhost:27017/art_advisor"

# Check network connectivity
telnet localhost 27017
```

#### 2. High Memory Usage
**Symptoms**: Service becomes slow, memory warnings
**Causes**: Large queries, memory leaks, insufficient indexing
**Solutions**:
```bash
# Check memory usage
pm2 monit

# Analyze slow queries
mongo art_advisor --eval "db.getProfilingStatus()"

# Create indexes for frequently queried fields
mongo art_advisor --eval "db.users.createIndex({email: 1})"
```

#### 3. Slow Query Performance
**Symptoms**: API responses are slow, timeout errors
**Causes**: Missing indexes, large datasets, inefficient queries
**Solutions**:
```bash
# Enable query profiling
mongo art_advisor --eval "db.setProfilingLevel(1, 100)"

# Check existing indexes
mongo art_advisor --eval "db.users.getIndexes()"

# Create missing indexes
mongo art_advisor --eval "db.users.createIndex({createdAt: -1})"
```

#### 4. Data Corruption Issues
**Symptoms**: Inconsistent data, validation errors
**Causes**: Application bugs, concurrent writes, hardware issues
**Solutions**:
```bash
# Validate database integrity
mongo art_advisor --eval "db.validateAll()"

# Check for duplicate emails
mongo art_advisor --eval "db.users.aggregate([{\$group: {_id: '\$email', count: {\$sum: 1}}}, {\$match: {count: {\$gt: 1}}}])"

# Repair database if needed
mongod --repair
```

### Log Analysis

#### Log Locations
```bash
# PM2 logs
pm2 logs database-service

# Application logs (if configured)
tail -f logs/db-service.log

# MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

#### Key Log Patterns
```bash
# Database connection errors
grep "connection.*error" logs/db-service.log

# Slow queries
grep "slow.*query" logs/db-service.log

# Authentication failures
grep "auth.*failed" logs/db-service.log

# Memory warnings
grep "memory.*warning" logs/db-service.log
```

## Security Considerations

### Security Best Practices

#### 1. Database Security
- Use strong authentication for MongoDB
- Enable SSL/TLS for database connections
- Implement network-level security (firewalls)
- Regular security updates

#### 2. API Security
- Validate all input data
- Implement rate limiting
- Use HTTPS in production
- Proper error handling (no sensitive data exposure)

#### 3. Data Protection
- Encrypt sensitive data at rest
- Implement data retention policies
- Regular backup verification
- Access control and audit logging

#### 4. Environment Security
- Secure environment variables
- Use different credentials for each environment
- Regular secret rotation
- Monitor for unauthorized access

### Security Headers
```javascript
// Implemented security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### Vulnerability Scanning
```bash
# Run security audit
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

## Testing

### Test Structure
```
src/test/
├── basic.test.js          # Unit tests
├── working.test.js        # Integration tests
├── simple-test.js         # Test runner
└── utils/
    └── testHelpers.js     # Test utilities
```

### Running Tests
```bash
# Run all tests
npm test

# Run specific test categories
npm run test:unit
npm run test:integration
npm run test:performance

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Categories

#### Unit Tests
- Database connection management
- Data validation functions
- Utility functions
- Error handling

#### Integration Tests
- API endpoint testing
- Database operations
- CRUD operations
- Error scenarios

#### Performance Tests
- Database query performance
- Connection pool testing
- Load testing
- Memory usage testing

### Test Coverage
- **Target Coverage**: > 85%
- **Critical Paths**: 100% coverage
- **Database Operations**: 100% coverage
- **Error Handling**: 100% coverage

---

## Support & Maintenance

### Contact Information
- **Developer**: DarylNyd
- **Repository**: [Database Service Repository]
- **Documentation**: This file

### Maintenance Schedule
- **Security Updates**: Monthly
- **Dependency Updates**: Quarterly
- **Performance Reviews**: Monthly
- **Backup Verification**: Daily
- **Database Optimization**: Weekly

### Emergency Procedures
1. **Service Down**: Check health endpoint and logs
2. **Database Issues**: Verify MongoDB connectivity and logs
3. **Data Corruption**: Restore from latest backup
4. **Performance Issues**: Check indexes and query optimization

---

*Last Updated: January 2024*
*Version: 1.0.0*
