require('dotenv').config();
const axios = require('axios');
const secret = process.env.COOKIE_SECRET;
const User = require('../models/user.js');
const Sentence = require('../models/sentences.js')
let jwt = require('jsonwebtoken');
const user = require('../models/user.js');

exports.login_user = (req, res) => {
  const token = req.headers.authorization.split('Bearer ')[1];
  axios.get("https://kapi.kakao.com/v2/user/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((info_res) => {
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
        let token = jwt.sign(user.kakao_id, secret);
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
  if (req.query.error) {
    return res.json({
      error: req.query.error,
      error_description: req.query.error_description
    })
  }
  else {
    axios.post("https://kauth.kakao.com/oauth/token", params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (response) {
      if (response.data.error) {
        res.json({
          error: response.data.error,
          error_description: response.data.error_description
        })
      }
      access_tok = response.data.access_token;
      kakao_scope = response.data.scope;
      axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${access_tok}`
        }
      }).then((info_res) => {
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
            let token = jwt.sign(user.kakao_id, secret);
            res.json({ success: true, token: token });
          }
        })
      })

    });
  }
};

exports.uploadImage = (req, res) => {

}

exports.logout_user = (req, res) => {
  res.redirect(`https://kauth.kakao.com/oauth/logout?client_id=${process.env.KAKAO_ID}&logout_redirect_uri=http://localhost:8001/api/auth/logout/callback`);
}

exports.logout_kakao = (req, res) => {
  res.redirect('/')
};

exports.user_info = async (req, res) => {
  try {
    let user = await User.findOne({
      kakao_id: req.body.request_id
    });
    if (user) {
      console.log(user);
      res.status(200).json({
        profile: {
          nickname: user.nickname,
          profileImageUrl: user.profile_image_data
        },
        userId: user.kakao_id,
        gender: user.gender,
        goal_amount: user.goal_amount,
        degree: user.degree,
        continue_day : user.study_log.study_continuity_cnt
      })
    } else {
      res.status(500).json({
        error: 'There is no User for your token'
      }).redirect('/auth/login')
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err })
  }
}

exports.user_photo = (req, res, next) => {
  console.log(req.file);
  next();
}


exports.set_user_goal = async (req, res) => {
  let user = await User.findOne({ kakao_id: req.body.request_id })
  if (req.body.goal < 1) {
    res.json({ success: false, message: '0보다 큰 수로 정해주세요' })
  } else {
    user.goal_amount = req.body.goal
    user.save(function (err) {
      if (err) {
        res.json({ success: false, error: err })
      } else {
        res.json({ success: true })
      }
    })
  }
}



exports.todayReport = async (req, res) => {
  let user = await User.findOne({ kakao_id: req.body.request_id });
  let today = new Date(new Date().setHours(0, 0, 0, 0))
  let logs = user.study_log.date_logs.find(datelog => datelog.date.getTime() == today.getTime()).logs
  let best_score_index = 0
  let worst_score_index = 0;
  let sum_point = 0;
  for (log of logs) {
    sum_point += log.score
    if (log.score > logs[best_score_index].score) best_score_index = logs.indexOf(log);
    if (log.score < logs[worst_score_index].score) worst_score_index = logs.indexOf(log);
  }
  let best_sentence = await Sentence.findById(logs[best_score_index].sentence_id);
  let worst_sentence = await Sentence.findById(logs[worst_score_index].sentence_id);
  let report = {
    avg_point: sum_point / logs.length,
    best_sentence: best_sentence.content,
    worst_sentence: worst_sentence.content
  }
  res.json(report);
}

exports.isGoalAchived = async (req, res) => {
  let user = await User.findOne({ kakao_id: req.body.request_id });
  let today = new Date(new Date().setHours(0, 0, 0, 0))
  let today_cnt = user.study_log.date_logs.find(datelog => datelog.date.getTime() == today.getTime()).logs.length
  res.json({ isAchived: user.goal_amount <= today_cnt });
}

exports.rewardList = async (req, res) => {
  let user = await User.findOne({ kakao_id: req.body.request_id });
  res.json({ rewardList: user.user_rewards })
}

exports.nearestReward = async (req, res) => {
  let user = await User.findOne({ kakao_id: req.body.request_id });
  let day_reward = user.user_rewards.filter(reward => reward.goal_type === '일')
  let sentence_reward = user.user_rewards.filter(reward => reward.goal_type === '문장')
  let nearest_day_amount = 0 
  let nearest_sentence_amount = 0 
  let nearest_day = ''
  let nearest_sentence=''
  if (day_reward.length>0) {
    nearest_day = day_reward.reduce((prev, value) => {
          return (prev.count - prev.achivement) <= (value.count - value.achivement) ? prev : value
        })
        nearest_day_amount = nearest_day.count - nearest_day.achivement 
  }
  if (sentence_reward.length>0) {
    nearest_sentence = sentence_reward.reduce((prev, value) => {
      return (prev.count - prev.achivement) <= (value.count - value.achivement) ? prev : value
    })
    nearest_sentence_amount = nearest_sentence.count - nearest_sentence.achivement
  }
  if (nearest_day_amount!=0 && nearest_sentence_amount!=0) {
    if (nearest_day_amount * user.goal_amount > nearest_sentence_amount) {
      res.json({ message: `${nearest_sentence_amount}문장만 더 공부하면`, reward: nearest_sentence.reward })
    } else {
      res.json({ message: `${nearest_day_amount}일만 더 공부하면`, reward: nearest_day.reward })
    }
  } else if (nearest_sentence_amount) {
    res.json({ message: `${nearest_sentence_amount}문장만 더 공부하면`, reward: nearest_sentence.reward })
  } else if (nearest_day_amount) {
    res.json({ message: `${nearest_day_amount}일만 더 공부하면`, reward: nearest_day.reward })
  } else res.json({ message: '목표와 보상을 추가로 설정하세요!',reward:'' })
}

exports.postReward = async (req, res) => {
  let user = await User.findOne({ kakao_id: req.body.request_id });
  user.user_rewards.push({
    count: req.body.count,
    goal_type: req.body.goal_type,
    reward: req.body.reward,
    achivement: 0
  })
  user.save(function (err) {
    if (err) {
      res.json({ success: false, error: err })
    } else res.json({ success: true })
  })
}

exports.achivedReward = async(req,res)=>{
  let user = await User.findOne({ kakao_id: req.body.request_id });
  res.json({achived_rewards: user.achived_rewards})
}


