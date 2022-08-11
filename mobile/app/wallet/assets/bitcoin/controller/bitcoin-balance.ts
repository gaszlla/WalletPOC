import { Address, Balance, CoinTypeAccount } from "wallet/types/wallet";
import { BitcoinService } from "../../../../../packages/blockchain-api-client/src";
import { BitcoinProvider } from "../../../../../packages/blockchain-api-client/src/blockchains/bitcoin/bitcoin-factory";
import { BitcoinToSatoshis } from "./bitcoin-utils";

/**
 * Calculates and returns the balance from an whole account
 * (could be changed to a batched api call)
 * @param account
 * @param refresh
 * @returns
 */
export const getBalanceFromAccount = async (account: CoinTypeAccount, refresh?: boolean): Promise<Balance> => {
  let balance: Balance = { incoming: 0, outgoing: 0 };
  for (const address of account.external.addresses) {
    balance = await addToBalance(address, balance);
  }
  for (const address of account.internal.addresses) {
    balance = await addToBalance(address, balance);
  }
  return balance;
};

/**
 * Returns the balance from an address from the api
 * @param address
 * @returns
 */
export const getBalanceFromAddress = async (address: string): Promise<Balance> => {
  const bitcoinService = new BitcoinService("TEST");
  return bitcoinService.getBalance(address, BitcoinProvider.TATUM);
};

/**
 * Adds balance of address to balance object
 * @param address
 * @param balance
 * @returns
 */
const addToBalance = async (address: Address, balance: Balance): Promise<Balance> => {
  const newBalance: Balance = { incoming: 0, outgoing: 0 };
  const addressBalance = await getBalanceFromAddress(address.address);
  newBalance.incoming = Number(balance.incoming) + Number(BitcoinToSatoshis(addressBalance.incoming));
  newBalance.outgoing = Number(balance.outgoing) + Number(BitcoinToSatoshis(addressBalance.outgoing));
  return newBalance;
};
