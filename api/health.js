module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'M TECHNOVATE Serverless API'
  });
};
