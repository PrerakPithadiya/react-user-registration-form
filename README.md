# Registration Form Application

A full-stack web application built with React, Node.js, Express, and MySQL that implements a user registration system with form validation and database storage.

## Features

- User-friendly registration form with the following fields:
  - First Name
  - Last Name
  - Username (lowercase letters and dashes only)
  - Email
  - Password
  - Age
  - Phone Number (with country code)
  - Address
  - City

- Form Validation:
  - All fields are required
  - Email format validation
  - Username validation (only lowercase letters and dashes allowed)
  - Phone number validation (country code + 10 digits)
  - Real-time input validation

- Backend Features:
  - REST API using Express.js
  - MySQL database integration
  - Data persistence
  - Error handling
  - CORS enabled

## Tech Stack

- Frontend:
  - React
  - Vite
  - CSS for styling

- Backend:
  - Node.js
  - Express.js
  - MySQL2
  - CORS

- Database:
  - MySQL

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v14 or higher)
- MySQL Server
- npm (Node Package Manager)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/PrerakPithadiya/react-user-registration-form.git
cd react-user-registration-form
```

1. Install frontend dependencies:

```bash
npm install
```

1. Install backend dependencies:

```bash
cd backend
npm install
```

1. Configure the database:

- Create a MySQL database named 'registration_form'
- Update the .env file in the backend directory with your MySQL credentials:

```env
DB_HOST=127.0.0.1
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=registration_form
PORT=3000
```

## Running the Application

1. Start the backend server:

```bash
cd backend
npm run dev
```

The server will run on `http://localhost:3000`

1. Start the frontend development server:

```bash
# From the project root directory
npm run dev
```

The application will be available at `http://localhost:5173`

## Database Schema

The application uses a 'users' table with the following structure:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  age VARCHAR(3) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Validation Rules

1. Username:
   - Only lowercase letters and dashes allowed
   - Pattern: ^[a-z-]+$

2. Email:
   - Must be a valid email format
   - Must be unique in the database

3. Phone Number:
   - Must include country code
   - Format: +XX XXXXXXXXXX (country code + space + 10 digits)
   - Example: +91 9876543210

## Security Features

- Password masking in database queries
- Input validation on both frontend and backend
- CORS protection
- Error handling for duplicate entries

## Error Handling

The application includes comprehensive error handling for:

- Invalid input validation
- Database connection issues
- Duplicate email entries
- Server errors

## API Endpoints

### POST /api/register

Registers a new user

Request body:

```json
{
  "firstName": "string",
  "lastName": "string",
  "username": "string",
  "email": "string",
  "password": "string",
  "age": "string",
  "phone": "string",
  "address": "string",
  "city": "string"
}
```

Response:

```json
{
  "success": true,
  "message": "Registration successful",
  "userId": "number"
}
```

## Database Commands

To view the registered users (with masked passwords):

```bash
mysql -u root -p"your_password" --table -e "USE registration_form; SELECT id, firstName, lastName, email, CONCAT('*****') as password, age, phone, address, city, created_at FROM users;"
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
