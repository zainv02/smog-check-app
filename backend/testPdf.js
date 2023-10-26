// eslint-disable-next-line @typescript-eslint/no-var-requires
const { jsPDF } = require('jspdf');
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const path = require('node:path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('node:fs');

function createInvoice(data) {

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4' // 595 pt x 842 pt allegedly
    });

    const dir = './temp';

    if (!fs.existsSync(dir)) {

        fs.mkdirSync(dir);
    
    }

    // these are in pt (points)
    const pageWidth = 595;
    const pageHeight = 842;
    const pagePadding = 40;
    const paddedPageWidth = pageWidth - pagePadding * 2;
    const paddedPageHeight = pageHeight - pagePadding * 2;
    const paddedMaxX = pageWidth - pagePadding;
    const paddedMaxY = pageHeight - pagePadding;
    const pageCenterX = pageWidth / 2;
    const pageCenterY = pageHeight / 2;
    
    const headerSize = 40;
    const textSize = 16;
    const gap = 10;

    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @returns {[number, number]}
     */
    function paddedPos(x, y) {

        return [ pagePadding + x, pagePadding + y ];
    
    }
    
    function filterObject(obj, keys = []) {

        return Object.fromEntries(
            Object.entries(obj).filter(([ key ]) => keys.includes(key))
        );
    
    }

    const cellLabelSize = 10;
    const cellValueSize = 16;
    const cellPaddingX = 10;
    const cellPaddingY = 5;
    const cellHeight = cellLabelSize + cellValueSize + cellPaddingY * 2;
    function createCell(x, y, label, value, width = undefined) {

        value = `${value}`;

        const lastFontSize = doc.getFontSize();

        const valueWidth = doc.getTextWidth(value);
        
        const cellWidth = width || valueWidth + cellPaddingX * 2;
        doc.rect(pagePadding + x, pagePadding + y, cellWidth, cellHeight);

        doc.setFontSize(cellLabelSize);
        doc.text(label, pagePadding + x + cellPaddingX, pagePadding + y + cellLabelSize + cellPaddingY);
        doc.setFontSize(cellValueSize);
        doc.text(value, pagePadding + x + cellPaddingX, pagePadding + y + cellValueSize + cellLabelSize + cellPaddingY);

        doc.setFontSize(lastFontSize);

        return cellWidth;
    
    }

    // header
    doc.setFontSize(headerSize);
    doc.text('Invoice', ...paddedPos(0, headerSize));

    // customer info table
    const customerInfoTableTop = headerSize + gap;

    // table row 1
    createCell(0, customerInfoTableTop, 'NAME', data[ 'name' ], paddedPageWidth * .6);
    createCell(paddedPageWidth * .6, customerInfoTableTop, 'DATE', data[ 'date' ], paddedPageWidth * .4);

    // table row 2
    createCell(0, customerInfoTableTop + cellHeight, 'ADDRESS', data[ 'address' ], paddedPageWidth * .6);
    createCell(paddedPageWidth * .6, customerInfoTableTop + cellHeight, 'PHONE', data[ 'phone' ], paddedPageWidth * .4);

    // table row 3
    createCell(0, customerInfoTableTop + cellHeight * 2, 'CITY', data[ 'city' ], paddedPageWidth);

    // table row 4
    createCell(0, customerInfoTableTop + cellHeight * 3, 'SOURCE', data[ 'source' ], paddedPageWidth);

    // vehicle info table
    const vehicleInfoTableTop = customerInfoTableTop + cellHeight * 4 + gap;

    // table row 1
    createCell(0, vehicleInfoTableTop, 'YEAR', data[ 'year' ], paddedPageWidth * .1);
    createCell(paddedPageWidth * .1, vehicleInfoTableTop, 'MAKE', data[ 'make' ], paddedPageWidth * .2);
    createCell(paddedPageWidth * .3, vehicleInfoTableTop, 'MODEL', data[ 'model' ], paddedPageWidth * .2);
    createCell(paddedPageWidth * .5, vehicleInfoTableTop, 'LICENSE NO.', data[ 'plate' ], paddedPageWidth * .25);
    createCell(paddedPageWidth * .75, vehicleInfoTableTop, 'MILEAGE', data[ 'mileage' ], paddedPageWidth * .25);

    // table row 2
    const vinLabelSize = 16;
    doc.setFontSize(vinLabelSize);
    doc.text('VIN', ...paddedPos(vinLabelSize + cellPaddingX, vehicleInfoTableTop + cellHeight + doc.getTextWidth('VIN') + cellPaddingY), null, 90);
    createCell(0, vehicleInfoTableTop + cellHeight, '', '', paddedPageWidth);

    // fancy vin
    const vinCharSize = 20;
    const vinCharWidth = 18;
    const vinCharPadding = 2;
    const vinStartX = pagePadding + vinLabelSize + cellPaddingX + 10;
    const vinStartY = pagePadding + vehicleInfoTableTop + cellHeight;
    const vinCharY = vinCharSize + vinStartY + cellPaddingY;
    doc.setFontSize(vinCharSize);
    doc.line(vinStartX, vinStartY, vinStartX, vinStartY + cellHeight);
    for (let i = 0; i < 17; i++) {

        const charX = i * vinCharWidth + vinStartX + vinCharPadding + vinCharPadding * i * 2;
        doc.text(data[ 'vin' ][ i ] || '', charX, vinCharY);
        doc.line(charX + vinCharWidth, vinStartY, charX + vinCharWidth, vinStartY + cellHeight);
    
    }

    // signature
    const signatureBottom = paddedPageHeight;
    const signatureLabelWidth = doc.getTextWidth('SIGNATURE');
    const signatureStart = signatureLabelWidth + 20;
    const signatureHeight = 90;
    const signatureScale = .7;
    doc.line(...paddedPos(signatureStart, signatureBottom), ...paddedPos(paddedPageWidth, signatureBottom));

    doc.setFontSize(16);
    doc.setFont(doc.getFont().fontName, 'bold');
    doc.text('SIGNATURE', ...paddedPos(0, signatureBottom));
    
    doc.setFontSize(24);
    doc.text('X', ...paddedPos(signatureLabelWidth, signatureBottom), { align: 'center' });


    if (data[ 'signature' ] !== undefined) {

        for (const stroke of data[ 'signature' ]) {
        
            for (let i = 0; i < stroke.length; i += 2) {

                const pos = paddedPos(
                    stroke[ i ] * signatureScale + signatureStart - 10,
                    (stroke[ i + 1 ] - signatureHeight) * signatureScale + signatureBottom
                );
                if (i === 0) {

                    doc.moveTo(...pos);
            
                } else {

                    doc.lineTo(...pos);
            
                }
        
            }

            doc.stroke();

        }
    
    }

    // estimate
    doc.setFont(doc.getFont().fontName);
    const estimateHeight = 34;
    const estimateWidth = 160;
    doc.setFontSize(12);
    doc.text('ESTIMATE', ...paddedPos(paddedPageWidth - estimateWidth, signatureBottom - estimateHeight));
    doc.setFontSize(estimateHeight * .7);
    doc.setFont(doc.getFont().fontName, 'bold');
    const currencySymbolWidth = doc.getTextWidth('$');
    const estimateValueBottom = signatureBottom - estimateHeight * .2;
    doc.text('$', ...paddedPos(paddedPageWidth - estimateWidth, estimateValueBottom));
    doc.setFont(doc.getFont().fontName);
    const parsedEstimate = Number.parseFloat(data[ 'estimate' ]);
    if (!isNaN(parsedEstimate)) {

        doc.text(`${parsedEstimate.toFixed(2)}`, ...paddedPos(paddedPageWidth - estimateWidth + currencySymbolWidth + 4, estimateValueBottom));
    
    }
    

    doc.save(dir + '/test.pdf');

}

