Certainly! Below is the content formatted for your `README.md` file, incorporating details from the relevant files in your project.

# Full-Stack Application with React, Express, and JWT Authentication

This project demonstrates a full-stack application using React for the frontend, Express for the backend, and JWT for authentication. It consists of two React applications (`main` and `external-app`) and an Express API.

## Project Structure

```plaintext
/project-root
  /main
    /src
      /components
        Login.tsx
        Todos.tsx
      App.tsx
      main.tsx
    package.json
  /external-app
    /src
      /components
        Todos.tsx
      App.tsx
      main.tsx
    package.json
  /api
    index.js
    package.json
```

## Setup Instructions

### API Setup

1. **Navigate to the API directory**:

   ```bash
   cd api
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the API server**:
   ```bash
   node index.js
   ```

### Main App Setup

1. **Navigate to the main app directory**:

   ```bash
   cd main
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the main app**:
   ```bash
   npm run dev
   ```

### External App Setup

1. **Navigate to the external app directory**:

   ```bash
   cd external-app
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the external app**:
   ```bash
   npm run dev
   ```

## Application Overview

### Main App

- **Login.tsx**: Handles user login and redirects to the todos page upon success.
- **Todos.tsx**: Displays a list of todos and allows adding and deleting todos.
- **App.tsx**: Manages routing and authentication verification.

### External App

- **Todos.tsx**: Displays a list of todos and allows adding and deleting todos.
- **App.tsx**: Verifies authentication and manages the display of todos.

## Authentication Flow

1. **Login**: Users log in through the main app, which sends a request to the API. Upon successful authentication, a JWT is stored in a cookie.
2. **Verification**: Both the main and external apps verify the JWT by calling the `/verify` endpoint.
3. **Todo Management**: Authenticated users can view, add, and delete todos.

## Dependencies

### Main App

- React
- React Router
- Axios
- React Toastify
- @tanstack/react-query
- js-cookie

### External App

- React
- Axios
- React Toastify
- js-cookie

## Conclusion

This setup demonstrates a full-stack application using React for the frontend and Express for the backend, with JWT handling authentication. The architecture allows for multiple frontend applications to interact with a single backend, showcasing the flexibility and scalability of this approach.

Feel free to customize and expand upon this foundation to suit your specific needs. Happy coding!
