export enum ObjectStatus {
    nochange = 1,
    created = 2,
    changed = 3,
    deleted = 4,
}

export enum TrxTypeIds {
    openingBalance = 0,
    receiveNote = 4,
    recieveRecord = 5,
    itemOutOrder = 106,
    damagedSettlement=116,
    returnDocument=8,
    transferCustody=108,
    tempReceiveNotification=3,
}

export enum permissionsTypes {
    open = 0,
    read = 1,
    insert = 2,
    update = 3,
    delete = 4,
    print = 5,
}

export enum CustodyTypes {
    register = 1,
    transfere = 100
}