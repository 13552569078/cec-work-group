/* Events */
export interface Events {
    type: string;
    targetId: string;
}
/* ConfigModel */
interface ConfigItemModel {
    id: string;
    parentId: string;
    type: string;
    label: string;
    title: string;
    children: ConfigItemModel[];
}
/**
 *  type: nav_1,nav_2特有属性
 */
interface ConfigItemModel {
    url?: string;
    position?: string;
    events?: Events;
    style?: string;
}

/**
 *  type: chater特有属性
 */
 interface ConfigItemModel {
    chartId?: Events;
    api?: string;
}

export interface ConfigStyle {
    height?: string;
    width?: string;
}

export interface Config {
    navs: ConfigItemModel[]
}
