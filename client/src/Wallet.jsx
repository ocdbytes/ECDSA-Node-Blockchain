import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  async function onChange(evt) {
    const private_key = evt.target.value;
    setPrivateKey(private_key);
    if (private_key) {
      const {
        data: { balance },
      } = await server.get(`balance/${toHex(secp.getPublicKey(private_key))}`);
      console.log(balance);
      setBalance(balance);
      setAddress(toHex(secp.getPublicKey(private_key)));
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Type your Private Key"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>

      <div>
        Address / Public Key : {address.slice(0, 10)}...
        {address.slice(120, address.length)}
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
