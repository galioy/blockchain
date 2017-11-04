# blockchain
Just a self-made implementation of a Blockchain, with the purpose to understand how things work under the hood... :)

# API

#### Get the blockchain of the current node
Returns the Blockchain of the current node.

*Request:*
`GET /chain`

*Response:*

```json
{
    "chain": [
        {
            "index": 1,
            "timestamp": 1509811828046,
            "transactions": [],
            "proof": 100,
            "previousHash": 1
        },
        {
            "index": 2,
            "timestamp": 1509811857403,
            "transactions": [
                {
                    "sender": "cfd49fee-dd0b-47a3-b7b4-b0bff0f12fcf",
                    "recipient": "cfd49fee-as6d-47jk-23b4-ua4o60f12fcf",
                    "amount": 5
                },
                {
                    "sender": "0",
                    "recipient": "c8968a3e-dac8-4c35-b1bb-be1a594b2ad5",
                    "amount": 1
                }
            ],
            "proof": 40545,
            "previousHash": "951ee32d76e9e671da00539d7263c52c5553b905f4e0508bca11c0eb50947254"
        }
    ],
    "length": 2
}
```

#### Create a new transaction
Registers a new transaction in the current node's Blockchain, that will be added to the next mined block.

*Request:*
`POST /transactions/new`

```json
{
	"sender": "cfd49fee-dd0b-47a3-b7b4-b0bff0f12fcf",
	"recipient": "cfd49fee-as6d-47jk-23b4-ua4o60f12fcf",
	"amount": 5
}
```

*Response:*

```json
"New transaction will be added to block 2"
```

#### Mine a new block
Mines a new block in the current node's Blockchain.

*Request:*
`GET /mine`

*Response:*

```json
{
    "message": "New Block forged.",
    "index": 2,
    "transactions": [
        {
            "sender": "cfd49fee-dd0b-47a3-b7b4-b0bff0f12fcf",
            "recipient": "cfd49fee-as6d-47jk-23b4-ua4o60f12fcf",
            "amount": 5
        },
        {
            "sender": "0",
            "recipient": "c8968a3e-dac8-4c35-b1bb-be1a594b2ad5",
            "amount": 1
        }
    ],
    "proof": 40545,
    "previousHash": "951ee32d76e9e671da00539d7263c52c5553b905f4e0508bca11c0eb50947254"
}
```

#### Register a new node
Registers a new node (obviously...).

NOTE: You have to have another server instance running for each node.
Pass the URL + port of the instance.

*Request:*
`POST /nodes/register`

```json
{
	"nodes": [
		"http://127.0.0.1:3001"
	]
}
```

*Response:*

```json
{
    "message": "New nodes have been added",
    "nodes": [
        "127.0.0.1:3001"
    ]
}
```

#### Resolve the nodes' blockchains
The node with the longest Blockchain is the authoritative.

*Request:*
`GET /nodes/resolve`

*Response:*

If our chain was shorter:

```json
{
    "message": "Our chain was replaced",
    "newChain": [
        // the blocks of the Blockchain as objects
    ]
}
```

If our chain was longer:

```json
{
    "message": "Our chain is authoritative",
    "chain": [
        // the blocks of the Blockchain as objects
    ]
}
```

