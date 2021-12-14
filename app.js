const Web3 = require('web3');
const EthereumTransaction = require('ethereumjs-tx');
const url = 'HTTP://127.0.0.1:7545';

const web3 = new Web3(url);

const sendingAddress = '0xab75b07C053434bc1DdbeAa05b5229AcDA1fb64f';
const receivingAddress = '0xE8DDD32dF65d46Ac8bb82Aa2E97bD2d7aadCBAb6';

web3.eth.getBalance(sendingAddress).then(console.log);
web3.eth.getBalance(receivingAddress).then(console.log);

web3.eth.getTransactionCount(sendingAddress)
.then(transactionCount => {
    var rawTransaction = { 
        nonce: transactionCount, 
        to: receivingAddress, 
        value: 1, 
        gasLimit: web3.utils.toHex(47123800000000000008),
        gasPrice: web3.utils.toHex(web3.utils.toWei('100', 'gwei')),
        // data: "Test Transaction" 
    };
    
    //Pass private key of the sending address
    const sendingAddressPrivateKey = 'ea7e7e74fa2f8ed591a2d34cb11bb39e9359a2184e8350db2cf79efa9d027ecc';
    //convert the private key of the sending address to hexidecimal format.
    const sendingAddressPrivateKeyHex = Buffer.from(sendingAddressPrivateKey, 'hex');
    //Define a new transaction using ethereumjs-tx library.
    const transaction = new EthereumTransaction.Transaction(JSON.stringify(rawTransaction));
    //Sign the transaction using the sending address private key in hexadecimal format.
    transaction.sign(sendingAddressPrivateKeyHex);
    
    //Define the serialize transaction
    const serializedTransaction = transaction.serialize();
    web3.eth.sendSignedTransaction(serializedTransaction);
});