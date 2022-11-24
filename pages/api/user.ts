// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  user?: any;
  error?: string;
  code?: number;
};

let conn: any = null;

const uri = process.env.MONGO_DB || "";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (conn == null) {
    conn = mongoose.createConnection(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    await conn.asPromise();
    conn.model(
      "users",
      new mongoose.Schema({
        _id: String,
        name: String,
        surname: String,
      }),
    );
  }
  const users = conn.model("users");
  if (req.method === "GET") {
    const user = await users.findById(req.query.msisdn).exec();
    if (user) {
      const { _id, name, surname } = user;
      if (!name) return res.status(403).json({ error: "user must login from redbull page", code: 1 });
      return res.status(200).json({ user: { msisdn: _id, name, surname } });
    }
    res.status(404).json({ error: "user not found", code: 2 });
  }
}
