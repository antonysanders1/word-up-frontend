# Word Up Frontend

This is the frontend application for Word Up, built with Next.js and Tailwind CSS. The application allows users to search for words, view definitions, examples, and synonyms, and keep a search history.

## Features

- Search for word definitions, examples, and synonyms.
- View and interact with search history.
- Responsive design with a history drawer.

## Prerequisites

- Node.js (v18.18.1 or higher)
- Yarn package manager

## Installation

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd words-api-frontend
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Create a `.env` file:**

   Create a `.env` file in the root directory with the following contents:

   ```env
   NEXT_PUBLIC_API_KEY=thisIsJustAFakeKey_12345
   ```

   - `NEXT_PUBLIC_API_KEY`: This is the static API key that your frontend will send to the backend as the `Authorization` header.

4. **Run the frontend:**

   ```bash
   yarn dev -p 3001
   ```

   The frontend will be running at `http://localhost:3001`.

## Notes

- Ensure that the `.env` file is properly configured with your API key before running the frontend.
- The frontend communicates with the backend running at `http://localhost:3000`.

## Usage

1. Open `http://localhost:3001` in your web browser.
2. Enter a word in the search bar and click "Search".
3. View the word definition, examples, and synonyms.
4. Interact with your search history in the drawer on the right.
5. Explore synonyms with just a simple click.

## Deployment

For production deployment, build the frontend using:

```bash
yarn build
```
