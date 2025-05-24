import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { todos } = req.body;
    const filePath = path.join(process.cwd(), 'todos.json');
    fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));
    res.status(200).json({ message: 'Todos saved' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}