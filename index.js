// const express = require('express')
// const path = require('path')
// const PORT = process.env.PORT || 5000

// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.render('pages/index'))

//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000


function calculateRate(weight, mailtype) {
  console.log("This is the mailtype " + mailtype);
  console.log("This is the weight " + weight);
}




express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

  .get('/', function (req, res) {
    lettertype = req.query.lettertype;
    weight = req.query.weight;

  res.render('pages/postage-result');
  calculateRate(req.query.weight, req.query.lettertype);

  // var weights = [1,2,3,4,5,6,7,8,9,10,11,12,13]

 var flatCost = {
    1 : 1.00,
    2 : 1.21,
    3 : 1.42,
    4 : 1.63,
    5 : 1.84,
    6 : 2.05,
    7 : 2.26,
    8 : 2.47,
    9 : 2.68,
    10 : 2.89,
    11 : 3.10,
    12 : 3.31,
    13 : 3.52
 }

 var stampedCost = {
  1 : 0.50,
  2 : 0.71,
  3 : 0.92,
  3.5 : 1.13
 }

 var meteredCost =  {
  1 : 0.47,
  2 : 0.68,
  3 : 0.89,
  3.5 : 1.10
 }

 var firstClassCost = {
  1 : 3.50,
  2 : 3.50,
  3 : 3.50,
  4 : 3.50,
  5 : 3.75,
  6 : 3.75,
  7 : 3.75,
  8 : 3.75,
  9 : 4.10,
  10 : 4.45,
  11 : 4.80,
  12 : 5.15,
  13 : 5.50
}

  

  // var closest = weights.reduce(function(prev, curr) {
  //   return (Math.abs(curr - weight) < Math.abs(prev - weight) ? curr : prev);
  // });

  // console.log("The closest value" + closest);
  var result = 0;
  if (lettertype = "stamped"){
    console.log("STAMPED");
    result = stampedCost[weight];

  } else if (lettertype = "metered") {
    console.log("metered");
    result = meteredCost[weight];

  } else if (lettertype = "flats") {
    console.log("flats");
    result = flatCost[weight];

  } else if (lettertype = "first-class") {
    console.log("first-class");
    result = firstClassCost[weight];

  }
  console.log("The result is" + result);
  
  res.render('pages/postage-result', {
    results: result
});

})
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))




