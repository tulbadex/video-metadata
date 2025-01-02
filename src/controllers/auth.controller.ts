import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AppDataSource from '../database/data-source';
import { User } from '../entity/User';
import { validationResult } from 'express-validator';

export class AuthController {
  private userRepository = AppDataSource.getRepository(User);

  async register(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({ name, email, password: hashedPassword });
        await this.userRepository.save(user);

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
        res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error });
    }
  }

  async login(req: Request, res: Response) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      try {
          const user = await this.userRepository.findOne({ where: { email } });
          if (!user || !(await bcrypt.compare(password, user.password))) {
              return res.status(400).json({ message: 'Invalid email or password.' });
          }

          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
          res.status(200).json({ user: { id: user.id, name: user.name, email: user.email }, token });
      } catch (error) {
          res.status(500).json({ message: 'Internal server error.', error });
      }
  }
}
