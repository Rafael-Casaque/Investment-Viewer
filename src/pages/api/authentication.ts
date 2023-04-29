import type { NextApiRequest, NextApiResponse } from "next";
import { Utils } from "../services/Utils";

export default async function authentication(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const authHeader = req.headers.authorization as string;
    const token = authHeader.split(" ")[1];
    Utils.validateJWT(token);
    return true
  } catch (error: any) {
    return false
  }

}
