var info = function (req, res) { 
  console.log('Get info...');
  var data = {
    'env': process.env.NODE_ENV
  }
  return res.json(data);
}

module.exports = info;