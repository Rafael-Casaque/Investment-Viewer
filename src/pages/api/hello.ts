// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // lógica para tratamento do verbo GET
      res.status(200).json({ message: 'GET request received' })
      break
    case 'POST':
      // lógica para tratamento do verbo POST
      res.status(200).json({ message: 'POST request received' })
      break
    case 'PUT':
      // lógica para tratamento do verbo PUT
      res.status(200).json({ message: 'PUT request received' })
      break
    case 'DELETE':
      // lógica para tratamento do verbo DELETE
      res.status(200).json({ message: 'DELETE request received' })
      break
    default:
      res.status(405).end() // método não permitido      
      break
  }
}