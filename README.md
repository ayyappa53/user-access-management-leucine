
# User Access Management System

A full-stack application for managing user access to internal software tools with role-based permissions and access request workflows.

---

## 🛠️ Tech Stack

- **Frontend**: React.js  
- **Backend**: Node.js, Express.js  
- **Database**: PostgreSQL  
- **ORM**: TypeORM  
- **Authentication**: JWT (JSON Web Token)  
- **Password Hashing**: bcrypt  

---

## ⚙️ Prerequisites

- Node.js (v14 or later)  
- PostgreSQL (v12 or later)  

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/ayyappa53/user-access-management-leucine.git
cd user-access-management-leucine
````

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder with:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=1234
DB_DATABASE=user_access_management
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=86400
PORT=3001
```

Create the PostgreSQL database:

```sql
CREATE DATABASE user_access_management;
```

Start the backend server:

```bash
npm start
# or
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend/` folder with:

```
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_NAME=User Access Management System
REACT_APP_VERSION=1.0.0
GENERATE_SOURCEMAP=true
BROWSER=none
```

Start the frontend development server:

```bash
npm start
```

---

## 📚 API Documentation

### Authentication Endpoints

#### Register a new user

```
POST /api/auth/signup
```

Request Body:

```json
{
  "username": "john.doe",
  "password": "secure_password",
  "role": "Employee"
}
```

Response:

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "john.doe",
    "role": "Employee"
  }
}
```

#### Login

```
POST /api/auth/login
```

Request Body:

```json
{
  "username": "john.doe",
  "password": "secure_password"
}
```

Response:

```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "john.doe",
    "role": "Employee"
  }
}
```

#### Get User Profile

```
GET /api/auth/profile
```

Headers:

```
Authorization: Bearer jwt_token_here
```

Response:

```json
{
  "user": {
    "id": 1,
    "username": "john.doe",
    "role": "Employee"
  }
}
```

---

### Software Endpoints

#### Create Software (Admin only)

```
POST /api/software
```

Headers:

```
Authorization: Bearer jwt_token_here
```

Request Body:

```json
{
  "name": "Project Management Tool",
  "description": "A tool for managing projects and tasks",
  "accessLevels": ["Read", "Write", "Admin"]
}
```

Response:

```json
{
  "message": "Software created successfully",
  "software": {
    "id": 1,
    "name": "Project Management Tool",
    "description": "A tool for managing projects and tasks",
    "accessLevels": ["Read", "Write", "Admin"]
  }
}
```

#### Get All Software

```
GET /api/software
```

Headers:

```
Authorization: Bearer jwt_token_here
```

Response:

```json
{
  "software": [
    {
      "id": 1,
      "name": "Project Management Tool",
      "description": "A tool for managing projects and tasks",
      "accessLevels": ["Read", "Write", "Admin"]
    }
  ]
}
```

#### Get Software by ID

```
GET /api/software/:id
```

Headers:

```
Authorization: Bearer jwt_token_here
```

Response:

```json
{
  "software": {
    "id": 1,
    "name": "Project Management Tool",
    "description": "A tool for managing projects and tasks",
    "accessLevels": ["Read", "Write", "Admin"]
  }
}
```

#### Update Software (Admin only)

```
PUT /api/software/:id
```

Headers:

```
Authorization: Bearer jwt_token_here
```

Request Body:

```json
{
  "name": "Updated Project Management Tool",
  "description": "Updated description",
  "accessLevels": ["Read", "Write"]
}
```

Response:

```json
{
  "message": "Software updated successfully",
  "software": {
    "id": 1,
    "name": "Updated Project Management Tool",
    "description": "Updated description",
    "accessLevels": ["Read", "Write"]
  }
}
```

#### Delete Software (Admin only)

```
DELETE /api/software/:id
```

Headers:

```
Authorization: Bearer jwt_token_here
```

Response:

```json
{
  "message": "Software deleted successfully"
}
```

---

### Access Request Endpoints

#### Create Access Request (Employee)

```
POST /api/requests
```

Headers:

```
Authorization: Bearer jwt_token_here
```

Request Body:

