import { NowRequest, NowResponse } from "@vercel/node";
import axios from "axios";

export default async (req: NowRequest, res: NowResponse) => {
  const skey = process.env.GITHUB_API_KEY;
  const url = "https://api.github.com/graphql";

  const resp = await axios({
    method: "POST",
    url,
    data: req.body,
    headers: {
      Authorization: `Bearer ${skey}`,
      accept: req.headers.accept,
      "content-type": req.headers["content-type"],
    },
  });

  res.setHeader("Cache-Control", "max-age=0, s-maxage=43200");
  res.status(resp.status).json(resp.data);
};
