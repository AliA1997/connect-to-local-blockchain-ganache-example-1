const Web3 = require("web3");
const url = "HTTP://127.0.0.1:7545";
const web3 = new Web3(url);
var { Transaction } = require("ethereumjs-tx");

const sendingAddress = "0x4f84bDa2EF552B7fde57789dc20176d6eaeDDD86";
const receivingAddress = "0xef8792090789a8D0E8a97753397cE2021fC6cB64";

//get balance of sending and receiving address.
web3.eth.getBalance(sendingAddress).then(console.log);
web3.eth.getBalance(receivingAddress).then(console.log);

web3.eth.getTransactionCount(sendingAddress).then(async (transactionCount) => {
  //Convert value to hexadecimal format
  const value = web3.utils.toWei("10", "gwei");
  console.log("value to send:", value);
  //Get the estimated gas limit using the value, from and to address
  const gasLimit = await web3.eth.estimateGas({
    from: sendingAddress,
    to: receivingAddress,
    amount: value,
  });
  console.log("gas limit:", gasLimit);
  //Get the gas price
  const gasPrice = await web3.eth.getGasPrice();
  console.log("gas price - base fee:", gasPrice);
  //Define the raw transaction, and convert the transactionCount(nonce), gasPrice, gasLimit, and value to hexadecimal format before signing transaction.
  var rawTransaction = {
    nonce: web3.utils.toHex(transactionCount),
    gasPrice: web3.utils.toHex(gasPrice),
    gasLimit: web3.utils.toHex(gasLimit),
    to: receivingAddress,
    value: web3.utils.toHex(value),
  };

  //Pass private key of the sending address
  try {
    //Convert sending address private key to hexadecimal format.
    const sendingAddressPrivateKey = Buffer.from(
      "6f9b0b535433c2c6ded4770b90665cd5ea4d121d3f26e3202ae145d13896becf",
      "hex"
    );
    //Define a new transaction instance.
    var transaction = new Transaction(rawTransaction);
    //Sign the transaction instance with the private key./
    transaction.sign(sendingAddressPrivateKey);
    //Serialize the transaction
    var serializedTransaction = transaction.serialize();
    //Send the signed transaction and log the receipt.
    await web3.eth
      .sendSignedTransaction("0x" + serializedTransaction.toString("hex"))
      .on("receipt", console.log);
  } catch (error) {
    //Log the error.
    console.log(error);
  }
});
