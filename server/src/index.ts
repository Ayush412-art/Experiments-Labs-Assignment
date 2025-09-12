import express ,{Application} from 'express'
const app : Application = express();

// default middlewares
app.use(express.json());
app.use(express.urlencoded({extended : true}))



app.listen(8090 , () =>{
    console.log("server is running at port 8090")
})