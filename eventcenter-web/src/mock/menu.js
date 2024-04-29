/* eslint-disable */
export default {
  "name": "区县一网统管",
  "sort": 1,
  "icon": "",
  "resourceId": "1",
  "resourceType": "appGroup",
  "ucrs_resourceId": "944610999",
  "ucrs_displayName": "区县一网统管",
  "ucrs_web_resource_id": "80c68ea3-de77-46a3-8da0-09b0e56bde47",
  "ucrs_display_resource_code": "1",
  "ucrs_display_resource_type": "应用分组",
  "permissions": [
    "show"
  ],
  "children": [
    {
      "name": "切面-演示用",
      "sort": 99,
      "icon": "",
      "resourceId": "99",
      "resourceType": "app",
      "ucrs_resourceId": "1645828956",
      "ucrs_displayName": "切面-演示用",
      "ucrs_web_resource_id": "1f07b353-16b4-40ea-89f3-b4e8bf4fd9cb",
      "ucrs_display_resource_code": "99",
      "ucrs_display_resource_type": "应用",
      "permissions": [
        "show"
      ],
      "children": [
        {
          "path": "/busicenter-disaptch",
          "name": "事件列表演示",
          "sort": 5,
          "icon": "dispatch",
          "resourceId": "992",
          "resourceType": "menu",
          "ucrs_resourceId": "1641031666",
          "ucrs_displayName": "事件列表演示",
          "ucrs_web_resource_id": "599fe268-a9c1-4f63-a83a-db1a9ac0443f",
          "ucrs_display_resource_code": "992",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "type-in-zx",
              "name": "事件录入(speType=10)",
              "sort": 6,
              "icon": "",
              "resourceId": "9926",
              "resourceType": "menu",
              "ucrs_resourceId": "931513004",
              "ucrs_displayName": "事件录入(speType=10)",
              "ucrs_web_resource_id": "f439e4ce-ea3a-4c52-9247-7cdcb0b2e522",
              "ucrs_display_resource_code": "9926",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/event/type-in?speType=10"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "type-in-zx6",
              "name": "知会事件(speType=all)",
              "sort": 6,
              "icon": "",
              "resourceId": "9933",
              "resourceType": "menu",
              "ucrs_resourceId": "1072436027",
              "ucrs_displayName": "知会事件(speType=all)",
              "ucrs_web_resource_id": "350ce9f2-c1da-4072-bead-698c30b642a1",
              "ucrs_display_resource_code": "9933",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/workbench/notify?speType=all"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "workbenchtodo-zx",
              "name": "统一待办(speType=10)",
              "sort": 2,
              "icon": "",
              "resourceId": "9922",
              "resourceType": "menu",
              "ucrs_resourceId": "1639478987",
              "ucrs_displayName": "统一待办(speType=10)",
              "ucrs_web_resource_id": "1ca3d5ec-6a7d-4ddd-bd30-86f3f16a7793",
              "ucrs_display_resource_code": "9922",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/workbench/todo?speType=10"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "type-in-zx1",
              "name": "全部事件(speType=10)",
              "sort": 6,
              "icon": "",
              "resourceId": "9928",
              "resourceType": "menu",
              "ucrs_resourceId": "1908554235",
              "ucrs_displayName": "全部事件(speType=10)",
              "ucrs_web_resource_id": "4f13dd05-90ff-4c52-a17f-5dbb4edf6862",
              "ucrs_display_resource_code": "9928",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/event/collection/all?speType=10"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "type-in-zx10",
              "name": "事件审批(speType=all)",
              "sort": 6,
              "icon": "",
              "resourceId": "9937",
              "resourceType": "menu",
              "ucrs_resourceId": "1234052830",
              "ucrs_displayName": "事件审批(speType=all)",
              "ucrs_web_resource_id": "73e9a8d3-5b33-421d-b091-020799360383",
              "ucrs_display_resource_code": "9937",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/event/approval?speType=all"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "type-in-zx5",
              "name": "知会事件(speType=10)",
              "sort": 6,
              "icon": "",
              "resourceId": "9932",
              "resourceType": "menu",
              "ucrs_resourceId": "1649970608",
              "ucrs_displayName": "知会事件(speType=10)",
              "ucrs_web_resource_id": "91f4f9c2-512a-499f-8805-7d4b5adf81b6",
              "ucrs_display_resource_code": "9932",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/workbench/notify?speType=10"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "type-in-zx7",
              "name": "事件受理(speType=10)",
              "sort": 6,
              "icon": "",
              "resourceId": "9934",
              "resourceType": "menu",
              "ucrs_resourceId": "511998613",
              "ucrs_displayName": "事件受理(speType=10)",
              "ucrs_web_resource_id": "5defbceb-c352-470e-b612-fe0bce888235",
              "ucrs_display_resource_code": "9934",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/event/pre-accepted?speType=10"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "workbenchtodo-all",
              "name": "统一待办(speType=all)",
              "sort": 1,
              "icon": "",
              "resourceId": "9921",
              "resourceType": "menu",
              "ucrs_resourceId": "50724917",
              "ucrs_displayName": "统一待办(speType=all)",
              "ucrs_web_resource_id": "e8201e37-5e9a-4191-ae37-efbd41f6fe62",
              "ucrs_display_resource_code": "9921",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/workbench/todo?speType=all"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "type-in-zx8",
              "name": "事件受理(speType=all)",
              "sort": 6,
              "icon": "",
              "resourceId": "9935",
              "resourceType": "menu",
              "ucrs_resourceId": "1262556769",
              "ucrs_displayName": "事件受理(speType=all)",
              "ucrs_web_resource_id": "2dfb3600-b1e5-47ed-bd47-7a20bf0b32c8",
              "ucrs_display_resource_code": "9935",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/event/pre-accepted?speType=all"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "type-in-zx11",
              "name": "发起督办(speType=10)",
              "sort": 6,
              "icon": "",
              "resourceId": "9938",
              "resourceType": "menu",
              "ucrs_resourceId": "1954261385",
              "ucrs_displayName": "发起督办(speType=10)",
              "ucrs_web_resource_id": "f30b2857-8134-498a-9610-aa382605a606",
              "ucrs_display_resource_code": "9938",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/inspector/list?speType=10"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "workbenchhandle-all",
              "name": "经办事件(speType=all)",
              "sort": 3,
              "icon": "",
              "resourceId": "9923",
              "resourceType": "menu",
              "ucrs_resourceId": "1375629621",
              "ucrs_displayName": "经办事件(speType=all)",
              "ucrs_web_resource_id": "b0f0743a-c1a4-4e72-a16f-373489ea4da1",
              "ucrs_display_resource_code": "9923",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/workbench/handle?speType=all"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "type-in-zx9",
              "name": "事件审批(speType=10)",
              "sort": 6,
              "icon": "",
              "resourceId": "9936",
              "resourceType": "menu",
              "ucrs_resourceId": "1328762576",
              "ucrs_displayName": "事件审批(speType=10)",
              "ucrs_web_resource_id": "1b75bc6f-481e-4098-bc2e-c4aae03d7f01",
              "ucrs_display_resource_code": "9936",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/event/approval?speType=10"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "type-in-zx15",
              "name": "我的督办单(speType=10)",
              "sort": 6,
              "icon": "",
              "resourceId": "9942",
              "resourceType": "menu",
              "ucrs_resourceId": "197163670",
              "ucrs_displayName": "我的督办单(speType=10)",
              "ucrs_web_resource_id": "2df34685-57b6-45dc-82e3-2299e935d09f",
              "ucrs_display_resource_code": "9942",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/inspector/settle?speType=10"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "type-in-zx4",
              "name": "协办事件(speType=all)",
              "sort": 6,
              "icon": "",
              "resourceId": "9931",
              "resourceType": "menu",
              "ucrs_resourceId": "1827994329",
              "ucrs_displayName": "协办事件(speType=all)",
              "ucrs_web_resource_id": "9036d69a-37ee-4c1c-af81-5f2cfbe59188",
              "ucrs_display_resource_code": "9931",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/workbench/assist?speType=all"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "type-in-zx2",
              "name": "全部事件(speType=all)",
              "sort": 6,
              "icon": "",
              "resourceId": "9929",
              "resourceType": "menu",
              "ucrs_resourceId": "627111778",
              "ucrs_displayName": "全部事件(speType=all)",
              "ucrs_web_resource_id": "39747a8b-b24a-4306-a441-94d6bf82bae7",
              "ucrs_display_resource_code": "9929",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/event/collection/all?speType=all"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "type-in-zx12",
              "name": "发起督办(speType=all)",
              "sort": 6,
              "icon": "",
              "resourceId": "9939",
              "resourceType": "menu",
              "ucrs_resourceId": "1248297434",
              "ucrs_displayName": "发起督办(speType=all)",
              "ucrs_web_resource_id": "f520c22d-539a-410e-8a62-81cc524c64bd",
              "ucrs_display_resource_code": "9939",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/inspector/list?speType=all"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "type-in-zx14",
              "name": "督办反馈(speType=all)",
              "sort": 6,
              "icon": "",
              "resourceId": "9941",
              "resourceType": "menu",
              "ucrs_resourceId": "1309115347",
              "ucrs_displayName": "督办反馈(speType=all)",
              "ucrs_web_resource_id": "f38a8758-06a4-4a3a-83cc-e5b526c2ac73",
              "ucrs_display_resource_code": "9941",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/inspector/feedback?speType=all"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "type-in-zx13",
              "name": "督办反馈(speType=10)",
              "sort": 6,
              "icon": "",
              "resourceId": "9940",
              "resourceType": "menu",
              "ucrs_resourceId": "570232419",
              "ucrs_displayName": "督办反馈(speType=10)",
              "ucrs_web_resource_id": "c174a236-9d71-41f1-839b-b4f25ddaadf8",
              "ucrs_display_resource_code": "9940",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/inspector/feedback?speType=10"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "type-in-zx3",
              "name": "协办事件(speType=10)",
              "sort": 6,
              "icon": "",
              "resourceId": "9930",
              "resourceType": "menu",
              "ucrs_resourceId": "602387630",
              "ucrs_displayName": "协办事件(speType=10)",
              "ucrs_web_resource_id": "b6fcb095-d7f2-4140-8063-2ef4226c47b0",
              "ucrs_display_resource_code": "9930",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/workbench/assist?speType=10"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "type-in-all",
              "name": "事件录入(speType=all)",
              "sort": 5,
              "icon": "",
              "resourceId": "9925",
              "resourceType": "menu",
              "ucrs_resourceId": "445040495",
              "ucrs_displayName": "事件录入(speType=all)",
              "ucrs_web_resource_id": "3436bd38-0625-4d21-b4c9-06bdfa60802a",
              "ucrs_display_resource_code": "9925",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/event/type-in?speType=all"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "type-in-zx16",
              "name": "我的督办单(speType=all)",
              "sort": 6,
              "icon": "",
              "resourceId": "9943",
              "resourceType": "menu",
              "ucrs_resourceId": "1809146941",
              "ucrs_displayName": "我的督办单(speType=all)",
              "ucrs_web_resource_id": "df306c15-1ac0-46c4-8fdc-6c2bd46ce7e3",
              "ucrs_display_resource_code": "9943",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/inspector/settle?speType=all"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "workbenchhandle-10",
              "name": "经办事件(speType=30)",
              "sort": 4,
              "icon": "",
              "resourceId": "9924",
              "resourceType": "menu",
              "ucrs_resourceId": "266385978",
              "ucrs_displayName": "经办事件(speType=30)",
              "ucrs_web_resource_id": "e7d47ff4-2987-4156-8f49-61293f2066df",
              "ucrs_display_resource_code": "9924",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/workbench/handle?speType=30"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/busicenter-strategyconfig",
          "name": "事项配置",
          "sort": 2,
          "icon": "plat-set",
          "resourceId": "991",
          "resourceType": "menu",
          "ucrs_resourceId": "788464782",
          "ucrs_displayName": "事项配置",
          "ucrs_web_resource_id": "90b43dd9-3866-4896-a976-d5eb89d0c224",
          "ucrs_display_resource_code": "991",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "event-type-zx",
              "name": "事件类型管理(speType=20)",
              "sort": 2,
              "icon": "",
              "resourceId": "9912",
              "resourceType": "menu",
              "ucrs_resourceId": "1578352152",
              "ucrs_displayName": "事件类型管理(speType=20)",
              "ucrs_web_resource_id": "b321fcd3-ce56-4fb2-aada-c29bdc9e4ec8",
              "ucrs_display_resource_code": "9912",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/admin/#/strategy-config/event-type?speType=20"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "accrual-list-zx",
              "name": "权责清单管理(speType=10)",
              "sort": 3,
              "icon": "",
              "resourceId": "9914",
              "resourceType": "menu",
              "ucrs_resourceId": "419214643",
              "ucrs_displayName": "权责清单管理(speType=10)",
              "ucrs_web_resource_id": "1160663a-ad81-4376-a0aa-04b914ea6a33",
              "ucrs_display_resource_code": "9914",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/admin/#/strategy-config/accrual-list?speType=10"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "accrual-list",
              "name": "权责清单管理(speType=all)",
              "sort": 3,
              "icon": "",
              "resourceId": "9913",
              "resourceType": "menu",
              "ucrs_resourceId": "1174563864",
              "ucrs_displayName": "权责清单管理(speType=all)",
              "ucrs_web_resource_id": "82f5166b-1a2a-4917-9c6a-b8f082053e98",
              "ucrs_display_resource_code": "9913",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/admin/#/strategy-config/accrual-list?speType=all"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "event-type",
              "name": "事件类型管理(speType=all)",
              "sort": 2,
              "icon": "",
              "resourceId": "9911",
              "resourceType": "menu",
              "ucrs_resourceId": "1399634056",
              "ucrs_displayName": "事件类型管理(speType=all)",
              "ucrs_web_resource_id": "449c6977-8372-4e6b-9daf-486d0babdec4",
              "ucrs_display_resource_code": "9911",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/admin/#/strategy-config/event-type?speType=all"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "网格中心",
      "sort": 5,
      "icon": "",
      "resourceId": "13",
      "resourceType": "app",
      "ucrs_resourceId": "858120869",
      "ucrs_displayName": "网格中心",
      "ucrs_web_resource_id": "6b368299-f9e3-441e-89fc-db8ecb6daeea",
      "ucrs_display_resource_code": "13",
      "ucrs_display_resource_type": "应用",
      "permissions": [
        "show"
      ],
      "children": [
        {
          "path": "/gridcenter-1",
          "name": "全科网格",
          "sort": 3,
          "icon": "网格绘制",
          "resourceId": "131",
          "resourceType": "menu",
          "ucrs_resourceId": "31771030",
          "ucrs_displayName": "全科网格",
          "ucrs_web_resource_id": "372bbebf-6c01-48a1-86b0-6c5d710949f9",
          "ucrs_display_resource_code": "131",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "gridGroup-list",
              "name": "全科网格",
              "sort": 1,
              "icon": "",
              "resourceId": "1311",
              "resourceType": "menu",
              "ucrs_resourceId": "1218261490",
              "ucrs_displayName": "全科网格",
              "ucrs_web_resource_id": "88baf935-c659-4886-993b-9ff238cd3aab",
              "ucrs_display_resource_code": "1311",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/igrid/#/gridGroup/list"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "gridStandard-index",
              "name": "网格标准",
              "sort": 2,
              "icon": "",
              "resourceId": "1312",
              "resourceType": "menu",
              "ucrs_resourceId": "1004338363",
              "ucrs_displayName": "网格标准",
              "ucrs_web_resource_id": "4fc49979-5061-464f-9392-1a55fd1634af",
              "ucrs_display_resource_code": "1312",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/igrid/#/gridStandard/index"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/gridcenter-2",
          "name": "组织机构",
          "sort": 1,
          "icon": "组织机构",
          "resourceId": "132",
          "resourceType": "menu",
          "ucrs_resourceId": "209019154",
          "ucrs_displayName": "组织机构",
          "ucrs_web_resource_id": "c0d5e31c-c700-4ca5-af45-28b3bfb536cb",
          "ucrs_display_resource_code": "132",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "orgRootList",
              "name": "组织机构",
              "sort": 0,
              "icon": "组织机构",
              "resourceId": "1321",
              "resourceType": "menu",
              "ucrs_resourceId": "1362308766",
              "ucrs_displayName": "组织机构",
              "ucrs_web_resource_id": "936b28f4-216f-4e60-8823-cab9abb3b9b2",
              "ucrs_display_resource_code": "1321",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/igrid/#/governOrg/list"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/gridcenter-8",
          "name": "行政区划",
          "sort": 2,
          "icon": "组织机构",
          "resourceId": "138",
          "resourceType": "menu",
          "ucrs_resourceId": "135068519",
          "ucrs_displayName": "行政区划",
          "ucrs_web_resource_id": "0864fff4-efe1-4bb8-821b-c7bb4497b9a8",
          "ucrs_display_resource_code": "138",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "standardized",
              "name": "行政区划",
              "sort": 0,
              "icon": "组织机构",
              "resourceId": "1381",
              "resourceType": "menu",
              "ucrs_resourceId": "595602406",
              "ucrs_displayName": "行政区划",
              "ucrs_web_resource_id": "aa3accfc-4136-4422-ac62-9598f8f83aed",
              "ucrs_display_resource_code": "1381",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/strategy-config/standardized?hiddenTop=true"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/gridcenter-3",
          "name": "多网格管理",
          "sort": 5,
          "icon": "组织机构",
          "resourceId": "133",
          "resourceType": "menu",
          "ucrs_resourceId": "1327842815",
          "ucrs_displayName": "多网格管理",
          "ucrs_web_resource_id": "cc93646b-22db-47e2-9a92-5995af0f2bd4",
          "ucrs_display_resource_code": "133",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "orgRootList",
              "name": "多网格管理",
              "sort": 0,
              "icon": "组织机构",
              "resourceId": "1331",
              "resourceType": "menu",
              "ucrs_resourceId": "756573252",
              "ucrs_displayName": "多网格管理",
              "ucrs_web_resource_id": "ff367636-a424-433a-8346-d0fc6312b626",
              "ucrs_display_resource_code": "1331",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/igrid/#/gridGroup/multi-grid"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/gridcenter-5",
          "name": "网格员管理",
          "sort": 7,
          "icon": "网格员管理",
          "resourceId": "135",
          "resourceType": "menu",
          "ucrs_resourceId": "1335100277",
          "ucrs_displayName": "网格员管理",
          "ucrs_web_resource_id": "20843876-27f4-488d-b485-ad0a78477783",
          "ucrs_display_resource_code": "135",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "trainingRecords",
              "name": "培训记录",
              "sort": 3,
              "icon": "",
              "resourceId": "1353",
              "resourceType": "menu",
              "ucrs_resourceId": "1685152279",
              "ucrs_displayName": "培训记录",
              "ucrs_web_resource_id": "2803f07f-b281-4a6d-acd3-49f17dc778a0",
              "ucrs_display_resource_code": "1353",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/igrid/#/gridManManage/trainingRecords"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "gridManManage-list",
              "name": "网格力量",
              "sort": 1,
              "icon": "",
              "resourceId": "1351",
              "resourceType": "menu",
              "ucrs_resourceId": "1055520620",
              "ucrs_displayName": "网格力量",
              "ucrs_web_resource_id": "13277942-5c0e-4a25-b0c9-85b2ef8bb045",
              "ucrs_display_resource_code": "1351",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/igrid/#/gridManManage/list"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "trace",
              "name": "网格员轨迹",
              "sort": 2,
              "icon": "",
              "resourceId": "1352",
              "resourceType": "menu",
              "ucrs_resourceId": "2098047143",
              "ucrs_displayName": "网格员轨迹",
              "ucrs_web_resource_id": "36950871-a6fd-4dee-9206-ad42c444c20e",
              "ucrs_display_resource_code": "1352",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/igrid/#/gridManManage/trace"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/gridcenter-7",
          "name": "日常考勤管理",
          "sort": 8,
          "icon": "网格分类",
          "resourceId": "137",
          "resourceType": "menu",
          "ucrs_resourceId": "1458472302",
          "ucrs_displayName": "日常考勤管理",
          "ucrs_web_resource_id": "9024ba78-e5fc-4c0f-bf9a-22d3b5954be3",
          "ucrs_display_resource_code": "137",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "query",
              "name": "考勤查询",
              "sort": 1,
              "icon": "",
              "resourceId": "1371",
              "resourceType": "menu",
              "ucrs_resourceId": "1418999163",
              "ucrs_displayName": "考勤查询",
              "ucrs_web_resource_id": "0c485dce-f922-420d-b4fd-9fab71d6f371",
              "ucrs_display_resource_code": "1371",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/igrid/#/dailyAttendance/query"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "approval",
              "name": "补卡审批",
              "sort": 2,
              "icon": "",
              "resourceId": "1372",
              "resourceType": "menu",
              "ucrs_resourceId": "2094094129",
              "ucrs_displayName": "补卡审批",
              "ucrs_web_resource_id": "393ab45e-55b4-4fc1-9159-ef54c2beaa0f",
              "ucrs_display_resource_code": "1372",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/igrid/#/dailyAttendance/approval"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "people",
              "name": "考勤人员",
              "sort": 4,
              "icon": "",
              "resourceId": "1374",
              "resourceType": "menu",
              "ucrs_resourceId": "1626003544",
              "ucrs_displayName": "考勤人员",
              "ucrs_web_resource_id": "d07b4e2c-c607-4a47-af25-ee34d2ba6ef3",
              "ucrs_display_resource_code": "1374",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/igrid/#/dailyAttendance/people"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "risk",
              "name": "风控管理",
              "sort": 3,
              "icon": "",
              "resourceId": "1373",
              "resourceType": "menu",
              "ucrs_resourceId": "2073955257",
              "ucrs_displayName": "风控管理",
              "ucrs_web_resource_id": "5caa62cf-c2e7-41ba-826c-d2a4d5752f9a",
              "ucrs_display_resource_code": "1373",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/igrid/#/dailyAttendance/risk"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/gridcenter-6",
          "name": "业务网格配置",
          "sort": 4,
          "icon": "网格标准化",
          "resourceId": "136",
          "resourceType": "menu",
          "ucrs_resourceId": "96718365",
          "ucrs_displayName": "业务网格配置",
          "ucrs_web_resource_id": "0533dc95-8971-4c46-8cdf-99f6fb692efb",
          "ucrs_display_resource_code": "136",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "base",
              "name": "全科网格管理",
              "sort": 0,
              "icon": "",
              "resourceId": "1367",
              "resourceType": "menu",
              "ucrs_resourceId": "1399593510",
              "ucrs_displayName": "全科网格管理",
              "ucrs_web_resource_id": "8cae8d3f-ecd0-484c-9333-a9bb58d1524e",
              "ucrs_display_resource_code": "1367",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/igrid/#/gridGroup/base"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "fireControl",
              "name": "消防网格管理",
              "sort": 3,
              "icon": "",
              "resourceId": "1363",
              "resourceType": "menu",
              "ucrs_resourceId": "1212445243",
              "ucrs_displayName": "消防网格管理",
              "ucrs_web_resource_id": "e5556913-df78-4295-8ec0-5dc989ae1919",
              "ucrs_display_resource_code": "1363",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/igrid/#/gridGroup/fireControl"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "safety",
              "name": "安全网格管理",
              "sort": 5,
              "icon": "",
              "resourceId": "1365",
              "resourceType": "menu",
              "ucrs_resourceId": "903958727",
              "ucrs_displayName": "安全网格管理",
              "ucrs_web_resource_id": "8abcc8dc-4dba-48d1-bc64-ad59ce1e3002",
              "ucrs_display_resource_code": "1365",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/igrid/#/gridGroup/safety"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "government",
              "name": "综治网格管理",
              "sort": 1,
              "icon": "",
              "resourceId": "1361",
              "resourceType": "menu",
              "ucrs_resourceId": "1086918856",
              "ucrs_displayName": "综治网格管理",
              "ucrs_web_resource_id": "691c5fc8-f31e-4a8a-90f9-05a39709545a",
              "ucrs_display_resource_code": "1361",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/igrid/#/gridGroup/government"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "police",
              "name": "警务网格管理",
              "sort": 4,
              "icon": "",
              "resourceId": "1364",
              "resourceType": "menu",
              "ucrs_resourceId": "243683656",
              "ucrs_displayName": "警务网格管理",
              "ucrs_web_resource_id": "4c6d357b-7f19-4329-95e9-61792e61b155",
              "ucrs_display_resource_code": "1364",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/igrid/#/gridGroup/police"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "cityManage",
              "name": "城管网格管理",
              "sort": 2,
              "icon": "",
              "resourceId": "1362",
              "resourceType": "menu",
              "ucrs_resourceId": "1278819076",
              "ucrs_displayName": "城管网格管理",
              "ucrs_web_resource_id": "4d142c90-f28f-44a9-87d3-9c3ad176ed08",
              "ucrs_display_resource_code": "1362",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/igrid/#/gridGroup/cityManage"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "sanitation",
              "name": "环卫网格管理",
              "sort": 6,
              "icon": "",
              "resourceId": "1366",
              "resourceType": "menu",
              "ucrs_resourceId": "97483046",
              "ucrs_displayName": "环卫网格管理",
              "ucrs_web_resource_id": "02fa82f8-d663-495c-9873-c9c1da8ac2f3",
              "ucrs_display_resource_code": "1366",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/igrid/#/gridGroup/sanitation"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/gridcenter-4",
          "name": "网格画像",
          "sort": 6,
          "icon": "组织机构",
          "resourceId": "134",
          "resourceType": "menu",
          "ucrs_resourceId": "1718915223",
          "ucrs_displayName": "网格画像",
          "ucrs_web_resource_id": "e10a7f90-f92e-4350-8fdf-2167caec44f1",
          "ucrs_display_resource_code": "134",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "orgRootList",
              "name": "网格画像",
              "sort": 0,
              "icon": "组织机构",
              "resourceId": "1341",
              "resourceType": "menu",
              "ucrs_resourceId": "1075853177",
              "ucrs_displayName": "网格画像",
              "ucrs_web_resource_id": "2891345b-7ec9-43a6-9313-ef5dbe14fcd9",
              "ucrs_display_resource_code": "1341",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/igrid/#/gridGroup/portrayal"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "运营中心",
      "sort": 7,
      "icon": "",
      "resourceId": "14",
      "resourceType": "app",
      "ucrs_resourceId": "1207484179",
      "ucrs_displayName": "运营中心",
      "ucrs_web_resource_id": "f0536218-9da5-40b9-9cc3-66e932182a96",
      "ucrs_display_resource_code": "14",
      "ucrs_display_resource_type": "应用",
      "permissions": [
        "show"
      ],
      "children": [
        {
          "path": "/admincenter-thirdsys",
          "name": "第三方系统管理",
          "sort": 3,
          "icon": "third-sys-manage",
          "resourceId": "142",
          "resourceType": "menu",
          "ucrs_resourceId": "1386794136",
          "ucrs_displayName": "第三方系统管理",
          "ucrs_web_resource_id": "7eb03335-6bfc-4ee5-862d-df682ec0014c",
          "ucrs_display_resource_code": "142",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "third-type",
              "name": "三方类型配置",
              "sort": 4,
              "icon": "",
              "resourceId": "1425",
              "resourceType": "menu",
              "ucrs_resourceId": "540982889",
              "ucrs_displayName": "三方类型配置",
              "ucrs_web_resource_id": "23ae2f52-7d9a-43b0-aef4-b376a4798b37",
              "ucrs_display_resource_code": "1425",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/admin/#/third-system-manage/third-type"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "base-info",
              "name": "基本信息管理",
              "sort": 1,
              "icon": "",
              "resourceId": "1421",
              "resourceType": "menu",
              "ucrs_resourceId": "300553706",
              "ucrs_displayName": "基本信息管理",
              "ucrs_web_resource_id": "b3e620f7-ae6a-496f-8a72-5406715a8624",
              "ucrs_display_resource_code": "1421",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/admin/#/third-system-manage/base-info"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "request-auth",
              "name": "请求鉴权配置",
              "sort": 3,
              "icon": "",
              "resourceId": "1422",
              "resourceType": "menu",
              "ucrs_resourceId": "1366636860",
              "ucrs_displayName": "请求鉴权配置",
              "ucrs_web_resource_id": "6c6ba089-a38f-4c01-9f35-0561cc1cf32b",
              "ucrs_display_resource_code": "1422",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/admin/#/third-system-manage/request-auth"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "element-transition",
              "name": "要素转换配置",
              "sort": 5,
              "icon": "",
              "resourceId": "1424",
              "resourceType": "menu",
              "ucrs_resourceId": "1150693950",
              "ucrs_displayName": "要素转换配置",
              "ucrs_web_resource_id": "e8b9789f-60eb-4041-a27b-9d0f6aade66e",
              "ucrs_display_resource_code": "1424",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/admin/#/third-system-manage/element-transition"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "third-interface",
              "name": "三方接口管理",
              "sort": 2,
              "icon": "",
              "resourceId": "1423",
              "resourceType": "menu",
              "ucrs_resourceId": "2110049834",
              "ucrs_displayName": "三方接口管理",
              "ucrs_web_resource_id": "f35eab81-085f-437e-913f-eb1f1b76a6ad",
              "ucrs_display_resource_code": "1423",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/admin/#/third-system-manage/third-interface"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/admin",
          "name": "组织用户管理",
          "sort": 7,
          "icon": "basic-set",
          "resourceId": "148",
          "resourceType": "menu",
          "ucrs_resourceId": "1119325709",
          "ucrs_displayName": "组织用户管理",
          "ucrs_web_resource_id": "a1175cad-211e-4a33-9492-fe48706a3037",
          "ucrs_display_resource_code": "148",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "stationManage",
              "name": "岗位管理",
              "sort": 3,
              "icon": "",
              "resourceId": "1483",
              "resourceType": "menu",
              "ucrs_resourceId": "1710136056",
              "ucrs_displayName": "岗位管理",
              "ucrs_web_resource_id": "70682a9b-cd9a-4c3c-8626-4936c297e59f",
              "ucrs_display_resource_code": "1483",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/fx-usercenter-web/admin/adminLayouts/authority/stationManage"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "staffManage",
              "name": "员工管理",
              "sort": 2,
              "icon": "",
              "resourceId": "1482",
              "resourceType": "menu",
              "ucrs_resourceId": "1102007133",
              "ucrs_displayName": "员工管理",
              "ucrs_web_resource_id": "d69c3105-57a7-4ee6-9dcc-5643fd549531",
              "ucrs_display_resource_code": "1482",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/fx-usercenter-web/admin/adminLayouts/authority/staffManage"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "appManage",
              "name": "应用管理",
              "sort": 10,
              "icon": "",
              "resourceId": "14810",
              "resourceType": "menu",
              "ucrs_resourceId": "787269976",
              "ucrs_displayName": "应用管理",
              "ucrs_web_resource_id": "3916c35c-2d1c-4760-b280-6e14b276fc7e",
              "ucrs_display_resource_code": "14810",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/fx-usercenter-web/admin/adminLayouts/integration/appManage"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "templateManagement",
              "name": "权限模板管理",
              "sort": 11,
              "icon": "",
              "resourceId": "14811",
              "resourceType": "menu",
              "ucrs_resourceId": "1745355658",
              "ucrs_displayName": "权限模板管理",
              "ucrs_web_resource_id": "301f15e4-2a56-4795-8bc1-9db81bd3961b",
              "ucrs_display_resource_code": "14811",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/fx-usercenter-web/admin/adminLayouts/integration/templateManagement"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "organizationMaintain",
              "name": "组织维护",
              "sort": 1,
              "icon": "",
              "resourceId": "1481",
              "resourceType": "menu",
              "ucrs_resourceId": "251326305",
              "ucrs_displayName": "组织维护",
              "ucrs_web_resource_id": "ed8f94ad-b743-42b6-a8ec-a2d154e0e0e9",
              "ucrs_display_resource_code": "1481",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/fx-usercenter-web/admin/adminLayouts/authority/organizationMaintain"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "roleSet",
              "name": "角色设置",
              "sort": 8,
              "icon": "",
              "resourceId": "1488",
              "resourceType": "menu",
              "ucrs_resourceId": "1038762853",
              "ucrs_displayName": "角色设置",
              "ucrs_web_resource_id": "f7404d84-9a14-4f62-a26e-93dfe07aaa3e",
              "ucrs_display_resource_code": "1488",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/fx-usercenter-web/admin/adminLayouts/authority/roleSet"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "dictSet",
              "name": "字典管理",
              "sort": 14,
              "icon": "",
              "resourceId": "14815",
              "resourceType": "menu",
              "ucrs_resourceId": "1560178707",
              "ucrs_displayName": "字典管理",
              "ucrs_web_resource_id": "9c9f2bdc-4bc0-4b1b-93fc-71d30335d682",
              "ucrs_display_resource_code": "14815",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/fx-usercenter-web/admin/adminLayouts/configSet/dictSet"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "tagManagement",
              "name": "标签管理",
              "sort": 5,
              "icon": "",
              "resourceId": "1485",
              "resourceType": "menu",
              "ucrs_resourceId": "1496587255",
              "ucrs_displayName": "标签管理",
              "ucrs_web_resource_id": "9e616676-a1bf-4873-a282-b82d668ecc90",
              "ucrs_display_resource_code": "1485",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/fx-usercenter-web/admin/adminLayouts/authority/tagManagement"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "officeLocation",
              "name": "办公地点",
              "sort": 4,
              "icon": "",
              "resourceId": "1484",
              "resourceType": "menu",
              "ucrs_resourceId": "1482556944",
              "ucrs_displayName": "办公地点",
              "ucrs_web_resource_id": "264a15ee-70d4-4334-b25f-bf795d6058d4",
              "ucrs_display_resource_code": "1484",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/fx-usercenter-web/admin/adminLayouts/authority/officeLocation"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "permissionManagement",
              "name": "权限管理",
              "sort": 7,
              "icon": "",
              "resourceId": "1487",
              "resourceType": "menu",
              "ucrs_resourceId": "2019063965",
              "ucrs_displayName": "权限管理",
              "ucrs_web_resource_id": "b841fd12-a57f-4967-bc31-786ff4ab24df",
              "ucrs_display_resource_code": "1487",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/fx-usercenter-web/admin/adminLayouts/authority/permissionManagement"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "passwordStrategy",
              "name": "密码策略",
              "sort": 12,
              "icon": "",
              "resourceId": "14812",
              "resourceType": "menu",
              "ucrs_resourceId": "1580054468",
              "ucrs_displayName": "密码策略",
              "ucrs_web_resource_id": "924636a8-e3f7-49c6-81a6-c5c94128a43f",
              "ucrs_display_resource_code": "14812",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/fx-usercenter-web/admin/adminLayouts/authority/passwordStrategy"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "adminAuth",
              "name": "分级授权管理",
              "sort": 9,
              "icon": "",
              "resourceId": "1489",
              "resourceType": "menu",
              "ucrs_resourceId": "1279570411",
              "ucrs_displayName": "分级授权管理",
              "ucrs_web_resource_id": "42995456-822a-445c-a287-b6da563b9e29",
              "ucrs_display_resource_code": "1489",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/fx-usercenter-web/admin/adminLayouts/authority/adminAuth"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "accountLock",
              "name": "账号锁定",
              "sort": 13,
              "icon": "",
              "resourceId": "14813",
              "resourceType": "menu",
              "ucrs_resourceId": "145158446",
              "ucrs_displayName": "账号锁定",
              "ucrs_web_resource_id": "07521d21-1ea5-49b6-ad55-a6239a90400d",
              "ucrs_display_resource_code": "14813",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/fx-usercenter-web/admin/adminLayouts/authority/accountLock"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "extendSet",
              "name": "扩展字段管理",
              "sort": 14,
              "icon": "",
              "resourceId": "14814",
              "resourceType": "menu",
              "ucrs_resourceId": "488417414",
              "ucrs_displayName": "扩展字段管理",
              "ucrs_web_resource_id": "90d333b6-1e27-4e58-872a-69aa30b3e53a",
              "ucrs_display_resource_code": "14814",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/fx-usercenter-web/admin/adminLayouts/configSet/extendSet"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "tagBind",
              "name": "标签绑定",
              "sort": 6,
              "icon": "",
              "resourceId": "1486",
              "resourceType": "menu",
              "ucrs_resourceId": "815235752",
              "ucrs_displayName": "标签绑定",
              "ucrs_web_resource_id": "c3c9e94d-541e-4380-8739-2c239e38dceb",
              "ucrs_display_resource_code": "1486",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/fx-usercenter-web/admin/adminLayouts/authority/tagBind"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/strategy-config",
          "name": "权责部门管理",
          "sort": 4,
          "icon": "plat-set",
          "resourceId": "145",
          "resourceType": "menu",
          "ucrs_resourceId": "691424193",
          "ucrs_displayName": "权责部门管理",
          "ucrs_web_resource_id": "e4e8ff81-ffc3-4b54-b457-65bbf5de5981",
          "ucrs_display_resource_code": "145",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "orgRootList",
              "name": "实体组织机构",
              "sort": 2,
              "icon": "",
              "resourceId": "1452",
              "resourceType": "menu",
              "ucrs_resourceId": "267131388",
              "ucrs_displayName": "实体组织机构",
              "ucrs_web_resource_id": "4a50f867-21aa-4936-a9f8-6094e715cc6a",
              "ucrs_display_resource_code": "1452",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/igrid/#/governOrg/list"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "duty-dept",
              "name": "职能部门管理",
              "sort": 1,
              "icon": "",
              "resourceId": "1451",
              "resourceType": "menu",
              "ucrs_resourceId": "1249351350",
              "ucrs_displayName": "职能部门管理",
              "ucrs_web_resource_id": "93e7349a-50ee-406d-833e-da38363d0d2f",
              "ucrs_display_resource_code": "1451",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/strategy-config/duty-dept"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/log",
          "name": "审计日志管理",
          "sort": 9,
          "icon": "basic-set",
          "resourceId": "149",
          "resourceType": "menu",
          "ucrs_resourceId": "972333561",
          "ucrs_displayName": "审计日志管理",
          "ucrs_web_resource_id": "54e8336d-af6a-44ee-9a61-c931a2c07a12",
          "ucrs_display_resource_code": "149",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "activityDegreeLog",
              "name": "账户活跃审计",
              "sort": 4,
              "icon": "",
              "resourceId": "1494",
              "resourceType": "menu",
              "ucrs_resourceId": "1173662328",
              "ucrs_displayName": "账户活跃审计",
              "ucrs_web_resource_id": "38fb349a-1a33-4fa7-b84f-21818432a427",
              "ucrs_display_resource_code": "1494",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/fx-usercenter-web/admin/adminLayouts/logCenter/activityDegreeLog"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "systemLog",
              "name": "系统日志",
              "sort": 1,
              "icon": "",
              "resourceId": "1491",
              "resourceType": "menu",
              "ucrs_resourceId": "3894491",
              "ucrs_displayName": "系统日志",
              "ucrs_web_resource_id": "122c8045-9a24-46cc-aba6-0670a77860be",
              "ucrs_display_resource_code": "1491",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/fx-usercenter-web/admin/adminLayouts/logCenter/systemLog"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "manageLog",
              "name": "用户行为日志",
              "sort": 2,
              "icon": "",
              "resourceId": "1492",
              "resourceType": "menu",
              "ucrs_resourceId": "1896637714",
              "ucrs_displayName": "用户行为日志",
              "ucrs_web_resource_id": "8d574b63-de66-4f1b-adcd-45bf00815981",
              "ucrs_display_resource_code": "1492",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/fx-usercenter-web/admin/adminLayouts/logCenter/manageLog"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "anomalyLog",
              "name": "异常行为日志",
              "sort": 3,
              "icon": "",
              "resourceId": "1493",
              "resourceType": "menu",
              "ucrs_resourceId": "2106813190",
              "ucrs_displayName": "异常行为日志",
              "ucrs_web_resource_id": "87f60cd0-ec5d-4754-afcb-9792985dc19d",
              "ucrs_display_resource_code": "1493",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/fx-usercenter-web/admin/adminLayouts/logCenter/anomalyLog"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/base-config",
          "name": "系统基础配置",
          "sort": 1,
          "icon": "basic-set",
          "resourceId": "143",
          "resourceType": "menu",
          "ucrs_resourceId": "397618063",
          "ucrs_displayName": "系统基础配置",
          "ucrs_web_resource_id": "52b6c1f9-cbef-4e79-9d30-e43597396156",
          "ucrs_display_resource_code": "143",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "dict",
              "name": "系统基础配置",
              "sort": 1,
              "icon": "",
              "resourceId": "1431",
              "resourceType": "menu",
              "ucrs_resourceId": "1522658253",
              "ucrs_displayName": "系统基础配置",
              "ucrs_web_resource_id": "e0288b27-67b0-4923-9e26-27605063fa38",
              "ucrs_display_resource_code": "1431",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/base/#/dict/index"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/admincenter-strategyconfig",
          "name": "平台事项配置",
          "sort": 2,
          "icon": "plat-set",
          "resourceId": "141",
          "resourceType": "menu",
          "ucrs_resourceId": "2020957040",
          "ucrs_displayName": "平台事项配置",
          "ucrs_web_resource_id": "9ebd094c-d52f-49c0-9d57-bb953fa04320",
          "ucrs_display_resource_code": "141",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "process-model",
              "name": "流程模型管理",
              "sort": 5,
              "icon": "",
              "resourceId": "1414",
              "resourceType": "menu",
              "ucrs_resourceId": "1909820723",
              "ucrs_displayName": "流程模型管理",
              "ucrs_web_resource_id": "4c87521b-5e5e-4e06-a904-de1cd057b76d",
              "ucrs_display_resource_code": "1414",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/admin/#/process/process-model"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "process-list",
              "name": "流程配置管理",
              "sort": 4,
              "icon": "",
              "resourceId": "1415",
              "resourceType": "menu",
              "ucrs_resourceId": "2052029348",
              "ucrs_displayName": "流程配置管理",
              "ucrs_web_resource_id": "a74bc342-575a-4eec-b2ef-65e6c1be459b",
              "ucrs_display_resource_code": "1415",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/admin/#/process/process-list"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "standardized",
              "name": "标准化管理",
              "sort": 1,
              "icon": "",
              "resourceId": "1418",
              "resourceType": "menu",
              "ucrs_resourceId": "1356169006",
              "ucrs_displayName": "标准化管理",
              "ucrs_web_resource_id": "a4cfd25a-f7e8-48e6-9633-68f267138b0e",
              "ucrs_display_resource_code": "1418",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/admin/#/strategy-config/standardized"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "accrual-list",
              "name": "权责清单管理",
              "sort": 3,
              "icon": "",
              "resourceId": "1412",
              "resourceType": "menu",
              "ucrs_resourceId": "1328127077",
              "ucrs_displayName": "权责清单管理",
              "ucrs_web_resource_id": "bb2eea80-9e47-4c4f-b7fd-180166472a1c",
              "ucrs_display_resource_code": "1412",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/admin/#/strategy-config/accrual-list"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "event-type",
              "name": "事件类型管理",
              "sort": 2,
              "icon": "",
              "resourceId": "1411",
              "resourceType": "menu",
              "ucrs_resourceId": "506921368",
              "ucrs_displayName": "事件类型管理",
              "ucrs_web_resource_id": "60247a6a-f435-4792-92d1-043635a24305",
              "ucrs_display_resource_code": "1411",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/admin/#/strategy-config/event-type"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "appraise-target",
              "name": "评价指标配置",
              "sort": 10,
              "icon": "",
              "resourceId": "1417",
              "resourceType": "menu",
              "ucrs_resourceId": "559589538",
              "ucrs_displayName": "评价指标配置",
              "ucrs_web_resource_id": "e59ca4ad-4c00-4c0f-82f3-bc3c85568748",
              "ucrs_display_resource_code": "1417",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/admin/#/evaluate-config/target"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "appraise-module",
              "name": "评价模型配置",
              "sort": 11,
              "icon": "",
              "resourceId": "1416",
              "resourceType": "menu",
              "ucrs_resourceId": "5844060",
              "ucrs_displayName": "评价模型配置",
              "ucrs_web_resource_id": "4823defa-8846-4672-b831-5f1cba860417",
              "ucrs_display_resource_code": "1416",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/admin/#/evaluate-config/model"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/mobile-config",
          "name": "移动端配置",
          "sort": 6,
          "icon": "plat-set",
          "resourceId": "147",
          "resourceType": "menu",
          "ucrs_resourceId": "1657619038",
          "ucrs_displayName": "移动端配置",
          "ucrs_web_resource_id": "b5bab3ff-92dc-409d-8fa9-d5109c01a7c9",
          "ucrs_display_resource_code": "147",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "appBackManager",
              "name": "移动端配置",
              "sort": 1,
              "icon": "",
              "resourceId": "1471",
              "resourceType": "menu",
              "ucrs_resourceId": "219887868",
              "ucrs_displayName": "移动端配置",
              "ucrs_web_resource_id": "93233c58-0b90-4460-987a-3679cc387d85",
              "ucrs_display_resource_code": "1471",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/og_web/#/appRerouseManage/appBackManager"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/message",
          "name": "消息中心",
          "sort": 5,
          "icon": "plat-set",
          "resourceId": "144",
          "resourceType": "menu",
          "ucrs_resourceId": "281830949",
          "ucrs_displayName": "消息中心",
          "ucrs_web_resource_id": "016d8d96-5b1a-4685-a8b1-95b28c9fcc17",
          "ucrs_display_resource_code": "144",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "record",
              "name": "消息记录",
              "sort": 1,
              "icon": "",
              "resourceId": "1441",
              "resourceType": "menu",
              "ucrs_resourceId": "1737077338",
              "ucrs_displayName": "消息记录",
              "ucrs_web_resource_id": "4ca47f54-94a8-4c77-a439-7e80287c67cc",
              "ucrs_display_resource_code": "1441",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/messagecenter_web/#/message-center/record"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "ms-classify",
              "name": "消息类别管理",
              "sort": 5,
              "icon": "",
              "resourceId": "1445",
              "resourceType": "menu",
              "ucrs_resourceId": "737871313",
              "ucrs_displayName": "消息类别管理",
              "ucrs_web_resource_id": "2079db84-4e57-459a-b78f-f83974caaa39",
              "ucrs_display_resource_code": "1445",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/messagecenter_web/#/config/ms-classify"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "model",
              "name": "模板管理",
              "sort": 3,
              "icon": "",
              "resourceId": "1443",
              "resourceType": "menu",
              "ucrs_resourceId": "12938441",
              "ucrs_displayName": "模板管理",
              "ucrs_web_resource_id": "adeec338-c0af-4faf-8dcf-4ed2f19ddc47",
              "ucrs_display_resource_code": "1443",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/messagecenter_web/#/config/model"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "platform",
              "name": "平台管理",
              "sort": 4,
              "icon": "",
              "resourceId": "1444",
              "resourceType": "menu",
              "ucrs_resourceId": "1574515605",
              "ucrs_displayName": "平台管理",
              "ucrs_web_resource_id": "09e4aeda-5231-402c-bd49-3cf683bcd083",
              "ucrs_display_resource_code": "1444",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/messagecenter_web/#/config/platform"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "plan",
              "name": "方案管理",
              "sort": 4,
              "icon": "",
              "resourceId": "1448",
              "resourceType": "menu",
              "ucrs_resourceId": "650072919",
              "ucrs_displayName": "方案管理",
              "ucrs_web_resource_id": "3d85572e-0981-4b33-b106-d30e2ed87897",
              "ucrs_display_resource_code": "1448",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/messagecenter_web/#/config/plan"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "station-news",
              "name": "站内消息",
              "sort": 2,
              "icon": "",
              "resourceId": "1442",
              "resourceType": "menu",
              "ucrs_resourceId": "1883930744",
              "ucrs_displayName": "站内消息",
              "ucrs_web_resource_id": "b7ee9cb2-6cf7-4fad-9f0c-3acf04940875",
              "ucrs_display_resource_code": "1442",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/messagecenter_web/#/message-center/station-news"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "message-log",
              "name": "消息日志",
              "sort": 6,
              "icon": "",
              "resourceId": "1446",
              "resourceType": "menu",
              "ucrs_resourceId": "682181419",
              "ucrs_displayName": "消息日志",
              "ucrs_web_resource_id": "346d158b-1cfc-4989-b451-b805535e47e7",
              "ucrs_display_resource_code": "1446",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/messagecenter_web/#/log/message-log"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "sys-statistics",
              "name": "消息统计",
              "sort": 7,
              "icon": "",
              "resourceId": "1447",
              "resourceType": "menu",
              "ucrs_resourceId": "460409948",
              "ucrs_displayName": "消息统计",
              "ucrs_web_resource_id": "ed821a58-590b-4645-9c56-cd15194f616b",
              "ucrs_display_resource_code": "1447",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/messagecenter_web/#/statistics/sys-statistics"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/work-config",
          "name": "考勤系统设置",
          "sort": 6,
          "icon": "basic-set",
          "resourceId": "146",
          "resourceType": "menu",
          "ucrs_resourceId": "1418285672",
          "ucrs_displayName": "考勤系统设置",
          "ucrs_web_resource_id": "71d613d7-843e-421f-bc28-63935e713fd1",
          "ucrs_display_resource_code": "146",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "holidayRules",
              "name": "假期规则设置",
              "sort": 2,
              "icon": "",
              "resourceId": "1462",
              "resourceType": "menu",
              "ucrs_resourceId": "1115143666",
              "ucrs_displayName": "假期规则设置",
              "ucrs_web_resource_id": "e0de32c6-ab3b-421e-aaeb-88a6259c9801",
              "ucrs_display_resource_code": "1462",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/igrid/#/attendanceSet/holidayRules"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "range",
              "name": "假期范围设置",
              "sort": 3,
              "icon": "",
              "resourceId": "1463",
              "resourceType": "menu",
              "ucrs_resourceId": "1051393859",
              "ucrs_displayName": "假期范围设置",
              "ucrs_web_resource_id": "fda3f765-37eb-4425-ae84-03b6bba29939",
              "ucrs_display_resource_code": "1463",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/igrid/#/attendanceSet/range"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "rules",
              "name": "考勤规则设置",
              "sort": 1,
              "icon": "",
              "resourceId": "1461",
              "resourceType": "menu",
              "ucrs_resourceId": "255988581",
              "ucrs_displayName": "考勤规则设置",
              "ucrs_web_resource_id": "cc64d355-10ae-42c6-a6ca-7092f66a5ab6",
              "ucrs_display_resource_code": "1461",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/igrid/#/attendanceSet/rules"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "事件中心",
      "sort": 2,
      "icon": "",
      "resourceId": "12",
      "resourceType": "app",
      "ucrs_resourceId": "1921737941",
      "ucrs_displayName": "事件中心",
      "ucrs_web_resource_id": "c9bc5551-6611-4c58-b8e8-34be8c0af6a3",
      "ucrs_display_resource_code": "12",
      "ucrs_display_resource_type": "应用",
      "permissions": [
        "show"
      ],
      "children": [
        {
          "path": "/eventcenter-inspector",
          "name": "事件督办",
          "sort": 6,
          "icon": "事件督办",
          "resourceId": "126",
          "resourceType": "menu",
          "ucrs_resourceId": "396852085",
          "ucrs_displayName": "事件督办",
          "ucrs_web_resource_id": "788e0eaa-9217-4dbf-8a41-ab4e312b0f53",
          "ucrs_display_resource_code": "126",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "list",
              "name": "发起督办",
              "sort": 1,
              "icon": "",
              "resourceId": "1261",
              "resourceType": "menu",
              "ucrs_resourceId": "959818653",
              "ucrs_displayName": "发起督办",
              "ucrs_web_resource_id": "4cb7439b-1bdf-4b86-a75b-5ec57f284616",
              "ucrs_display_resource_code": "1261",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/inspector/list"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "settle",
              "name": "我的督办单",
              "sort": 3,
              "icon": "",
              "resourceId": "1263",
              "resourceType": "menu",
              "ucrs_resourceId": "747722143",
              "ucrs_displayName": "我的督办单",
              "ucrs_web_resource_id": "1cd31f66-8584-4c82-80e4-450aeb3b7a99",
              "ucrs_display_resource_code": "1263",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/inspector/settle"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "feedback",
              "name": "督办反馈",
              "sort": 2,
              "icon": "",
              "resourceId": "1262",
              "resourceType": "menu",
              "ucrs_resourceId": "527111605",
              "ucrs_displayName": "督办反馈",
              "ucrs_web_resource_id": "42297f47-5ac5-4443-b541-4061fa4b22a5",
              "ucrs_display_resource_code": "1262",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/inspector/feedback"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/eventcenter-monitor",
          "name": "事件分析",
          "sort": 7,
          "icon": "事件监控",
          "resourceId": "127",
          "resourceType": "menu",
          "ucrs_resourceId": "449312550",
          "ucrs_displayName": "事件分析",
          "ucrs_web_resource_id": "5d091290-1522-4cb2-aaa4-7c45bb6c10a0",
          "ucrs_display_resource_code": "127",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "eventType-analysis",
              "name": "事件类型分析",
              "sort": 2,
              "icon": "",
              "resourceId": "1272",
              "resourceType": "menu",
              "ucrs_resourceId": "148287139",
              "ucrs_displayName": "事件类型分析",
              "ucrs_web_resource_id": "c5348a24-0851-4202-be43-193c125ff03b",
              "ucrs_display_resource_code": "1272",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/event-analysis/eventType-analysis"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "third-inflow",
              "name": "三方流入分析",
              "sort": 1,
              "icon": "",
              "resourceId": "1271",
              "resourceType": "menu",
              "ucrs_resourceId": "1104285231",
              "ucrs_displayName": "三方流入分析",
              "ucrs_web_resource_id": "35421a6b-b73c-4527-bd8d-9b787038efbe",
              "ucrs_display_resource_code": "1271",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/monitor/third-inflow"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "area-analysis",
              "name": "区域办理分析",
              "sort": 4,
              "icon": "",
              "resourceId": "1274",
              "resourceType": "menu",
              "ucrs_resourceId": "1589662262",
              "ucrs_displayName": "区域办理分析",
              "ucrs_web_resource_id": "f0c5f7eb-a6bd-4881-9446-37d0a2417f9b",
              "ucrs_display_resource_code": "1274",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/event-analysis/area-analysis"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "event-access",
              "name": "三方接口监控",
              "sort": 5,
              "icon": "",
              "resourceId": "1275",
              "resourceType": "menu",
              "ucrs_resourceId": "1860441671",
              "ucrs_displayName": "三方接口监控",
              "ucrs_web_resource_id": "4ffdc778-8cfe-48d1-8824-7e0ffe22c504",
              "ucrs_display_resource_code": "1275",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/monitor/event-access"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "dept-analysis",
              "name": "部门办理分析",
              "sort": 3,
              "icon": "",
              "resourceId": "1273",
              "resourceType": "menu",
              "ucrs_resourceId": "625449349",
              "ucrs_displayName": "部门办理分析",
              "ucrs_web_resource_id": "bc089d22-a617-4be9-9d27-e290ed553c69",
              "ucrs_display_resource_code": "1273",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/event-analysis/dept-analysis"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/eventcenter-typein",
          "name": "事件录入",
          "sort": 2,
          "icon": "事件录入",
          "resourceId": "123",
          "resourceType": "menu",
          "ucrs_resourceId": "759643586",
          "ucrs_displayName": "事件录入",
          "ucrs_web_resource_id": "183e77c8-3c1f-4d1e-9e3c-5f82b6d46b64",
          "ucrs_display_resource_code": "123",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "",
              "name": "事件录入",
              "sort": 1,
              "icon": "事件录入",
              "resourceId": "1231",
              "resourceType": "menu",
              "ucrs_resourceId": "125551291",
              "ucrs_displayName": "事件录入",
              "ucrs_web_resource_id": "b4323148-f375-4e48-ae67-de9e76206c60",
              "ucrs_display_resource_code": "1231",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/event/type-in"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/eventcenter-event",
          "name": "全部事件",
          "sort": 4,
          "icon": "事件汇聚",
          "resourceId": "122",
          "resourceType": "menu",
          "ucrs_resourceId": "843096997",
          "ucrs_displayName": "全部事件",
          "ucrs_web_resource_id": "59089a87-232e-4aa9-a4c8-c60953e8f929",
          "ucrs_display_resource_code": "122",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "query",
              "name": "全部事件",
              "sort": 1,
              "icon": "",
              "resourceId": "1222",
              "resourceType": "menu",
              "ucrs_resourceId": "1861512344",
              "ucrs_displayName": "全部事件",
              "ucrs_web_resource_id": "07f6efce-c12b-4062-b182-aac4c6e500bc",
              "ucrs_display_resource_code": "1222",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/event/collection/all"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "todo",
              "name": "待处置事件",
              "sort": 3,
              "icon": "",
              "resourceId": "1221",
              "resourceType": "menu",
              "ucrs_resourceId": "1832970744",
              "ucrs_displayName": "待处置事件",
              "ucrs_web_resource_id": "73f14825-475c-43e1-86c8-b447dc37c57b",
              "ucrs_display_resource_code": "1221",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/event/collection/unsolved"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/eventcenter-prehandle",
          "name": "事件预处理",
          "sort": 3,
          "icon": "事件预处理",
          "resourceId": "124",
          "resourceType": "menu",
          "ucrs_resourceId": "1536153821",
          "ucrs_displayName": "事件预处理",
          "ucrs_web_resource_id": "0f0a9c7e-5a5d-4cd3-9d8c-342a465337a2",
          "ucrs_display_resource_code": "124",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "merge",
              "name": "事件合并",
              "sort": 2,
              "icon": "",
              "resourceId": "1241",
              "resourceType": "menu",
              "ucrs_resourceId": "583842034",
              "ucrs_displayName": "事件合并",
              "ucrs_web_resource_id": "6af16197-2fef-48d1-912a-b05bd779ca1c",
              "ucrs_display_resource_code": "1241",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/event/merge"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "pre-accepted",
              "name": "事件受理",
              "sort": 1,
              "icon": "",
              "resourceId": "1243",
              "resourceType": "menu",
              "ucrs_resourceId": "840320292",
              "ucrs_displayName": "事件受理",
              "ucrs_web_resource_id": "cca1754b-b1d9-4f89-8d74-a90f93bf8db5",
              "ucrs_display_resource_code": "1243",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/event/pre-accepted"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "de-weight",
              "name": "事件去重",
              "sort": 3,
              "icon": "",
              "resourceId": "1242",
              "resourceType": "menu",
              "ucrs_resourceId": "61587230",
              "ucrs_displayName": "事件去重",
              "ucrs_web_resource_id": "8b95de1c-ac3d-45a1-bcd7-f4c37c89b583",
              "ucrs_display_resource_code": "1242",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/event/de-weight"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/eventcenter-manage",
          "name": "事件评价",
          "sort": 8,
          "icon": "事件评价",
          "resourceId": "128",
          "resourceType": "menu",
          "ucrs_resourceId": "768130374",
          "ucrs_displayName": "事件评价",
          "ucrs_web_resource_id": "d1e25594-8de6-45f1-8b8d-16157321b0aa",
          "ucrs_display_resource_code": "128",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "appraise",
              "name": "事件评价",
              "sort": 1,
              "icon": "事件评价",
              "resourceId": "1282",
              "resourceType": "menu",
              "ucrs_resourceId": "1958949157",
              "ucrs_displayName": "事件评价",
              "ucrs_web_resource_id": "cd2ed372-8156-40dc-adb1-77adb2667f92",
              "ucrs_display_resource_code": "1282",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/event/appraise"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/eventcenter-disaptch",
          "name": "调度处置",
          "sort": 5,
          "icon": "dispatch",
          "resourceId": "125",
          "resourceType": "menu",
          "ucrs_resourceId": "587904911",
          "ucrs_displayName": "调度处置",
          "ucrs_web_resource_id": "c66e99c0-48d3-44ab-849b-fe7bcf8300de",
          "ucrs_display_resource_code": "125",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "third-self-handle",
              "name": "三方自处置事件",
              "sort": 5,
              "icon": "",
              "resourceId": "1227",
              "resourceType": "menu",
              "ucrs_resourceId": "207446813",
              "ucrs_displayName": "三方自处置事件",
              "ucrs_web_resource_id": "c2db3656-dcc0-4a87-b2c5-614a06b51b50",
              "ucrs_display_resource_code": "1227",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/event/collection/third-self-handle"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "approval",
              "name": "事件审批",
              "sort": 6,
              "icon": "",
              "resourceId": "1255",
              "resourceType": "menu",
              "ucrs_resourceId": "543599012",
              "ucrs_displayName": "事件审批",
              "ucrs_web_resource_id": "11e7da56-5384-4c2e-9109-41f6a473adb1",
              "ucrs_display_resource_code": "1255",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/event/approval"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "workbenchtodo",
              "name": "统一待办",
              "sort": 1,
              "icon": "",
              "resourceId": "1223",
              "resourceType": "menu",
              "ucrs_resourceId": "179442251",
              "ucrs_displayName": "统一待办",
              "ucrs_web_resource_id": "8e4ec175-ef31-4bec-86a2-74889a17aa58",
              "ucrs_display_resource_code": "1223",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/workbench/todo"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "workbenchassist",
              "name": "协办事件",
              "sort": 3,
              "icon": "",
              "resourceId": "1225",
              "resourceType": "menu",
              "ucrs_resourceId": "1211144434",
              "ucrs_displayName": "协办事件",
              "ucrs_web_resource_id": "74ee04d0-f133-48fa-9474-c41f11097ad7",
              "ucrs_display_resource_code": "1225",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/workbench/assist"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "workbenchhandle",
              "name": "经办事件",
              "sort": 2,
              "icon": "",
              "resourceId": "1224",
              "resourceType": "menu",
              "ucrs_resourceId": "773364292",
              "ucrs_displayName": "经办事件",
              "ucrs_web_resource_id": "a1bac206-77a8-4097-a637-38e9701e768d",
              "ucrs_display_resource_code": "1224",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/workbench/handle"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "workbenchnotify",
              "name": "知会事件",
              "sort": 4,
              "icon": "",
              "resourceId": "1226",
              "resourceType": "menu",
              "ucrs_resourceId": "2025327445",
              "ucrs_displayName": "知会事件",
              "ucrs_web_resource_id": "f5ae7ec6-4c05-4e20-be0a-8a650533d44d",
              "ucrs_display_resource_code": "1226",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/workbench/notify"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "工作台",
      "sort": 1,
      "icon": "",
      "resourceId": "11",
      "resourceType": "app",
      "ucrs_resourceId": "33767748",
      "ucrs_displayName": "工作台",
      "ucrs_web_resource_id": "a551acb4-ee02-4a5a-8e8b-1b34ea6caaca",
      "ucrs_display_resource_code": "11",
      "ucrs_display_resource_type": "应用",
      "extAttr": {
        "hasNoLeftMenus": true
      },
      "permissions": [
        "show"
      ],
      "children": [
        {
          "path": "/inmenu",
          "name": "内嵌工作台",
          "sort": 2,
          "icon": "",
          "resourceId": "112",
          "resourceType": "menu",
          "ucrs_resourceId": "1076362897",
          "ucrs_displayName": "内嵌工作台",
          "ucrs_web_resource_id": "079854d5-39c1-48e7-9727-7377b2de6af7",
          "ucrs_display_resource_code": "112",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "remark": "",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "command-event",
              "name": "指挥事件",
              "sort": 0,
              "icon": "指挥体系",
              "resourceId": "1125",
              "resourceType": "menu",
              "ucrs_resourceId": "681792837",
              "ucrs_displayName": "指挥事件",
              "ucrs_web_resource_id": "808d446c-b185-43e7-b60f-28700f95444d",
              "ucrs_display_resource_code": "1125",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/linkage-command-event-handle-web/strategy-list/event-list-index"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "event-approval",
              "name": "审批事件",
              "sort": 0,
              "icon": "事件预处理",
              "resourceId": "1123",
              "resourceType": "menu",
              "ucrs_resourceId": "95391936",
              "ucrs_displayName": "审批事件",
              "ucrs_web_resource_id": "424f3395-7802-49bd-a7de-c724e4b30bd6",
              "ucrs_display_resource_code": "1123",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/event/approval"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "event-todo",
              "name": "待办事件",
              "sort": 0,
              "icon": "事件汇聚",
              "resourceId": "1122",
              "resourceType": "menu",
              "ucrs_resourceId": "583592037",
              "ucrs_displayName": "待办事件",
              "ucrs_web_resource_id": "067b613f-2729-4fa3-8bed-c76872a0debe",
              "ucrs_display_resource_code": "1122",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/workbench/todo"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "command-task",
              "name": "指挥任务",
              "sort": 0,
              "icon": "task-manage",
              "resourceId": "1126",
              "resourceType": "menu",
              "ucrs_resourceId": "61549305",
              "ucrs_displayName": "指挥任务",
              "ucrs_web_resource_id": "2f23972e-ec58-4c4a-ab1b-20dd6f07cda3",
              "ucrs_display_resource_code": "1126",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/swan-task-center/taskCenter/taskList"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "event-handle",
              "name": "经办事件",
              "sort": 0,
              "icon": "事件预处理",
              "resourceId": "1124",
              "resourceType": "menu",
              "ucrs_resourceId": "683121759",
              "ucrs_displayName": "经办事件",
              "ucrs_web_resource_id": "831669f1-2260-4c46-a7f3-23845b5ef0a6",
              "ucrs_display_resource_code": "1124",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/workbench/handle"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/workbench",
          "name": "工作台",
          "sort": 1,
          "icon": "mon-object",
          "resourceId": "111",
          "resourceType": "menu",
          "ucrs_resourceId": "2067394231",
          "ucrs_displayName": "工作台",
          "ucrs_web_resource_id": "cbbc38b7-feed-4364-8d0e-c13c0c47cae1",
          "ucrs_display_resource_code": "111",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "0",
          "component": "layout",
          "remark": "",
          "extAttr": {
            "keepAlive": true,
            "alwaysShow": true,
            "isworkBench": true
          },
          "permissions": [
            "hidden",
            "show"
          ],
          "children": [
            {
              "path": "",
              "name": "工作台",
              "sort": 0,
              "icon": "",
              "resourceId": "1112",
              "resourceType": "menu",
              "ucrs_resourceId": "2061529416",
              "ucrs_displayName": "工作台",
              "ucrs_web_resource_id": "15fe4231-319e-44fa-a7b1-07091a5c74a7",
              "ucrs_display_resource_code": "1112",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "0",
              "component": "views/workbench/index.vue",
              "remark": "",
              "extAttr": {
                "hidden": true
              },
              "permissions": [
                "hidden",
                "show"
              ]
            }
          ]
        },
        {
          "path": "/outmenu",
          "name": "隐藏菜单",
          "sort": 3,
          "icon": "",
          "resourceId": "114",
          "resourceType": "menu",
          "ucrs_resourceId": "1158971585",
          "ucrs_displayName": "隐藏菜单",
          "ucrs_web_resource_id": "8fd3018c-6e0a-403a-94d7-4d9d9f7f0544",
          "ucrs_display_resource_code": "114",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "remark": "",
          "extAttr": {
            "hidden": true
          },
          "permissions": [
            "hidden",
            "show"
          ],
          "children": [
            {
              "path": "msg-list",
              "name": "消息列表",
              "sort": 0,
              "icon": "",
              "resourceId": "1145",
              "resourceType": "menu",
              "ucrs_resourceId": "511092308",
              "ucrs_displayName": "消息列表",
              "ucrs_web_resource_id": "c15a3f7b-6aa0-48f7-8bcf-a9611720f4e0",
              "ucrs_display_resource_code": "1145",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "hidden": true,
                "iframeUrl": "http://10.32.132.123:6060/messagecenter_web/#/message"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "event-handle-info",
              "name": "经办事件详情",
              "sort": 0,
              "icon": "事件汇聚",
              "resourceId": "1144",
              "resourceType": "menu",
              "ucrs_resourceId": "301612649",
              "ucrs_displayName": "经办事件详情",
              "ucrs_web_resource_id": "4e76cd3e-6135-4414-9dbc-724cebf94037",
              "ucrs_display_resource_code": "1144",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/workbench/handle/info"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "event-detail",
              "name": "组织机构详情",
              "sort": 0,
              "icon": "",
              "resourceId": "1141",
              "resourceType": "menu",
              "ucrs_resourceId": "235144705",
              "ucrs_displayName": "组织机构详情",
              "ucrs_web_resource_id": "e927258d-1b41-4a1d-be1f-de79dd9786a3",
              "ucrs_display_resource_code": "1141",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "hidden": true,
                "iframeUrl": "http://10.32.132.123:6060/igrid/#/governOrg/detail"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "event-todo-info",
              "name": "待办事件详情",
              "sort": 0,
              "icon": "事件汇聚",
              "resourceId": "1142",
              "resourceType": "menu",
              "ucrs_resourceId": "809850266",
              "ucrs_displayName": "待办事件详情",
              "ucrs_web_resource_id": "9fb23202-06a4-427d-9099-c5b81f7e0f43",
              "ucrs_display_resource_code": "1142",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/workbench/todo/info"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "event-approval-info",
              "name": "审批事件详情",
              "sort": 0,
              "icon": "事件汇聚",
              "resourceId": "1143",
              "resourceType": "menu",
              "ucrs_resourceId": "744634300",
              "ucrs_displayName": "审批事件详情",
              "ucrs_web_resource_id": "2bc74e5a-3369-4a70-9fc5-b2aea2a14e3b",
              "ucrs_display_resource_code": "1143",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/event/#/event/approval/info"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "指挥中心",
      "sort": 3,
      "icon": "",
      "resourceId": "15",
      "resourceType": "app",
      "ucrs_resourceId": "1421198872",
      "ucrs_displayName": "指挥中心",
      "ucrs_web_resource_id": "92e1aad8-3e9b-4bbe-83b1-100b68e6e54d",
      "ucrs_display_resource_code": "15",
      "ucrs_display_resource_type": "应用",
      "permissions": [
        "show"
      ],
      "children": [
        {
          "path": "/commandcenter-2",
          "name": "协同标绘",
          "sort": 4,
          "icon": "协同标绘",
          "resourceId": "152",
          "resourceType": "menu",
          "ucrs_resourceId": "1683516730",
          "ucrs_displayName": "协同标绘",
          "ucrs_web_resource_id": "7a50b5a6-b754-4a82-9e3a-5cd52c020f7f",
          "ucrs_display_resource_code": "152",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "",
              "name": "协同标绘",
              "sort": 0,
              "icon": "协同标绘",
              "resourceId": "1521",
              "resourceType": "menu",
              "ucrs_resourceId": "618898567",
              "ucrs_displayName": "协同标绘",
              "ucrs_web_resource_id": "8013223c-fe0c-4320-b104-5985294f69cd",
              "ucrs_display_resource_code": "1521",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/pc-collaborative-plotting/plotting/list"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/commandcenter-4",
          "name": "任务管理",
          "sort": 3,
          "icon": "task-manage",
          "resourceId": "154",
          "resourceType": "menu",
          "ucrs_resourceId": "1641383592",
          "ucrs_displayName": "任务管理",
          "ucrs_web_resource_id": "080c9ec0-3a4f-45a0-b97f-f284e0d64b6e",
          "ucrs_display_resource_code": "154",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "taskTypeConfigure",
              "name": "任务类型",
              "sort": 2,
              "icon": "",
              "resourceId": "1542",
              "resourceType": "menu",
              "ucrs_resourceId": "1525250265",
              "ucrs_displayName": "任务类型",
              "ucrs_web_resource_id": "845eaf44-06d3-4570-831e-7876b20f2a2a",
              "ucrs_display_resource_code": "1542",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/swan-task-center/taskCenter/taskTypeConfigure"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "taskList",
              "name": "任务管理",
              "sort": 1,
              "icon": "",
              "resourceId": "1541",
              "resourceType": "menu",
              "ucrs_resourceId": "1685666",
              "ucrs_displayName": "任务管理",
              "ucrs_web_resource_id": "78f8e868-0024-4fb0-8259-5c4510262958",
              "ucrs_display_resource_code": "1541",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/swan-task-center/taskCenter/taskList"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/commandcenter-6",
          "name": "指挥体系",
          "sort": 5,
          "icon": "指挥体系",
          "resourceId": "156",
          "resourceType": "menu",
          "ucrs_resourceId": "1257033675",
          "ucrs_displayName": "指挥体系",
          "ucrs_web_resource_id": "b13bb530-e5fc-4621-8723-b92bd4fcb40d",
          "ucrs_display_resource_code": "156",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "command-management",
              "name": "指挥体系管理",
              "sort": 0,
              "icon": "",
              "resourceId": "1561",
              "resourceType": "menu",
              "ucrs_resourceId": "336952961",
              "ucrs_displayName": "指挥体系管理",
              "ucrs_web_resource_id": "e47862bf-3018-443c-8100-6ded31ec29db",
              "ucrs_display_resource_code": "1561",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/swan-command-system/#/command-system/command-management"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "role-management",
              "name": "岗位职责管理",
              "sort": 0,
              "icon": "",
              "resourceId": "1562",
              "resourceType": "menu",
              "ucrs_resourceId": "1623943630",
              "ucrs_displayName": "岗位职责管理",
              "ucrs_web_resource_id": "6d4dbc42-215c-4104-959c-a1c80967bf99",
              "ucrs_display_resource_code": "1562",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/swan-command-system/#/command-system/role-management"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/commandcenter-5",
          "name": "一张图",
          "sort": 2,
          "icon": "协同标绘",
          "resourceId": "155",
          "resourceType": "menu",
          "ucrs_resourceId": "1948424079",
          "ucrs_displayName": "一张图",
          "ucrs_web_resource_id": "13ad3064-a73d-4e53-9b21-d9d3098f2a87",
          "ucrs_display_resource_code": "155",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "http://10.32.132.123:6060/linkage-command-op-web/overview",
              "name": "一张图",
              "sort": 0,
              "icon": "一张图",
              "resourceId": "1551",
              "resourceType": "menu",
              "ucrs_resourceId": "2008509567",
              "ucrs_displayName": "一张图",
              "ucrs_web_resource_id": "d980520f-e985-4e88-a3df-97f5c42d07ca",
              "ucrs_display_resource_code": "1551",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": ""
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/commandcenter-3",
          "name": "事件响应",
          "sort": 1,
          "icon": "事件响应",
          "resourceId": "153",
          "resourceType": "menu",
          "ucrs_resourceId": "777248380",
          "ucrs_displayName": "事件响应",
          "ucrs_web_resource_id": "cf382b94-8b80-495b-90f7-cc8bc4cbced0",
          "ucrs_display_resource_code": "153",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "strategy",
              "name": "指挥策略",
              "sort": 1,
              "icon": "",
              "resourceId": "1531",
              "resourceType": "menu",
              "ucrs_resourceId": "160538888",
              "ucrs_displayName": "指挥策略",
              "ucrs_web_resource_id": "702f64b8-c56a-4d5a-b84f-2c855739ae12",
              "ucrs_display_resource_code": "1531",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/linkage-command-event-handle-web/strategy-list/index"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "event-list",
              "name": "事件管理",
              "sort": 2,
              "icon": "",
              "resourceId": "1532",
              "resourceType": "menu",
              "ucrs_resourceId": "534555937",
              "ucrs_displayName": "事件管理",
              "ucrs_web_resource_id": "4b8f2824-c449-4397-b51c-79cad0c1d2df",
              "ucrs_display_resource_code": "1532",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/linkage-command-event-handle-web/strategy-list/event-list-index"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "监测中心",
      "sort": 6,
      "icon": "",
      "resourceId": "18",
      "resourceType": "app",
      "ucrs_resourceId": "2024275618",
      "ucrs_displayName": "监测中心",
      "ucrs_web_resource_id": "5da53dc8-53ba-486a-9326-61a735bd9d52",
      "ucrs_display_resource_code": "18",
      "ucrs_display_resource_type": "应用",
      "permissions": [
        "show"
      ],
      "children": [
        {
          "path": "/warning-1",
          "name": "概览",
          "sort": 1,
          "icon": "",
          "resourceId": "181",
          "resourceType": "menu",
          "ucrs_resourceId": "2070632433",
          "ucrs_displayName": "概览",
          "ucrs_web_resource_id": "a686d291-2aa8-499a-90cd-afda1bb16796",
          "ucrs_display_resource_code": "181",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "index",
              "name": "概览",
              "sort": 0,
              "icon": "",
              "resourceId": "1811",
              "resourceType": "menu",
              "ucrs_resourceId": "1631310900",
              "ucrs_displayName": "概览",
              "ucrs_web_resource_id": "69ec1d0e-93c6-4150-a1f1-bd09d150a9ce",
              "ucrs_display_resource_code": "1811",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/pre-warning-center/homepage/index"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/warning-2",
          "name": "指标管理",
          "sort": 2,
          "icon": "",
          "resourceId": "182",
          "resourceType": "menu",
          "ucrs_resourceId": "1909021547",
          "ucrs_displayName": "指标管理",
          "ucrs_web_resource_id": "b9e70c17-99b9-43cf-9b2c-7d5e3a63e162",
          "ucrs_display_resource_code": "182",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "computational-formula-mgmt",
              "name": "内置公式库",
              "sort": 1,
              "icon": "",
              "resourceId": "1821",
              "resourceType": "menu",
              "ucrs_resourceId": "1313189221",
              "ucrs_displayName": "内置公式库",
              "ucrs_web_resource_id": "9f83331d-31d6-4582-b63c-2d06275c7baa",
              "ucrs_display_resource_code": "1821",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/pre-warning-center/system-common-config/computational-formula-mgmt"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "indicator-mgmt",
              "name": "指标管理",
              "sort": 3,
              "icon": "",
              "resourceId": "1823",
              "resourceType": "menu",
              "ucrs_resourceId": "80343272",
              "ucrs_displayName": "指标管理",
              "ucrs_web_resource_id": "6ff42715-f12f-4fdc-9853-418714cb3aaa",
              "ucrs_display_resource_code": "1823",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/pre-warning-center/system-common-config/indicator-mgmt"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "measuring-unit-mgmt",
              "name": "计量单位管理",
              "sort": 2,
              "icon": "",
              "resourceId": "1822",
              "resourceType": "menu",
              "ucrs_resourceId": "1820844868",
              "ucrs_displayName": "计量单位管理",
              "ucrs_web_resource_id": "5b25efd3-9c04-480d-b9bb-7b22e2246e27",
              "ucrs_display_resource_code": "1822",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/pre-warning-center/system-common-config/measuring-unit-mgmt"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/warning-6",
          "name": "监测预警",
          "sort": 6,
          "icon": "",
          "resourceId": "186",
          "resourceType": "menu",
          "ucrs_resourceId": "1587464998",
          "ucrs_displayName": "监测预警",
          "ucrs_web_resource_id": "c0c9c0a1-dfde-4366-a480-806275187dfd",
          "ucrs_display_resource_code": "186",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "third-warning",
              "name": "第三方预警",
              "sort": 5,
              "icon": "",
              "resourceId": "1865",
              "resourceType": "menu",
              "ucrs_resourceId": "921769797",
              "ucrs_displayName": "第三方预警",
              "ucrs_web_resource_id": "3e6900ce-93c7-42a4-9821-5764a63d1fed",
              "ucrs_display_resource_code": "1865",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/pre-warning-center/monitoring-warning/warning-management/third-warning"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "warning-judgment",
              "name": "预警研判",
              "sort": 4,
              "icon": "",
              "resourceId": "1864",
              "resourceType": "menu",
              "ucrs_resourceId": "1697231008",
              "ucrs_displayName": "预警研判",
              "ucrs_web_resource_id": "65d1a014-badb-41da-b928-19b73260cb98",
              "ucrs_display_resource_code": "1864",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/pre-warning-center/monitoring-warning/warning-management/warning-judgment"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "monitoring-control",
              "name": "接入数据监测",
              "sort": 1,
              "icon": "",
              "resourceId": "1861",
              "resourceType": "menu",
              "ucrs_resourceId": "164055220",
              "ucrs_displayName": "接入数据监测",
              "ucrs_web_resource_id": "d52641cd-ffdb-49ee-b52d-166ccb565bb7",
              "ucrs_display_resource_code": "1861",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/pre-warning-center/monitoring-warning/realtime-monitoring/monitoring-control"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "historical-warning",
              "name": "历史预警",
              "sort": 6,
              "icon": "",
              "resourceId": "1866",
              "resourceType": "menu",
              "ucrs_resourceId": "621806561",
              "ucrs_displayName": "历史预警",
              "ucrs_web_resource_id": "b104aa15-f505-44a1-93b2-6a0fcdedd5a9",
              "ucrs_display_resource_code": "1866",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/pre-warning-center/monitoring-warning/warning-management/historical-warning"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "online-monitoring",
              "name": "指标数据监测",
              "sort": 2,
              "icon": "",
              "resourceId": "1862",
              "resourceType": "menu",
              "ucrs_resourceId": "364033190",
              "ucrs_displayName": "指标数据监测",
              "ucrs_web_resource_id": "c44f7e1b-2d2c-4904-8169-306546f12654",
              "ucrs_display_resource_code": "1862",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/pre-warning-center/monitoring-warning/realtime-monitoring/online-monitoring"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "realtime-warning",
              "name": "实时预警",
              "sort": 3,
              "icon": "",
              "resourceId": "1863",
              "resourceType": "menu",
              "ucrs_resourceId": "782222634",
              "ucrs_displayName": "实时预警",
              "ucrs_web_resource_id": "f603763d-0c84-405d-9d88-e34a04bb6fda",
              "ucrs_display_resource_code": "1863",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/pre-warning-center/monitoring-warning/warning-management/realtime-warning"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/warning-3",
          "name": "预警策略",
          "sort": 3,
          "icon": "",
          "resourceId": "183",
          "resourceType": "menu",
          "ucrs_resourceId": "2061086573",
          "ucrs_displayName": "预警策略",
          "ucrs_web_resource_id": "ebd928fc-285a-4231-9cb5-312cb6d3527f",
          "ucrs_display_resource_code": "183",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "event-type",
              "name": "风险分类管理",
              "sort": 1,
              "icon": "",
              "resourceId": "1831",
              "resourceType": "menu",
              "ucrs_resourceId": "774127324",
              "ucrs_displayName": "风险分类管理",
              "ucrs_web_resource_id": "42fd0574-8a17-4b72-af45-ff3be94c8ddd",
              "ucrs_display_resource_code": "1831",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/pre-warning-center/monitoring-config/event-type"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "alarm-strategy-config",
              "name": "预警策略配置",
              "sort": 2,
              "icon": "",
              "resourceId": "1832",
              "resourceType": "menu",
              "ucrs_resourceId": "1987816919",
              "ucrs_displayName": "预警策略配置",
              "ucrs_web_resource_id": "cf6acc4b-4eec-418f-b300-af23ee7c214c",
              "ucrs_display_resource_code": "1832",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/pre-warning-center/monitoring-config/alarm-strategy-config"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/warning-5",
          "name": "监测布控",
          "sort": 5,
          "icon": "",
          "resourceId": "185",
          "resourceType": "menu",
          "ucrs_resourceId": "1138613026",
          "ucrs_displayName": "监测布控",
          "ucrs_web_resource_id": "51196ed1-f339-4772-8061-d7824132f57d",
          "ucrs_display_resource_code": "185",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "subject",
              "name": "监测主体管理",
              "sort": 1,
              "icon": "",
              "resourceId": "1851",
              "resourceType": "menu",
              "ucrs_resourceId": "765263199",
              "ucrs_displayName": "监测主体管理",
              "ucrs_web_resource_id": "cc58c1bf-c2ea-4a96-99d9-af61e712d93b",
              "ucrs_display_resource_code": "1851",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/pre-warning-center/monitoring-elements/subject"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "point",
              "name": "监测点管理",
              "sort": 2,
              "icon": "",
              "resourceId": "1852",
              "resourceType": "menu",
              "ucrs_resourceId": "1580152682",
              "ucrs_displayName": "监测点管理",
              "ucrs_web_resource_id": "bd98ab8f-b229-4719-bf59-e697e6110f6a",
              "ucrs_display_resource_code": "1852",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/pre-warning-center/monitoring-elements/point"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "equipment",
              "name": "设备管理",
              "sort": 3,
              "icon": "",
              "resourceId": "1853",
              "resourceType": "menu",
              "ucrs_resourceId": "104703457",
              "ucrs_displayName": "设备管理",
              "ucrs_web_resource_id": "5a633bd8-a6f3-4d80-9559-a1ad753b45fc",
              "ucrs_display_resource_code": "1853",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/pre-warning-center/monitoring-elements/equipment"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/warning-4",
          "name": "数据接入",
          "sort": 4,
          "icon": "",
          "resourceId": "184",
          "resourceType": "menu",
          "ucrs_resourceId": "1373463981",
          "ucrs_displayName": "数据接入",
          "ucrs_web_resource_id": "eba489e3-731b-42cc-b94d-8bd405902532",
          "ucrs_display_resource_code": "184",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "access-object",
              "name": "接入对象管理",
              "sort": 1,
              "icon": "",
              "resourceId": "1841",
              "resourceType": "menu",
              "ucrs_resourceId": "496874656",
              "ucrs_displayName": "接入对象管理",
              "ucrs_web_resource_id": "95fbe9a2-846a-45bd-9701-5c0aeb1c1906",
              "ucrs_display_resource_code": "1841",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/pre-warning-center/access-management/access-object"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "indicator-data-access",
              "name": "指标数据项管理",
              "sort": 3,
              "icon": "",
              "resourceId": "1843",
              "resourceType": "menu",
              "ucrs_resourceId": "1803617044",
              "ucrs_displayName": "指标数据项管理",
              "ucrs_web_resource_id": "50fcf522-0ecc-4b84-afe7-768d6bb07f2a",
              "ucrs_display_resource_code": "1843",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/pre-warning-center/access-management/indicator-data-access"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "access-item",
              "name": "接入数据项管理",
              "sort": 2,
              "icon": "",
              "resourceId": "1842",
              "resourceType": "menu",
              "ucrs_resourceId": "187961220",
              "ucrs_displayName": "接入数据项管理",
              "ucrs_web_resource_id": "ffc74aee-2f6d-49f4-b8f7-fe26936ab6c2",
              "ucrs_display_resource_code": "1842",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/pre-warning-center/access-management/access-item"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/warning-7",
          "name": "综合分析",
          "sort": 7,
          "icon": "",
          "resourceId": "187",
          "resourceType": "menu",
          "ucrs_resourceId": "2035203377",
          "ucrs_displayName": "综合分析",
          "ucrs_web_resource_id": "2caf29a1-ed36-496d-9b60-22c8951545c5",
          "ucrs_display_resource_code": "187",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "target-analysis",
              "name": "指标综合分析",
              "sort": 1,
              "icon": "",
              "resourceId": "1871",
              "resourceType": "menu",
              "ucrs_resourceId": "580889764",
              "ucrs_displayName": "指标综合分析",
              "ucrs_web_resource_id": "37cdd837-52c7-42b8-ac3f-2f03649c53bd",
              "ucrs_display_resource_code": "1871",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/pre-warning-center/whole-analysis/target-analysis"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "high-incidence",
              "name": "预警高发分析",
              "sort": 2,
              "icon": "",
              "resourceId": "1872",
              "resourceType": "menu",
              "ucrs_resourceId": "1639619003",
              "ucrs_displayName": "预警高发分析",
              "ucrs_web_resource_id": "2e921a13-09f0-47dc-b42e-5cbb14848032",
              "ucrs_display_resource_code": "1872",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/pre-warning-center/whole-analysis/high-incidence"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "资源中心",
      "sort": 4,
      "icon": "",
      "resourceId": "16",
      "resourceType": "app",
      "ucrs_resourceId": "1084253414",
      "ucrs_displayName": "资源中心",
      "ucrs_web_resource_id": "d60da00d-5970-4616-ac3e-161af8afec0d",
      "ucrs_display_resource_code": "16",
      "ucrs_display_resource_type": "应用",
      "permissions": [
        "show"
      ],
      "children": [
        {
          "path": "/commandcenter-7",
          "name": "资源管理",
          "sort": 4,
          "icon": "资源管理",
          "resourceId": "164",
          "resourceType": "menu",
          "ucrs_resourceId": "92333864",
          "ucrs_displayName": "资源管理",
          "ucrs_web_resource_id": "4a3f4914-99f1-41a7-9262-e0a13271294a",
          "ucrs_display_resource_code": "164",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "risk-hidden-danger",
              "name": "风险隐患管理",
              "sort": 1,
              "icon": "",
              "resourceId": "1641",
              "resourceType": "menu",
              "ucrs_resourceId": "1958898649",
              "ucrs_displayName": "风险隐患管理",
              "ucrs_web_resource_id": "0029b359-686d-4025-9364-8d47f512a8c6",
              "ucrs_display_resource_code": "1641",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/resource-management-web/resource-center/risk-hidden-danger"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "emergency-resource",
              "name": "应急资源管理",
              "sort": 3,
              "icon": "",
              "resourceId": "1643",
              "resourceType": "menu",
              "ucrs_resourceId": "1755405888",
              "ucrs_displayName": "应急资源管理",
              "ucrs_web_resource_id": "c255bc5c-8d36-4df3-8c48-070d47b3af52",
              "ucrs_display_resource_code": "1643",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/resource-management-web/resource-center/emergency-resource"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "protection-target",
              "name": "防护目标管理",
              "sort": 2,
              "icon": "",
              "resourceId": "1642",
              "resourceType": "menu",
              "ucrs_resourceId": "465411975",
              "ucrs_displayName": "防护目标管理",
              "ucrs_web_resource_id": "47c5c589-1312-4053-9265-ae46b70fba8a",
              "ucrs_display_resource_code": "1642",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/resource-management-web/resource-center/protection-target"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/commandcenter-5",
          "name": "知识管理",
          "sort": 3,
          "icon": "知识管理",
          "resourceId": "163",
          "resourceType": "menu",
          "ucrs_resourceId": "209523493",
          "ucrs_displayName": "知识管理",
          "ucrs_web_resource_id": "23c3553f-c779-4eb0-ab36-5db6a3a44ab3",
          "ucrs_display_resource_code": "163",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "knowledge-search",
              "name": "知识检索",
              "sort": 1,
              "icon": "",
              "resourceId": "1632",
              "resourceType": "menu",
              "ucrs_resourceId": "203126459",
              "ucrs_displayName": "知识检索",
              "ucrs_web_resource_id": "430cdeaa-91a5-4c59-ad6e-3087daef4757",
              "ucrs_display_resource_code": "1632",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/knowledge-management-web/knowledge-search/index"
              },
              "permissions": [
                "show"
              ]
            },
            {
              "path": "knowledge-management",
              "name": "知识发布",
              "sort": 2,
              "icon": "",
              "resourceId": "1631",
              "resourceType": "menu",
              "ucrs_resourceId": "120591860",
              "ucrs_displayName": "知识发布",
              "ucrs_web_resource_id": "3183b00e-76c9-4a1b-ae0b-1cf2ea678aa8",
              "ucrs_display_resource_code": "1631",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/knowledge-management-web/knowledge-management/index"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/commandcenter-8",
          "name": "预案列表",
          "sort": 2,
          "icon": "预案列表",
          "resourceId": "162",
          "resourceType": "menu",
          "ucrs_resourceId": "1158747895",
          "ucrs_displayName": "预案列表",
          "ucrs_web_resource_id": "f4994a30-5277-4630-9430-b203807fdcb8",
          "ucrs_display_resource_code": "162",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "",
              "name": "预案列表",
              "sort": 0,
              "icon": "预案列表",
              "resourceId": "1621",
              "resourceType": "menu",
              "ucrs_resourceId": "1140279443",
              "ucrs_displayName": "预案列表",
              "ucrs_web_resource_id": "75adaa47-9fc2-44c8-b22e-64a33509631f",
              "ucrs_display_resource_code": "1621",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/reserve-plan-management-web/digital-plan/index"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        },
        {
          "path": "/commandcenter-9",
          "name": "数据模型管理",
          "sort": 1,
          "icon": "预案列表",
          "resourceId": "161",
          "resourceType": "menu",
          "ucrs_resourceId": "979056423",
          "ucrs_displayName": "数据模型管理",
          "ucrs_web_resource_id": "41abd9df-845a-4ad1-a966-a03d3aad806b",
          "ucrs_display_resource_code": "161",
          "ucrs_display_resource_type": "菜单",
          "isFrame": "1",
          "component": "layout",
          "extAttr": {},
          "permissions": [
            "show"
          ],
          "children": [
            {
              "path": "",
              "name": "数据模型管理",
              "sort": 0,
              "icon": "预案列表",
              "resourceId": "1611",
              "resourceType": "menu",
              "ucrs_resourceId": "984961965",
              "ucrs_displayName": "数据模型管理",
              "ucrs_web_resource_id": "e4b69df5-e4e8-4ac3-8b87-be610789c5b9",
              "ucrs_display_resource_code": "1611",
              "ucrs_display_resource_type": "菜单",
              "isFrame": "1",
              "component": "views/iframe-page/index.vue",
              "remark": "",
              "extAttr": {
                "iframeUrl": "http://10.32.132.123:6060/one-form-pc/#/data-model/category-management"
              },
              "permissions": [
                "show"
              ]
            }
          ]
        }
      ]
    }
  ]
}