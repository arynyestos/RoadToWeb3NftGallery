# NFT Gallery

On this project we created an NFT gallery with Next.js and Tailwind that can display all the NFTs owned by a wallet, filter by collection or fetch all the NFTs of a collection. Also, it allows for searching on five different networks, Ethereum, Sepolia, Polygon, Arbitrum and Optimism. It also has a very slick pagination system. The full walkthrough can be found [here](https://docs.alchemy.com/docs/how-to-create-an-nft-gallery), however, several improvements were made that can only be seen in the code in this repo, such as video support for the NFTs' metadata, placeholders for NFTs with no image, same size for all NFT cards, etc. Check out the video demo below!

## Demo

Below you can see a video demo of the developed app, featuring all its functionalities. First, we searched for the address of a user, getting all of their NFTs, then, we filtered by collection, getting that user's Bored Ape. Then, we searched for the whole Bored Ape collection, and while it was getting fetched, searched for the NFTs in my on-chain CV address, which contains Alchemy's early access and ceritificate for the Ethereum Developer Bootcamp, which have mp4 metadata, to showcase video support, then, we searched for my dev address NFTs, showing all the badges for Patrick Collins' Foundry course, as well as the NFT created for the first project of the Road to Web 3 program. Finally, we went back to the first tab, to see the full Bored Ape Yacht Club collection being displayed in our app.

https://github.com/arynyestos/RoadToWeb3NftGallery/assets/33223441/d888931d-3535-46c6-9b74-f5bea9f8fc85

## Future improvements
Many future improvements are possible, such as:

- Wallet connectivity: giving users the possibility to connect their wallets and search the NFTs they own.
- ENS support: being able to search by ENS instead of address would be a convenient feature.
- Cache: keeping in cache the fetched NFTs so that they don't need to be refetched if the users wants to see them again within the same session.
