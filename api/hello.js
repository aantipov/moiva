module.exports = (req, res) => {
  const { name = "World" } = req.query;
  const skey = process.env.SENTRY_MYKEY;
  res.status(200).send(`Hello ${name}!. Secret key: ${skey}`);
};
