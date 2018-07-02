const express = require('express')
var app = express();
const path = require('path');

// to send posts
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// Require my custom config file
var config = require('./config');

// Set up port to listen on
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

// Require 'pg' to connect to database
const { Pool } = require('pg');

// Get the connection string from environment variables, if not, then grab it from my local config file.
connectionString = process.env.DATABASE_URL || config.connectionString;

// Create our pool for connections
const pool = new Pool({connectionString: connectionString});

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => res.render('pages/login'));
    

/* getCharacters - returns json list of all characters belong to that user */
app.get('/getCharacters', function(req, res) {
    var userid = req.query.userid;

    var sql = "SELECT * from characters where userid = $1::int;";
    var params = [userid];

    pool.query(sql, params, function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(result.rows);
        }
    })
});

/* getGames - returns json list of all games -> used so user can pick which one to join */
app.get('/getGames', function(req, res) {

    var sql = "SELECT * from games;";
    var params = [];

    pool.query(sql, params, function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(result.rows);
        }
    })
});


/* getDMs - returns json list of all dms belong to that user */
app.get('/getDMs', function(req, res) {
    var userid = req.query.userid;

    var sql = "SELECT * from dm where userid = $1::int;";
    var params = [userid];

    pool.query(sql, params, function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(result.rows);
        }
    })
});

/* getNPCs - returns json list of all dms belong to that user */
app.get('/getNPCs', function(req, res) {
    var dmid = req.query.dmid;

    var sql = "SELECT * from NPC where dmid = $1::int;";
    var params = [dmid];  

    pool.query(sql, params, function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(result.rows);
        }
    })
});


/* changeMap - changes the currently displayed map */
    app.get('/changeMap', function(req, res) {
        // Grab the input from the query string
        var newtableImgPath = req.query.tableImgPath;
        var gameid = req.query.gameid;

        // create a function with a callback, which will be invoked when the database is finished
        changeMapdb(newtableImgPath, gameid, function (err, result) {
            if (err) {
                // If an error was returned from the db, send back an
                // internal server error 500 and the error.
                res.status(500).send(err);
            } else {
                // If it worked, send a 200: OK and the result
                res.status(200).json({success: 200, result: result});
            }
        });
    });

    // execute the database query, calling back to our /changeMap endpoint
    function changeMapdb (newtableImgPath, gameid, callback) {

        // sql query
        var sql = "UPDATE games set tableimgpath = $1::text where id = $2::int";

        // load prepared statement with proper variables
        var params = [newtableImgPath, gameid];

        // execute the query with our pool
        pool.query(sql, params, function(err, result) {
                if (err) {
                    // if database returns an error, pass it to the callback
                    callback("failed to change map: " + err);
                } else {
                    // if successful, error = null, pass back success message
                    callback(null, "Map changed successfully");
                }
        });
    }


/* addNPC - adds a new NPC */
app.get('/addNPC', function(req, res) {
    // grab the username and password (password better be encrypted)
    npcname = req.query.npcname;
    dmid = req.query.dmid;
    npcimgpath = req.query.npcimgpath;

    // created sql statement and assign parameters
    var sql = "INSERT INTO NPC (npcname, dmid, npcimagepath) VALUES ($1::text, $2::int, $3::text)";
    var params = [npcname, dmid, npcimgpath];
    
    // execute the query
    pool.query(sql,params, function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else (
            res.status(200).send("Successfully added NPC: " + npcname)
        )
    });
});

/* addDM - adds a new user */
app.get('/addDM', function(req, res) {
    // grab the username and password (password better be encrypted)
    dmname = req.query.dmname;
    userid = req.query.userid;

    // created sql statement and assign parameters
    var sql = "INSERT INTO dm (dmname, userid) VALUES ($1::text, $2::int)";
    var params = [dmname, userid];
    
    // execute the query
    pool.query(sql,params, function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else (
            res.status(200).send("Successfully added dm" + dmname + " to the database")
        )
    });
});

/* addUser - adds a new user (uses post method because we don't want to expose password in the query string)*/
app.post('/addUser', function(req, res) {
    // grab the username and password (password better be encrypted)
    username = req.body.username;
    password = req.body.password;

    // created sql statement and assign parameters
    var sql = "INSERT INTO users (username, password) VALUES ($1::text, $2::text)";
    var params = [username, password];
    
    // execute the query
    pool.query(sql,params, function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else (
            res.status(200).send("Successfully added user" + username + " to the database")
        )
    });
});


/* addCharacter - adds a character to the database */

    app.get('/addCharacter', function (req, res) {
        var characterName = req.query.characterName;
        var imgPath = req.query.imgPath;
        var userid = req.query.userid; 

        addCharacterdb(characterName, imgPath, userid, function (err, result) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).json(result);
            }
        });
    });

    function addCharacterdb(characterName, imgPath, userid, callback) {
        var sql = "INSERT into characters (avatarname, posx, posy, imgpath, userid, gameid) VALUES ($1::text, $2::int, $3::int, $4::text, $5::int, $6::int);"
        var params = [characterName, 0, 0, imgPath, userid, 0];

        pool.query(sql, params, function(err, result) {
            if (err) {
                console.log("Failed to add Character to db;");
                callback("failed to add character to database " + err, null);
            } else {
                console.log("added character" + JSON.stringify(result.rows));
                callback(null, result.rows);
            }
        });
    }

/* /getGameCharacters – gets all the characters that have enrolled in this game. (via session variable or another table?) */
    app.get('/getGameCharacters', function (req, res) {
        var gameid = req.query.gameid;

        console.log("getGameCharacters called correctly :D");
        getGameCharactersdb(gameid, function(err, result) {
            console.log("got row with gameid:" + gameid)
            console.log("Got this result back from the database: " + result);
            res.json(result)
        });
    })

    function getGameCharactersdb(gameid, callback) {
        var sql = "SELECT * from characters where gameid = $1::int;";
        var params = [gameid];

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


/* /move - records a players move into the database - its counter part is getGameCharacters, which returns position of each characters */
app.get('/move', function(req, res) {
    var characterName = req.query.characterName;
    var posy = req.query.posy;
    var posx = req.query.posx;

    moveCharacter (characterName, posx, posy, function (err, result) {
        if (err) {
            res.status(500).send("Database failed" + err);
        } else {
            res.status(200).send(result);
        }
    });
});

function moveCharacter(characterName, posx, posy, callback) {
    var sql = "UPDATE table characters set posx = $1::int posy = $2::int where avatarname = $3::text";
    var params = [posx, posy, characterName];

    pool.query(sql, params, function(err, result) {
        if (err) {
            callback(err, null);
        } else (
            callback(null, characterName + ' position updated successfully')
        )
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
  
