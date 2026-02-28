---
# Foolics API

The backend API for the Foolics system.
---

## 📦 Setup Local Environment

### Prerequisites

Before starting, ensure you have the following installed:

-   [**Git**](https://git-scm.com/downloads): The version control system used to version this Repo.
-   [**Node.js**](https://nodejs.org/): JS runtime for backend.
    -   **npm**: Comes with Node.js. Verify installation with: `npm -v`.
-   [**DBngin**](https://dbngin.com/): Convenient RDBMS server management.
-   [**TablePlus**](https://tableplus.com/): GUI SQL client. Used to set up & query the Foolics database.

---

### Clone the Repository

Clone the repository and navigate to the project directory:

```bash
git clone git@github.com:FoodicsFolks/foolics-api.git
cd foolics-api
```

---

### Install Dependencies

Install the required dependencies:

```bash
npm install
```

---

### Setup PostgreSQL Database with Prisma

1. Open **DBngin** and create a PostgreSQL database server. Give it any name (e.g., `foolics`).
2. It will create a default database (`postgres`) and a default database user (`postgres`).
3. Click the right-arrow icon and open the database in **TablePlus**.
4. Click on the database icon and create a new database called `foolics`.
5. _Google or search online for any unclear steps._

---

### Environment Variables

1. Copy `.env.example` to `.env`:

    ```bash
    cp .env.example .env
    ```

2. Fill in the local values:

    - Use the database name you set up earlier.
    - Leave the password empty if you did not setup a password.
    - The user should be `postgres` by default (change it if you updated it while setting up your database).
    - Update the `.env` file with your database connection information:

        ```env
        DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/foolics?schema=public
        JWT_SECRET="your_secret_key"
        PORT=3000
        ```

---

### Initialize and Migrate the Database with Prisma

1. **Generate the Prisma Client**:

    ```bash
    npx prisma generate
    ```

    This generates the Prisma client based on your schema.

2. **Run the Prisma migration** to create all database tables:

    ```bash
    npx prisma migrate dev --name init
    ```

    This command will:

    - Create all the necessary tables based on the schema defined in `prisma/schema.prisma`.
    - Apply the migration to your database.

3. **If you need to reset the database** (this will delete all data):
    ```bash
    npx prisma migrate reset
    ```
    Use this command if you need to start fresh with a clean database.

---

### Start the Server

Start the development server:

```bash
npm run dev
```

---

### Available APIs

| Method | Route               | Description                   |
| ------ | ------------------- | ----------------------------- |
| POST   | `/auth/register`    | Register a new user           |
| POST   | `/auth/login`       | Authenticate a user           |
| GET    | `/products/:id`     | Get product details by ID     |
| POST   | `/cart`             | Add a new product to cart     |
| GET    | `/cart`             | Get the user's cart           |
| DELETE | `/cart`             | Delete the user's cart        |
| POST   | `/orders`           | Create a new order            |
| GET    | `/admin/dashboard`  | Retrieve admin dashboard data |
| POST   | `/admin/auth/login` | Admin login                   |
| PATCH  | `/admin/stock`      | Update product stock          |
| PATCH  | `/admin/orders/:id` | Update the status of an order |

---

## 🛠 Notes

-   🌐 The server runs at [`http://localhost:3000`](http://localhost:3000).
-   🧪 Test routes via **Postman** or **Swagger UI** ([`/docs`](http://localhost:3000/docs) endpoint).
-   🔁 **Important:** Every time you pull changes from `main`, run:

    ```bash
    npm install
    npx prisma generate
    npx prisma migrate dev
    ```

    To ensure newly added dependencies are installed and database schema is up to date.

-   🔄 Use `npx prisma migrate reset` if you need to completely reset your database (this will delete all data).

---

## Testing Endpoints

### Testing the `POST /cart` Endpoint

1. **Login to Obtain a Token**:

    - Use the `POST /auth/login` endpoint in the Swagger docs (`http://localhost:3000/docs`).
    - Provide valid credentials (email and password) in the request body:
        ```json
        {
            "email": "hossam@gmail.com",
            "password": "password123"
        }
        ```
    - Copy the `auth_token` from the response. This token will be used to authorize subsequent requests.

2. **Authorize in Swagger**:

    - Click the **Authorize** button in the Swagger UI (top-right corner).
    - Paste the token in the following format:
        ```
        Bearer <your-token>
        ```
    - Replace `<your-token>` with the token obtained from the `POST /auth/login` response.

3. **Insert a Product into the Database using Prisma**:

    - Use Prisma Studio to add a product:
        ```bash
        npx prisma studio
        ```
    - This will launch Prisma Studio at [http://localhost:5555](http://localhost:5555).
    - Go to the `products` table and click on "Add Record" to add a product with the following fields:
        - `name`: `test_product`
        - `price`: `49.99`
        - `stock`: `100`

4. **Test the `POST /cart` Endpoint**:

    - Use the `POST /cart` endpoint in the Swagger docs.
    - Set the request body with the `product_id` and `quantity`:
        ```json
        {
            "product_id": 1,
            "quantity": 5
        }
        ```
    - Replace `1` with the actual `id` of the product you inserted in step 3.

5. **Token Expiry**:
    - The token expires in 1 hour. If you receive a `Token expired` or `Invalid token` message, repeat step 1 to obtain a new token and re-authorize in Swagger.

---

### Testing the `DELETE /cart` Endpoint

1. **Login to Obtain a Token**:

    - Follow the same steps as in the `POST /cart` section to obtain a token.

2. **Authorize in Swagger**:

    - Follow the same steps as in the `POST /cart` section to authorize in Swagger.

3. **Add a Product to the Cart**:

    - Follow the steps in the `POST /cart` section to add a product to the cart.

4. **Test the `DELETE /cart` Endpoint**:

    - Use the `DELETE /cart` endpoint in the Swagger docs to delete the cart.
    - No request body is required for this endpoint.
    - If the cart is successfully deleted, you will receive the following response:
        ```json
        {
            "message": "Cart successfully deleted"
        }
        ```
    - If no cart exists for the user, you will receive the following error response:
        ```json
        {
            "message": "No cart found"
        }
        ```

5. **Token Expiry**:

    - The token expires in 1 hour. If you receive a `Token expired` or `Invalid token` message, repeat step 1 to obtain a new token and re-authorize in Swagger.

6. **Error Handling**:

    - If the server encounters an unexpected error, you will receive a `500 Internal Server Error` response with the following structure:
        ```json
        {
            "message": "Server error"
        }
        ```

---

### Testing the `POST /orders` Endpoint

1. **Login to Obtain a Token**:

    - Use the `POST /auth/login` endpoint in the Swagger docs (`http://localhost:3000/docs`).
    - Provide valid credentials (email and password) in the request body:
        ```json
        {
            "email": "hossam@gmail.com",
            "password": "password123"
        }
        ```
    - Copy the `auth_token` from the response. This token will be used to authorize subsequent requests.

2. **Authorize in Swagger**:

    - Click the **Authorize** button in the Swagger UI (top-right corner).
    - Paste the token in the following format:
        ```
        Bearer <your-token>
        ```
    - Replace `<your-token>` with the token obtained from the `POST /auth/login` response.

3. **Add a Product to the Cart**:

    - Follow the steps in the `POST /cart` section to add a product to the cart.

4. **Test the `POST /orders` Endpoint**:

    - Use the `POST /orders` endpoint in the Swagger docs to create an order.
    - No request body is required for this endpoint.
    - If the order is successfully created, you will receive the following response:
        ```json
        {
            "message": "Order created successfully",
            "orderId": 1,
            "item": {
                "product_id": 1,
                "quantity": 2
            },
            "total": 99.98
        }
        ```
    - If the cart is empty or does not exist, you will receive the following error response:
        ```json
        {
            "message": "No cart found"
        }
        ```
    - If there is insufficient stock for a product in the cart, you will receive the following error response:
        ```json
        {
            "message": "Not enough stock available"
        }
        ```

5. **Token Expiry**:

    - The token expires in 1 hour. If you receive a `Token expired` or `Invalid token` message, repeat step 1 to obtain a new token and re-authorize in Swagger.

6. **Error Handling**:

    - If the server encounters an unexpected error, you will receive a `500 Internal Server Error` response with the following structure:
        ```json
        {
            "message": "Server error"
        }
        ```

---

### Testing the `GET /cart` Endpoint

1. **Login to Obtain a Token**:

    - Use the `POST /auth/login` endpoint in the Swagger docs (`http://localhost:3000/docs`).
    - Provide valid credentials (email and password) in the request body:
        ```json
        {
            "email": "hossam@gmail.com",
            "password": "password123"
        }
        ```
    - Copy the `auth_token` from the response. This token will be used to authorize subsequent requests.

2. **Authorize in Swagger**:

    - Click the **Authorize** button in the Swagger UI (top-right corner).
    - Paste the token in the following format:
        ```
        Bearer <your-token>
        ```
    - Replace `<your-token>` with the token obtained from the `POST /auth/login` response.

3. **Test the `GET /cart` Endpoint**:

    - Use the `GET /cart` endpoint in the Swagger docs to retrieve the user's cart.
    - No request body is required for this endpoint.
    - **If the cart has items**, you will receive a response like:
        ```json
        {
            "cart": {
                "items": [
                    {
                        "id": 1,
                        "quantity": 2,
                        "product": {
                            "id": 1,
                            "name": "test_product",
                            "price": 49.99,
                            "stock": 100
                        }
                    }
                ],
                "total": 99.98,
                "itemCount": 2
            }
        }
        ```
    - **If the cart is empty or doesn't exist**, you will receive:
        ```json
        {
            "cart": {
                "items": [],
                "total": 0,
                "itemCount": 0
            }
        }
        ```

4. **Token Expiry**:

    - The token expires in 1 hour. If you receive a `Token expired` or `Invalid token` message, repeat step 1 to obtain a new token and re-authorize in Swagger.

5. **Error Handling**:
    - If the server encounters an unexpected error, you will receive a `500 Internal Server Error` response with the following structure:
        ```json
        {
            "message": "Server error"
        }
        ```

---

### Testing Admin Endpoints

#### Testing the `GET /admin/dashboard` Endpoint

1. **Login as Admin**:

    - Use the `POST /admin/auth/login` endpoint in the Swagger docs (`http://localhost:3000/docs`).
    - Provide valid admin credentials (email and password) in the request body:
        ```json
        {
            "email": "admin@example.com",
            "password": "adminpassword"
        }
        ```
    - Copy the `auth_token` from the response. This token will be used to authorize subsequent requests.

2. **Authorize in Swagger**:

    - Click the **Authorize** button in the Swagger UI (top-right corner).
    - Paste the token in the following format:
        ```
        Bearer <your-token>
        ```
    - Replace `<your-token>` with the token obtained from the `POST /admin/auth/login` response.

3. **Test the `GET /admin/dashboard` Endpoint**:

    - Use the `GET /admin/dashboard` endpoint in the Swagger docs.
    - If successful, you will receive a response containing user details, stock information, and order details.

#### Testing the `PATCH /admin/stock` Endpoint

1. **Login as Admin**:

    - Follow the same steps as above to obtain an admin token.

2. **Test the `PATCH /admin/stock` Endpoint**:

    - Use the `PATCH /admin/stock` endpoint in the Swagger docs.
    - Provide the `product_id` and `stock` in the request body:
        ```json
        {
            "product_id": 1,
            "stock": 100
        }
        ```
    - If successful, you will receive a response confirming the stock update.

#### Testing the `PATCH /admin/orders/:id` Endpoint

1. **Login as Admin**:

    - Follow the same steps as above to obtain an admin token.

2. **Test the `PATCH /admin/orders/:id` Endpoint**:

    - Use the `PATCH /admin/orders/:id` endpoint in the Swagger docs.
    - Provide the `status` in the request body:
        ```json
        {
            "status": "completed"
        }
        ```
    - Replace `:id` in the URL with the actual order ID.
    - If successful, you will receive a response confirming the status update.

---

### Creating an Admin User

To create an admin user, follow these steps:

1. **Register a User Using the `auth/register` Endpoint**:

    - Use the `POST /auth/register` endpoint in the Swagger docs (`http://localhost:3000/docs`).
    - Provide the required fields in the request body:
        ```json
        {
            "full_name": "Admin User",
            "email": "admin@example.com",
            "phone": "0123456789",
            "password": "adminpassword"
        }
        ```
    - Copy the `auth_token` from the response. This token will be used for admin login later.

2. **Open Prisma Studio**:

    - Run the following command to open Prisma Studio:
        ```bash
        npx prisma studio
        ```
    - This will launch Prisma Studio at [`http://localhost:5555`](http://localhost:5555).

3. **Modify the User in the `users` Table**:

    - Navigate to the `users` table in Prisma Studio.
    - Locate the user you just registered (search by their email, e.g., `admin@example.com`).
    - Change the `is_admin` field to `true`.

4. **Save Changes**:

    - Click the "Save Changes" button in Prisma Studio to apply the update.

5. **Login as Admin**:
    - Use the `POST /admin/auth/login` endpoint in the Swagger docs (`http://localhost:3000/docs`).
    - Provide the admin credentials (email and password) in the request body:
        ```json
        {
            "email": "admin@example.com",
            "password": "adminpassword"
        }
        ```
    - If successful, you will receive an `auth_token` that can be used to access admin-specific endpoints.

Now the user is an admin and can access all admin-specific endpoints, such as `/admin/dashboard`, `/admin/stock`, and `/admin/orders/:id`.

---

### Project Structure

The project is organized as follows:

```
.env                     # Environment variables file
.env.example             # Example environment variables file
.gitignore               # Git ignore file
db.js                    # Database connection setup
index.js                 # Main entry point of the application
package.json             # Project metadata and dependencies
README.md                # Project documentation
server.js                # Server initialization

config/                  # Configuration files
    config.js            # General configuration
    swagger.js           # Swagger API documentation setup

controllers/             # API controllers
    adminController.js   # Handles admin-related logic
    authController.js    # Handles authentication logic
    cartController.js    # Handles cart-related logic
    orderController.js   # Handles order-related logic

generated/               # Auto-generated Prisma client files
    prisma/              # Prisma client and schema
        client.d.ts
        client.js
        schema.prisma
        ...

middleware/              # Middleware functions
    adminMiddleware.js   # Admin authorization middleware
    authMiddleware.js    # Authentication middleware

migrations/              # Database migration files

models/                  # Database models (Prisma)
    index.js             # Model initialization

prisma/                  # Prisma schema and migrations
    schema.prisma        # Prisma schema definition
    migrations/          # Prisma migration files

routes/                  # API route definitions
    adminRoutes.js       # Routes for admin operations
    authRoutes.js        # Routes for authentication
    cartRoutes.js        # Routes for cart operations
    orderRoutes.js       # Routes for orders

seeders/                 # Database seed files

tests/                   # Unit and integration tests
    auth.test.js         # Tests for authentication
    cart.test.js         # Tests for cart operations
    order.test.js        # Tests for order operations
    dashboard.admin.test.js # Tests for admin dashboard
    stock.admin.test.js  # Tests for admin stock updates
    status.admin.test.js # Tests for admin order status updates
```

## Alternative setup (Docker)

- Make sure you have docker installed and running
- Run in your terminal these commands
  - docker-compose up --build *or* docker compose up --build -d # to run in the background
  - visit [localhost:3000](http://localhost:3000/docs) to view APIs

### Useful commands

- if you want to enter the container for some reason: docker exec -it foolix-backend sh
- to run the project later docker compose up
