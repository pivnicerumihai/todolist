const express = require("express");
const bodyParser = require("body-parser");

const app = express();

let todo = [];
let workItems = [];
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));



app.get("/", function (req, res) {

    var today = new Date();
    currentDay = today.getDay();
    var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var day = [];

    weekdays.forEach((element, index) => {
        if (currentDay === index) {
            day = weekdays[currentDay - 1];
            res.render("list", {
                listTitle: day,
                todo: todo
            });
        }
    });
})

app.get("/work", function (req, res) {
    res.render("list", {
        listTitle: "Work",
        todo: workItems
    })
});

app.post("/", function (req, res) {
    var todo_item = req.body.todo;
    
    if(req.body.list === "Work"){
        workItems.push(todo_item);
        res.redirect("/work");
    }
    else{
        todo.push(todo_item);
        res.redirect("/")
    }
})
app.listen(3001, function () {
    console.log("Server is running on port 3001")
})