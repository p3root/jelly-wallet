import "core-js/actual";
import { listen } from "@ledgerhq/logs";
import AppDfi from "hw-app-dfi";

import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import SpeculosTransport from "hw-transport-node-speculos-http";

import {
  bitcoin,
  testnet,
  defichain,
  defichain_testnet,
} from "defichainjs-lib/src/networks";

import { SignP2SHTransactionArg } from "hw-app-dfi/lib/signP2SHTransaction";

import { serializeTransaction } from "hw-app-dfi/lib/serializeTransaction";
import { Transaction, TransactionInput, TransactionOutput } from "hw-app-dfi/lib/types";
import { LedgerTransaction, LedgerTransactionRaw } from "./ledger_tx";
import * as defichainlib from "defichainjs-lib";
import { buffer } from "stream/consumers";
import { crypto } from "bitcoinjs-lib";

export class JellyWalletLedger {

  async appLedgerDefichain(): Promise<AppDfi> {
    const transport = await SpeculosTransport.open({ baseURL: "172.18.49.126:5000" });
    // const transport = await TransportWebUSB.create();

    listen((log) => console.log(log));

    const btc = new AppDfi(transport);
    return btc;
  }

  public async signMessageLedger(path: string, message: string) {
    try {

      const appBtc = await this.appLedgerDefichain();
      var result = await appBtc.signMessageNew(path, Buffer.from(message).toString("hex"));
      var v = result['v'] + 27 + 4;
      var signature = Buffer.from(v.toString(16) + result['r'] + result['s'], 'hex').toString('base64');
      return signature;
    }
    catch (e) {
      console.log(e);
      return null;
    }
  }

  public async getAddress(path: string, verify: boolean) {
    try {

      const appBtc = await this.appLedgerDefichain();
      const address = await appBtc.getWalletPublicKey(path, {
        verify: verify,
        format: "bech32",
      });
      console.log(address);
      return address;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  public async signTransactionRaw(transaction: LedgerTransactionRaw[], paths: string[], newTx: string, networkStr: string, changePath: string): Promise<string> {
    const ledger = await this.appLedgerDefichain();
    const splitNewTx = await ledger.splitTransaction(newTx, true);
    const outputScriptHex = await ledger.serializeTransactionOutputs(splitNewTx).toString("hex");

    var inputs: Array<
      [Transaction, number, string | null | undefined, number | null | undefined]
    > = [];

    for (var tx of transaction) {
      var ledgerTransaction = await ledger.splitTransaction(tx.rawTx, true);

      inputs.push([ledgerTransaction, tx.index, tx.redeemScript, void 0]);
    }

    const txOut = await ledger.createPaymentTransactionNew({
      inputs: inputs,
      associatedKeysets: paths,
      outputScriptHex: outputScriptHex,
      segwit: true,
      additionals: ["bech32"],
      transactionVersion: 2,
      lockTime: 0,
      useTrustedInputForSegwit: true
    });

    return txOut;
  }
}


