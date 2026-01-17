import { Storage } from "@google-cloud/storage";
import { randomUUID } from "crypto";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

export const objectStorageClient = new Storage({
    credentials: {
        audience: "replit",
        subject_token_type: "access_token",
        token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
        type: "external_account",
        credential_source: {
            url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
            format: {
                type: "json",
                subject_token_field_name: "access_token",
            },
        },
        universe_domain: "googleapis.com",
    },
    projectId: "",
});

function getPrivateObjectDir(): string {
    const dir = process.env.PRIVATE_OBJECT_DIR || "";
    if (!dir) {
        throw new Error("PRIVATE_OBJECT_DIR not set");
    }
    return dir;
}

function parseObjectPath(path: string): { bucketName: string; objectName: string } {
    if (!path.startsWith("/")) {
        path = `/${path}`;
    }
    const pathParts = path.split("/");
    if (pathParts.length < 3) {
        throw new Error("Invalid path");
    }
    const bucketName = pathParts[1];
    const objectName = pathParts.slice(2).join("/");
    return { bucketName, objectName };
}

async function signObjectURL({
    bucketName,
    objectName,
    method,
    ttlSec,
}: {
    bucketName: string;
    objectName: string;
    method: "GET" | "PUT" | "DELETE" | "HEAD";
    ttlSec: number;
}): Promise<string> {
    const request = {
        bucket_name: bucketName,
        object_name: objectName,
        method,
        expires_at: new Date(Date.now() + ttlSec * 1000).toISOString(),
    };
    const response = await fetch(
        `${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
        }
    );
    if (!response.ok) {
        throw new Error(`Failed to sign object URL: ${response.status}`);
    }
    const { signed_url: signedURL } = await response.json();
    return signedURL;
}

export async function getUploadURL(): Promise<{ uploadURL: string; objectPath: string }> {
    const privateObjectDir = getPrivateObjectDir();
    const objectId = randomUUID();
    const fullPath = `${privateObjectDir}/uploads/${objectId}`;
    const { bucketName, objectName } = parseObjectPath(fullPath);

    const uploadURL = await signObjectURL({
        bucketName,
        objectName,
        method: "PUT",
        ttlSec: 900,
    });

    return {
        uploadURL,
        objectPath: `/objects/uploads/${objectId}`,
    };
}

export async function getPublicURL(objectPath: string): Promise<string> {
    if (!objectPath.startsWith("/objects/")) {
        return objectPath;
    }

    const entityId = objectPath.replace("/objects/", "");
    let entityDir = getPrivateObjectDir();
    if (!entityDir.endsWith("/")) {
        entityDir = `${entityDir}/`;
    }
    const fullPath = `${entityDir}${entityId}`;
    const { bucketName, objectName } = parseObjectPath(fullPath);

    return await signObjectURL({
        bucketName,
        objectName,
        method: "GET",
        ttlSec: 3600,
    });
}
