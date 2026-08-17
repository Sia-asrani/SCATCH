# Scatch - Project Explanation

## Section 1: Project Overview

**Scatch** is a full-stack e-commerce shopping website built with **Node.js and Express.js**. It's an initial implementation of a shopping platform where users can browse products, add items to their cart, and manage their shopping experience.

### Key Features:

- **User Authentication**: Register and login with email and password (secured with bcrypt hashing)
- **Product Browsing**: View all available products with details and pricing
- **Shopping Cart**: Add products to cart, adjust quantities, and view cart summary
- **Session Management**: User sessions are maintained using Express session and JWT tokens
- **Owner Dashboard**: Owners can create and manage products (initial setup)
- **Responsive UI**: Built with EJS templating for dynamic frontend rendering

### Technology Stack:

- **Backend**: Node.js, Express.js (v5.2.1)
- **Database**: MongoDB (Mongoose for ODM)
- **Authentication**: JWT (JSON Web Tokens), bcrypt for password hashing
- **Session Management**: express-session, cookie-parser
- **Frontend Templating**: EJS
- **File Upload**: Multer for handling product images
- **Environment Config**: dotenv for configuration management

---

## Section 2: Request Lifecycle & Failure Points

### A. User Registration Flow

```
1. User fills registration form (fullname, email, password)
2. POST /users/register
   ↓
3. AuthController.registerUser()
   - Validates: email, password, fullname all required
   - **FAILURE POINT 1**: Missing field → Return error "All fields are required"
   - Checks if email already exists in database
   - **FAILURE POINT 2**: Email exists → Return "user already exists, please login"
   ↓
4. Password Hashing
   - bcrypt.genSalt(12) generates salt
   - bcrypt.hash() hashes password with salt
   - **FAILURE POINT 3**: Hashing error → Return error message
   ↓
5. User Creation
   - Creates user document in MongoDB with hashed password
   - **FAILURE POINT 4**: Database error → Catch block returns "something went wrong"
   ↓
6. Token Generation
   - generateToken() creates JWT with user details
   - **FAILURE POINT 5**: Token generation fails → Return error
   ↓
7. Cookie Setting
   - Sets JWT token in response cookie
   ↓
8. Response
   - Success: "user created successfully"
```

### B. User Login Flow

```
1. User enters email and password
2. POST /users/login
   ↓
3. AuthController.loginUser()
   - Queries database for user by email
   - **FAILURE POINT 1**: User not found → Return "Email or password incorrect"
   ↓
4. Password Verification
   - bcrypt.compare(input password, stored hash)
   - **FAILURE POINT 2**: Password mismatch → Return error
   ↓
5. Token Generation (on success)
   - generateToken() creates JWT with user credentials
   ↓
6. Cookie & Session Setup
   - Sets JWT in cookie
   - Express session established
   ↓
7. Redirect
   - User redirected to /shop or dashboard
```

### C. Browse Products (Shop Page)

```
1. User clicks "Shop" link or navigates to /shop
2. GET /shop → IsLoggedIn middleware
   ↓
3. IsLoggedIn Middleware Check
   - Checks if req.cookies.token exists
   - **FAILURE POINT 1**: No token → Flash error, redirect to home page
   - Verifies JWT token with jwt.verify()
   - **FAILURE POINT 2**: Token invalid/expired → Flash "something went wrong", redirect home
   - Queries user from database
   - **FAILURE POINT 3**: User not found in DB → Error, redirect
   ↓
4. Product Retrieval
   - productModel.find({}) fetches all products from MongoDB
   - **FAILURE POINT 4**: Database connection error → Page crashes
   ↓
5. Flash Messages
   - Retrieves any success messages from previous requests
   ↓
6. Response
   - EJS renders shop.ejs with products array
```

### D. Add to Cart Flow

