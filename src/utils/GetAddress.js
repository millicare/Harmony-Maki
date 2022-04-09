import { HarmonyAddress } from "@harmony-js/crypto";

export function getAddress(address) {
    try {
        return HarmonyAddress(address);
    } catch (error) {
        throw error;
    }
}