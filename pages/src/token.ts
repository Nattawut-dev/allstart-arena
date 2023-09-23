import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest) {
    
    const sessionToken = req.cookies.sessionToken;
    if (!sessionToken) {
        return false;
    } else {
        return true;
    }
}


