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
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (conn == null) {
    conn = mongoose.createConnection(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    await conn.asPromise();
    conn.model(
      "redbull-scores",
      new mongoose.Schema(
        {
          playerName: String,
          score: Number,
          msisdn: String,
        },
        {
          timestamps: true,
        },
      ),
    );
  }
  const leaderBoard = conn.model("redbull-scores");
  if (req.method === "POST") {
    const { playerName, score, msisdn } = req.body;
    if (playerName && score) {
      const record = new leaderBoard({
        playerName,
        score,
        msisdn,
      });
      record.save((err: any, resData: any) => {
        if (resData) {
          console.log(+score);
          return res.status(200).json({ playerName, score: +score });
        } else {
          return res.status(500).json({ err });
        }
      });
    }
    res.status(500);
  } else if (req.method === "GET") {
    const leadersArray = await leaderBoard.aggregate([{ $group: { _id: "$msisdn", scores: { $push: "$score" } } }, { $sort: { scores: -1 } }, { $limit: 10 }]);
    const leaders = leadersArray.map((x: any) => {
      return { msisdn: x._id, topScore: Math.max(...x.scores) };
    });
    res.status(200).json({ leaders });
  }
}
