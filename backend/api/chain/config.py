from __future__ import annotations

import os
from dataclasses import dataclass


@dataclass(frozen=True)
class SepoliaConfig:
    enabled: bool
    network: str
    chain_id: int
    rpc_url: str | None
    private_key: str | None
    contract_address: str | None


def load_sepolia_config() -> SepoliaConfig:
    rpc_url = os.getenv("SEPOLIA_RPC_URL")
    private_key = os.getenv("SEPOLIA_PRIVATE_KEY")
    contract_address = os.getenv("RECEIPT_TOKEN_CONTRACT_ADDRESS")
    enabled = os.getenv("SEPOLIA_ENABLED", "false").lower() == "true"
    return SepoliaConfig(
        enabled=enabled,
        network="sepolia",
        chain_id=int(os.getenv("SEPOLIA_CHAIN_ID", "11155111")),
        rpc_url=rpc_url,
        private_key=private_key,
        contract_address=contract_address,
    )
