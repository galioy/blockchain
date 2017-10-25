'use strict';
const crypto = require('crypto');

class Blockchain {
  constructor() {
    this.chain = [];
    this.currentTransactions = [];
    this.newBlock(100, 1); // create the genesis block
  }

  /**
   * Create a new block in the Blockchain
   *
   * @param {int}               proof         The proof given by the Proof of Work algorithm
   * @param {string|undefined}  previousHash  Hash of the previous block
   * @return {object} A new block
   */
  newBlock(proof, previousHash = undefined) {
    const block = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.currentTransactions,
      proof,
      previousHash: previousHash || Blockchain.hash(this.chain[this.chain.length - 1])
    };

    this.currentTransactions = [];
    this.chain.push(block);

    return block;
  }

  /**
   * Create a new tx to go into the next mined block
   *
   * @param {string}  sender    Address of the sender
   * @param {string}  recipient Address of the recipient
   * @param {int}     amount    The amount being sent
   */
  newTx(sender, recipient, amount) {
    this.currentTransactions.push({
      sender,
      recipient,
      amount
    });

    // Increment the index of the last block in the chain and return it
    return this.lastBlock().index + 1;
  }

  /**
   * Creates a SHA-256 hash of a block
   *
   * @param {object}  block The block object to be hashed
   * @return {string} The block as a hash string
   */
  static hash(block) {
    return crypto.createHash('sha256').update(JSON.stringify(block)).digest('hex');
  }

  static uuid4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  lastBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Simple Proof of Work algorithm:
   *  - find a number P such that hash(P') contains 4 leading zeroes, where P is the previous P'
   *  - P is the previous proof and P' is the new proof
   *
   * @param {int} lastProof
   * @return {int}
   */
  proofOfWork(lastProof) {
    let proof = 0;

    while (Blockchain.isValidProof(lastProof, proof) === false) {
      proof++;
    }

    return proof;
  }

  /**
   * Validate the proof by the following logic: does `hash(lastProof, proof)` contain 4 leading zeroes?
   *
   * @param {int} lastProof The previous proof
   * @param {int} proof     The current proof
   * @return {boolean} `true` if correct, `false` otherwise
   */
  static isValidProof(lastProof, proof) {
    const guess = Buffer.from(`${lastProof}${proof}`).toString('base64');
    const guessHash = crypto.createHash('sha256').update(guess).digest('hex');
    return guessHash.substr(0, 4) === '0000';
  }
}

module.exports = Blockchain;
