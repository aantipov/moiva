const axios = require("axios");

module.exports = async (req, res) => {
  const skey = process.env.GITHUB_API_KEY;
  const url = "https://api.github.com/graphql";

  const resp = await axios({
    method: req.method,
    url,
    data: req.body,
    headers: {
      Authorization: `Bearer ${skey}`,
      accept: req.headers.accept,
      "content-type": req.headers["content-type"],
    },
  });

  res.status(resp.status).json(resp.data);
};
