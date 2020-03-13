const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));
//mongoose
mongoose.connect("mongodb+srv://admin:testpassword@todolist-sglyu.mongodb.net/todolistDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.set('useFindAndModify', false);

const itemSchema = new mongoose.Schema({
    name: String
})

const Item = mongoose.model("Item", itemSchema)

let item1 = new Item({
    name: "Go to Gym"
})

let item2 = new Item({
    name: "Eat"
})

let item3 = new Item({
    name: "Code"
})
let defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});

const List = mongoose.model("List", listSchema);


//day variables
let today = new Date();
currentDay = today.getDay();
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
let day = [];

function checkCurrentDay() {
    weekdays.forEach(function (el, i) {
        if (currentDay === i) {
            day = weekdays[currentDay - 1];
        }
    })
}
checkCurrentDay();

app.get("/:customList", function (req, res) {
    let customList = _.capitalize(req.params.customList);
    List.findOne({
        name: customList
    }, (err, results) => {
        if (!err) {
            if (results) {
                res.render("list", {
                    listTitle: results.name,
                    todo: results.items
                })
            } else {
                let list = new List({
                    name: customList,
                    items: defaultItems
                });

                list.save();
                res.redirect("/" + customList)
            }
        }
    })


})

app.get("/", function (req, res) {

    Item.find({}, function (err, items) {
            if (items.length === 0) {
                Item.insertMany(defaultItems, (err) => err ? console.log(err) : console.log("Items Successfully inserted into the database"))
                res.redirect("/");
            } else {
                if (err) {
                    console.log(err)
                } else {

                    res.render("list", {
                        listTitle: day,
                        todo: items
                    })
                }
            }
        }

    )
})







app.post("/", function (req, res) {
    const todoName = req.body.todo;
    const customListName = req.body.list;

    const item = new Item({
        name: todoName
    });

    if (customListName === day) {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({
            name: customListName
        }, function (err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + customListName);
        })
    }
})

app.post("/delete", function (req, res) {
    const checkedItem = req.body.checkbox;
    const customListName = req.body.listName;
    if (customListName === day) {
        Item.findOneAndDelete({
            _id: checkedItem
        }, () => res.redirect("/"))
    } else {

        List.findOneAndUpdate({
            name: customListName
        }, {
            $pull: {
                items: {
                    _id: checkedItem
                }
            }
        }, () => res.redirect("/" + customListName))
    }
})


app.listen(3001, function () {
    console.log("Server is running on port 3001")
})