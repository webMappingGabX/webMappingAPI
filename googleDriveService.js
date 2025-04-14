const fs = require('fs');
const { google } = require("googleapis");

const apiKeys = require("./config/apiKeys.json");
//const apiKeys = require(process.env.GOOGLE_API_KEYS_LINK);

const SCOPE = ["https://www.googleapis.com/auth/drive"];

async function authorize() {
    const jwtClient = new google.auth.JWT(
        apiKeys.client_email,
        null,
        apiKeys.private_key,
        SCOPE
    );

    await jwtClient.authorize();

    return jwtClient;
}

async function uploadFile(authClient, filename, path) {
    return new Promise((resolve, rejected) => {
        const drive = google.drive({version: "v3", auth: authClient});

        var fileMetaData = {
            name: filename,
            parents: ["1Y0f9nnqYs0mrKboq71U7WrTAwsk9X1RE"]
        }

        drive.files.create({
            resource: fileMetaData,
            media: {
                body: fs.createReadStream(path),
                mimeType: "application/json"
            },
            fields: 'id'
        }, (err, file) => {
            if(err) return rejected(err);

            resolve(file)
        });

    });
}

async function getFile(authClient, fileId) {
    return new Promise((resolve, reject) => {
        const drive = google.drive({ version: "v3", auth: authClient });

        drive.files.get(
            { fileId: fileId, alt: "media" },
            { responseType: "stream" },
            (err, res) => {
                if (err) {
                    console.error("Error while getting file:", err.message);
                    return reject(err);
                }

                const filePath = `./downloaded_${fileId}.json`;
                const dest = fs.createWriteStream(filePath);

                res.data
                    .on("end", () => resolve(filePath))
                    .on("error", (err) => reject(err))
                    .pipe(dest);
            }
        );
    });
}

async function updateFile(authClient, fileId, newFilePath) {
    return new Promise((resolve, reject) => {
        const drive = google.drive({ version: "v3", auth: authClient });

        const fileMetadata = {
            name: "updatedFileName",
        };

        const media = {
            mimeType: "application/json",
            body: fs.createReadStream(newFilePath),
        };

        drive.files.update(
            {
                fileId: fileId,
                resource: fileMetadata,
                media: media,
                fields: "id",
            },
            (err, file) => {
                if (err) return reject(err);

                resolve(file);
            }
        );
    });
}

async function deleteFile(authClient, fileId) {
    return new Promise((resolve, reject) => {
        const drive = google.drive({ version: "v3", auth: authClient });

        drive.files.delete({ fileId: fileId }, (err, res) => {
            if (err) return reject(err);

            resolve(res);
        });
    });
}

exports.uploadFile = async (filename, path) => {
    try
    {
        const authClient = await authorize();
        const file = await uploadFile(authClient, filename, path);

        console.log("UPLOADED FILE", file);

        return file;
    } catch (err) {
        console.log("\n ERROR UPLOADING FILE", err);
    }
}

exports.getDriveFile = () => {
    authorize().then((authClient) => {
        getFile(authClient, "14MO3ZdnZJkEjvsrAPBfnZw-P5yt-JAwx").then((filepath) => {
            console.log("FILE PATH", filepath);
        });


    }).catch((err) => console.log("\n ERROR READING FILE", err));
}

exports.updateDriveFile = async (fileId, updatedFilename) => {
    try
    {
        const authClient = await authorize();
        const file = await updateFile(authClient, fileId, updatedFilename);

        console.log("UPDATED FILE", file);

        return file;
    } catch (err) {
        console.log("\n ERROR UPDATING FILE", err);
    }   
};

exports.deleteDriveFile = async (fileId) => {

    try
    {
        const authClient = await authorize();
        const file = await deleteFile(authClient, fileId);

        console.log("DELETED FILE", file);

        return file;
    } catch (err) {
        console.log("\n ERROR DELETING FILE", err);
    }
};