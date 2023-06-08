require('dotenv').config();
const axios = require('axios');
const secret = process.env.COOKIE_SECRET;
const User = require('../models/user.js');
let jwt = require('jsonwebtoken');
const user = require('../models/user.js');

exports.login_user = (req,res)=>{
  const token = req.headers.authorization.split('Bearer ')[1];
  axios.get("https://kapi.kakao.com/v2/user/me",{headers : {
        Authorization : `Bearer ${token}`
      }}).then((info_res)=>{
        User.findOne({
          kakao_id: info_res.data.id
        }, function (err, user) {
          if (err) {
            return res.json({ success: false, msg: err })
          }
          if (!user) {
            user = new User({
              nickname: info_res.data.properties.nickname,
              kakao_id: info_res.data.id,
              gender: info_res.data.kakao_account.gender,
              photo_data: null,
              profile_image_data: info_res.data.properties.profile_image
            });
            user.save(function (err) {
              if (err) {
                return res.json({ success: false, msg: err.message });
              }
              else {
                let token = jwt.sign(user.kakao_id, secret);
                res.json({ success: true, token: token });
              }
            });
          } else {
            let token = jwt.sign(user.kakao_id,secret);
            res.json({ success: true, token: token });
          }
        })
      });
}

exports.login_kakao = (req, res, next) => {
  var access_tok, kakao_scope
  var params = {
    grant_type: "authorization_code",
    client_id: process.env.KAKAO_ID,
    redirect_uri: "http://localhost:8001/api/auth/login/callback",
    code: req.query.code,
  };
  if(req.query.error){
    return res.json({
      error: req.query.error,
      error_description : req.query.error_description
    })
  }
  else{
    axios.post("https://kauth.kakao.com/oauth/token", params,{headers:{'Content-Type': 'application/x-www-form-urlencoded'}}).then(function(response){
      if(response.data.error){
        res.json({
        error: response.data.error,
        error_description : response.data.error_description
      })
    }
      access_tok = response.data.access_token;
      kakao_scope = response.data.scope;
      axios.get("https://kapi.kakao.com/v2/user/me",{headers : {
        Authorization : `Bearer ${access_tok}`
      }}).then((info_res)=>{
        User.findOne({
          kakao_id: info_res.data.id
        }, function (err, user) {
          if (err) {
            return res.json({ success: false, msg: err })
          }
          if (!user) {
            user = new User({
              nickname: info_res.data.properties.nickname,
              kakao_id: info_res.data.id,
              gender: info_res.data.kakao_account.gender,
              photo_data: null,
              profile_image_data: info_res.data.properties.profile_image
            });
            user.save(function (err) {
              if (err) {
                return res.json({ success: false, msg: err.message });
              }
              else {
                let token = jwt.sign(user.kakao_id, secret);
                res.json({ success: true, token: token });
              }
            });
          } else {
            let token = jwt.sign(user.kakao_id,secret);
            res.json({ success: true, token: token });
          }
        })
      })
      
    }); 
  }
};

exports.uploadImage = (req,res)=>{
  
}

exports.logout_user = (req,res)=>{
  res.redirect(`https://kauth.kakao.com/oauth/logout?client_id=${process.env.KAKAO_ID}&logout_redirect_uri=http://localhost:8001/api/auth/logout/callback`);
}

exports.logout_kakao = (req, res) => {
  res.redirect('/')
};

exports.user_info = async(req,res)=>{
  try{
  let user = await User.findOne({
    kakao_id : req.body.request_id
  });
  if(user){
    console.log(user);
    res.status(200).json({
      profile:{
        nickname : user.nickname,
        profileImageUrl : user.profile_image_data
      },
      userId : user.kakao_id,
      gender : user.gender,
      goal_amount : user.goal_amount
    })
  }else{
    res.status(500).json({
      error : 'There is no User for your token'
    }).redirect('/auth/login')
  }
  }catch(err){
    console.log(err);
    res.status(500).json({error : err})
  }
}

exports.user_photo = (req,res,next)=>{
  console.log(req.file);
  next();
}


exports.set_user_goal = async(req,res)=>{
  let user = await User.findOne({kakao_id:req.body.request_id})
  if(req.body.goal<1){
    res.json({success:false,message:'0보다 큰 수로 정해주세요'})
  }else{
    user.goal_amount = req.body.goal
    user.save(function(err){
      if(err){
        res.json({success:false,error:err})
      }else{
        res.json({success:true})
      }
    })
  }
}

