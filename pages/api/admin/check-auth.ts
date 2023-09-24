import { NextApiRequest, NextApiResponse } from 'next';
import { verify, VerifyErrors } from 'jsonwebtoken'; // For verifying the session token
import { parse } from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Get the session token from the request cookies
    const sessionToken = req.cookies.sessionToken;
    console.log("req.cookies", req.cookies.sessionToken)
    if (!sessionToken) {
      res.status(401).json({ status: false, message: 'Not authenticated' });
      return;
    }
    try {
      // Verify the session token
      const decodedToken = verify(sessionToken, '123456') as Express.JwtPayload;

      // Extract the userId from the decoded token
      const userId = decodedToken.userId;

      // Check if the user exists or perform any other authentication checks here...
      // For example, you could query the database to find the user based on the userId.

      // If the user is authenticated, you can send back a success response
      res.status(200).json({ status: true, message: 'Authenticated', userId });
    } catch (error) {
      console.error('Error while verifying session token', error as VerifyErrors);
      res.status(401).json({ message: 'Not authenticated' });
    }



  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}


