import axios, { AxiosInstance } from "axios";
import { QueueItem } from "../Queue";

export default class ImageHost {
   axios: AxiosInstance;
   constructor(baseURL: string) {
      this.axios = axios.create({ timeout: 10000, baseURL });
   }

   pathExists(path: string): Promise<boolean> {
      return this.axios({
         method: "post",
         url: "/exists",
         data: { path },
      })
         .catch((e) => {
            let { code, message } = e;
            return Promise.reject({ code, message });
         })
         .then((res) => {
            if (res.status === 200) {
               return res.data?.exists;
            }

            return Promise.reject(res.data.error);
         });
   }

   downloadURL(data: QueueItem): Promise<string> {
      return this.axios({ method: "post", url: "/files", data })
         .catch(({ code, message }) => Promise.reject({ code, message }))
         .then((res) => (res.status === 200 ? res.data?.path : Promise.reject(res.data.error)));
   }
}
