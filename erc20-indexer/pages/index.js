import { Alchemy, Network } from "alchemy-sdk";

// internal import-------
import styles from "@/styles/index.module.css";
import Wallet from "@/components/Wallet/Wallet";
import HomePage from "@/components/Home/HomePage";

const config = {
  apiKey: "JMNm-wz06jVXXLqOxf4tNkk9afrZFzCF",
  network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(config);

export default function Home() {
  return (
    <div className={styles.home}>
      <h1>
        This app provides tokens details for SEPOLIA testnet. So please connect
        to it
      </h1>
      <div className={styles.home_container}>
        <HomePage alchemy={alchemy} />
        <Wallet alchemy={alchemy} />
      </div>
    </div>
  );
}
