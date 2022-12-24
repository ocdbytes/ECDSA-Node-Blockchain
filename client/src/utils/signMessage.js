import * as secp from "ethereum-cryptography/secp256k1";
import HashMessage from "./hashMessage";

const SignMessage = async (msg, privateKey) => {
    const hashed_message = HashMessage(msg);
    const signed_message = await secp.sign(hashed_message, privateKey, { recovered: true });
    return signed_message;
}
export default SignMessage;