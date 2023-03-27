
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import config from "../config";
import DbService from "../services/Db";
import { Model } from "../services/Db/models/model";
import Resource from "../utils/resource/Resource";
import toResource from "../utils/resource/toResource";

const dbService = new DbService(config.dbAPIUrl)

export default function useModelState() : Resource<Model> | null {
    const location = useLocation()
    const { id } = useParams()

    const [resource, setResource] = useState <Resource<Model>| null> (null)

    useEffect(() => {
        if(location.state?.model) {
            setResource({
                read() {
                    return location.state?.model as Model
                }
            })

            return
        }

        setResource(toResource(dbService.getModelById(id ?? "")))
    },
    [location.state, id])
    
    return resource
}