# Trello-like Todo List Application

A modern web application built with Next.js that allows users to manage their tasks in a Trello-like interface. The application features user authentication, drag-and-drop task management, and a responsive design.

## Features

- 🔐 User Authentication with Firebase
- 📋 Trello-like Kanban Board Interface
- 🎯 Drag and Drop Task Management
- 📱 Responsive Design
- 🎨 Modern UI with shadcn/ui components
- 🔄 Real-time Updates
- 🚀 Docker Support for Easy Deployment

## Tech Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **UI Components**: shadcn/ui
- **Authentication**: Firebase Authentication
- **Drag and Drop**: @hello-pangea/dnd
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form + Zod
- **Deployment**: Docker + AWS

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Docker (for containerization)

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd to-dolist
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Deployment

1. Build the Docker image:

```bash
docker build -t to-dolist .
```

2. Run the container:

```bash
docker run -p 3000:3000 to-dolist
```

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/         # Reusable UI components
├── lib/               # Utility functions and configurations
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
└── styles/            # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
