import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Site } from "./models/site";
import { Model } from "./models/model";
import Album from "./models/album";

export type AlbumByLinkResult = {
   _id: string;
   originalUrl: string;
   imageCount: number;
};

function handleError(e: AxiosResponse) {
   return Promise.reject({
      status: e.status,
      message: e.data?.message,
      payload: e.data?.payload,
   });
}

export default class DbService {
   axios: (config: AxiosRequestConfig) => Promise<any>;
   constructor(dbAPIUrl: string) {
      let axiosInst = axios.create({ baseURL: dbAPIUrl });
      this.axios = (config: AxiosRequestConfig) =>
         axiosInst(config)
            .then((res) => res.data)
            .catch((e) => handleError(e.response));
   }

   //sites
   getSitesByNames(names: string[]): Promise<Site[]> {
      return this.axios({ url: "/admin/sites?names=" + names.join(",") }).then(
         (data) => data?.sites,
      );
   }

   addSite(site: Site): Promise<string> {
      return this.axios({
         method: "post",
         url: "/admin/sites",
         data: site,
      }).then((data) => data.value);
   }

   async getModelByLink(source: string): Promise<Model | undefined> {
      let { models } = await this.axios({
         method: "get",
         url: `/admin/models?source=${source}&skip=0&limit=1`,
      });

      if (!models || !(models instanceof Array)) {
         return Promise.reject({ message: "invalid response type" });
      }

      return models[0];
   }

   async getModelsCount() : Promise<number> {
      return this.axios(
         {
            method : "get",
            url : "/admin/models/count"
         }
      )
      .then(data => data.count)
   }

   async getModelById(id : string) : Promise<Model> {
      return this.axios(
         {
            method : "get",
            url : "/admin/models/" + id
         }
      )
      .then(data => data.model)
   }

   async getModels(skip : number, limit : number) : Promise<Model[]> {
      let { models } = await this.axios(
         {
            method : "get",
            url : `/admin/models?skip=${skip}&limit=${limit}`
         }
      )

      if(!models || !(models instanceof Array)) {
         return Promise.reject({ message : "invalid response type"})
      }

      return models
   }

   //models
   addModel(model: Model): Promise<string> {
      let { _id, ...restModel } = model;
      return this.axios({
         method: "post",
         url: "/admin/models",
         data: restModel,
      }).then((res) => res.value);
   }

   updateModel(model: Partial<Model>): Promise<boolean> {
      if (!model._id) {
         return Promise.reject("invalid id sent");
      }

      return this.axios({
         method: "patch",
         url: "/admin/models/" + model._id,
         data: { siteAlias: model.siteAlias },
      });
   }

   //albums
   getAlbumById(albumId: string): Promise<Album> {
      return this.axios({ url: `/admin/albums/${albumId}` }).then((data) => data.album);
   }

   getAlbumsByLinks(modelId: string, links: string[]): Promise<AlbumByLinkResult[]> {
      return this.axios({
         url: `/admin/albums?modelId=${modelId}&links=${links}`,
      });
   }

   addAlbum(album: Omit<Omit<Album, "_id">, "imageIds">): Promise<string> {
      return this.axios({
         method: "post",
         url: `/admin/albums`,
         data: album,
      }).then((data) => data.value);
   }

   addImagesToAlbum(albumId: string, imageIds: string[]): Promise<boolean> {
      return this.axios({
         method: "post",
         url: `/admin/albums/${albumId}/images`,
         data: { imageIds },
      }).then((data) => data.value);
   }

   //images
   addImages(imageUrls: string[], modelId: string, siteId: string): Promise<string[]> {
      return this.axios({
         method: "post",
         url: `/admin/images?modelId=${modelId}&siteId=${siteId}`,
         data: { imageUrls },
      }).then((data) => data.value);
   }
}
