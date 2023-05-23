import { Commitment, PublicKey } from "@solana/web3.js";

export const REGISTER = "./register.csv";

// Should equal the contents of solana/program/program-id.md
export const PROGRAM_ID: PublicKey = new PublicKey(
  "gtwyhHAjVceBRE9JkRPG7FoA62t1EqU2zT1C8uKBnoZ"
);
export const SOLANA_COMMITMENT: Commitment = "confirmed";