/* eslint-disable @typescript-eslint/no-namespace */


       export namespace IpostEventIndexSortSpace {



      export interface Model {
        code: string;
        desc: string;
        tips: string;
        httpStatusCode: number;
        data: boolean;
      }
      }

      export namespace IpostFindEventTypeIndexListSpace {


        export interface Data {
          id: string;
          eventTypeCode: string;
          code: string;
          name: string;
          unit: string;
          type: number;
          length: number;
          precision: number;
          displayCard: string;
          systemIndex: number;
          conditionIndex: number;
          state: number;
          sort: number;
        }
        export interface Model {
          code: string;
          desc: string;
          tips: string;
          httpStatusCode: number;
          data: Data[];
        }
        }

        export namespace IpostFindEventTypeIndexByIdSpace {


          export interface Data {
            id: string;
            eventTypeCode: string;
            code: string;
            name: string;
            unit: string;
            type: number;
            length: number;
            precision: number;
            displayCard: string;
            systemIndex: number;
            conditionIndex: number;
            state: number;
            sort: number;
          }
          export interface Model {
            code: string;
            desc: string;
            tips: string;
            httpStatusCode: number;
            data: Data;
          }
          }

          export namespace IgetFindEventTypeIndexUnitListSpace {


            export interface Data {
              id: string;
              name: string;
            }
            export interface Model {
              code: string;
              desc: string;
              tips: string;
              httpStatusCode: number;
              data: Data[];
            }
            }
