// internal import -------
import React from "react";
import styles from "./Wallet.module.css";
import { useState } from "react";

import {
  useMetamask,
  useAddress,
  useConnectionStatus,
  useDisconnect,
} from "@thirdweb-dev/react";

const Wallet = ({ alchemy }) => {
  const [walletData, setWalletData] = useState([]);
  const [loading, setLoading] = useState(false);

  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const connectionStatus = useConnectionStatus();
  const disconnect = useDisconnect();

  const handleClick = async () => {
    if (connectionStatus === "connected") {
      disconnect();
    } else if (connectionStatus === "disconnected") {
      connectWithMetamask();
    }
  };

  const handleWallet = async () => {
    if (walletData.length > 0) {
      return;
    }
    setLoading(true);
    console.log(address);
    const balances = await alchemy.core.getTokenBalances(address);
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

      setWalletData((prevdata) => [
        ...prevdata,
        { symbol: metadata.symbol, balance: balance, name: metadata.name },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className={styles.wallet}>
      <div className={styles.wallet_container}>
        <div className={styles.wallet_box}>
          <h1>Your Wallet</h1>
          <h3>
            {address !== undefined &&
              ` ${address.slice(0, 4)}....${address.slice(-5)}`}
          </h3>
          <button
            className={styles.button}
            onClick={handleClick}
            disabled={loading}
          >
            {!address ? "Connect Metamask" : "disconnect"}
          </button>{" "}
        </div>
        <div className={styles.wallet_token_list}>
          {connectionStatus === "connected" && (
            <button
              onClick={handleWallet}
              className={styles.button_connected}
              disabled={walletData.length > 0 && true}
            >
              getTokenList
            </button>
          )}
          {connectionStatus === "connected" && (
            <>
              <div className={styles.wallet_token_heading}>
                <p>name</p>
                <p>symbol</p>
                <p>balance</p>
              </div>
              {walletData.map((token, i) => {
                return (
                  <div className={styles.wallet_tokenlist_token} key={i}>
                    <p className={styles.tokenname}>{token.name}</p>
                    <p className={styles.tokensymbol}>{token.symbol}</p>
                    <p className={styles.tokenbalance}>{token.balance}</p>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
