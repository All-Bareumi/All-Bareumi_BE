let jwt = require('jsonwebtoken')

  exports.authChecker = (req,res,next)=>{
    if(req.headers.authorization){
      const token = req.headers.authorization.split('Bearer ')[1];
      jwt.verify(token,process.env.COOKIE_SECRET,(err)=>{
        if(err) res.status(401).json({error : 'Auth Error with jwt token'})
        else{
          req.body.request_id = jwt.decode(token);
          next();
        };
      })
    }else res.status(401).json({error: 'No token in Header'})

  }