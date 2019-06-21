import {Client} from "../client";
import {ServiceAccountOptions} from "./ServiceAccountOptions";

export interface ClientFactory {
    getClient: (opts: ServiceAccountOptions) => Client
}