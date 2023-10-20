const { jsPDF } = require('jspdf');
const path = require('node:path');
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

    // data
    doc.setFontSize(textSize);

    // table row 1
    createCell(0, headerSize + gap, 'NAME', data[ 'name' ], paddedPageWidth * .6);
    createCell(paddedPageWidth * .6, headerSize + gap, 'DATE', data[ 'date' ], paddedPageWidth * .4);

    // table row 2
    createCell(0, headerSize + gap + cellHeight, 'ADDRESS', data[ 'address' ], paddedPageWidth * .6);
    createCell(paddedPageWidth * .6, headerSize + gap + cellHeight, 'PHONE', data[ 'phone' ], paddedPageWidth * .4);

    // table row 3
    createCell(0, headerSize + gap + cellHeight * 2, 'CITY', data[ 'city' ], paddedPageWidth);

    // table row 4
    createCell(0, headerSize + gap + cellHeight * 3, 'SOURCE', data[ 'source' ], paddedPageWidth);


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
