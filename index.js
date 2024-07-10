const express = require("express");
const app = express();
const axios = require("axios");
app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");
app.set("views","./views");

app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("home");
})

let score = 0;
app.get("/quiz/:id",async(req,res)=>{
    let data = await axios.get("http://localhost:3000/data");

    let item = data.data.find(val=>val.id === req.params.id);

    let id = parseInt(req.params.id, 10);

    let newId = id+1;
    res.render("quiz",{data:item,id:newId,score:score});
})

app.post("/quiz/:id", async (req, res) => {
    let data = await axios.get("http://localhost:3000/data");
    let item = data.data.find(val => val.id === req.params.id);
    let index = data.data.findIndex(obj => obj.id === req.params.id);
    // console.log(data.data[index-1].answer);
    // console.log(req.body.answer);
    console.log("Index is :"+index);
    console.log("Length is: "+data.data.length);


    let answer;
    // console.log(score);
    if(index == -1){
        answer = data.data[14].answer;
        if (req.body.answer === answer) {
            score++;
        }
    }else{
        answer = data.data[index-1].answer;
        if (req.body.answer === answer) {
            score++;
        }
    }

    let id = parseInt(req.params.id, 10);
    let newId = id + 1;
    console.log(newId);
    console.log("score is : "+score)

    if (newId > data.data.length) {
        res.redirect(200,"/user",{score});
    } else {
        res.render("quiz", { data: item, id: newId, score: score });
    }
});

app.get("/user",(req,res)=>{
    res.render("userDetail");

})

app.post("/submit",async(req,res)=>{
    let data = await axios.get("http://localhost:3000/data");
    const {username,age} = req.body;
    await axios.post("http://localhost:3000/users",req.body)
    const correctAnswers = score;
    const incorrectAnswers = data.data.length-correctAnswers;
    res.render("chart",{correctAnswers,incorrectAnswers,username,age,score});
})
app.listen(5000,()=>{
    console.log("Server is running on port 5000");
})