from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache

from api.chain.config import SepoliaConfig, load_sepolia_config


@dataclass(frozen=True)
class ChainMintResult:
    network: str
    chain_id: int
    contract_address: str | None
    tx_hash: str | None
    token_id: str | None
    mode: str


class ChainService:
    def __init__(self, config: SepoliaConfig):
        self.config = config

    def ready(self) -> bool:
        return bool(
            self.config.enabled
            and self.config.rpc_url
            and self.config.private_key
            and self.config.contract_address
        )

    def mint_receipt_token(
        self,
        submission_id: str,
        proof_hash: str,
        owner_ref: str,
    ) -> ChainMintResult:
        if not self.ready():
            return ChainMintResult(
                network=self.config.network,
                chain_id=self.config.chain_id,
                contract_address=self.config.contract_address,
                tx_hash=None,
                token_id=None,
                mode="mock",
            )

        # Sepolia integration intentionally stubbed for the next engineer.
        # This preserves the interface and env contract without pretending the
        # transaction path is finished.
        return ChainMintResult(
            network=self.config.network,
            chain_id=self.config.chain_id,
            contract_address=self.config.contract_address,
            tx_hash=f"stub-tx-{submission_id}",
            token_id=f"stub-token-{proof_hash[-6:]}",
            mode="stub",
        )


@lru_cache(maxsize=1)
def get_chain_service() -> ChainService:
    return ChainService(load_sepolia_config())
