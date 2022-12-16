const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const { error } = require("console");
const dbjsonPath = path.join(__dirname, "db.json");

app.use("/",express.static(path.join(__dirname,"public")));
app.set("view engine", "ejs");

app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname,"/public/index.html"))
});

app.get("/about", (req, res) => {
    fs.readFile(dbjsonPath, (err, data) => {
        if (err) throw err;
        const obj = JSON.parse(data);
        res.render("about", { comments: obj.comments});
    })
});

app.post("/api/data", (req, res)=>{
    fs.readFile(dbjsonPath,(err, data)=>{
        const obj = JSON.parse(data);
        obj.users.push({
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email
        });
        console.log(obj);
        fs.writeFile(dbjsonPath, JSON.stringify(obj), (err)=>{
            if(err)
            console.log(err)
        });
        
        res.redirect("/contact.html")
    });
    

});
app.post("/api/enter", (req, res)=>{
    fs.readFile(dbjsonPath,(err, data)=>{
        const feedback = JSON.parse(data);
        feedback.comments.push({
            name: req.body.name,
            emailaddress: req.body.emailaddress,
            comment: req.body.comment
        });
        console.log(feedback);
        fs.writeFile(dbjsonPath, JSON.stringify(feedback), (err)=>{
            if(err)
            console.log(err)
        });
        
        
        res.redirect("/about");
    });
})

app.listen(3000, ()=>{
    console.log("Listening on port 3000");
});