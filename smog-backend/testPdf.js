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
    'mileage':21
});

// const dir = path.resolve('../../temp');

// const pdfPath = dir + '/' + 'invoice.pdf';

// console.log(path.relative(pdfPath, '.'));
