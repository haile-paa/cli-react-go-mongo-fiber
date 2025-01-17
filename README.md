# CLI React Go Mongo Fiber Project Setup

This project setup script allows you to quickly create a full-stack application with React (frontend), Go (backend), MongoDB (database), and Fiber (Go web framework). It initializes the project folder structure, sets up the backend with Go and MongoDB, and creates the frontend with React, Vite, and Tailwind CSS.

## Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (with `npm`): [Install Node.js](https://nodejs.org/)
- **Go**: [Install Go](https://golang.org/doc/install)
- **MongoDB**: [Install MongoDB](https://www.mongodb.com/docs/manual/installation/)

## Installation

To use the setup script, run the following command:

```bash
npm install -g cli-react-go-mongo-fiber-v2
```

Run the CLI to create a new project:

```bash
create-my-project
```

Project Structure
After running the CLI, the following project structure will be created:

```bash
<your-project-name>/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── main.go
├── frontend/
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       └── tailwind.config.js
└── shared/
    └── utils/
```
