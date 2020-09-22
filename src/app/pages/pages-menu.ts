import { PERMISSIONS } from 'src/app/shared/services/permissions-service';

export interface PagesMenu {
    path?: string;
    isLink?: boolean;
    dontHaveChildren?: boolean;
    data?: {
        title?: string;
        icon?: string;
        permissionName?: number;
        children?: PagesMenu[];
    }
}

export const PagesMenu: PagesMenu[] = [
    {
        path: 'pages',
        data: {
            children: [
                 {
                    path: '',
                    isLink: true,
                    dontHaveChildren: true,
                    data: {
                        title: 'الرئيسية',
                        icon: 'fa fa-home'
                    }
                }, 
                {
                    data: {
                        title: 'الأكواد الرئيسية',
                        icon: 'fas fa-layer-group',
                        children: [
                            {
                                path: 'main-codes/branches',
                                data: {
                                    title: 'الإدارات الداخلية',
                                    icon: 'fas fa-indent',
                                    permissionName: PERMISSIONS.branches
                                }
                            }, {
                                path: 'main-codes/suppliers',
                                data: {
                                    title: 'بيانات الموردين',
                                    icon: 'fas fa-user-secret',
                                    permissionName: PERMISSIONS.suppliers
                                }
                            }, {
                                path: 'main-codes/store-types',
                                data: {
                                    title: 'تصنيف المستودعات',
                                    icon: 'fas fa-align-center',
                                    permissionName: PERMISSIONS.storeTypes
                                }
                            }, {
                                path: 'main-codes/store-sections',
                                data: {
                                    title: 'أماكن التخزين',
                                    icon: 'fas fa-map',
                                    permissionName: PERMISSIONS.storeSections
                                }
                            }, {
                                path: 'main-codes/units',
                                data: {
                                    title: 'وحدات القياس',
                                    icon: 'fas fa-drafting-compass',
                                    permissionName: PERMISSIONS.units
                                }
                            }, {
                                path: 'main-codes/item-types',
                                data: {
                                    title: 'أنواع الأصناف',
                                    icon: 'fab fa-pagelines',
                                    permissionName: PERMISSIONS.itemTypes
                                }
                            },
                            {
                                path: 'main-codes/item-states',
                                data: {
                                    title: 'حالات الأصناف',
                                    icon: 'fas fa-vials',
                                    permissionName: PERMISSIONS.itemStates
                                }
                            },
                            {
                                path: 'main-codes/specifications',
                                data: {
                                    title: 'المواصفات الفنية',
                                    icon: 'fas fa-toolbox',
                                    permissionName: PERMISSIONS.specifications
                                }
                            }, {
                                path: 'main-codes/recommendations',
                                data: {
                                    title: 'توصيات لجنة فحص الرجيع',
                                    icon: 'fas fa-diagnoses',
                                    permissionName: PERMISSIONS.recommendations
                                }
                            },
                            {
                                path: 'main-codes/stock-taking-types',
                                data: {
                                    title: 'أنواع الجرد',
                                    icon: 'fas fa-grip-vertical',
                                    permissionName: PERMISSIONS.stockTakingTypes
                                }
                            }
                        ]
                    }
                }, {
                    data: {
                        title: 'المستودعات',
                        icon: 'fas fa-store-alt',
                        children: [
                            {
                                path: 'stores-info/employees',
                                data: {
                                    title: 'الموظفين',
                                    icon: 'fas fa-user-tie',
                                    permissionName: PERMISSIONS.employees
                                }
                            }, {
                                path: 'stores-info/stores',
                                data: {
                                    title: 'بيانات المستودعات',
                                    icon: 'fas fa-database',
                                    permissionName: PERMISSIONS.stores
                                }
                            },
                            {
                                path: 'stores-info/store-keepers',
                                data: {
                                    title: 'أمناء المستودعات',
                                    icon: 'fas fa-user-shield',
                                    permissionName: PERMISSIONS.storeKeepers
                                }
                            },
                            {
                                path: 'stores-info/work-places',
                                data: {
                                    title: 'مواقع وساحات العمل',
                                    icon: 'fas fa-map-marked-alt',
                                    permissionName: PERMISSIONS.workPlaces
                                }
                            }
                        ]
                    }
                }, {
                    data: {
                        title: 'الأصناف',
                        icon: 'fab fa-blackberry',
                        children: [
                            {
                                path: 'items-info/item-groups',
                                data: {
                                    title: 'مجموعات ترميز الأصناف',
                                    icon: 'far fa-object-group',
                                    permissionName: PERMISSIONS.itemGroups
                                }
                            }, {
                                path: 'items-info/items',
                                data: {
                                    title: 'بيانات الأصناف',
                                    icon: 'fas fa-holly-berry',
                                    permissionName: PERMISSIONS.items
                                }
                            }
                        ]
                    }
                }
                , {
                    data: {
                        title: 'الحركات',
                        icon: 'fas fa-object-ungroup',
                        children: [
                            {
                                path: 'movements/mngr-orders',
                                data: {
                                    title: 'طلب أصناف للقسم',
                                    icon: 'fab fa-squarespace',
                                    permissionName: PERMISSIONS.mngrOrders
                                }
                            },
                            {
                                path: 'movements/opening-balance',
                                data: {
                                    title: 'الأرصدة الافتتاحية',
                                    icon: 'fas fa-recycle',
                                    permissionName: PERMISSIONS.openingBalance
                                }
                            },
                            {
                                path: 'movements/temp-receive-notification',
                                data: {
                                    title: 'إشعار استلام مؤقت',
                                    icon: 'fab fa-atlassian',
                                    permissionName: PERMISSIONS.tempReceiveNotification
                                }
                            },
                            {
                                path: 'movements/receive-note',
                                data: {
                                    title: 'مذكرة استلام',
                                    icon: 'far fa-envelope-open',
                                    permissionName: PERMISSIONS.receiveNote
                                }
                            },
                            {
                                path: 'movements/receive-record',
                                data: {
                                    title: 'محضر استلام',
                                    icon: 'fas fa-sticky-note',
                                    permissionName: PERMISSIONS.receiveRecord
                                }
                            },
                            {
                                path: 'movements/item-out-order',
                                data: {
                                    title: 'طلب صرف مواد ',
                                    icon: 'far fa-envelope',
                                    permissionName: PERMISSIONS.itemOutOrder
                                }
                            },
                            {
                                path: 'movements/transfer-custody',
                                data: {
                                    title: 'مستند صرف رجيع ',
                                    icon: 'fas fa-file',
                                    permissionName: PERMISSIONS.transferCustody
                                }
                            }

                        ]
                    }
                },
                {
                    data: {
                        title: 'الجرد',
                        icon: 'fab fa-dropbox',
                        children: [
                            {
                                path: 'stock-taking/stock-taking-trxes',
                                data: {
                                    title: ' كشف الجرد',
                                    icon: 'fas fa-file-export',
                                    permissionName: PERMISSIONS.stockTakingTrx
                                }
                            },
                            {
                                path: 'stock-taking/damaged-settlement',
                                data: {
                                    title: 'مستند تسوية توالف',
                                    icon: 'fas fa-fill-drip',
                                    permissionName: PERMISSIONS.damagedSettlement
                                }
                            }

                        ]
                    }
                },
                {
                    data: {
                        title: 'عهد الموظفين',
                        icon: 'fas fa-user-cog',
                        children: [
                            {
                                path: 'employees-custody/custody-register',
                                data: {
                                    title: 'تسجيل عهدة',
                                    icon: 'fas fa-pencil-ruler',
                                    permissionName: PERMISSIONS.custodyTrx
                                }
                            },
                            {
                                path: 'employees-custody/custody-transfer',
                                data: {
                                    title: 'نقل عهدة',
                                    icon: 'fab fa-uber',
                                    permissionName: PERMISSIONS.custodyTransfer
                                }
                            },
                            {
                                path: 'employees-custody/return-document',
                                data: {
                                    title: 'رد عهدة',
                                    icon: 'fab fa-servicestack',
                                    permissionName: PERMISSIONS.returnDocument
                                }
                            }
                        ]
                    }
                },
                {
                    data: {
                        title: 'التقارير',
                        icon: 'fas fa-book',
                        children: [
                            {
                                isLink: false,
                                data: {
                                    title: 'تقارير الأصناف',
                                    icon: 'fas fa-window-restore',
                                    children: [
                                        {
                                            path: 'reports/items-reports/measure-units',
                                            data: {
                                                title: 'وحدات القياس',
                                                icon: 'fas fa-drafting-compass',
                                                permissionName: PERMISSIONS.measureUnitsReports
                                            }
                                        },
                                        {
                                            path: 'reports/items-reports/items-data',
                                            data: {
                                                title: 'بيانات الأصناف',
                                                icon: 'fas fa-chess-board',
                                                permissionName: PERMISSIONS.itemsReports
                                            }

                                        },

                                        {
                                            path: 'reports/items-reports/item-card',
                                            data: {
                                                title: ' بطاقة صنف ',
                                                icon: 'fas fa-vr-cardboard',
                                                permissionName: PERMISSIONS.itemCardReports
                                            }
                                        },
                                        {
                                            path: 'reports/items-reports/return-item-card',
                                            data: {
                                                title: ' بطاقة صنف رجيع',
                                                icon: 'fas fa-id-card-alt',
                                                permissionName: PERMISSIONS.returnItemCardReports
                                            }
                                        },
                                        {
                                            path: 'reports/items-reports/return-items-data-report',
                                            data: {
                                                title: 'بيانات أصناف الرجيع ',
                                                icon: 'fas fa-shopping-cart',
                                                permissionName: PERMISSIONS.returnItemsDataReport
                                            }
                                        }

                                    ]
                                }
                            },
                            {
                                isLink: false,
                                data: {
                                    title: 'تقارير المستودعات',
                                    icon: 'far fa-window-restore',
                                    children: [
                                        {
                                            path:'reports/stores-reports/store-items-balance-report',
                                            data:{
                                                title:'حصر الموجودات',
                                                icon: 'fas fa-folder-open',
                                                permissionName: PERMISSIONS.storeItemsBalanceReport
                                            }
                                        },
                                        {
                                            path:'reports/stores-reports/store-keepers-report',
                                            data:{
                                                title:'أمناء المستودعات',
                                                icon: 'fas fa-people-carry',
                                                permissionName: PERMISSIONS.storeKeepersReport
                                            }
                                        },
                                        {
                                            path:'reports/stores-reports/store-report',
                                            data:{
                                                title:' بيانات المستودعات',
                                                icon: 'fas fa-solar-panel',
                                                permissionName: PERMISSIONS.storeReport
                                            }
                                        },
                                        {
                                            path:'reports/stores-reports/work-places-report',
                                            data:{
                                                title:'مواقع وساحات العمل',
                                                icon: 'fas fa-project-diagram',
                                                permissionName: PERMISSIONS.workPlacesReport
                                            }
                                        }
                                    ]
                                }

                            },
                            {
                                isLink: false,
                                data: {
                                    title: 'تقارير الحركات',
                                    icon: 'fab fa-readme',
                                    children: [
                                        {
                                            path:'reports/movements-reports/suppliers-report',
                                            data:{
                                                title:'بيانات الموردين',
                                                icon: 'fas fa-user-friends',
                                                permissionName: PERMISSIONS.suppliersReport
                                            }
                                        },
                                        {
                                            path:'reports/movements-reports/trx-types-report',
                                            data:{
                                                title:'المراجع الإدارية',
                                                icon: 'fab fa-stack-exchange',
                                                permissionName: PERMISSIONS.trxTypesReport
                                            }
                                        },
                                        {
                                            path:'reports/movements-reports/emp-custody-report',
                                            data:{
                                                title:'حصر عهد موظف',
                                                icon: 'fas fa-user-check',
                                                permissionName: PERMISSIONS.empCustodyReport
                                            }
                                        },
                                        {
                                            path:'reports/movements-reports/receive-note-report',
                                            data:{
                                                title:'مذكرات الإستلام',
                                                icon: 'fas fa-sticky-note',
                                                permissionName: PERMISSIONS.receiveNoteReport
                                            }
                                        },
                                        {
                                            path:'reports/movements-reports/receive-record-report',
                                            data:{
                                                title:'محاضر الإستلام',
                                                icon: 'fas fa-sliders-h',
                                                permissionName: PERMISSIONS.receiveRecordReport
                                            }
                                        },
                                        {
                                            path:'reports/movements-reports/item-out-order-report',
                                            data:{
                                                title:'طلبات صرف مواد',
                                                icon: 'fab fa-stack-overflow',
                                                permissionName: PERMISSIONS.itemOutOrderReport
                                            }
                                        },
                                        {
                                            path:'reports/movements-reports/temp-receive-notification-report',
                                            data:{
                                                title:'إشعارات الاستلام المؤقتة',
                                                icon: 'fas fa-sun',
                                                permissionName: PERMISSIONS.tempReceiveNotificationReport
                                            }
                                        },
                                        {
                                            path:'reports/movements-reports/transfer-custody-report',
                                            data:{
                                                title:'مستندات صرف رجيع',
                                                icon: 'fas fa-shekel-sign',
                                                permissionName: PERMISSIONS.transferCustodyReport
                                            }
                                        },
                                        {
                                            path:'reports/movements-reports/return-document-report',
                                            data:{
                                                title:'مستندات الإرجاع',
                                                icon: 'fas fa-memory',
                                                permissionName: PERMISSIONS.returnDocumentReport
                                            }
                                        }
                                    ]
                                }
                            }

                        ]

                    }

                },
                {
                    data: {
                        title: 'الأدوات',
                        icon: 'fas fa-tools',
                        children: [
                            {
                                path: 'tools/users',
                                data: {
                                    title: 'المستخدمين',
                                    icon: 'fas fa-users',
                                    permissionName: PERMISSIONS.users
                                }
                            },
                            {
                                path: 'tools/settings',
                                data: {
                                    title: 'إعدادات البرنامج',
                                    icon: 'fas fa-cogs',
                                    permissionName: PERMISSIONS.settings
                                }
                            },
                            {
                                path: 'tools/users-perm',
                                data: {
                                    title: 'صلاحيات الشاشات',
                                    icon: 'fas fa-eye-slash',
                                    permissionName: PERMISSIONS.usersPerm
                                }
                            },
                            {
                                path: 'tools/branches-perm',
                                data: {
                                    title: 'صلاحيات الفروع',
                                    icon: 'fas fa-unlock-alt',
                                    permissionName: PERMISSIONS.branchesPerm
                                }
                            }, {
                                path: 'tools/change-items-year',
                                data: {
                                    title: 'تغيير سنة الأصناف',
                                    icon: 'fas fa-calendar-week',
                                    permissionName: PERMISSIONS.noPermission
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }
];