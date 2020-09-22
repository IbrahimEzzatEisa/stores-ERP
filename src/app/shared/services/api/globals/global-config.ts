
export const BaseURL = "http://storeswebapi.taj-it.com";
export const API_URL = BaseURL+'/api';

export class END_POINTS {
    public static branches = API_URL+'/Branches';
    public static suppliers = API_URL+'/Suppliers';
    public static storeTypes = API_URL+'/StoreTypes';
    public static storeSections = API_URL+'/StoreSections';
    public static units = API_URL+'/Units';
    public static itemTypes = API_URL+'/ItemTypes';
    public static itemStates = API_URL+'/ItemStates';
    public static Specifications = API_URL+'/Specifications';
    public static Recommendation = API_URL+'/Recommendations';
    public static employees = API_URL+'/Employees';
    public static stores = API_URL+'/Stores';
    public static itemGroups = API_URL+'/ItemGroups';
    public static users = API_URL+'/Users';
    public static storeKeepers = API_URL+'/StoreKeepers';
    public static settings = API_URL+'/Settings';
    public static menuDropDown = API_URL+"/Menus";
    public static workPlaces = API_URL+'/WorkPlaces';
    public static stockTakingTypes = API_URL+"/StockTakingTypes";
    public static items = API_URL+"/Items";
    public static usersPerms = API_URL+"/UsersPerms";
    public static StoresTrxes = API_URL+"/StoresTrxes";
    public static StoresTrxItems = API_URL+"/StoresTrxItems";
    public static orders = API_URL + "/Orders";
    public static ordersItems = API_URL + "/OrdersItems";
    public static MngrOrders=API_URL+"/MngrOrders";
    public static MngrOrdersItems=API_URL+"/MngrOrdersItems";
    public static stockTakingTrxes = API_URL+"/StockTakingTrxes";
    public static stockTakingTrxItems = API_URL+"/StockTakingTrxItems";
    public static CustodyTrxes = API_URL+"/CustodyTrxes";
    public static CustodyTrxesItems = API_URL+"/CustodyTrxItems";
    public static MeasureUnitsReport = API_URL+"/Reports/MeasureUnitsReport";
    public static ItemsDataReport = API_URL+"/Reports/ItemsDataReport";
    public static ItemCardReport = API_URL+"/Reports/ItemCardReport";
    public static ItemCardCReport = API_URL+"/Reports/ItemCardCReport";
    public static ReturnItemDataReport = API_URL+"/Reports/ItemsReportRetReport";
    public static SuppliersReport = API_URL+"/Reports/SuppliersReport";
    public static TrxTypesReport = API_URL+"/Reports/TrxTypesReport";
    public static EmpCustodyReport = API_URL+"/Reports/EmpCustodyReport";
    public static ReceiveNoteReport = API_URL+"/Reports/ReceiveNoteReport";
    public static ReceiveRecordReport = API_URL+"/Reports/ReceiveRecordReport";
    public static ItemOutOrderReport = API_URL+"/Reports/ItemOutOrderReport";
    public static TempReceiveNotificationReport = API_URL+"/Reports/TempReceiveNotificationReport";
    public static TransferCustodyReport = API_URL+"/Reports/TransferCustodyReport";
    public static ReturnDocumentReport = API_URL+"/Reports/ReturnDocumentReport";
    
    public static StoreItemsBalanceReport = API_URL+"/Reports/StoreItemsBalanceReport";
    public static StoreKeepersReport = API_URL+"/Reports/StoreKeepersReport";
    public static StoreReport = API_URL+"/Reports/StoreReport";
    public static WorkPlacesReport = API_URL+"/Reports/WorkPlacesReport";


}

export const SYSTEM_ID = 10;

