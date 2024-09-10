const express = require("express");
const { ethers } = require('ethers');
const router = express.Router();

const userRoute = require("./userRoute");
const orderRoute = require("./orderRoute");
const paymentRoute = require("./paymentRoute");
const productRoute = require("./productRoute");

const provider =new  ethers.providers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/6b677d225fd642a0942cb579504be3ef"
);
const uniswapV2FactoryAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'; // Example contract address (UniswapV2 Factory)
const uniswapV2FactoryABI = [
  'function allPairs(uint256) view returns (address)', // Function ABI to fetch LP pairs
  'function allPairsLength() view returns (uint256)',  // Function ABI to get the length of LP pairs
];
router.get("/jeremy-apitest",async (req, res) => {
    try {
        const contract = new ethers.Contract(uniswapV2FactoryAddress, uniswapV2FactoryABI, provider);
    
        // Fetch total number of LP pairs
        const pairsLength = await contract.allPairsLength();
        
        // Fetch the first LP pair (for demonstration)`
        const firstPair = await contract.allPairs(0);
    
        const data = {
          totalPairs: pairsLength.toString(),
          firstPair,
        };
                
        res.json(data);
      } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching contract data');
      }
});
router.route("/user", userRoute);
router.route("/order", orderRoute);
router.route("/payment", paymentRoute);
router.route("/product", productRoute);

module.exports = router;
