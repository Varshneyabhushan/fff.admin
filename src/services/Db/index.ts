import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Site } from "./models/site";
import { Model } from "./models/model";
import Album from "./models/album";
import Image from "./models/image";

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

   async getModelsCount(): Promise<number> {
      return this.axios(
         {
            method: "get",
            url: "/admin/models/count"
         }
      )
         .then(data => data.count)
   }

   async getModelById(id: string): Promise<Model> {
      return this.axios(
         {
            method: "get",
            url: "/admin/models/" + id
         }
      )
         .then(data => data.model)
   }

   async getModels(skip: number, limit: number): Promise<Model[]> {
      let { models } = await this.axios(
         {
            method: "get",
            url: `/admin/models?skip=${skip}&limit=${limit}`
         }
      )

      if (!models || !(models instanceof Array)) {
         return Promise.reject({ message: "invalid response type" })
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

      const updatingModel = { ...model }
      delete updatingModel._id
      if (updatingModel.siteAlias) {
         for (let i = 0; i < updatingModel.siteAlias?.length ?? 0; i++) {
            delete updatingModel.siteAlias?.[i].siteName
         }
      }

      return this.axios({
         method: "patch",
         url: "/admin/models/" + model._id,
         data: updatingModel,
      });
   }

   deleteModel(id : string) : Promise<{ albumCount : number, imageCount : number }> {
      return this.axios({
         method : "delete",
         url : `/admin/models/${id}`,
      })
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

   getAlbumsCount(modelId : string) : Promise<number> {
      return this.axios({
         url : "/admin/albums/count?modelId=" + modelId
      })
      .then(data => data.count)
   }

   getAlbumsOfModel(modelId : string, skip : number, limit : number) : Promise<Album[]> {
      return this.axios(
         {
            url : `/admin/albums?modelId=${modelId}&skip=${skip}&limit=${limit}`
         }
      )
      .then(data => data.albums)
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

   updateAlbum(albumId : string, updateInfo : Partial<Album>) : Promise<boolean>{
      return this.axios(
         {
            method : "patch",
            url : `/admin/albums/${albumId}`,
            data : updateInfo
         }
      )
   }

   //images
   addImages(modelId: string, siteId: string, count : number): Promise<string[]> {
      return this.axios({
         method: "post",
         url: `/admin/images?modelId=${modelId}&siteId=${siteId}`,
         data: { count },
      }).then((data) => data.value);
   }

   getRandomImageOfModel(modelId : string) : Promise<Image| null> {
      return this.axios(
         {
            method : "get",
            url : "/admin/images/random?modelId=" + modelId 
         }
      )
      .then(data => data.image)
   }

   getImages(modelId: string, skip: number, limit: number): Promise<Image[]> {
      return this.axios(
         {
            method: "get",
            url: `/admin/images?modelId=${modelId}`
         }
      )
         .then(data => data.images)
   }
}
