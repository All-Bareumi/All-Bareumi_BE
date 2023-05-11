require('dotenv').config();
const mongoose = require('mongoose');

const db_entry = process.env.DB_ENTRY
const db_username = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;
const db_URL = process.env.DB_URL;
const db_name = process.env.DB_NAME;

const connect = ()=>{
    if(process.env.NODE_ENV !== 'production'){
        mongoose.set('debug',true);
    }

    mongoose.connect(`${db_entry}://${db_username}:${db_password}@${db_URL}/${db_name}`,{
        dbName:'All_Bareumi',useNewUrlParser:true,
    }, (error)=>{
        if(error){
            console.log('몽고DB 연결 에러',error);
        }else {
            console.log('몽고DB 연결 성공')
        }
    })
}
mongoose.connection.on('error',(error)=>{
    console.error('몽고DB 연결 에러',error);
})
mongoose.connection.on('disconnected',()=>{
    console.error('몽고DB 연결이 해제되었습니다. 다시 시도합니다.');
    connect();
})

module.exports = connect;