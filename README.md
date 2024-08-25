# Task Manager API Backend

This is the backend for the Task Manager application, built with Node.js, Express, MongoDB, and Socket.IO. It provides user authentication, task management, and real-time updates.

## Installation

1. Clone the repository:

   git clone https://github.com/shubhojeet1/tash-manager-server.git

2. Navigate to the project directory:

   cd tash-manager-server

3. Install the dependencies:

   npm install

## Environment Variables

Create a .env file in the root directory with the following:

MONGO_URI="_Add_Mongodb_Connection_String"
JWT_SECRET="_Add_Secret_Key"
PORT=8000

## Running the Server

Start the server :

   npm run dev

## Testing 

- npm test


## API Endpoints

- POST /api/auth/register: Register a new user.
- POST /api/auth/login: Log in a user.
- GET /api/tasks: Get all tasks.
- POST /api/tasks: Create a new task.
- PUT /api/tasks/:id: Update a task.
- DELETE /api/tasks/:id: Delete a task.

## License

This project is licensed under the MIT License.
