# Task Runner UI

This project is the web-based frontend for the Task Runner application. It provides a rich, interactive user interface for creating, managing, searching, and executing shell commands from a web browser.

The UI is built using React 19, TypeScript, and the Ant Design component library, with a focus on usability, accessibility, and real-time user feedback.

# Key Features

- Full CRUD Operations: Create, Read, Update, and Delete tasks.
- Powerful Task Execution: Run any configured task with a single click.
- Real-Time Status: The UI provides live feedback, showing a "Running" status with a spinner while a task is executing. Buttons are intelligently disabled to prevent concurrent actions on the same task.
- Rich History: View a complete execution history for every task, including start/end times and the full command output.
- Live Form Validation: The "Create/Edit Task" form provides immediate client-side validation on the `command` field to prevent unsafe commands before they are sent to the backend.
  \*\*Desktop-Class UI: Built with Ant Design for a professional, responsive, dark-mode-first experience.
- Notifications: Uses toast notifications to clearly communicate the success or failure of API operations.

# Screenshots

Here are some of the key views of the application:

# Main Dashboard

The main view showing the list of all created tasks, their status, and their execution history.
![Main_page](.\images\main.png)

# Create Task Execution

This shows how to create a task in UI
![Task_page](.\images\task.png)

# Viewing Command Output

After a task runs, the modal displays the complete execution results, including start/end times and the full console output.
![Output](.\images\op.png)

# Expanded Execution History

Users can expand any task row to see a detailed table of all its previous runs.
![Expand_page](.\images\expand.png)

# Architecture: Frontend & Backend Connection

This is a two-part application.

1.  Backend (The "Engine"): A Spring Boot application (my `TASK-1`) that serves a REST API. It handles all business logic, command execution (local or Kubernetes), and communication with the MongoDB database.
2.  Frontend (This task): A React Single Page Application (SPA) that acts as the "control panel." It has no direct access to the database or the shell. It only communicates with the backend's REST API.

# How it Connects

The connection is managed through asynchronous HTTP requests.

- API Service: The `src/services/api.ts` file in this project uses the `axios` library to make all API calls to the backend.
- Data Format: The frontend sends and receives all data as JSON. The TypeScript interfaces in `src/types/index.ts` are built to mirror the Java models (`Task.java`, `TaskExecution.java`) on the backend.
- Development Proxy: To avoid CORS (Cross-Origin Resource Sharing) errors during development, the `package.json` file contains a `"proxy": "http://localhost:9090"` setting. This tells the React development server (on port 3000) to forward all API requests to your Spring Boot backend (on port 9090).

# How Results are Produced (The "Run Task" Flow)

This is a perfect example of the full-stack connection:

1.  UI: A user clicks the "Run" button on a task.
2.  UI: `axios` sends a `PUT` request to `http://localhost:3000/api/tasks/{id}/run`.
3.  Proxy: The React dev server intercepts this call and forwards it to `http://localhost:9090/api/tasks/{id}/run`.
4.  Backend: The `TaskController` on the backend receives this request and calls `service.runTask(id)`.4
5.  Backend: The `TaskService` finds the task in MongoDB. It checks the command's safety again.
6.  Backend: `TaskService` calls the `execute()` method on the currently configured `ExecutorService` (e.g., `KubernetesExecutorService`).
7.  Backend: The executor runs the command in the pod, captures the `stdout`/`stderr`, and returns a `TaskExecution` object back to the `TaskService`.
8.  Backend: `TaskService` adds this new `TaskExecution` to the task's history list and saves the updated task to MongoDB.
9.  Backend: The `TaskController` sends the `TaskExecution` object back to the UI as a JSON response with a `200 OK` status.
10. UI: React receives the JSON. It shows a "Task... Triggered" notification, opens the Execution Result modal, and displays the command output from the received JSON.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or newer recommended)
- `npm` (comes with Node.js)
- A running instance of the [Task Runner Backend](https://www.google.com/search?q=https://github.com/your-username/TASK-1) on `http://localhost:9090`.

# Installation & Running

1.  Clone this repository:

    ```bash
    git clone https://github.com/your-username/task-runner-ui.git
    ```

2.  Navigate to the project directory:

    ```bash
    cd task-runner-ui
    ```

3.  Install all required dependencies:

    ```bash
    npm install
    ```

4.  Run the application:

    ```bash
    npm start
    ```

The application will automatically open in your default browser at `http://localhost:3000`.
Note: The backend _must_ be running on port 9090 for the API calls to work. If your backend runs on a different port, update the `"proxy"` value in `package.json`.

# Project Structure

```
/src
├── components/        # Reusable React components
│   ├── RunResultModal.tsx # Modal to show command output
│   ├── TaskForm.tsx       # Create/Edit task modal form
│   └── TaskList.tsx       # The main table for tasks
├── services/
│   └── api.ts           # Handles all API calls to the backend
├── types/
│   └── index.ts         # TypeScript types (mirrors the Java models)
├── utils/
│   └── validators.ts    # Client-side command validation
├── App.tsx              # Main application component (layout, state)
├── App.css              # Styles for App.tsx
├── index.tsx            # The entry point for React 19
└── index.css            # Global styles
```

# Built With

- React 19
- TypeScript
- Ant Design - UI Component Library
- Axios - HTTP Client
- Create React App - Project Scaffolding
