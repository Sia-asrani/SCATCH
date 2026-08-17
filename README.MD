# Scatch - E-Commerce Shopping Platform

A full-stack e-commerce web application built with **Node.js**, **Express**, and **MongoDB**. This is an initial implementation of a shopping website where users can register, browse products, add items to their cart, and manage their shopping experience.

_This project was created following the Shariyan's Coding School 'Backend Domination' tutorial. The aim is to help anyone following the tutorial and wants to check out a certain section of the code_

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Running the Project](#running-the-project)
- [API Routes](#api-routes)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- **User Authentication**: Secure registration and login with bcrypt password hashing
- **Product Catalog**: Browse all available products with pricing and discounts
- **Shopping Cart**: Add/remove products, adjust quantities, and calculate totals
- **Session Management**: Persistent user sessions with JWT token-based authentication
- **Cart Management**: View cart, update quantities, see price calculations with platform fees
- **Owner Dashboard**: Initial setup for product owners to create and manage products
- **Responsive UI**: EJS templating engine for dynamic frontend rendering
- **Security**: Password hashing, JWT tokens, session protection, cookie-based auth

## 🛠 Tech Stack

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** (v5.2.1) - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM (Object Document Mapper)

### Authentication & Security

- **JWT** (jsonwebtoken) - Token-based authentication
- **bcrypt** - Password hashing and verification
- **cookie-parser** - HTTP cookie parsing
- **express-session** - Session management
- **connect-flash** - Flash message storage

### Frontend

- **EJS** - Templating engine
- **CSS/JavaScript** - Frontend styling and interactivity

### File Management

- **Multer** - File upload handling for product images

### Development Tools

- **dotenv** - Environment variable management
- **nodemon** - Auto-restart on file changes

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **MongoDB** (v4.4 or higher)
   - Download from: https://www.mongodb.com/try/download/community
   - Verify installation: `mongod --version`
   - MongoDB should be running on `localhost:27017`

4. **Git** (for cloning the repository)
   - Download from: https://git-scm.com/

## 🚀 Getting Started

### Step 1: Clone the Repository

```bash
git clone https://github.com/Sia-asrani/SCATCH.git
cd SCATCH
```

If you don't have SSH configured, use HTTPS:

```bash
git clone https://github.com/Sia-asrani/SCATCH.git
cd SCATCH
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`:

- express
- mongodb & mongoose
- jsonwebtoken
- bcrypt
- ejs
- cookie-parser
- express-session
- multer
- dotenv
- nodemon
- And other dependencies...

### Step 3: Create Environment Variables File

Create a `.env` file in the project root directory:

```bash
# On Windows (PowerShell)
New-Item .env

# On macOS/Linux
touch .env
```

### Step 4: Configure Environment Variables

Add the following variables to your `.env` file:

```env
JWT_KEY=your_super_secret_jwt_key_here_make_it_long_and_random
EXPRESS_SESSION_SECRET=your_session_secret_key_make_it_random_too
```

**Important Security Tips:**

- Use strong, random strings for both keys (at least 32 characters)
- Use different values for development and production
- Never commit `.env` to Git (it's in `.gitignore`)
- For production, use environment management services (AWS Secrets Manager, Heroku Config Vars, etc.)

### Step 5: Ensure MongoDB is Running

Before starting the application, MongoDB must be running:

**On Windows:**

```bash
# If MongoDB was installed as a service, it should run automatically
# Check if running: mongosh
```

**On macOS:**

```bash
brew services start mongodb-community
```

**On Linux:**

```bash
sudo systemctl start mongod
```

To verify MongoDB is running:

```bash
mongosh
# Should connect successfully, press Ctrl+C to exit
```

### Step 6: Start the Application

```bash
# Development mode (with auto-restart on file changes)
npm run dev
# or
nodemon app.js

# Production mode
npm start
# or
node app.js
```

The application will start on: **http://localhost:3000**

## 🔐 Environment Variables

### JWT_KEY

- **Purpose**: Secret key for signing and verifying JWT tokens
- **Usage**: Used in authentication process to create secure tokens
- **Example**: `JWT_KEY=your_very_long_random_string_with_numbers_1234567890`
- **Security**: Must be kept secret and different per environment

### EXPRESS_SESSION_SECRET

- **Purpose**: Secret key for encrypting session data
- **Usage**: Protects session information stored on the server
- **Example**: `EXPRESS_SESSION_SECRET=another_random_secret_key_value`
- **Security**: Keep confidential, never expose in public repositories

## 📁 Project Structure

```
scatch/
├── config/
│   ├── development.json       # Development configuration
│   ├── keys.js               # API keys configuration
│   ├── mongoose-connection.js # MongoDB connection setup
│   └── multer-config.js       # File upload configuration
├── controllers/
│   └── AuthController.js      # Authentication logic (register, login)
├── middleware/
│   └── IsLoggedIn.js          # Authentication middleware
├── models/
│   ├── user-model.js          # User schema and model
│   ├── product-model.js       # Product schema and model
│   └── owners-model.js        # Owner schema and model
├── routes/
│   ├── index.js               # Main/home routes
│   ├── usersRouter.js         # User routes (register, login, cart)
│   ├── productsRouter.js      # Product routes
│   └── ownersRouter.js        # Owner routes
├── utils/
│   └── generateToken.js       # JWT token generation utility
├── public/
│   ├── images/                # Product images and assets
│   ├── javascripts/           # Client-side JavaScript
│   └── stylesheets/           # CSS stylesheets
├── views/
│   ├── index.ejs              # Home page
│   ├── shop.ejs               # Products listing page
│   ├── cart.ejs               # Shopping cart page
│   ├── createproducts.ejs     # Create product form (owner)
│   ├── owner-login.ejs        # Owner login page
│   ├── admin.ejs              # Admin dashboard
│   └── partials/
│       ├── header.ejs         # Header component
│       └── footer.ejs         # Footer component
├── app.js                     # Main Express server file
├── package.json               # Project dependencies and metadata
├── .env                       # Environment variables (not in Git)
├── .env.example               # Example environment variables
├── .gitignore                 # Files to ignore in Git
├── README.md                  # This file
└── explanation.md             # Detailed project documentation
```

## 🏃 Running the Project

### Development Environment

```bash
npm run dev
```

The app will start with nodemon, which automatically restarts on file changes.

### Production Environment

```bash
node app.js
```

This runs without auto-restart.

## 📡 API Routes

### User Routes (`/users`)

- `POST /users/register` - Register a new user
- `POST /users/login` - Login user
- `GET /users/logout` - Logout user
- `GET /users/cart` - View shopping cart (Protected)
- `GET /users/addedtocart/:productid` - Add product to cart (Protected)
- `GET /users/increase/:index` - Increase cart item quantity (Protected)
- `GET /users/decrease/:index` - Decrease cart item quantity (Protected)

### Product Routes (`/products`)

- `GET /products` - Get all products
- `POST /products/create` - Create new product (Owner only)
- `GET /products/:id` - Get product details

### Owner Routes (`/owners`)

- `GET /owners` - Owner dashboard (Protected)
- `POST /owners/register` - Register new owner
- `POST /owners/login` - Login owner

### Main Routes (`/`)

- `GET /` - Home page
- `GET /shop` - Shop/Products page (Protected)
- `GET /cart` - View cart (Protected)
- `GET /logout` - Logout

## 🐛 Troubleshooting

### Issue: "Cannot find module 'express'"

**Solution:**

```bash
npm install
```

Make sure you've run `npm install` to install all dependencies.

### Issue: "MongoDB connection failed"

**Solution:**

1. Verify MongoDB is running: `mongosh`
2. Check connection string in `config/mongoose-connection.js`
3. Default: `mongodb://localhost:27017/scatch`
4. Ensure MongoDB service is started on your system

### Issue: "JWT verification failed" or redirect to home

**Solution:**

1. Check `.env` file has `JWT_KEY` and `EXPRESS_SESSION_SECRET`
2. Ensure keys are non-empty strings
3. If modified, restart the app for changes to take effect

### Issue: "User already exists" on registration

**Solution:**
This is expected behavior. Try registering with a different email address.

### Issue: "nodemon not found"

**Solution:**

```bash
npm install -g nodemon
# or use: npx nodemon app.js
```

### Issue: Port 3000 already in use

**Solution:**

1. Check what's using port 3000: `netstat -ano | findstr :3000` (Windows)
2. Kill the process or change port in `app.js` (line: `app.listen(3000)`)

### Issue: Cannot upload product images

**Solution:**

1. Check `public/images/` folder exists
2. Verify `multer-config.js` paths are correct
3. Ensure proper file permissions on the folder

## 📚 Documentation

For detailed explanations of:

- Request lifecycle and failure points
- Technical FAQs
- Architecture details

See [explanation.md](./explanation.md)

## 🔒 Security Notes

1. **Passwords**: Always hashed with bcrypt (salt rounds: 12)
2. **Authentication**: JWT tokens stored in httpOnly cookies
3. **Sessions**: Express sessions for additional security layer
4. **Validation**: Email uniqueness and field requirements enforced
5. **Environment**: Sensitive data stored in `.env` (never committed)

## 📝 License

This project is created for educational purposes.

## 🎓 Learning Resource

This project follows the tutorial from **Shariyan's Coding School**. It's an excellent resource for learning full-stack development with Node.js, Express, and MongoDB.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements.

## 📞 Support

For issues, questions, or suggestions:

1. Check the [explanation.md](./explanation.md) for detailed technical documentation
2. Review the [Troubleshooting](#troubleshooting) section above
3. Open an issue on GitHub with detailed error messages
