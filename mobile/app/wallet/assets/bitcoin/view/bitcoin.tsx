import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BitcoinAccountBuilder } from "bitcoin/controller/creation/bitcoin-account-creation";
import { getUsedAddresses } from "bitcoin/controller/creation/bitcoin-transaction-scanning";
import { BitcoinWalletsState, bitcoinWalletsState } from "bitcoin/state/bitcoin-atoms";
import React, { useCallback, useEffect } from "react";
import { Button } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
import { NavigationRoutes } from "shared/types/navigation";
import { getPurposeWallet } from "state/utils";
import { useAddAddress } from "wallet/state/wallet-state-utils";
import Wallets from "wallet/view/generic-wallet-view";
import BitcoinWalletListView from "./list/bitcoin-wallet-list";
import { BitcoinBalance } from "./list/item/bitcoin-wallet-balance";

type Props = NativeStackScreenProps<NavigationRoutes, "Bitcoin">;

const Bitcoin = ({ route, navigation }: Props) => {
  const [bitcoinState, setBitcoin] = useRecoilState<BitcoinWalletsState>(bitcoinWalletsState);
  const setAddAddress = useAddAddress(bitcoinWalletsState);
  const purposeKeyShare = useRecoilValue(getPurposeWallet);

  const { isStateEmpty, user } = route.params;

  useEffect(() => {
    const onOpen = async () => {
      if (bitcoinState.accounts.length > 0 || !isStateEmpty) return;

      const accountBuilder = new BitcoinAccountBuilder(user);

      const newState = await accountBuilder
        .init()
        .then((builder) => builder.useCoinTypeShare(purposeKeyShare, bitcoinState.coinTypeKeyShare))
        .then((builder) => builder.createAccount(false))
        .then((builder) => builder.createChange("internal"))
        .then((builder) => builder.createChange("external"))
        .then((builder) => builder.build());

      setBitcoin(() => newState as BitcoinWalletsState);
      await loadUsedAddresses(newState);
      //TODO also load balances here
    };

    onOpen();
  }, []);

  const deleteBitcoinAccount = useCallback(() => {
    setBitcoin((current) => ({ ...current, accounts: [] }));
  }, [setBitcoin]);

  const loadUsedAddresses = async (state: any) => {
    setAddAddress(await getUsedAddresses(user, state.accounts[0], "external"), state.accounts[0], "external");
    setAddAddress(await getUsedAddresses(user, state.accounts[0], "internal"), state.accounts[0], "internal");
  };

  return (
    <Wallets name="Bitcoin">
      {bitcoinState.accounts[0] && (
        <>
          <BitcoinBalance wallet={bitcoinState.accounts[0]}></BitcoinBalance>

          <Button
            onPress={() =>
              navigation.navigate("BitcoinTransactions", {
                account: bitcoinState.accounts[0],
              })
            }
            title="Show transactions"
          />

          <Button
            onPress={() =>
              navigation.navigate("SendTransaction", {
                account: bitcoinState.accounts[0],
              })
            }
            title="New transaction"
          />

          <BitcoinWalletListView
            wallets={bitcoinState.accounts}
            virtualAccount={bitcoinState.accounts[0]?.virtualAccount!}
          />
          <Button onPress={deleteBitcoinAccount} title="Delete Bitcoin Account" />
        </>
      )}
    </Wallets>
  );
};

export default Bitcoin;
