# 🏪 Store Rating Platform – FullStack Intern Coding Challenge

A full-stack web application that allows users to submit and manage ratings for stores.  
The platform supports multiple user roles with role-based access control and dashboards.

---

## 🚀 Tech Stack

### Frontend
- React.js
- Axios
- React Router
- CSS / Tailwind / Bootstrap (update as per your project)

### Backend
- Node.js
- Express.js
- JWT Authentication
- Role-Based Access Control (RBAC)

### Database
- PostgreSQL / MySQL (update based on what you used)

---

## 📌 Features

## 🔐 Authentication System
- Single login system for all users
- JWT-based authentication
- Role-based authorization
- Secure password hashing (bcrypt)
- Logout functionality

---

# 👥 User Roles & Functionalities

## 1️⃣ System Administrator

### Capabilities:
- Add new stores
- Add new users (Normal/Admin)
- View dashboard statistics:
  - Total Users
  - Total Stores
  - Total Ratings
- View all stores:
  - Name
  - Email
  - Address
  - Rating
- View all users:
  - Name
  - Email
  - Address
  - Role
- Filter users & stores by:
  - Name
  - Email
  - Address
  - Role
- View detailed user information
- Logout

---

## 2️⃣ Normal User

### Capabilities:
- Sign up
- Login
- Update password
- View all stores
- Search stores by:
  - Name
  - Address
- Submit ratings (1–5)
- Modify submitted ratings
- View:
  - Store Name
  - Address
  - Overall Rating
  - Their Submitted Rating
- Logout

---

## 3️⃣ Store Owner

### Capabilities:
- Login
- Update password
- View:
  - List of users who rated their store
  - Average rating of their store
- Logout

---

# 📝 Form Validations

| Field    | Validation Rules |
|----------|------------------|
| Name     | Min 20 characters, Max 60 characters |
| Address  | Max 400 characters |
| Password | 8–16 characters, must include at least one uppercase letter and one special character |
| Email    | Standard email format validation |

All validations implemented on:
- ✅ Frontend
- ✅ Backend

---

# 📊 Dashboard Functionalities

### Admin Dashboard
- Total Users Count
- Total Stores Count
- Total Ratings Count

### Store Owner Dashboard
- Average Store Rating
- List of Users Who Submitted Ratings

---

# 🔎 Sorting & Filtering

All tables support:
- Sorting (Ascending / Descending)
- Filtering by key fields

Implemented for:
- Users
- Stores
- Ratings

---

# 🗄️ Database Design

### Core Tables:
- Users
- Stores
- Ratings

### Relationships:
- One Store → Many Ratings
- One User → Many Ratings
- Role-based user management

Database designed following normalization and best practices.

---

# 🔒 Security Practices

- Password hashing using bcrypt
- JWT-based authentication
- Protected routes
- Role-based middleware
- Input validation & sanitization

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository
git clone (https://github.com/Aditi-kod/store-rating-system)
cd project-folder
## 2️⃣ Backend Setup
cd backend
npm install


## Create a .env file:

PORT=5000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_password
DB_NAME=your_database
JWT_SECRET=your_secret_key


## Start backend:

npm start

## 3️⃣ Frontend Setup
cd frontend
npm install
npm start

# 🧪 Testing

Manual testing for all roles

Authentication & authorization testing

Form validation testing

Role-based route protection testing

# 📈 Improvements (Future Scope)

Pagination

Email verification

Password reset feature

Unit & Integration tests

Deployment (AWS / Vercel / Render)

# 🎯 Learning Outcomes

Role-Based Access Control implementation

Secure authentication system using JWT

Relational database schema design

Full-stack application architecture

Dashboard & analytics implementation

# 👩‍💻 Author

Aditi Kumari
Full-Stack Developer

