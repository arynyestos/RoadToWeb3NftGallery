import { useState } from 'react';
import { isNftVideo } from '../utils/isNftVideo';

export const NFTCard = ({ nft }) => {

    const [copySuccess, setCopySuccess] = useState(false);
    const copyToClipboard = () => {
        navigator.clipboard.writeText(nft.contract.address)
            .then(() => {
                setCopySuccess(true);
                setTimeout(() => {
                    setCopySuccess(false);
                }, 3000);
            })
            .catch(err => console.error('Failed to copy:', err));
    };
    const metaDataURL = nft.metadata.image;
    const isIpfsUrl = metaDataURL && metaDataURL.startsWith('ipfs://');
    const url = isIpfsUrl ? `https://ipfs.io/ipfs/${metaDataURL.slice(7)}` : metaDataURL;
    // const isVideo = isNftVideo(url);
    const [isVideo, setIsVideo] = useState(false);
    const checkIfVideo = async () => {
        const isNftVideoResult = await isNftVideo(url);
        setIsVideo(isNftVideoResult);
    };
    if (url) checkIfVideo();

    return (
        <div className="w-[19vw] flex flex-col">
            <div className="rounded-md">
                {/* <img className="object-cover h-128 w-full rounded-t-md" src={nft.media[0].gateway} ></img> */}
                {isIpfsUrl ? (
                    // Render IPFS image or video
                    isVideo ? (
                        <video className="object-cover w-full md:aspect-square rounded-t-md"
                            src={`/https://ipfs.io/ipfs/${metaDataURL.slice(7)}`} controls autoPlay loop />
                    ) : (
                        <img className="object-contain w-full md:aspect-square rounded-t-md"
                            src={`https://ipfs.io/ipfs/${metaDataURL.slice(7)}`}
                            alt="Image"
                        />
                    )
                ) : (
                    // Render HTTPS image or video   
                    isVideo ? (
                        <video className="object-cover w-full md:aspect-square rounded-t-md"
                            src={`${metaDataURL}` || 'https://via.placeholder.com/200'} controls autoPlay loop />
                    ) : (
                        <img className="object-contain w-full md:aspect-square rounded-t-md"
                            src={metaDataURL || 'https://via.placeholder.com/200'}
                            alt="Image"
                        />
                    )
                )}
                {/* <img className="object-cover h-128 w-full rounded-t-md" src={isNftVideo(nft.metadata.image) ? : nft.metadata.image} ></img> */}
            </div>

            <div className="flex flex-col y-gap-2 px-2 py-3 bg-slate-100 rounded-b-md h-110 ">
                <div className="">
                    {nft.title ? (
                        <h2 className="text-xl text-gray-800 h-8 overflow-hidden">
                            {nft.title}
                        </h2>
                    ) : (
                        <h2 className="text-xl text-gray-800 h-8 overflow-hidden">
                            NO TITLE TO DISPLAY
                        </h2>
                    )
                    }
                    <p className="text-gray-600">Id: {nft.id.tokenId.substr(nft.id.tokenId.length - 4)}</p>
                    <a className="text-gray-600" >
                        {
                            `${nft.contract.address.substr(0, 6)}........${nft.contract.address.substr(nft.contract.address.length - 4)}`
                        }
                    </a>
                    <button
                        onClick={copyToClipboard}
                        className="ml-2 p-1 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none"
                        title="Copy contract address to clipboard"
                    >
                        {copySuccess ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <div className="flex-grow mt-2 h-20 overflow-hidden">
                    {nft.description ? (
                        <p className="text-gray-600">
                            {
                                nft.description?.length > 50 ? `${nft.description?.substr(0, 60)}...` : nft.description
                            }
                        </p>) : (
                        <p className="text-gray-600">
                            No description available.
                        </p>
                    )}
                </div>
                <div className="flex justify-between mb-1">
                    <label className="justify-left">View on Etherscan:</label>
                    <a className="py-1 px-4 bg-blue-500 text-center rounded-lg text-white cursor-pointer hover:bg-blue-600"
                        target={"_blank"} href={`https://etherscan.io/token/${nft.contract.address}`}>
                        Collection
                    </a>
                    <a className="py-1 px-3 bg-blue-500 text-center rounded-lg text-white cursor-pointer hover:bg-blue-600"
                        target={"_blank"} href={`https://etherscan.io/nft/${nft.contract.address}/${parseInt(nft.id.tokenId, 16)}`}>
                        NFT
                    </a>
                </div >
                <div className="flex justify-center mb-1">
                </div >
            </div >
        </div >
    )
}