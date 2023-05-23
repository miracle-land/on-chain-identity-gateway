import { Commitment, PublicKey } from "@solana/web3.js";

// Should equal the contents of solana/program/program-id.md
export const PROGRAM_ID: PublicKey = new PublicKey(
  "gtwyhHAjVceBRE9JkRPG7FoA62t1EqU2zT1C8uKBnoZ"
);
export const GATEKEEPER_NONCE_SEED_STRING = "gatekeeper"; // must match get_inbox_address_with_seed in state.rs
export const GATEWAY_TOKEN_ADDRESS_SEED = "gateway"; // must match get_inbox_address_with_seed in state.rs

export const SOLANA_COMMITMENT: Commitment = "confirmed";
export const DEFAULT_SOLANA_RETRIES: number = 3;
// Timeouts vary depending on the commitment.
export const SOLANA_TIMEOUT_PROCESSED = 3000;
export const SOLANA_TIMEOUT_CONFIRMED = 7000;
export const SOLANA_TIMEOUT_FINALIZED = 10000;
export const DEFAULT_DERIVATION_SEED = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]);
