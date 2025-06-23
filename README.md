# BlogNest: Where Thoughts Find Their Roost

BlogNest is a modern, full-stack blog application designed for creating, sharing, and discovering content. It features a sleek and responsive user interface powered by React and a robust, high-performance backend built with FastAPI.

## ✨ Features

-   **User Authentication**: Secure JWT-based authentication for user registration and login.
-   **Full CRUD for Blogs**: Users can create, read, update, and delete their own blog posts.
-   **Interactive Content**: Like and dislike posts to engage with content.
-   **Categorization**: Blogs are organized into 24 distinct categories for easy browsing.
-   **Powerful Search**: Instantly search for blogs by title or author across the platform.
-   **Personalized Profiles**: A dedicated profile page to view your own posts and posts you've liked.
-   **Responsive Design**: A beautiful and intuitive UI that works seamlessly across all devices.

## 🛠️ Tech Stack

### Backend

-   **Framework**: FastAPI
-   **Database**: PostgreSQL (with SQLAlchemy ORM)
-   **Authentication**: `python-jose` for JWT tokens, `passlib` for hashing.
-   **Data Validation**: Pydantic V2
-   **Dependency**: `psycopg2-binary` for PostgreSQL connection.

### Frontend

-   **Framework**: React
-   **Styling**: `styled-components`
-   **API Communication**: Axios
-   **State Management**: React Context API
-   **Routing**: `react-router-dom`
-   **JWT Decoding**: `jwt-decode`
-   **Date Handling**: `date-fns`

## 📁 Project Structure

```
BlogNest/
├── backend/                 # FastAPI backend
│   ├── routers/            # API route handlers
│   ├── models.py           # Database models
│   ├── schemas.py          # Pydantic schemas
│   ├── database.py         # Database configuration
│   ├── main.py             # FastAPI application
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/                # React source code
│   ├── public/             # Static assets
│   ├── package.json        # Node.js dependencies
│   └── package-lock.json   # Locked dependency versions
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   **Node.js & npm**: For running the React frontend.
-   **Python 3.8+ & pip**: For running the FastAPI backend.
-   **PostgreSQL**: A running instance of a PostgreSQL server.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/BlogNest.git
    cd BlogNest
    ```

2.  **Backend Setup:**

    *   Navigate to the backend directory:
        ```bash
        cd backend
        ```
    *   Create a virtual environment and activate it:
        ```bash
        python -m venv venv
        source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
        ```
    *   Install the required Python packages:
        ```bash
        pip install -r requirements.txt
        ```
    *   **Database Configuration**:
        The application is configured to connect to a PostgreSQL database. You must update the connection string in `backend/database.py`. Locate the following line and replace it with your actual PostgreSQL connection URL:
        ```python
        SQLALCHEMY_DATABASE_URL = "postgresql://user:password@host:port/database_name"
        ```

3.  **Frontend Setup:**

    *   Navigate to the frontend directory:
        ```bash
        cd frontend
        ```
    *   Install the required npm packages:
        ```bash
        npm install
        ```
    *   **API Configuration**:
        Create a `.env` file in the `frontend` directory and add the following line to connect the frontend to your running backend server:
        ```
        REACT_APP_API_URL=http://127.0.0.1:8000
        ```

### Running the Application

1.  **Start the Backend Server:**
    *   From the `backend` directory, with your virtual environment activated, run:
        ```bash
        uvicorn main:app --reload
        ```
    *   The backend will be running at `http://127.0.0.1:8000`.

2.  **Start the Frontend Development Server:**
    *   From the `frontend` directory, run:
        ```bash
        npm start
        ```
    *   The application will open in your browser at `http://localhost:3000`.

## 🔧 Development

-   **Backend Development**: The backend uses FastAPI with automatic API documentation available at `http://127.0.0.1:8000/docs` when running.
-   **Frontend Development**: The frontend uses React with hot reloading enabled for development.
-   **Database**: Make sure your PostgreSQL server is running and accessible with the configured connection string.

## 📝 API Endpoints

The backend provides the following main endpoints:
-   `POST /register` - User registration
-   `POST /login` - User authentication
-   `GET /blogs` - Get all blogs
-   `POST /blogs` - Create a new blog
-   `PUT /blogs/{id}` - Update a blog
-   `DELETE /blogs/{id}` - Delete a blog
-   `POST /blogs/{id}/like` - Like/unlike a blog

For complete API documentation, visit `http://127.0.0.1:8000/docs` when the backend is running.

Now you can visit `http://localhost:3000` in your browser, create an account, and start blogging! 