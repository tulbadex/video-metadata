import "express";

declare module "express" {
  export interface Request {
    user?: any; // Adjust `any` to the expected structure of your JWT payload
  }
}
