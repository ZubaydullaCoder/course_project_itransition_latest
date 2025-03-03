````md
# Forms App - Customizable Forms Builder

A modern web application for creating and managing customizable forms, similar to Google Forms. Built with **Next.js, Prisma, and PostgreSQL**.

---

## 🚀 Features

### 🔑 Authentication & User Management

- Email/password authentication using **NextAuth.js**.
- Role-based access control (**Admin, User**).
- User management (block/unblock, role management).

### 📑 Template Management

- Create, edit, and delete form templates.
- Public and restricted access settings.
- **Rich template settings**:
  - Markdown-supported descriptions.
  - Topic categorization.
  - Cloud-based image storage.
  - Tag system with autocompletion.

### 🏗️ Form Building

- Multiple question types:
  - Single-line text.
  - Multi-line text.
  - Positive integer.
  - Checkbox.
- Drag-and-drop question reordering.
- Question visibility settings.

### 📊 Form Management

- Form submission and response tracking.
- Response analytics and aggregation.
- Access control based on template settings.

### 🌐 Social Features

- Template comments with real-time updates.
- Template likes system.
- Tag-based template discovery.

### 🎨 Additional Features

- Dark/Light theme support.
- Responsive design.
- Full-text search.
- Tag cloud navigation.

---

## 🛠️ Tech Stack

| Layer             | Technology                                |
| ----------------- | ----------------------------------------- |
| **Frontend**      | Next.js 14, React, TailwindCSS, shadcn/ui |
| **Backend**       | Next.js API routes, Server Actions        |
| **Database**      | PostgreSQL with Prisma ORM                |
| **Auth**          | NextAuth.js                               |
| **Cloud Storage** | Cloudinary                                |
| **Deployment**    | Vercel                                    |

---

## 📌 Getting Started

### 📋 Prerequisites

- **Node.js** (18.17 or later).
- **PostgreSQL** database.
- **Cloudinary** account.

### 🔧 Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-upload-preset"
```
````

---

## ⚡ Installation & Setup

### 📦 Install dependencies

```sh
npm install
```

### 🛠️ Generate Prisma Client

```sh
npx prisma generate
```

### 🏗️ Push database schema

```sh
npx prisma db push
```

### 🔄 Run development server

```sh
npm run dev
```

---

## 🗄️ Database Setup

### 📌 Apply migrations

```sh
npx prisma migrate dev
```

### 🌱 Seed database (if needed)

```sh
npx prisma db seed
```

---

## 📂 Project Structure

```
├── app/                    # Next.js app directory
│   ├── (admin)/           # Admin routes
│   ├── (auth)/            # Authentication routes
│   └── (main)/            # Main application routes
├── components/            # React components
├── lib/                   # Utility functions and business logic
├── prisma/                # Database schema and migrations
└── public/                # Static assets
```

---

## 🎯 Usage

1. **Registration/Login**: Create an account or login with existing credentials.
2. **Create Template**: Navigate to **Templates → Create New Template**.
3. **Add Questions**: Build your form by adding different types of questions.
4. **Configure Access**: Set template visibility and access permissions.
5. **Share**: Share the template link with users who can fill out the form.
6. **View Responses**: Track and analyze form submissions.

---

## 🚀 Deployment

The application is configured for deployment on **Vercel**:

1. Push your code to **GitHub**.
2. Import the project to **Vercel**.
3. Configure **environment variables**.
4. **Deploy**.

---

## 🤝 Contributing

1. **Fork** the repository.
2. **Create** a feature branch.
3. **Commit** your changes.
4. **Push** to the branch.
5. **Open a Pull Request**.

---

## 📜 License

This project is licensed under the **MIT License** - see the `LICENSE` file for details.

---

## 🙌 Acknowledgments

- **Next.js**
- **Prisma**
- **TailwindCSS**
- **shadcn/ui**

```


```
