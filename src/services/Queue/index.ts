import axios from "axios";

export interface QueueItem {
   id: string;
   url: string;
   title : string;
   path: string;
}

export default class QueueService {
   apiUrl: string;
   constructor(apiUrl: string) {
      this.apiUrl = apiUrl;
   }

   addQueueItems<K>(items: K[]): Promise<number> {
      if (items.length === 0) {
         return Promise.resolve(0);
      }

      return axios({
         method: "post",
         url: `${this.apiUrl}/items`,
         data: {
            items,
         },
      })
         .catch(({ code, message }) => Promise.reject({ code, message }))
         .then((res) => res.data?.data?.success);
   }

   getTotalItems(): Promise<number> {
      return axios(`${this.apiUrl}/count`)
         .catch((e) => Promise.reject(e.message))
         .then((res) => res.data)
         .then(({ data: { count } }) => count);
   }
}
