const express = require("express");
const app = express();
const cors = require("cors");
const secp = require("ethereum-cryptography/secp256k1");
const hashMessage = require("./utils/hashMessage");
const port = 3042;
const { toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
    "043232b62cefe43036b240ea951df9e5687496c889d67895b540f61bdd42b4e58e03c3efb7edb98bc03461b0fb0752c06700e81eb0c162a6a4bd8c883a231e90d0": 100,
    "04215c9abe0571dcc2d3d7ea1b050308d4d8911e3d85072887ad2fc902599efa320ac6bd35741305f66ce9414ebd1050b39a4d1b2e4bd80fa60153602841636563": 50,
    "041a6f661d3a665c0774bc9220123b45baf929e82755e1b9c8238ecce921cdb90cb5f3cd4e41813e8071442386c1cf840a952891b3f826def7a21a146d66463aa9": 75,
};

app.get("/balance/:address", (req, res) => {
    const { address } = req.params;
    const balance = balances[address] || 0;
    res.send({ balance });
});

app.post("/send", (req, res) => {
    const { sender, recipient, amount, signedMessage, message, privateKey } = req.body;

    setInitialBalance(sender);
    setInitialBalance(recipient);

    const senderPublicKey = secp.getPublicKey(privateKey);
    console.log("Sender Public Key : ", senderPublicKey);
    console.log("Sender Private Key : ", privateKey);
    console.log("Sender Message : ", message);
    console.log("Signed Message : ", signedMessage[0]);

    const valid = secp.verify(signedMessage, hashMessage(message), senderPublicKey);
    console.log("Is valid transaction ? : ", valid);

    if (valid) {
        if (balances[sender] < amount) {
            res.status(400).send({ message: "Not enough funds!" });
        } else {
            balances[sender] -= amount;
            balances[recipient] += amount;
            res.send({ balance: balances[sender] });
        }
    } else {
        res.send("This operation is not allowed from your private key !!");
    }


});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
    if (!balances[address]) {
        balances[address] = 0;
    }
}
