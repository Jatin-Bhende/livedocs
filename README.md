# Live Docs

Livedocs is a web-based collaborative document editor designed to allow users to create, share, and edit documents in real-time. It offers features similar to Google Docs, where users can collaborate seamlessly by sharing documents via email, assigning viewer or editor roles, and keeping documents synchronized in real-time across all users.

## Features

- **Create Documents:** Easily create new documents from the dashboard.
- **Share Documents:** Share documents with others by inviting them through their email.
- **Access Control:** Assign roles to collaborators:
  - **Viewer:** Can view the document but not edit.
  - **Editor:** Can view and edit the document.
- **Add/Remove Collaborators:** Manage who can access your documents by adding or removing collaborators anytime.
- **Real-time Collaboration:** Any changes made by users with editor access will be reflected in real-time across all devices.
- **Document Security:** Only invited users with appropriate access rights can view or edit the documents.

## How It Works

1. **Sign Up/Login:**
   - Users can sign up or log in using their email and password.
  
2. **Create a New Document:**
   - Once logged in, click the "New Document" button on the dashboard to create a fresh document.

3. **Share the Document:**
   - After creating the document, invite collaborators by entering their email addresses and assigning them either "Viewer" or "Editor" access.

4. **Real-Time Editing:**
   - Any changes made by an editor will be visible to all collaborators instantly. Viewers will see the latest version without being able to make changes.

5. **Manage Collaborators:**
   - You can add or remove collaborators at any time. Adjust permissions as needed for each user.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/livedocs.git

2. Navigate to the project folder:

   ```bash
   cd livedocs

3. Install the dependencies:

   ```bash
   npm install

4. Add .env.local file at root level and add following env variables:

   ```bash
   # clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # liveblocks
   LIVEBLOCKS_SECRET_KEY=your_liveblocks_secret_key

5. Start the development server:

   ```bash
   npm run start

The app will be available at http://localhost:3000

## Technologies Used

- React
- Next.js
- Shadcn (UI Components)
- Tailwind (Styling)
- Liveblocks (Realtime collaboration)
- Clerk (Authentication)
- Vercel (Hosting)
