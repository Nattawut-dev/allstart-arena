// jsonwebtoken.d.ts
declare namespace Express {
  interface JwtPayload {
    userId: string; // Replace 'string' with the actual type of your user ID
    // Add other properties if needed
  }
}
