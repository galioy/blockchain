'use strict';
const express = require('express');
const router = express.Router();

const Blockchain = require('../services/BlockchainService');
const blockchain = new Blockchain();
const nodeId = Blockchain.uuid4();

router.get('/mine', (req, res, next) => {
  const lastBlock = blockchain.lastBlock();
  const lastProof = lastBlock.proof;
  const proof = blockchain.proofOfWork(lastProof);

  /*
   * The miner must receive a reward for finding the proof (mining a new block).
   * The sender is "0" to signify that this node has mined a new coin.
   */
  blockchain.newTx('0', nodeId, 1);

  /* Forge the block by adding it to the chain */
  const block = blockchain.newBlock(proof);

  res.json({
    message: 'New Block forged.',
    index: block.index,
    transactions: block.transactions,
    proof: block.proof,
    previousHash: block.previousHash
  });
});

router.post('/transactions/new', (req, res, next) => {
  if (!req.body.sender || !req.body.recipient || !req.body.amount) {
    res.json(new Error('Missing param(s)', req.body));
  }

  const index = blockchain.newTx(req.body.sender, req.body.recipient, req.body.amount);
  res.json(`New transaction will be added to ${index}`);
});

router.get('/chain', (req, res, next) => {
  res.json({
    chain: blockchain.chain,
    length: blockchain.chain.length
  })
});

module.exports = router;
