/* eslint-disable @typescript-eslint/no-namespace */
      
      /**
      * 天气预警-Model类库
      */
       export namespace IgetGetAlertsWeatherAreCodeSpace {

        export class RequestParams{
          areCode?:string;
          constructor(){
            this.areCode="";
          }
        }
      
      export interface Data {
        geocode: string;
        title: string;
        desc: string;
        type: string;
        level: string;
        public_time: string;
        effective: string;
        expires: string;
        lat: string;
        lon: string;
      }
      
      export interface Model {
        code: string;
        desc: string;
        tips: string;
        httpStatusCode: number;
        data: Data[];
      }
      }
            /**
            * 逐日天气-Model类库
            */
      export namespace IpostGetDailyFcstsSpace {
      
        export class RequestParams{
          lonlat?:string;days?:number;
          constructor(){
            this.lonlat="";this.days=0;
          }
        }
      
      export interface Data {
        text_day: string;
        code_day: string;
        text_night: string;
        code_night: string;
        high: string;
        low: string;
        wc_day: string;
        wd_day: string;
        wc_night: string;
        wd_night: string;
        wa_day: string;
        wa_night: string;
        ws_day: string;
        ws_night: string;
        pop: string;
        pressure: string;
        maxrh: string;
        minrh: string;
        vis: string;
        clouds_day: string;
        clouds_night: string;
        uv: string;
        date: string;
        week: string;
        last_update: string;
      }
      
      export interface Model {
        code: string;
        desc: string;
        tips: string;
        httpStatusCode: number;
        data: Data[];
      }
      }
            /**
            * 逐日天气-Model类库
            */
      export namespace IgetGetNowCastingSpace {
      
        export class RequestParams{
          lonlat?:string;
          constructor(){
            this.lonlat="";
          }
        }
      
      export interface Sery {}
      
      export interface Data {
        startTime: string;
        endTime: string;
        series: any[];
        text?: string;
        code?: string;
        msg?: string;
      }
      
      export interface Model {
        code: string;
        desc: string;
        tips: string;
        httpStatusCode: number;
        data: Data;
      }
      }
            /**
            * 根据经纬度-Model类库
            */
      export namespace IgetGetLocationAreacodeSpace {
      
        export class RequestParams{
          lonlat?:string;
          constructor(){
            this.lonlat="";
          }
        }
      
      export interface Data {
        areacode: string;
        name: string;
        country: string;
        path: string;
      }
      
      export interface Model {
        code: string;
        desc: string;
        tips: string;
        httpStatusCode: number;
        data: Data;
      }
      }
            /**
            * 报警天气-Model类库
            */
      export namespace IgetGetAlertsWeatherSpace {
      
        export class RequestParams{
          lonlat?:string;
          constructor(){
            this.lonlat="";
          }
        }
      
      export interface Data {
        geocode: string;
        title: string;
        desc: string;
        type: string;
        level: string;
        public_time: string;
        effective: string;
        expires: string;
        lat: string;
        lon: string;
      }
      
      export interface Model {
        code: string;
        desc: string;
        tips: string;
        httpStatusCode: number;
        data: Data[];
      }
      }
            /**
            * 逐小时预报-Model类库
            */
      export namespace IpostGetHourlyFcstsSpace {
      
        export class RequestParams{
          lonlat?:string;hours?:number;
          constructor(){
            this.lonlat="";this.hours=0;
          }
        }
      
      export interface Data {
        text: string;
        code: string;
        temp_fc: string;
        wind_class: string;
        wind_speed: string;
        wind_dir: string;
        wind_angle: string;
        rh: string;
        prec: string;
        pressure: string;
        clouds: string;
        feels_like: string;
        data_time: string;
        last_update: string;
      }
      
      export interface Model {
        code: string;
        desc: string;
        tips: string;
        httpStatusCode: number;
        data: Data[];
      }
      }
            /**
            * 智能天气-Model类库
            */
      export namespace IgetGetIntelligentWeatherSpace {
      
        export class RequestParams{
          lonlat?:string;
          constructor(){
            this.lonlat="";
          }
        }
      
      export interface Data {
        text: string;
        code: string;
        temp: string;
        feels_like: string;
        rh: string;
        wind_class: string;
        wind_speed: string;
        wind_dir: string;
        wind_angle: string;
        prec: string;
        clouds: string;
        vis: string;
        pressure: string;
        dew: string;
        uv: string;
        snow: string;
        last_update: string;
      }
      
      export interface Model {
        code: string;
        desc: string;
        tips: string;
        httpStatusCode: number;
        data: Data;
      }
      }
            /**
            * 逐小时预报-Model类库
            */
      export namespace IpostGetThHoursSpace {
      
        export class RequestParams{
          lonlat?:string;hours?:number;
          constructor(){
            this.lonlat="";this.hours=0;
          }
        }
      
      export interface Data {
        text: string;
        code: string;
        temp_fc: string;
        wind_class: string;
        wind_speed: string;
        wind_dir: string;
        wind_angle: string;
        rh: string;
        prec: string;
        pressure: string;
        clouds: string;
        feels_like: string;
        data_time: string;
        last_update: string;
      }
      
      export interface Model {
        code: string;
        desc: string;
        tips: string;
        httpStatusCode: number;
        data: Data[];
      }
      }