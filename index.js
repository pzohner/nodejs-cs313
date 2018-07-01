// const express = require('express')
// const path = require('path')
// const PORT = process.env.PORT || 5000

// function calculateRate(weight, lettertype) {
//   // var weights = [1,2,3,4,5,6,7,8,9,10,11,12,13]

//  var flatCost = {
//   1 : 1.00,
//   2 : 1.21,
//   3 : 1.42,
//   4 : 1.63,
//   5 : 1.84,
//   6 : 2.05,
//   7 : 2.26,
//   8 : 2.47,
//   9 : 2.68,
//   10 : 2.89,
//   11 : 3.10,
//   12 : 3.31,
//   13 : 3.52
// }

// var stampedCost = {
// 1 : 0.50,
// 2 : 0.71,
// 3 : 0.92,
// 3.5 : 1.13
// }

// var meteredCost =  {
// 1 : 0.47,
// 2 : 0.68,
// 3 : 0.89,
// 3.5 : 1.10
// }

// var firstClassCost = {
// 1 : 3.50,
// 2 : 3.50,
// 3 : 3.50,
// 4 : 3.50,
// 5 : 3.75,
// 6 : 3.75,
// 7 : 3.75,
// 8 : 3.75,
// 9 : 4.10,
// 10 : 4.45,
// 11 : 4.80,
// 12 : 5.15,
// 13 : 5.50
// }



// // var closest = weights.reduce(function(prev, curr) {
// //   return (Math.abs(curr - weight) < Math.abs(prev - weight) ? curr : prev);
// // });

// // console.log("The closest value" + closest);
// var result = 0;
// if (lettertype = "stamped"){
//   console.log("STAMPED");
//   result = stampedCost[weight];

// } else if (lettertype = "metered") {
//   console.log("metered");
//   result = meteredCost[weight];

// } else if (lettertype = "flats") {
//   console.log("flats");
//   result = flatCost[weight];

// } else if (lettertype = "first-class") {
//   console.log("first-class");
//   result = firstClassCost[weight];
// }

// console.log("The result is" + result);

// return result;

// }

// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   // res.render('public/week09-postage')
//   .get('/', (req, res) => 
//   res.sendFile('week09-postage.html', { root: __dirname + "/public/" } ))


//   .get('/calculatePostage', function (req, res) {
//     lettertype = req.query.lettertype;
//     weight = req.query.weight;

//   // res.render('pages/postage-result');
//   result = calculateRate(req.query.weight, req.query.lettertype);

//   res.render('pages/postage-result', {
//     results: result
//   });
  
// })
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))


const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');


connectionString = process.env.DATABASE_URL;

const pool = new Pool({connectionString: connectionString});

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')

    .get('/', (req, res) => 
    res.send("connected to my app"))
    
    //   /getGameCharacters – gets all the characters that have enrolled in this game. (via session variable or another table?)
    .get('/getGameCharacters', function (req, res) {
        gameid = req.query.gameid;

        console.log("getGameCharacters called correctly :D");
        getGameCharactersdb(gameid, function(err, result) {
            console.log("got row with gameid:" + gameid)
            console.log("Got this result back from the database: " + result);
            res.json(result)
        });
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))

    function getGameCharactersdb(gameid, callback) {
        var sql = "SELECT * from character;"
        var params = []

        pool.query(sql, params, function (err, result) {
            if (err) {
               console.log("could't get game characters from database");
               console.log(err);
            } else {
                console.log("The result was: " + JSON.stringify(result.rows));
                callback(null, result.rows)

            }
        
        
        });
    }
    // //   /getLocation – Returns a JSON object which is a list of charactername and coordinates on the map
    // .get('/getLocation', function (req,res) {
    //     console.log("getLocation called correctly :D"); 
    // })
    // //   /changeImg – changes the image of the map (only available to DM)?
    // .get('/setImg', function (req,res) {
    //     console.log("setImg called correctly :D");
    // })
    // //   /addUser – adds a user to the database
    // .get('/addUser', function (req,res) {
    //     console.log("addUser called correctly :D");
    // })
    // //   / addCharacter – adds a character to the database
    // .get('/addCharacter', function (req,res) {
    //     console.log("addCharacter called correctly :D");
    // })
    // //   /addDM – adds a DM to the database
    // .get('/addDM', function (req,res) {
    //     console.log("addDM called correctly :D");
    // })
    // //   /addNPC – adds an NPC to the database
    // .get('/addNPC', function (req, res) {
    //     console.log('addNPC called correctly :D')
    // })
    // //   /move – records players move into the db (sends player to move, and coords as parameters)
    // .get('/move', function (req,res) {
    //     console.log("getGameCharacters called correctly :D");
    // })



    /* Listen on port 5000 */

//   .get('/calculatePostage', function (req, res) {
//     lettertype = req.query.lettertype;
//     weight = req.query.weight;

//   res.render('pages/postage-result');
//   calculateRate(req.query.weight, req.query.lettertype);

//   // var weights = [1,2,3,4,5,6,7,8,9,10,11,12,13]

//  var flatCost = {
//     1 : 1.00,
//     2 : 1.21,
//     3 : 1.42,
//     4 : 1.63,
//     5 : 1.84,
//     6 : 2.05,
//     7 : 2.26,
//     8 : 2.47,
//     9 : 2.68,
//     10 : 2.89,
//     11 : 3.10,
//     12 : 3.31,
//     13 : 3.52
//  }

//  var stampedCost = {
//   1 : 0.50,
//   2 : 0.71,
//   3 : 0.92,
//   3.5 : 1.13
//  }

//  var meteredCost =  {
//   1 : 0.47,
//   2 : 0.68,
//   3 : 0.89,
//   3.5 : 1.10
//  }

//  var firstClassCost = {
//   1 : 3.50,
//   2 : 3.50,
//   3 : 3.50,
//   4 : 3.50,
//   5 : 3.75,
//   6 : 3.75,
//   7 : 3.75,
//   8 : 3.75,
//   9 : 4.10,
//   10 : 4.45,
//   11 : 4.80,
//   12 : 5.15,
//   13 : 5.50
// }

  

//   // var closest = weights.reduce(function(prev, curr) {
//   //   return (Math.abs(curr - weight) < Math.abs(prev - weight) ? curr : prev);
//   // });

//   // console.log("The closest value" + closest);
//   var result = 0;
//   if (lettertype = "stamped"){
//     console.log("STAMPED");
//     result = stampedCost[weight];

//   } else if (lettertype = "metered") {
//     console.log("metered");
//     result = meteredCost[weight];

//   } else if (lettertype = "flats") {
//     console.log("flats");
//     result = flatCost[weight];

//   } else if (lettertype = "first-class") {
//     console.log("first-class");
//     result = firstClassCost[weight];
//   }

//   console.log("The result is" + result);
  
//   res.render('pages/postage-result', {
//     results: result
// });

// })
  
