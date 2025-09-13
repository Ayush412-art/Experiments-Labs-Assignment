import mongoose from 'mongoose';

const connection = async()=>{
    try{
    const url : any  = "mongodb+srv://iamayush449:1rD34hwk8MJZ2X0u@ayush.mv5dzyj.mongodb.net/";
    if(!url){
        console.log("mongo url not found");
        
    }
    await mongoose.connect(url , {
      dbName : process.env.DB_NAME!
    })
    console.log("Mongodb connection established ✅ ")


    }
    catch(err){
        console.log("Connection failed" , err);
        
    }
     


}
export default connection