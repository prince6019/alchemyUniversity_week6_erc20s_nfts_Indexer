// --internal import
import React from "react";
import styles from "./HomePage.module.css";
import { useState } from "react";

import ReactLoading from "react-loading";

const HomePage = ({ alchemy }) => {
  const [tokensData, setTokensData] = useState([]);
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // vitalik buterin's Wallet address
    // const address = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
    setLoading(true);
    const balances = await alchemy.core.getTokenBalances(walletAddress);
    const nonZeroBalances = balances.tokenBalances.filter((token) => {
      return (
        token.tokenBalance !=
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      );
    });

    for (let token of nonZeroBalances) {
      let balance = token.tokenBalance;
      const metadata = await alchemy.core.getTokenMetadata(
        token.contractAddress
      );
      // Compute token balance in human-readable format
      balance = balance / Math.pow(10, metadata.decimals);
      balance = balance.toFixed(); // Loop through all tokens with non-zero balance

      setTokensData((prevdata) => [
        ...prevdata,
        { symbol: metadata.symbol, balance: balance, name: metadata.name },
      ]);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setWalletAddress(e.target.value);
  };

  return (
    <div className={styles.home}>
      <div className={styles.home_container}>
        <h1>Enter the Wallet Address</h1>
        <h4>Get the all Erc-20s tokens of this address</h4>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter wallet address"
            value={walletAddress}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className={styles.button}
            disabled={tokensData.length !== 0 ? true : false}
          >
            Get Token Balance
          </button>
        </form>
        {loading && (
          <ReactLoading
            type="balls"
            color="#0E131F"
            height={"10%"}
            width={"10%"}
            className={styles.reactloading}
          />
        )}
        <div className={styles.home_container_tokenlist}>
          {tokensData.length !== 0 && (
            <div className={styles.home_token_heading}>
              <p>name</p>
              <p>symbol</p>
              <p>balance</p>
            </div>
          )}
          {tokensData.map((token, i) => {
            return (
              <div className={styles.home_container_tokenlist_token} key={i}>
                <p className={styles.tokenname}>{token.name}</p>
                <p className={styles.tokensymbol}>{token.symbol}</p>
                <p className={styles.tokenbalance}>{token.balance}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
