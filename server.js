// const { onRequest } = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
// const { setGlobalOptions } = require("firebase-functions/v2");
const path = require('path')
const app = express();

dotenv.config();
// app.use(cors());

const dirname = path.resolve();
console.log(dirname);
console.log(path.join(dirname, "..", 'amazone-clone', 'build'))

// const secrete_key = process.env.STRIPE_SECRET;
// const stripe = new Stripe(`${secrete_key}`);


// to serve the frontend 
app.use(express.static(path.join(dirname,'..', 'amazone-clone/build')));

// to redirect any routes to index.html since all the frontend route is inside index
app.get('*', (req, res)=>{
    res.sendFile(path.join(dirname, '..', 'amazone-clone', 'build', 'index.html'))
})

// dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);
// const app = express();
// setGlobalOptions({maxInstances:10})



app.use(cors({ origin: true }));

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Success !",
  });
});

app.post("/payment/create", async (req, res) => {
  const total = parseInt(req.query.total);
  // console.log(total)
  if (total > 0) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
    });

    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
      
    });
  } else {
    res.status(403).json({
      message: "total must be greater than 0",
    });
  }
});

// exports.api = onRequest(app);

app.listen(4000,()=>console.log("listening"))