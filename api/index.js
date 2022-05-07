const express = require("express");
const app = express();
const connectDB = require("./db");
const fs = require('fs');
require('dotenv').config();
app.use(express.json());
connectDB();

app.use(express.urlencoded({
    extended: true
  }));
fs.readdir('./routes' , async(err,files)=>{
    if(err) throw new err;
    files.forEach((file)=>{
        app.use(`/api/${file.split('.')[0].toLowerCase()}/` , require(`./routes/${file}`))
    })
})


app.listen(process.env.PORT || 5000, () => {
console.log("Server is live on port 5000");
})