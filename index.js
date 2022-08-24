/* eslint-disable no-unused-vars */
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const config = require("./src/config");
const pairs = require("./src/config/pairs.json");


const pino = require("pino");
const logger = pino({ level: process.env.LOG_LEVEL || "info" });
const app = express();

var corsOptions = {
  origin: "*"
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') {
      res.status(200).end()
      return;
  }
  // Pass to next layer of middleware
  next();
});


/*
*   This is the entry point of program. Select the strategy or analyzer(s)
*/
const momentumStrategyStart = require("./strategies/momentumTrading/momentumTrading");
const momentumStrategyAnalyzerStart = require("./strategies/momentumTrading/momentumTradingAnalyzer");

const momentumWithStopLossStrategyStart = require("./strategies/momentumTradingWithStopLoss/momentumTradingWithStopLoss");

const reverseMomentumStrategyStart = require("./strategies/reverseMomentumTrading/reverseMomentumTrading");
const reverseMomentumStrategyAnalyzerStart = require("./strategies/reverseMomentumTrading/reverseMomentumTradingAnalyzer");

const strategy = process.env.TRADING_STRATEGY || 'momentum';
const backtest = process.env.BACK_TEST || 'false';

logger.info(`Selected ${strategy} strategy`)

/*** Make sure to configure the momentumStrategy in ./strategies/momentumTrading/momentumTrading.js or in the .env before launching ***/
if (strategy == 'momentum') {
    if (backtest == 'true') {
        //Launches the momentum strategy anaylzer for back testing:
        momentumStrategyAnalyzerStart();
    } else {
    // Launches the momentum strategy and starts the bot:
    momentumStrategyStart();
    }
}

/*** Make sure to configure the momentumStrategy in ./strategies/momentumTrading/momentumTrading.js or in the .env before launching ***/
if (strategy == 'reverse') {
    if (backtest == 'true') {
        //Launches the reverse momentum strategy anaylzer for back testing:
        reverseMomentumStrategyAnalyzerStart();
    } else {
    //Launches the reverse momentum strategy and starts the bot:
    reverseMomentumStrategyStart();
    }
}


/*** Make sure to configure the momentumWithStopLossStrategy in ./strategies/momentumTradingWithStopLoss/momentumTradingWithStopLoss.js or in the .env before launching ***/
if (strategy == 'stoploss') {
    // Launches the momentum with stop loss strategy and starts the bot:
    logger.debug(`Starting stop loss strategy`);
    momentumWithStopLossStrategyStart();
}


app.get("/api/balance/:network", async (req, res) => {
    
  
})

// set port, listen for requests
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
