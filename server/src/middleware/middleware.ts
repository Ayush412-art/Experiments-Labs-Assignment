// import { Request, Response, NextFunction } from "express";
// import jwt, { JwtPayload } from "jsonwebtoken";

// // Extend Express Request type to include `user`
// declare module "express-serve-static-core" {
//   interface Request {
//     user?: string | JwtPayload;
//   }
// }

// const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   const SECRET_KEY = process.env.SECRET_KEY;
//   const header = req.headers.authorization;

//   if (!SECRET_KEY) {
//     return res.status(500).json({ msg: "Server misconfigured: SECRET_KEY missing" });
//   }

//   if (!header) {
//     return res.status(401).json({ msg: "Unauthorized: No token provided" });
//   }

//   const token = header.split(" ")[1]!;

//   jwt.verify(token, SECRET_KEY, (err) => {
//     if (err) {
//       return res.status(403).json({ msg: "Invalid or expired token" });
//     }

//     next();
//   });
// };

// export default userMiddleware;