```
1. User clicks "Add to Cart" button for a product
2. GET /addedtocart/:productid → IsLoggedIn middleware
   ↓
3. Authentication Check (same as Section C)
   ↓
4. Find User in Database
   - userModel.findOne({email: req.user.email})
   - **FAILURE POINT 1**: Database error → App crashes
   ↓
5. Check if Product Already in Cart
   - Searches user.cart array for existing product
   ↓
6. Update Cart
   If product exists:
     - Increment quantity
     - **FAILURE POINT 2**: Save operation fails → Changes lost
   If product new:
     - Push new cart item: {product: productId, quantity: 1}
   ↓
7. Save to Database
   - user.save()
   - **FAILURE POINT 3**: Database write error → Item not saved
   ↓
8. Flash Message
   - Set success message "added to cart"
   ↓
9. Redirect
   - res.redirect("/shop")
```

### E. View Cart & Checkout Summary

```
1. GET /cart → IsLoggedIn middleware
   ↓
2. Authentication & Authorization (same checks)
   ↓
3. Fetch User with Populated Products
   - userModel.findOne({email: req.user.email}).populate("cart.product")
   - Mongoose populates full product details from reference
   - **FAILURE POINT 1**: Database error → Cart page crashes
   ↓
4. Calculate Bill
   - Initialize subtotal = 0
   - For each cart item:
     - subtotal += (product.price - product.discount) × quantity
   - Add platform fee: bill = subtotal + 20
   ↓
5. Render Cart Page
   - res.render("cart", {user, bill, subtotal})
   - **FAILURE POINT 2**: EJS rendering error → Page fails to load
```

### F. Modify Cart Quantities

```
A. Increase Quantity: GET /increase/:index
B. Decrease Quantity: GET /decrease/:index

Flow:
1. Authentication check (IsLoggedIn middleware)
2. Find user by email
3. Access user.cart[index]
   - **FAILURE POINT 1**: Invalid index → Array index error / crashes
4. Increment/Decrement quantity
5. Save to database
   - **FAILURE POINT 2**: Database write fails
6. Redirect to /cart
```

---

## Section 3: Technical FAQ for New Users

### **1. What is JWT and why is it used?**

- **JWT (JSON Web Tokens)** are encrypted tokens containing user information
- Used here for **stateless authentication** - token stored in cookies
- When user logs in, a JWT is created with their email and user ID
- Each protected route verifies this token using `IsLoggedIn` middleware
- More secure than storing plain credentials in cookies

### **2. Why is bcrypt used for passwords?**

- **bcrypt** is a password hashing algorithm that's deliberately slow
- Uses salt (random data) to prevent rainbow table attacks
- **Salt rounds = 12** means password is hashed 2^12 times (4096 iterations)
- Passwords are never stored plain-text; only hashes are stored
- `bcrypt.compare()` safely verifies login passwords against stored hashes

### **3. What is MongoDB and why Mongoose?**

- **MongoDB** is a NoSQL database that stores data as JSON-like documents
- **Mongoose** is an ODM (Object Document Mapper) that:
  - Provides schema validation
  - Handles database connections
  - Manages relationships between collections (like user-to-products via cart)
  - Makes queries easier with methods like `.findOne()`, `.populate()`

### **4. What does `req.flash()` do?**

- **Flash messages** are one-time messages displayed to users
- Common for success/error notifications
- Stored in session and automatically cleared after displayed
- Example: "added to cart" message shown after adding item

### **5. What is middleware and why is `IsLoggedIn` needed?**

- **Middleware** is code that runs before route handlers
- `IsLoggedIn` middleware:
  - Checks if user has valid JWT token
  - Verifies token hasn't been tampered with
  - Prevents unauthenticated users from accessing protected routes
  - Automatically redirects unauthorized users to home page

### **6. What does `.populate()` do in Mongoose?**

- When you reference another collection (like products in cart), MongoDB stores only the ID
- `.populate("cart.product")` replaces the ID with the full product document
- This allows access to product details like price, discount, image, etc.
- Example: Instead of `cart[0].product = "60d...abc"`, you get full product object

### **7. How are products stored in user's cart?**

