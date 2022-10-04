use crate::constants::NETWORK_SEED;
use crate::errors::NetworkErrors;
use crate::state::*;
use anchor_lang::prelude::*;

/// Placeholder for additional close_network functionality
pub fn close_network(ctx: Context<CloseNetworkAccount>) -> Result<()> {
    require!(
        ctx.accounts.network.is_closeable(),
        NetworkErrors::AccountInUse
    );

    Ok(())
}

#[derive(Accounts, Debug)]
pub struct CloseNetworkAccount<'info> {
    #[account(
        mut,
        close = destination,
        seeds = [NETWORK_SEED, network.authority.key().as_ref(), &network.network_index.to_le_bytes()],
        bump,
        constraint = network.can_access(&authority, NetworkKeyFlags::AUTH),
    )]
    pub network: Account<'info, GatekeeperNetwork>,
    /// CHECK: Rent destination account does not need to satisfy the any constraints.
    #[account(mut)]
    pub destination: UncheckedAccount<'info>,
    pub authority: Signer<'info>,
}
