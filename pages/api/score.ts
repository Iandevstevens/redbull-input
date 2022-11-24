// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  playerName?: string;
  score?: number;
  err?: any;
  leaders?: any;
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
      "redbull-scores",
      new mongoose.Schema(
        {
          score: Number,
          msisdn: String,
          playerName: String,
        },
        {
          timestamps: true,
        },
      ),
    );
  }
  const leaderBoard = conn.model("redbull-scores");
  if (req.method === "POST") {
    const { score, msisdn, playerName } = req.body;
    if (msisdn && score) {
      const record = new leaderBoard({
        score,
        msisdn,
        playerName,
      });
      record.save((err: any, resData: any) => {
        if (resData) {
          return res.status(200).json({ score: +score });
        } else {
          return res.status(500).json({ err });
        }
      });
    }
    res.status(500);
  } else if (req.method === "GET") {
    const leadersArray = await leaderBoard.aggregate([{ $group: { _id: "$msisdn", scores: { $push: "$score" }, names: { $push: "$playerName" } } }, { $sort: { scores: 1 } }, { $limit: 10 }]);
    const leaders = leadersArray.map((x: any) => {
      return { msisdn: x._id, topScore: Math.max(...x.scores), name: x.names[0] };
    });
    res.status(200).json({ leaders });
  }
}
