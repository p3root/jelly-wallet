import 'package:defi_wallet/helpers/history_new.dart';
import 'package:defi_wallet/models/balance_model.dart';
import 'package:defi_wallet/models/history_model.dart';
import 'package:flutter/material.dart';
import 'address_model.dart';

class AccountModel {
  @required int? index;
  List<AddressModel>? addressList;
  List<BalanceModel>? balanceList;
  List<HistoryNew>? historyList;
  List<HistoryModel>? testnetHistoryList;
  String? transactionNext;
  String? historyNext;
  String? activeToken;
  String? name;

  AccountModel({
    this.index,
    this.addressList,
    this.balanceList,
    this.historyList,
    this.testnetHistoryList,
    this.transactionNext,
    this.historyNext,
    this.activeToken,
  }){
    this.name = 'Account ${this.index! + 1}';
  }

  AccountModel.fromJson(Map<String, dynamic> jsonModel) {
    this.index = jsonModel["index"];
    this.name = jsonModel["name"];
    this.activeToken = jsonModel["activeToken"];

    List<AddressModel> addressList = [];
    jsonModel["addressList"]
        .map((data) => addressList.add(AddressModel.fromJson(data)))
        .toList();

    this.addressList = addressList;

    List<BalanceModel> balanceList = [];

    jsonModel["balanceList"]
        .map((data) => balanceList.add(BalanceModel.fromJson(data)))
        .toList();
    this.balanceList = balanceList;

    List<HistoryNew> historyList = [];
    jsonModel["historyList"]
        .map((data) => historyList.add(HistoryNew.fromJson(data)))
        .toList();

    this.historyList = historyList;

    List<HistoryModel> testnetHistoryList = [];
    jsonModel["testnetHistoryList"]
        .map((data) => testnetHistoryList.add(HistoryModel.fromJson(data)))
        .toList();

    this.testnetHistoryList = testnetHistoryList;
  }

  String getActiveAddress({required bool isChange}) {
    return this.addressList!.first.address!;
  }
  AddressModel getActiveAddressModel({required bool isChange}) {
    return this.addressList!.first;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data["index"] = this.index;
    data["activeToken"] = this.activeToken;
    data["name"] = this.name;
    data['addressList'] = this.addressList?.map((e) => e.toJson()).toList();
    data['balanceList'] = this.balanceList?.map((e) => e.toJson()).toList();
    data['historyList'] = this.historyList?.map((e) => e.toJson()).toList();
    data['testnetHistoryList'] = this.testnetHistoryList?.map((e) => e.toJson()).toList();
    return data;
  }
}
