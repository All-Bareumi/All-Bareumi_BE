require('dotenv').config();
var request = require('request');
const secret = process.env.COOKIE_SECRET;
const User = require('../models/user.js');
let jwt = require('jsonwebtoken');



exports.login = (req, res, next) => {
  var access_tok, kakao_scope
  var params = {
    grant_type: "authorization_code",
    client_id: process.env.KAKAO_ID,
    redirect_uri: "http://localhost:8001/api/auth/login",
    code: req.query.code
  };
  request.post("https://kauth.kakao.com/oauth/token", { form: params }, (err, resp, body) => {
    if (body) {
      var data = JSON.parse(body);
      access_tok = data.access_token;
      kakao_scope = data.scope;
    }
  });
  console.log(access_tok);


  // User.findOne({
  //   kakao_id: req.body.kakao_id
  // }, function (err, user) {
  //   if (err) {
  //     return res.json({ success: false, msg: err })
  //   }
  //   if (!user) {
  //     if (!req.body.gender) {
  //       return res.json({ success: false, msg: 'First Time Login, But There is no gender data. Gender data is required' });
  //     }
  //     user = new User({
  //       nickname: req.body.nickname,
  //       kakao_id: req.body.kakao_id,
  //       gender: req.body.gender,
  //       photo_data: null
  //     });
  //     user.save(function (err) {
  //       if (err) {
  //         return res.json({ success: false, msg: err.message });
  //       }
  //       else {
  //         let token = jwt.sign(user._id.toJSON(), secret);
  //         res.json({ success: true, token: token });
  //       }
  //     });
  //   } else {
  //     let token = jwt.sign(user._id.toJSON(),secret);
  //     res.json({ success: true, token: token });
  //   }
  // })
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
};
