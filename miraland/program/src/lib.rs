//! SOL program
#![deny(missing_docs)]

extern crate core;

mod entrypoint;
pub mod error;
pub mod processor;
pub mod state;

// Export current SDK types for downstream users building with a different SDK version
pub use solana_program;

solana_program::declare_id!("gtwyhHAjVceBRE9JkRPG7FoA62t1EqU2zT1C8uKBnoZ");
