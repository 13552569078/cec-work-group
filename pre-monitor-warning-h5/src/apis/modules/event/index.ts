import { requestHelper } from "@/apis/base/mapper-helper";
import { IgetEventSpace } from './model';
import { GlobalAPI } from '@/common';
const API_DOMAIN = GlobalAPI.config.BASE_URL;
const API_PREFIX = GlobalAPI.config.API_PREFIX_EVENT_HANDLE_STRATEGY;

/**
 * 数据访问，此类代码生成器生成
 */
class EventApi {
    data2Mock: boolean = false;


    // 根据事件id查询事件详情|根据事件id查询事件详情-事件列表
    getEvent(id: any) {
        const url = `${API_DOMAIN}${API_PREFIX}/event/${id}`;
        return requestHelper.getRequestData<IgetEventSpace.Model>(url, '4bd2a41e-fc64-4ac8-a91f-c771ec5556ab', this.data2Mock);
    }
}
export const apiEventObj = new EventApi();
