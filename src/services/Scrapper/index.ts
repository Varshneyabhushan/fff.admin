import { ScrappedAlbum, ScrappedModel } from "./models";
import axios, { AxiosInstance } from "axios";

// Scrapper should implement streaming
export default class ScrapperService {
   axios: AxiosInstance;
   constructor(apiUrl: string) {
      this.axios = axios.create({
         baseURL: `${apiUrl}`,
         responseType: "json",
         validateStatus: (status) => status >= 200 && status < 500,
      });
   }

   // make validations
   getModel(link: string): Promise<ScrappedModel> {
      link = link.replace("#", "%23");
      return this.axios.get(`/model-info?link=${link}`).then((res) => {
         if (res.status === 200) {
            return res.data.modelInfo;
         }

         if (res.status < 500) {
            return Promise.reject(res.data);
         }

         return Promise.reject({ message: "got server error", code: res.status });
      });
   }

   getAlbum(link: string): Promise<ScrappedAlbum> {
      link = link.replace("#", "%23");
      return this.axios.get(`/album-info?link=${link}`).then((res) => {
         if (res.status === 200) {
            return res.data.albumInfo;
         }

         if (res.status < 500) {
            return Promise.reject(res.data);
         }

         return Promise.reject({ message: "got server error", code: res.status });
      });
   }
}
