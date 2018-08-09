const sd = require('silly-datetime')
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/msgboard');
const db = mongoose.connection;
db.on('open', function(){
  console.log('数据库连接成功')
})

// schema
const userSchema = new mongoose.Schema({
  name: String,
  password: String
})
const userModel = db.model('users',userSchema);

const msgSchema = new mongoose.Schema({
  sender: String,
  nickname: String,
  title: String,
  content: String,
  addTime: Date,
  isDel: {
    type: Number,
    default: 0
  }
})
const msgModel = db.model('msgs', msgSchema)


module.exports = {
    doregister: (req, res, next)=>{
        let name = req.query.name,
            password = req.query.password;

          userModel.insertMany({
            name: name,
            password: password
          }, function(err, doc){
            if(err){
              res.json({state: false})
            }else{
              res.json({state: true})
            }
          })
    },
  
    dologin: (req, res, next)=>{
      let name = req.query.name,
        password = req.query.password;

        userModel.findOne({name: name, password: password}, function(err, doc){
          if(!doc){
            res.json({state: false})      
          }else{
            req.session.user = doc
            res.json({state: true})
          }
        })
    },

    dologout: (req, res, next)=>{
      req.session.destroy();
      res.redirect('/')
    },

    doAddMsg: (req, res, next)=>{
      let nickname = req.query.nickname,
          title = req.query.title,
          content = req.query.content;
      
      msgModel.insertMany({nickname: nickname, title: title, content: content, sender: req.session.user.name, addTime: sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')}, (err, doc)=>{
        if(!doc){
          res.json({state: false});
        }else{
          res.json({state: true});
        }
      })
    },

    doGetMsg: (req, res, next)=>{
      let pageIndex = parseInt(req.query.pageIndex),
          pageSize = parseInt(req.query.pageSize),
          skipNum = (pageIndex -1 ) *  pageSize;
      msgModel.find({sender: req.session.user.name,isDel: {$ne: 1}}, "nickname title content addTime", {skip: skipNum, limit: pageSize, sort: {addTime: -1}}, function(err, doc){
        if(!doc){
          res.json({state: false, data: null})
        }else{
          let resJson = doc;
            // 数据总条数
            msgModel.count({sender: req.session.user.name,isDel: {$ne: 1}}, function(err, num){
              if(num){
                res.json({state: true, data: resJson, totalCount: num, pageIndex: pageIndex})
              }
            })
        }
      })
    },

    doGetMsgById: (req, res, next)=>{
      let msgId = req.query.msgId;
      msgModel.findOne({_id: msgId, isDel: {$ne: 1}}, "nickname title content addTime", function(err, doc){
        if(!doc){
          res.json({state: false, data: null});
        }else{
          res.json({state: true, data: doc});
        }
      })
    },

    doUpdateMsg: (req, res, next)=>{
      let msgId = req.query.msgId,
          nickname = req.query.nickname,
          title = req.query.title,
          content = req.query.content;

      msgModel.updateOne({_id: msgId, isDel: {$ne: 1}}, {nickname: nickname, title: title, content: content}, function(err, doc){
        if(!err && doc.ok >= 1){
          res.json({state: true, data: '修改成功'})
        }else{
          res.json({state: false, data: '修改失败'})
        }
      })
    },

    doDelMsg: (req, res, next)=>{
      let msgId = req.query.msgId;
      msgModel.updateOne({_id: msgId, isDel: {$ne: 1}}, {isDel: 1}, function(err, doc){
        if(!err && doc.ok >= 1){
          res.json({state: true, data: '删除成功'})
        }else{
          res.json({state: false, data: '删除失败'})
        }
      })
    }
}

