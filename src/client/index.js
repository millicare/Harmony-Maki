import { transport } from "./ws";
import { ApiCache } from "./ApiCache";

const signatureHash = new ApiCache({ key: "signatureHashCache" });

export function getRelatedTransactionsByType(params) {
    return transport("getRelatedTransactionsByType", params)
}

export function getByteCodeSignatureByHash(params) {
    // console.log(signatureHash.get(params[0]))
    return signatureHash.get(params[0])
    ? Promise.resolve(signatureHash.get(params[0]))
    : (transport("getSignaturesByHash", params).then((res) => {
        signatureHash.set(params[0], res);

        return Promise.resolve(res)
    }));
}

export function getAllERC20() {
    return transport("getAllERC20", [
        '0x0ab8894cda70a6efd32ce7563834444e2811b182'
    ]);
}

export function getAllERC721() {
    return transport("getAllERC721", []);
}