```json
{
  "softwareId": 1,
  "accessType": "Write",
  "reason": "Need write access to manage project tasks"
}
```

Response:

```json
{
  "message": "Access request submitted successfully",
  "request": {
    "id": 1,
    "user": {
      "id": 1,
      "username": "john.doe",
      "role": "Employee"
    },
    "software": {
      "id": 1,
      "name": "Project Management Tool",
      "description": "A tool for managing projects and tasks",
      "accessLevels": ["Read", "Write", "Admin"]
    },
    "accessType": "Write",
    "reason": "Need write access to manage project tasks",
    "status": "Pending",
    "createdAt": "2023-10-25T14:30:00.000Z"
  }
}
```

#### Get All Requests

```
GET /api/requests
```

Headers:

```
Authorization: Bearer jwt_token_here
```

Response (varies by role):

```json
{
  "requests": [
    {
      "id": 1,
      "user": {
        "id": 1,
        "username": "john.doe",
        "role": "Employee"
      },
      "software": {
        "id": 1,
        "name": "Project Management Tool",
        "description": "A tool for managing projects and tasks",
        "accessLevels": ["Read", "Write", "Admin"]
      },
      "accessType": "Write",
      "reason": "Need write access to manage project tasks",
      "status": "Pending",
      "createdAt": "2023-10-25T14:30:00.000Z"
    }
  ]
}
```

#### Get Pending Requests (Manager, Admin)

```
GET /api/requests/status/pending
```

Headers:

```
Authorization: Bearer jwt_token_here
```

Response:

```json
{
  "requests": [
    {
      "id": 1,
      "user": {
        "id": 1,
        "username": "john.doe",
        "role": "Employee"
      },
      "software": {
        "id": 1,
        "name": "Project Management Tool",
        "description": "A tool for managing projects and tasks",
        "accessLevels": ["Read", "Write", "Admin"]
      },
      "accessType": "Write",
      "reason": "Need write access to manage project tasks",
      "status": "Pending",
      "createdAt": "2023-10-25T14:30:00.000Z"
    }
  ]
}
```

#### Get Request by ID

```
GET /api/requests/:id
```

Headers:

```
Authorization: Bearer jwt_token_here
```

Response:

```json
{
  "request": {
    "id": 1,
    "user": {
      "id": 1,
      "username": "john.doe",
      "role": "Employee"
    },
    "software": {
      "id": 1,
      "name": "Project Management Tool",
      "description": "A tool for managing projects and tasks",
      "accessLevels": ["Read", "Write", "Admin"]
    },
    "accessType": "Write",
    "reason": "Need write access to manage project tasks",
    "status": "Pending",
    "createdAt": "2023-10-25T14:30:00.000Z"
  }
}
```

#### Update Request Status (Manager, Admin)

```
PATCH /api/requests/:id/status
```

Headers:

```
Authorization: Bearer jwt_token_here
```

Request Body:

```json
{
  "status": "Approved"
}
```

Response:

```json
{
  "message": "Request approved successfully",
  "request": {
    "id": 1,
    "user": {
      "id": 1,
      "username": "john.doe",
      "role": "Employee"
    },
    "software": {
      "id": 1,
      "name": "Project Management Tool",
      "description": "A tool for managing projects and tasks",
      "accessLevels": ["Read", "Write", "Admin"]
    },
    "accessType": "Write",
    "reason": "Need write access to manage project tasks",
    "status": "Approved",
    "createdAt": "2023-10-25T14:30:00.000Z"
  }
}
```

---

## ⚠️ Error Handling

All endpoints return appropriate HTTP status codes:

* `200 OK`: Success
* `201 Created`: Resource created
* `400 Bad Request`: Invalid input
* `401 Unauthorized`: Authentication required
* `403 Forbidden`: Insufficient permissions
* `404 Not Found`: Resource not found
* `409 Conflict`: Resource already exists
* `500 Internal Server Error`: Server error

---

## 🔒 Security Considerations

* Passwords hashed using bcrypt
* JWT for stateless authentication
* Role-based middleware protects sensitive endpoints
* TypeORM prevents SQL injection

---

## 📄 License

This project is licensed under the MIT License.

