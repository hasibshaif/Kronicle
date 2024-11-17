import nextAppSession from 'next-app-session';

// Your session data type
type MySessionData = {
  grantId?: string;
  email?: string;
}

export const session = nextAppSession<MySessionData>({
  name: 'kronicle-session',
  secret: process.env.SECRET,
  cookie: {
    httpOnly: true, // Use secure HTTP-only cookies
    secure: process.env.NODE_ENV === "production", // Ensure cookies are secure in production
    sameSite: "lax", // Prevent CSRF
  },
});