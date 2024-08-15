# EverShop API Server

## Overview

The Evershop Backend provides the necessary API services for the Evershop Online Store. It handles product management, user authentication, and various other functionalities required for the online store.

## Live Site

- You can visit the live site: [EverShop API](https://evershop-api.vercel.app).
- GitHub Repository link: [EverShop API Client](https://github.com/maasajal/evershop-online).

## Main Features

- **Product Management:** CRUD operations for products.
- **Filtering and Sorting:** Filter and sort products based on various criteria.
- **User Authentication:** Integration with Firebase Authentication for secure user login.
- **Brand and Category Management:** Fetch distinct brands and categories for filtering.
- **Price Range Calculation:** Determine the maximum price for filtering.

## Main Technologies Used

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express.js**: Web framework for building the API.
- **Firebase**: Authentication and Firestore for database and authentication.
- **MongoDB**: Database for storing product information (or any other database as used).
- **dotenv:** For managing environment variables.
- **cors:** A middleware for Cross-origin resource sharing (CORS).

## Dev Dependencies

- **nodemon:** Tool for automatically restarting the server during development.
- **eslint:** Linter for identifying and fixing problems in JavaScript code.

## Endpoints

### Auth Endpoints

- **POST /register:** Register a new user.
- **POST /login:** Log in a user and return a JWT.

### Products Endpoints

- **GET /products:** Products manage to send client site by filtering and sorting

## Running the Project Locally

To run this project on your local machine, follow these steps:

### Prerequisites

Make sure you have the following installed on your local machine:

- Node.js (version 14 or higher)
- npm (Node Package Manager)
- MongoDB

### Steps

1. **Clone the Repository:**

   ```sh
   git clone https://github.com/maasajal/evershop-api.git
   ```

2. **Navigate to the Project Directory:**

   ```sh
   cd evershop-api
   ```

3. **Install Dependencies:**
   ```sh
   npm install
   ```
4. **Environment variable:**
   Create a .env file in the root of your project and add the following:

   ```sh
   PORT=5000
   DB_URI=<Your_mongodb_uri>
   ```

5. **Start the Development Server:**

   ```sh
   nodemon index.js
   ```

6. **Run the Project:**

Open your browser and navigate to http://localhost:5000. You should see the project running.
