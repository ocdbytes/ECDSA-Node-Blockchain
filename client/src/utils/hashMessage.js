import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";

const HashMessage = (message) => {
    const bytes = utf8ToBytes(message);
    const hash = keccak256(bytes);
    return hash;
}

export default HashMessage;