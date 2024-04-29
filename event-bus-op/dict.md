```json
{
    "factorDataType":"interzone-区间型",
    "factorValue":[
        {
            "upKey":"上区间",
            "upExpression":"none(无区间)、gt(大于)、lt(小于)、ge(大于等于)、le(小于等于)",
            "upValue":0.6,
            "lowKey":"下区间",
            "lowExpression":"none(无区间)、gt(大于)、lt(小于)、ge(大于等于)、le(小于等于)",
            "lowValue":1.1
        }
    ]
}
{
    "factorDataType":"switch-开关型",
    "factorValue":"1-开或0-关" //数值类型
}

{
    "factorDataType":"in-被包含型",
    "factorValue":["1","3","5","7"]
}

{
    "factorDataType":"contain-包含型",
    "factorValue":["RULE","FLG","XXX","ABC"]
}
```

MONITOR_FREQUENCY_UNIT   WARNING_LEVEL_CODE   ALARM_LEVEL_CODE

unitUserFor
，1表示监测，2表示预警

// WARNING_LEVEL_CODE
//   WARNING_LEVEL_CODE_1 一级预警
//   WARNING_LEVEL_CODE_2 二级预警
//   WARNING_LEVEL_CODE_3 三级预警
//   WARNING_LEVEL_CODE_4 四级预警
// ALARM_LEVEL_CODE
//   ALARM_LEVEL_CODE_1 一级报警
//   ALARM_LEVEL_CODE_2 二级报警
//   ALARM_LEVEL_CODE_3 三级报警
//   ALARM_LEVEL_CODE_4 四级报警