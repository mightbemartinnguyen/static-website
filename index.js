'use strict';

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({
  extended: true
}));

app.use(express.static('public'));


app.get("/review", (req, res) => {
  console.log(req.query);
  res.send(req.query);
});

let htmlTop = `
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>Martin Nguyen</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <meta name="robots" content="noindex,noarchive, nofollow" />
    <link rel='stylesheet' type='text/css' media='screen' href='main.css'>
    <script src='main.js'></script>

    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="icon" type="image/png" sizes="512x512" href="android-chrome-512x512.png">
    <link rel="icon" type="image/png" sizes="192x192" href="android-chrome-192x192.png">
    <link rel="manifest" href="/site.webmanifest">

</head>
<body>
    <header>
        <h1>Martin Nguyen <img src="android-chrome-192x192.png" alt="favicon symbol"></h1>
    </header>
    
    <nav class="globalNav">
        <a href="index.html">Home</a>
        <a href="contact.html">Contact</a>  
        <a href="gallery.html">Gallery</a>
    </nav>
    
    <main>
`;

let htmlBottom = `
</main>
    
  <footer>
        <p>&copy; 2023 Martin Nguyen</p>
  </footer>
</body>
</html>
`;


app.post('/results', (req, res) => {
  const fullName = req.body.fullName;
  const email = req.body.email;
  const message = req.body.message;
  const superBowl = req.body.superBowl;
  const favLanguage = req.body.favLanguage; 
  const sports = req.body.sports; 


  const sportsArray = Array.isArray(sports) ? sports : (sports ? [sports] : []);

  res.send(`
  ${htmlTop}  
  <section> 
    <h2>Response</h2>
      <article>
        <h3> Thank you for your submission, <strong>${fullName}</strong>! </h3>
        <p>
        Your email address is, <strong>${email}</strong>. For the question about the
        future champions for Superbowl LVIII, you believe that <strong>${superBowl} </strong>will win! Next we asked 
        for your favorite programming language and you choose <strong>${favLanguage}</strong>. The last question that we asked 
        was what sports do you follow, and you said that you followed <strong>${sportsArray.join(', ')}</strong>.
        </p>

        <p>
        You sent us the following message: <strong>${message}</strong> 
        </p>
        </article>
    </section>
      ${htmlBottom} `)
});

const productFile = require('./products.js').products;

function compareProducts(productName) {
  for (const item of productFile) {
      if (item.product === productName) {
          return item;
      }
  }
}

// This route uses the form's action endpoint to display the 
// choice returned by the function above.
app.post('/orderEndpoint', (req, res) => {
  const fullName = req.body.fullName;
  const emailAddress = req.body.email;
  const orderAddress = req.body.orderAddress;
  const chosenProduct = compareProducts(req.body.productName);
  const quantity = req.body.quantity;
  const cost = chosenProduct.price;
  const costof1 = chosenProduct.price.toLocaleString('en-US',{style: 'currency',currency: 'USD', minimumFractionDigits: 2});
  const total = quantity * cost;
  const totalCost = total.toLocaleString('en-US',{style: 'currency',currency: 'USD', minimumFractionDigits: 2});
  const orderInstructions = req.body.orderInstructions

  res.send(`${htmlTop}
  <section>
    <h2>Order Confirmation</h2>
      <article>
        <h3>Thank you for your order, <strong>${fullName}</strong>.</h3>
        <p>You emailed us through your email address at <strong>${emailAddress}</strong>. Your order consists of
          <strong>${quantity}</strong>  
          <strong>${chosenProduct.product}s</strong> produced by the
          <strong>${chosenProduct.company}</strong> company. The price of one ${chosenProduct.product} is
          <strong>${costof1}</strong>. So overall, the total cost for your order is
          <span class="numeric"><strong>${totalCost}</strong></span>. We will send your order to the address you provided at
          <strong>${orderAddress}</strong>. Thank you and have a  good day.</p>
        <p> Additional instructions that you may or may not have requested are as followed:
          <strong>${orderInstructions}</strong></p>
    </article>
  </section>
  
  ${htmlBottom}`);
});



app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});