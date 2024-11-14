import nextAppSession, { SessionOptions } from "next-app-session";
import { NextApiRequest, NextApiResponse } from "next";

// Define the session data type
type MySessionData = {
  grantId?: string;
  email?: string;
};

// Extend NextApiRequest to include the session type
declare module "next" {
  interface NextApiRequest {
    session?: MySessionData;
  }
}

// Configure session options
const sessionOptions: SessionOptions = {
  name: "cronus-session",
  secret: process.env.SECRET as string,
  cookie: {
    maxAge: 60 * 60 * 24, // 1 day
  },
};

// Function to apply session middleware
export const withSession = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
  const sessionMiddleware = nextAppSession<MySessionData>(sessionOptions);
  
  return async (req: NextApiRequest, res: NextApiResponse) => {
    await sessionMiddleware(req, res); // Attach session to req
    return handler(req, res); // Proceed to handler
  };
};
