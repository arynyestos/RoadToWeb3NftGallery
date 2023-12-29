"use client";
import { useState, useEffect } from 'react'
import { Network } from 'alchemy-sdk';
import { NFTCard } from './components/nftCard';

export default function Home() {

  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [fetchedNFTs, setFetchedNFTs] = useState([]);
  const [displayedNFTs, setDisplayedNFTs] = useState([]);
  const [fetchCollection, setFetchCollection] = useState(false);
  const [network, setNetwork] = useState(Network.ETH_MAINNET);
  const networkNames = {
    [Network.ETH_MAINNET]: 'Ethereum',
    [Network.ETH_SEPOLIA]: 'Sepolia',
    [Network.MATIC_MAINNET]: 'Polygon',
    [Network.ARB_MAINNET]: 'Arbitrum',
    [Network.OPT_MAINNET]: 'Optimism',
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [nftsPerPage, setNftsPerPage] = useState(16);
  const [totalPages, setTotalPages] = useState(0);
  const [totalNftCount, setTotalNftCount] = useState(0);
  const handleNetworkChange = (event) => {
    setNetwork(event.target.value);
    setNftsRefetched(false);
  };
  const [fetchingNfts, setFetchingNfts] = useState(false);
  const [nftsRefetched, setNftsRefetched] = useState(false);
  const maxPageButtons = 20; // Maximum number of buttons to show
  // Calculate the start and end index for the visible buttons
  const startPage = Math.max(1, Math.min(currentPage - Math.floor(maxPageButtons / 2), totalPages - maxPageButtons + 1));
  const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);


  useEffect(() => {
    console.log("Fetched NFTs", fetchedNFTs)
    const startIndex = (currentPage - 1) * nftsPerPage;
    const endIndex = currentPage * nftsPerPage;
    setDisplayedNFTs(fetchedNFTs.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(fetchedNFTs.length / nftsPerPage));
  }, [fetchedNFTs, currentPage]);

  const fetchNFTs = async () => {
    let ownedNfts, pageKey, totalCount;
    console.log("fetching nfts");
    const api_key = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
    const baseURL = `https://${network}.g.alchemy.com/v2/${api_key}/getNFTs/`;
    const requestOptions = {
      method: 'GET'
    };

    if (!collection.length) {
      let fetchURL = `${baseURL}?owner=${wallet}`;
      setFetchingNfts(true);
      ({ ownedNfts, pageKey, totalCount } = await fetch(fetchURL, requestOptions).then(data => data.json()));
      while (pageKey) {
        console.log(`Fetching additional NFTs for pageKey ${pageKey}`);
        fetchURL = `${baseURL}?owner=${wallet}&pageKey=${encodeURIComponent(pageKey)}`;
        const additionalNfts = await fetch(fetchURL, requestOptions).then(data => data.json())
        ownedNfts = [...ownedNfts, ...additionalNfts.ownedNfts];
        pageKey = additionalNfts.pageKey;
      }
    } else {
      console.log("fetching nfts for collection owned by address")
      let fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      setFetchingNfts(true);
      ({ ownedNfts, pageKey, totalCount } = await fetch(fetchURL, requestOptions).then(data => data.json()));
      while (pageKey) {
        console.log(`Fetching additional NFTs for pageKey ${pageKey}`);
        fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}&pageKey=${encodeURIComponent(pageKey)}`;
        const additionalNfts = await fetch(fetchURL, requestOptions).then(data => data.json())
        ownedNfts = [...ownedNfts, ...additionalNfts.ownedNfts];
        pageKey = additionalNfts.pageKey;
      }
    }

    if (ownedNfts) {
      console.log("nfts:", ownedNfts);
      setFetchedNFTs(ownedNfts);
      setTotalNftCount(totalCount);
      setFetchingNfts(false);
      setNftsRefetched(true);
      setCurrentPage(1);
    }
  }

  const fetchWholeNftCollection = async () => {
    if (collection.length) {
      let nfts, nextToken;
      const requestOptions = {
        method: 'GET'
      };
      const api_key = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
      const baseURL = `https://${network}.g.alchemy.com/v2/${api_key}/getNFTsForCollection/`;
      let fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=true`;
      setFetchingNfts(true);
      ({ nfts, nextToken } = await fetch(fetchURL, requestOptions).then(data => data.json()));
      while (nextToken) {
        console.log(`Fetching additional NFTs for nextToken ${nextToken}`);
        fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=true&startToken=${encodeURIComponent(nextToken)}`;
        const additionalNfts = await fetch(fetchURL, requestOptions).then(data => data.json())
        nfts = [...nfts, ...additionalNfts.nfts];
        nextToken = additionalNfts.nextToken;
      }
      if (nfts) {
        console.log("NFTs in collection:", nfts);
        setFetchedNFTs(nfts);
        setFetchingNfts(false);
        setNftsRefetched(true);
        setCurrentPage(1);
      }
    }
  }

  const goToPreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const handleWalletAddressChange = (address) => {
    setWalletAddress(address);
    setNftsRefetched(false);
  }

  const handleCollectionAddressChange = (address) => {
    setCollectionAddress(address);
    setNftsRefetched(false);
  }

  return (
    <main className="flex flex-col items-center justify-center py-8 gap-y-3">
      <h1 className="text-6xl text-gray-800 font-bold mb-6">NFT Gallery</h1>
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input
          disabled={fetchCollection}
          className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-200 disabled:text-gray-50"
          onChange={(e) => { handleWalletAddressChange(e.target.value) }} value={wallet} type={"text"} placeholder="Input wallet address">
        </input>
        <input
          className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-200 disabled:text-gray-50"
          onChange={(e) => { handleCollectionAddressChange(e.target.value) }} value={collection} type={"text"} placeholder="Input collection address">
        </input>
        <div>
          <select value={network} onChange={handleNetworkChange}
            className="disabled:bg-slate-500 text-black bg-gray-300 px-4 py-2 mt-3 mr-5 rounded-sm w-1/10">
            <option value={Network.ETH_MAINNET}>Ethereum</option>
            <option value={Network.ETH_SEPOLIA}>Sepolia</option>
            <option value={Network.MATIC_MAINNET}>Polygon</option>
            <option value={Network.ARB_MAINNET}>Arbitrum</option>
            <option value={Network.OPT_MAINNET}>Optimism</option>
          </select>
          <label className='text-gray-600'>
            Fetch whole collection
            <input className="ml-2" type="checkbox" onChange={(e) => { setFetchCollection(e.target.checked) }}></input>
          </label>
        </div>
        <button disabled={!wallet && !fetchCollection}
          className="disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/6"
          onClick={
            () => {
              if (fetchCollection) {
                fetchWholeNftCollection();
              } else {
                fetchNFTs();
              }
            }
          }>Fetch NFTs! </button>
      </div>
      <div>
        {fetchingNfts ? (
          <p>Loading NFTs...</p>
        ) : (
          <>
            {nftsRefetched && totalNftCount && !collection && !fetchCollection ? (
              <p className='mt-2'>
                Address {wallet.slice(0, 6)}...{wallet.slice(-4)} contains {totalNftCount} NFTs on the {networkNames[network]} network!
              </p>
            ) : null}

            {nftsRefetched && totalNftCount && collection && !fetchCollection ? (
              <p>
                Address {wallet.slice(0, 6)}...{wallet.slice(-4)} contains {totalNftCount} NFTs on the {networkNames[network]} network for collection {collection.slice(0, 6)}...{collection.slice(-4)}!
              </p>
            ) : null}

            {nftsRefetched && fetchCollection && collection ? (
              <p>
                Collection {collection.slice(0, 6)}...{collection.slice(-4)} has a total supply of {fetchedNFTs.length} NFTs!
              </p>
            ) : null}
          </>
        )}
      </div>

      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-5 justify-center'>
        {
          displayedNFTs.length && displayedNFTs.map(nft => {
            return (
              <NFTCard nft={nft} />
            )
          })
        }
        {/* {
          displayedNFTs.length ? <NFTCard nft={displayedNFTs[5]} /> : null
        } */}

      </div>

      {/* Pagination buttons and page numbers */}
      {totalPages > 1 && (
        <div className="flex items-center mt-10">
          <button
            disabled={currentPage === 1}
            onClick={() => goToPage(1)}
            className="mr-2 px-3 py-1 rounded bg-blue-400 text-white"
          >
            First
          </button>
          <button
            disabled={currentPage === 1}
            onClick={goToPreviousPage}
            className="mr-2 px-3 py-1 rounded bg-blue-400 text-white"
          >
            Prev.
          </button>

          {/* Display page numbers */}
          {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
            <button
              key={startPage + index}
              onClick={() => goToPage(startPage + index)}
              className={`px-3 py-1 rounded ${currentPage === startPage + index ? 'bg-blue-400 text-white' : 'bg-gray-200 text-gray-700'}`}
              disabled={currentPage === startPage + index}
            >
              {startPage + index}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={goToNextPage}
            className="ml-2 px-3 py-1 rounded bg-blue-400 text-white"
          >
            Next
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => goToPage(totalPages)}
            className="ml-2 px-3 py-1 rounded bg-blue-400 text-white"
          >
            Last
          </button>
        </div>
      )}

    </main>
  )
}