- User cart is an array of objects: `[{product: productId, quantity: 1}, ...]`
- Each item stores:
  - **product**: Reference (ObjectId) to product in products collection
  - **quantity**: How many of that product
- Cart updates are done via array operations and saved to database

### **8. Why are sessions needed if we have JWT?**

- **JWT** for stateless authentication (token validity verification)
- **Sessions** for:
  - User data persistence during browser session
  - Flash message storage
  - Additional security layer
  - Session ID tracking

### **9. What happens if MongoDB is not running?**

- Connection attempt in `mongoose-connection.js` will fail
- App may crash or hang when trying to access database
- Error: "connect ECONNREFUSED 127.0.0.1:27017"
- Must ensure MongoDB service is running on `localhost:27017`

### **10. What does `.select("-password")` do?**

- In Mongoose queries, `-password` excludes the password field from results
- Security best practice: Never send passwords to frontend, even hashed ones
- Example: `userModel.findOne({email}).select("-password")` returns user data without password

### **11. What is the platform fee?**

- Fixed fee of **20 currency units** added to every order
- Calculated as: `bill = subtotal + 20`
- Helps cover operational costs (payment processing, shipping logistics, etc.)

### **12. What are environment variables (.env)?**

- Stored in `.env` file (must be created manually with sensitive data)
- Used for:
  - **EXPRESS_SESSION_SECRET**: Encrypts session data
  - **JWT_KEY**: Secret key for signing/verifying JWT tokens
  - **DATABASE_URL**: MongoDB connection string
- Protected from version control via `.gitignore`
- Accessed via `process.env.VARIABLE_NAME`

### **13. Why use `.trim()` and `minLength` in schema?**

- **Validation** at database level ensures data quality
- `.trim()`: Removes leading/trailing whitespaces
- `minLength`: Prevents usernames with single characters
- Helps maintain consistent data without null/empty values

### **14. What is the difference between `.send()` and `.render()`?**

- **`res.send()`**: Sends plain text or HTML directly to browser
- **`res.render()`**: Processes EJS template with variables and sends HTML
- EJS example: `res.render("shop", {products})` converts shop.ejs template with products data

### **15. How do cookies work with authentication?**

- JWT token stored in HTTP cookie via `res.cookie("token", token)`
- Cookie automatically sent with every request (even redirects)
- Middleware reads `req.cookies.token` to verify authentication
- Cleared on logout: `res.cookie("token", "")`

### **16. What could cause "Token is invalid or expired"?**

- Token modified or corrupted
- JWT secret key (JWT_KEY env var) doesn't match
- Token signed with wrong key
- Session timeout/expiration
- User logged out (token cleared)

### **17. How does the cart persist between page refreshes?**

- Cart data stored in MongoDB (not just browser memory)
- On each request, fresh cart data fetched from database
- Ensures consistency across devices/sessions

### **18. What happens if a product is deleted but still in user's cart?**

- Reference becomes "orphaned" in database
- May cause errors when trying to populate product details
- Future enhancement: Add cascade delete or "product no longer available" handling

---

## Deployment & Running the Project

### Prerequisites:

1. **Node.js** (v14+) and npm installed
2. **MongoDB** running locally on `localhost:27017` (or update connection string)
3. Create `.env` file in root with:
   ```
   EXPRESS_SESSION_SECRET=your_secret_here
   JWT_KEY=your_jwt_secret_here
   ```

### Start the Project:

```bash
npm install
npm start    # or: nodemon app.js (for development)
```

Visit `http://localhost:3000` in browser.

### Key Files to Know:

- **app.js**: Main server file, sets up Express and routes
- **routes/**: Define API endpoints and page routes
- **controllers/**: Business logic for authentication
- **middleware/**: Protective functions (IsLoggedIn)
- **models/**: Database schemas (user, product, owner)
- **config/**: Database connection and configuration
- **public/**: Static files (CSS, images, client-side JS)
- **views/**: EJS templates for frontend pages
