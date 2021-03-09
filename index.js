import clientJson from "./client.json"
import config from "./config.json"
import axios from "axios"
import fs from "fs"
import path from "path"

if (config.clean) {
    console.log("Clening before start...")
    if(fs.existsSync(config.output.client)) fs.rmSync(config.output.client)
    if(fs.existsSync(config.output.client_mappings)) fs.rmSync(config.output.client_mappings)
    if(fs.existsSync(config.output.server)) fs.rmSync(config.output.server)
    if(fs.existsSync(config.output.server_mappings)) fs.rmSync(config.output.server_mappings)
    if(fs.existsSync(config.output.artifacts)) fs.rmdirSync(config.output.artifacts, { recursive: true })
}
console.log("Fetching resources...")
if (config.fetch.client) {
    console.log("Fetching client...")
    axios.get(clientJson.downloads.client.url).then(
        (response) => {
            console.log("Successfully fetched client, writing to " + config.output.client)
            fs.writeFile(config.output.client, response.data, (err) => console.log("Write error: " + err))
        },
        (reason) => {
            console.log("Fetching client failed, skipping! Reason: " + reason)
        }
    )
}

if (config.fetch.server) {
    console.log("Fetching server...")
    axios.get(clientJson.downloads.server.url).then(
        (response) => {
            console.log("Successfully fetched server, writing to " + config.output.server)
            fs.writeFile(config.output.server, response.data, (err) => console.log("Write error: " + err))
        },
        (reason) => {
            console.log("Fetching server failed, skipping! Reason: " + reason)
        }
    )
}

if (config.fetch.client_mappings) {
    console.log("Fetching client mappings...")
    axios.get(clientJson.downloads.client_mappings.url).then(
        (response) => {
            console.log("Successfully fetched client mappings, writing to " + config.output.client_mappings)
            fs.writeFile(config.output.client_mappings, response.data, (err) => console.log("Write error: " + err))
        },
        (reason) => {
            console.log("Fetching client mappings failed, skipping! Reason: " + reason)
        }
    )
}

if (config.fetch.server_mappings) {
    console.log("Fetching server mappings...")
    axios.get(clientJson.downloads.server_mappings.url).then(
        (response) => {
            console.log("Successfully fetched server mappings, writing to " + config.output.server_mappings)
            fs.writeFile(config.output.server_mappings, response.data, (err) => console.log("Write error: " + err))
        },
        (reason) => {
            console.log("Fetching server mappings failed, skipping! Reason: " + reason)
        }
    )
}

if (config.fetch.artifacts) {
    console.log("Fetching artifacts...")
    clientJson.libraries.forEach(lib => {
        axios.get(lib.downloads.artifact.url).then(
            (response) => {
                console.log("Successfully fetched artifact " + lib.name + ", writing to " + path.join(config.output.artifacts, lib.downloads.artifact.path));
                fs.mkdirSync(path.dirname(path.join(config.output.artifacts, lib.downloads.artifact.path)), { recursive: true })
                fs.writeFile(path.join(config.output.artifacts, lib.downloads.artifact.path), response.data, (err) => console.log(`Done ${lib.name}`))
            },
            (reason) => {
                console.log("Fetching artifact " + lib.name + " failed, skipping! Reason: " + reason)
            }
        )
    });
}