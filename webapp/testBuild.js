/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line no-undef
// const fs = require('node:fs');
import fs from 'node:fs';
// eslint-disable-next-line no-undef
// const http = require('node:http');
import http from 'node:http';
// eslint-disable-next-line no-undef
// const path = require('node:path');
import path from 'node:path';

const PORT = 8000;

const MIME_TYPES = {
    default: 'application/octet-stream',
    html: 'text/html; charset=UTF-8',
    js: 'application/javascript',
    css: 'text/css',
    png: 'image/png',
    jpg: 'image/jpg',
    gif: 'image/gif',
    ico: 'image/x-icon',
    svg: 'image/svg+xml',
};

// eslint-disable-next-line no-undef
const STATIC_PATH = path.join(process.cwd(), './dist');

const toBool = [ () => true, () => false ];

const prepareFile = async (url) => {

    const paths = [ STATIC_PATH, url ];
    if (url.endsWith('/')) paths.push('index.html');
    const filePath = path.join(...paths);
    const pathTraversal = !filePath.startsWith(STATIC_PATH);
    const exists = await fs.promises.access(filePath).then(...toBool);
    const found = !pathTraversal && exists;
    // redirect to index.html if the path doesn't exist
    // this is because it is a single page app, with client side rendering, so it will handle the route once it loads the index.html
    const streamPath = found ? filePath : STATIC_PATH + '/index.html';
    const ext = path.extname(streamPath).substring(1).toLowerCase();
    const stream = fs.createReadStream(streamPath);
    return { found, ext, stream };

};

http
    .createServer(async (req, res) => {

        const file = await prepareFile(req.url);
        const statusCode = file.found ? 200 : 404;
        const mimeType = MIME_TYPES[ file.ext ] || MIME_TYPES.default;
        res.writeHead(statusCode, { 'Content-Type': mimeType });
        file.stream.pipe(res);
        console.log(`${req.method} ${req.url} ${statusCode}`);
    
    })
    .listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);