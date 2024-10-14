# Melody Memo - Frontend

## Introduction

Melody Memo is a full-stack web application for managing and reviewing music releases. This README focuses on the frontend portion of the project, which is built with React and TypeScript.

## Table of Contents

1. [Technologies Used](#technologies-used)
2. [Project Structure](#project-structure)
3. [Setup and Installation](#setup-and-installation)
4. [Key Components](#key-components)
5. [Styling](#styling)
6. [State Management](#state-management)
7. [Routing](#routing)
8. [API Integration](#api-integration)
9. [Authentication](#authentication)
10. [Features](#features)

## Technologies Used

- React 18
- TypeScript
- Vite (for build tooling)
- React Router (for routing)
- Axios (for API calls)
- Bulma (for CSS framework)
- Lucide React (for icons)

## Project Structure

The frontend is organized into several key directories:

- `src/`: Root directory for the source code
  - `components/`: React components organized by feature
  - `styles/`: CSS modules and global styles
  - `interfaces/`: TypeScript interfaces and types
  - `config/`: Configuration files (e.g., API base URL)

## Setup and Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory and add:
   ```
   VITE_APP_URL=http://localhost:3000
   ```
5. Start the development server:
   ```
   npm run dev
   ```

## Key Components

- `App.tsx`: The main component that sets up routing and manages global state
- `Navbar.tsx`: Navigation component present on all pages
- `Home.tsx`: Landing page component
- `ReleaseList.tsx`: Displays a list of music releases
- `ShowRelease.tsx`: Detailed view of a single release
- `ArtistList.tsx`: Displays a list of artists
- `ShowArtist.tsx`: Detailed view of a single artist
- `UserProfile.tsx`: Displays user profile information
- `CreateRelease.tsx` and `CreateArtist.tsx`: Forms for creating new releases and artists

## Styling

The project uses a combination of Bulma CSS framework and custom CSS modules:

- Bulma provides a responsive grid system and pre-styled components
- Custom CSS modules (e.g., `Pagination.module.css`, `FancyLoading.module.css`) are used for component-specific styling
- Global styles are defined in `App.css` and `index.css`
- The `NeonLogo` component uses custom CSS for a unique, animated logo

## State Management

- React's built-in useState and useEffect hooks are used for local component state
- Global state (e.g., user authentication) is managed in the `App` component and passed down via props

## Routing

React Router is used for client-side routing. Main routes include:

- `/`: Home page
- `/releases`: List of releases
- `/releases/:releaseId`: Detailed view of a release
- `/artists`: List of artists
- `/artists/:artistId`: Detailed view of an artist
- `/user/:userId/profile`: User profile page

## API Integration

Axios is used for making HTTP requests to the backend API. The base URL for API calls is configured in `config.ts`.

## Authentication

- JWT-based authentication is implemented
- Login and signup functionality in `Login.tsx` and `Signup.tsx`
- The authentication token is stored in localStorage
- Protected routes check for user authentication before rendering

## Features

1. **User Authentication**: 
   - Sign up, log in, and log out functionality
   - Email confirmation for new users
   - Password reset capability

2. **Release Management**:
   - View a list of music releases
   - View detailed information about each release
   - Create new releases (for authenticated users)
   - Edit and delete releases (for release creators)

3. **Artist Management**:
   - View a list of artists
   - View detailed information about each artist
   - Create new artist profiles (for authenticated users)
   - Edit and delete artist profiles (for profile creators)

4. **Review System**:
   - Users can leave reviews on releases
   - Reviews include a star rating, favorite track, and text content
   - Users can edit or delete their own reviews

5. **User Profiles**:
   - View user profiles showing uploaded releases and favorites
   - Add/remove releases from favorites

6. **Search and Filter**:
   - Search functionality for releases and artists
   - Filter releases and artists by various criteria (e.g., genre, year)

7. **Responsive Design**:
   - The application is fully responsive, working on both desktop and mobile devices

8. **Pagination**:
   - Lists of releases, artists, and reviews are paginated for better performance and user experience

---

## Component Relationships and Email System

### Linking Artists and Releases

In this section, I will just go slightly deeper explaining the coding for these two sections, the Component Relationships and Email System.

## Component Relationships and Email System

### Linking Artists and Releases

The Melody Memo application maintains a strong relationship between artists and their releases, which is reflected in both the data model and the user interface:

1. **Data Model**: 
   - In the backend, the `Release` model contains an `artist` field that references the `Artist` model.
   - The `Artist` model has a `releases` field that is an array of references to `Release` documents.

   Example from `release.ts`:
   ```typescript
   const releaseSchema = new mongoose.Schema({
     // ... other fields
     artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
     // ...
   });
   ```

   Example from `artist.ts`:
   ```typescript
   const artistSchema = new mongoose.Schema({
     // ... other fields
     releases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Release' }],
     // ...
   });
   ```

2. **User Interface**:
   - When viewing a release (`ShowRelease.tsx`), the artist's name is displayed and linked to the artist's page.
   - On the artist's page (`ShowArtist.tsx`), all releases by that artist are listed and linked.

   Example from `ShowRelease.tsx`:
   ```tsx
   <Link to={`/artists/${artist._id}`} className={styles.yellowLink}>
     {artist.name}
   </Link>
   ```

   Example from `ShowArtist.tsx`:
   ```tsx
   {currentReleases.map((release: Release) => (
     <div key={release._id} className="column is-half">
       <div className={`box ${styles.releaseBox}`}>
         <article className="media">
           {/* ... */}
           <Link to={`/releases/${release._id}`}>{release.title}</Link>
           {/* ... */}
         </article>
       </div>
     </div>
   ))}
   ```

3. **Data Fetching**:
   - When fetching a release, the artist data is populated using Mongoose's populate method in the backend.

   Example from `releaseController.ts`:
   ```typescript
   const release = await Release.findById(req.params.releaseId)
     .populate('artist')
     .populate('user', '_id username');
   ```

### Email System

The email system in Melody Memo is primarily used for user authentication and account management:

1. **Technology**: 
   - The application uses SendGrid for sending emails.
   - Email functionality is implemented in the backend (`utils/sendEmail.ts`).

   Example from `sendEmail.ts`:
   ```typescript
   import sendgrid from '@sendgrid/mail';

   export default async function sendEmail(options: EmailOptions): Promise<void> {
     sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);
     
     const msg = {
       to: options.to,
       from: 'your-email@example.com',
       subject: options.subject,
       text: options.text,
       html: options.html,
     };

     await sendgrid.send(msg);
   }
   ```

2. **Use Cases**:
   - **Email Confirmation**: When a user signs up, a confirmation email is sent to verify their email address.
   - **Password Reset**: Users can request a password reset, which sends an email with a reset link.

   Example from `userController.ts` for password reset:
   ```typescript
   const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
   
   await sendEmail({
     to: user.email,
     subject: 'Password Reset Request',
     text: `Please click on this link to reset your password: ${resetUrl}`,
     html: `<p>Please click <a href="${resetUrl}">here</a> to reset your password.</p>`
   });
   ```

3. **Frontend Integration**:
   - The frontend initiates email sending by making API calls to the backend endpoints.

   Example from `ForgotPassword.tsx`:
   ```tsx
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     try {
       const response = await axios.post(`${baseUrl}/forgot-password`, { email });
       setMessage(response.data.message);
       setIsError(false);
     } catch (error: any) {
       setMessage(error.response?.data?.message || 'An error occurred');
       setIsError(true);
     }
   };
   ```

By integrating these systems, Melody Memo provides a seamless user experience, from browsing interlinked artist and release data to managing user accounts through a secure email system.