createInvoice({
    'name':'John',
    'address':'1234 Cool Street',
    'city':'San Limon',
    'phone':'1234567890',
    'source':'Source',
    'date': '12-21-2022',
    'vin':'JF1GE7E68AH505850',
    'year':'2010',
    'make':'Subaru',
    'model':'Impreza',
    'plate':'6LEE230',
    'mileage':21,
    'estimate': 200.23,
    'signature': [ [ 19.046875,31.5,27.046875,25.5,31.046875,23.5,35.046875,21.5,39.046875,18.5,43.046875,17.5,46.046875,15.5,49.046875,13.5,52.046875,12.5,53.046875,17.5,51.046875,24.5,49.046875,29.5,47.046875,35.5,45.046875,42.5,42.046875,49.5,39.046875,56.5,36.046875,62.5,32.046875,67.5,29.046875,72.5,26.046875,77.5,23.046875,80.5,21.046875,83.5,21.046875,79.5,23.046875,75.5,26.046875,70.5,30.046875,65.5,34.046875,58.5,39.046875,52.5,45.046875,46.5,51.046875,40.5,56.046875,34.5,61.046875,28.5,66.046875,23.5,70.046875,20.5,72.046875,17.5,70.046875,23.5,67.046875,26.5,64.046875,31.5,61.046875,36.5,58.046875,42.5,55.046875,47.5,51.046875,51.5,49.046875,55.5,46.046875,59.5,44.046875,62.5,42.046875,65.5,40.046875,68.5,38.046875,71.5,37.046875,75.5,41.046875,71.5,44.046875,68.5,47.046875,64.5,51.046875,59.5,56.046875,55.5,61.046875,50.5,65.046875,45.5,71.046875,39.5,75.046875,35.5,80.046875,30.5,84.046875,26.5,87.046875,22.5,89.046875,19.5,91.046875,16.5,90.046875,20.5,89.046875,23.5,86.046875,26.5,84.046875,30.5,81.046875,34.5,77.046875,39.5,73.046875,45.5,70.046875,50.5,66.046875,56.5,63.046875,61.5,60.046875,66.5,58.046875,70.5,56.046875,74.5,55.046875,77.5,60.046875,75.5,63.046875,73.5,67.046875,69.5,72.046875,65.5,77.046875,61.5,81.046875,57.5,86.046875,53.5,89.046875,50.5,91.046875,47.5,92.046875,43.5,89.046875,47.5,86.046875,50.5,82.046875,56.5,80.046875,59.5,79.046875,63.5,78.046875,66.5,77.046875,71.5,81.046875,69.5,85.046875,65.5,88.046875,63.5,91.046875,60.5,93.046875,57.5,97.046875,53.5,98.046875,56.5,98.046875,61.5,97.046875,65.5,99.046875,61.5,103.046875,56.5,106.046875,52.5,109.046875,48.5,112.046875,44.5,115.046875,40.5,118.046875,36.5,120.046875,32.5,121.046875,29.5,122.046875,26.5,119.046875,29.5,118.046875,32.5,117.046875,36.5,115.046875,42.5,114.046875,47.5,113.046875,52.5,112.046875,56.5,111.046875,59.5,112.046875,63.5,116.046875,61.5,121.046875,58.5,124.046875,55.5,127.046875,52.5,130.046875,48.5,134.046875,44.5,137.046875,40.5,140.046875,35.5,142.046875,31.5,143.046875,28.5,143.046875,22.5,142.046875,26.5,141.046875,29.5,140.046875,34.5,140.046875,39.5,139.046875,45.5,138.046875,51.5,137.046875,58.5,136.046875,63.5,135.046875,67.5,135.046875,71.5,136.046875,74.5,138.046875,70.5,140.046875,66.5,142.046875,62.5,145.046875,58.5,147.046875,53.5,151.046875,48.5,154.046875,43.5,156.046875,37.5,159.046875,31.5,161.046875,26.5,163.046875,22.5,165.046875,18.5,166.046875,14.5,165.046875,10.5,164.046875,14.5,163.046875,17.5,162.046875,24.5,162.046875,28.5,161.046875,33.5,161.046875,37.5,160.046875,43.5,159.046875,48.5,159.046875,52.5,159.046875,57.5,159.046875,61.5,159.046875,67.5,162.046875,69.5,166.046875,69.5,170.046875,66.5,173.046875,63.5,176.046875,61.5,179.046875,58.5,182.046875,56.5,185.046875,54.5,189.046875,53.5,192.046875,62.5,193.046875,66.5,194.046875,70.5,195.046875,73.5,195.046875,77.5,196.046875,83.5,197.046875,87.5,197.046875,82.5,199.046875,78.5,202.046875,73.5,204.046875,70.5,206.046875,67.5,207.046875,61.5,208.046875,57.5,206.046875,61.5,205.046875,67.5,204.046875,74.5,204.046875,78.5,203.046875,82.5,204.046875,86.5,208.046875,85.5,211.046875,82.5,216.046875,77.5,221.046875,73.5,224.046875,69.5,227.046875,65.5,228.046875,62.5,227.046875,65.5,226.046875,69.5,226.046875,73.5,226.046875,77.5,229.046875,79.5,232.046875,77.5,235.046875,79.5,239.046875,80.5,243.046875,80.5,243.046875,76.5,240.046875,73.5,238.046875,69.5,236.046875,66.5,232.046875,64.5,229.046875,63.5,228.046875,66.5,224.046875,63.5,221.046875,61.5,218.046875,57.5,214.046875,54.5,211.046875,51.5,215.046875,51.5,218.046875,50.5,105.046875,41.5,116.046875,42.5,122.046875,42.5,128.046875,42.5,135.046875,41.5,144.046875,40.5,154.046875,39.5,166.046875,38.5,180.046875,38.5,195.046875,37.5,210.046875,36.5,224.046875,35.5,238.046875,35.5,249.046875,35.5,258.046875,35.5,265.046875,35.5,269.046875,35.5 ] ]
});

// const dir = path.resolve('../../temp');

// const pdfPath = dir + '/' + 'invoice.pdf';

// console.log(path.relative(pdfPath, '.'));
