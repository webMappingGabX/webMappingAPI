const fs = require('fs');
const { google } = require("googleapis");

const apiKeys = require("./config/apiKeys.json");

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

async function uploadFile(authClient) {
    return new Promise((resolve, rejected) => {
        const drive = google.drive({version: "v3", auth: authClient});

        var fileMetaData = {
            name: "fileName",
            parents: ["1Y0f9nnqYs0mrKboq71U7WrTAwsk9X1RE"]
        }

        drive.files.create({
            resource: fileMetaData,
            media: {
                body: fs.createReadStream("test.geojson"),
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
                if (err) return reject(err);

                const filePath = `./downloaded_${fileId}.json`;
                const dest = fs.createWriteStream(filePath);

                console.log("GET FILE DATAS", res.data);
                res.data
                    .on("end", () => resolve(filePath))
                    .on("error", (err) => reject(err))
                    .pipe(dest);
            }
        );
    });
}
exports.upload = () => {
    authorize().then((authClient) => {
        uploadFile(authClient).then((file) => {
            console.log("UPLOADED FILE", file);
        });


    }).catch((err) => console.log("\n ERROR UPLOAD TO DRIVE", err));
}

exports.getDriveFile = () => {
    authorize().then((authClient) => {
        getFile(authClient, "14MO3ZdnZJkEjvsrAPBfnZw-P5yt-JAwx").then((filepath) => {
            console.log("FILE PATH", filepath);
        });


    }).catch((err) => console.log("\n ERROR READING FILE", err));
}


//module.exports = { uploadFile, readFile, updateFile };