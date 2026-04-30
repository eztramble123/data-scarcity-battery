// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ReceiptToken is ERC721, Ownable {
    uint256 private _nextTokenId = 1;

    mapping(uint256 => string) private _tokenUris;
    mapping(bytes32 => uint256) public tokenByProofHash;

    event ReceiptMinted(
        uint256 indexed tokenId,
        bytes32 indexed proofHash,
        address indexed recipient,
        string submissionId
    );

    constructor(address initialOwner)
        ERC721("Greek Energy Receipt", "GER")
        Ownable(initialOwner)
    {}

    function mintReceipt(
        address recipient,
        bytes32 proofHash,
        string calldata submissionId,
        string calldata metadataUri
    ) external onlyOwner returns (uint256 tokenId) {
        require(tokenByProofHash[proofHash] == 0, "proof already minted");

        tokenId = _nextTokenId++;
        tokenByProofHash[proofHash] = tokenId;
        _tokenUris[tokenId] = metadataUri;

        _safeMint(recipient, tokenId);
        emit ReceiptMinted(tokenId, proofHash, recipient, submissionId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return _tokenUris[tokenId];
    }
}
