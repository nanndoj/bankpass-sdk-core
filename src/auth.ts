/**
 * Copyright 2019 Bankpass Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {RequestScope} from "./types/RequestScopes";
import {ServiceAccountOptions} from "./types/ServiceAccountOptions";
import {Client} from "./client";
import {ClientFactory} from "./types/ClientFactory";

export interface AuthOptions {
    /**
     * Object containing client_email and private_key properties
     */
    credentials?: ServiceAccountOptions;

    /**
     * Required scopes for the desired API request
     */
    scopes?: RequestScope[];

    /**
     * Your project ID.
     */
    projectId?: string;
}

/*! Developer Documentation
 *
 * Invoke this method to create a new Storage object bound with pre-determined
 * configuration options. For each object that can be created (e.g., a bucket),
 * there is an equivalent static and instance method. While they are classes,
 * they can be instantiated without use of the `new` keyword.
 */
/**
 * <h4>ACLs</h4>
 * Cloud Storage uses access control lists (ACLs) to manage object and
 * bucket access. ACLs are the mechanism you use to share files with other users
 * and allow other users to access your buckets and files.
 *
 * To learn more about ACLs, read this overview on
 * [Access Control](https://cloud.google.com/storage/docs/access-control).
 *
 * @see [Cloud Storage overview]{@link https://cloud.google.com/storage/docs/overview}
 * @see [Access Control]{@link https://cloud.google.com/storage/docs/access-control}
 *
 * @class
 */
export class Auth {
    _cachedProjectId?: string | null;

    cachedCredential?: Client;
    scopes?: RequestScope | RequestScope[];
    jsonContent: ServiceAccountOptions | null = null;
    clientFactory: ClientFactory;

    constructor(private opts: AuthOptions = {}, clientFactory: ClientFactory) {
        this._cachedProjectId = opts.projectId || null;
        this.scopes = opts.scopes;
        this.jsonContent = opts.credentials;
        this.clientFactory = clientFactory;
    }

    /**
     * Automatically obtain a client based on the provided configuration.  If no
     * options were passed, use Application Default Credentials.
     */
    async getClient() {
        if (this.cachedCredential)
            return this.cachedCredential;

        if (this.jsonContent) {
            this.cachedCredential = this.fromJSON(this.jsonContent);
        }

        return this.cachedCredential;
    }

    /**
     * Create a credentials instance using the given input options.
     * @param json The input object.
     * @returns Client with data
     */
    fromJSON(json: ServiceAccountOptions): Client {

        if (!json) {
            throw new Error(
                'Must pass in a JSON object containing the auth settings.'
            );
        }

        this.jsonContent = json;
        return this.clientFactory.getClient(this.jsonContent);

    }
}