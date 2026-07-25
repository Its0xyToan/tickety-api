/**
 * Creates a fetch function for the upload reference.
 * @param {import("../index.d.ts").UploadReference} reference
 * @param {import("../index.d.ts").Config} config
 * @returns {function({ format?: "default" | "json" }): Promise<Buffer>}
 */
export function makeUploadFetch(reference, config) {
    return async function fetchUpload({ format = "default" } = {}) {
        if(format === "json") {
            const response = await fetch(`${reference.url}&format=json`, {
                method: "GET",
                headers: {
                    Authorization: config.key,
                },
            });
            if(!response.ok) {
                throw new Error(`Failed to fetch upload: ${response.statusText}`);
            }
            return await response.json();
        }

        const response = await fetch(reference.url, {
            method: "GET",
            headers: {
                Authorization: config.key,
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch upload: ${response.statusText}`);
        }
        return Buffer.from(await response.arrayBuffer());
    };
}