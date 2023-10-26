
import { jsPDF } from 'jspdf';
import { Fee, UserVehicleInfo } from '../types';

export interface InvoiceData extends UserVehicleInfo {
    fees?: {label: string, amount: number}[]
}

export function calculateFees(data: {year: number | string}): Fee[] {

    const fees: Fee[] = [];

    const year = parseInt(`${data.year}`);

    let inspectionFee: number = 0;
    const certificateFee = 8.25;

    if (year >= 2000) {

        inspectionFee = 85;
    
    } else if (year >= 1996) {

        inspectionFee = 120;
    
    } else {

        inspectionFee = 150;
    
    }

    fees.push({
        label: 'Smog inspection',
        amount: inspectionFee - certificateFee
    });

    fees.push({
        label: 'Smog certificate (this fee goes to the state of California)',
        amount: certificateFee
    });

    return fees;

}

export function createInvoice(data: InvoiceData): jsPDF {

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4' // 595 pt x 842 pt allegedly
    });

    // these are in pt (points)
    const pageWidth = 595;
    const pageHeight = 842;
    const pagePadding = 40;
    const paddedPageWidth = pageWidth - pagePadding * 2;
    const paddedPageHeight = pageHeight - pagePadding * 2;
    // const paddedMaxX = pageWidth - pagePadding;
    // const paddedMaxY = pageHeight - pagePadding;
    // const pageCenterX = pageWidth / 2;
    // const pageCenterY = pageHeight / 2;
    
    const headerSize = 40;
    // const textSize = 16;
    const gap = 10;

    function paddedPos(x: number, y: number): [number, number] {

        return [ pagePadding + x, pagePadding + y ];
    
    }

    const cellLabelSize = 10;
    const cellValueSize = 16;
    const cellPaddingX = 10;
    const cellPaddingY = 5;
    const cellHeight = cellLabelSize + cellValueSize + cellPaddingY * 2;
    function createCell(x: number, y: number, label: string, value: unknown, width?: number) {

        const strValue = `${value !== undefined ? value : ''}`;

        const lastFontSize = doc.getFontSize();

        const valueWidth = doc.getTextWidth(strValue);
        
        const cellWidth = width || valueWidth + cellPaddingX * 2;
        doc.rect(pagePadding + x, pagePadding + y, cellWidth, cellHeight);

        doc.setFontSize(cellLabelSize);
        doc.text(label, pagePadding + x + cellPaddingX, pagePadding + y + cellLabelSize + cellPaddingY);
        doc.setFontSize(cellValueSize);
        doc.text(strValue, pagePadding + x + cellPaddingX, pagePadding + y + cellValueSize + cellLabelSize + cellPaddingY);

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
    doc.text('VIN', ...paddedPos(vinLabelSize + cellPaddingX, vehicleInfoTableTop + cellHeight + doc.getTextWidth('VIN') + cellPaddingY), undefined, 90);
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
        if (data[ 'vin' ] && data[ 'vin' ][ i ]) {

            doc.text(data[ 'vin' ][ i ], charX, vinCharY);
        
        }
        
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
    const parsedEstimate = Number.parseFloat(`${data[ 'estimate' ]}`);
    if (!isNaN(parsedEstimate)) {

        doc.text(`${parsedEstimate.toFixed(2)}`, ...paddedPos(paddedPageWidth - estimateWidth + currencySymbolWidth + 4, estimateValueBottom));
    
    }
    

    // doc.save(dir + '/test.pdf');

    return doc;

}

export const EXAMPLE_INVOICE_DATA: InvoiceData = {
    'name':'John',
    'address':'1234 Cool Street',
    'city':'San Limon',
    'phone':'1234567890',
    'source':'Source',
    'date': '12-21-2022',
    'vin':'JF1GE7E68AH505850',
    'year':2010,
    'make':'Subaru',
    'model':'Impreza',
    'plate':'6LEE230',
    'mileage':21,
    'estimate': 200.23,
    'signature': [ [ 44.046875,27.5,46.046875,35.5,47.046875,38.5,48.046875,43.5,49.046875,46.5,50.046875,51.5,52.046875,54.5,53.046875,57.5,55.046875,61.5 ],[ 26.046875,47.5,33.046875,40.5,36.046875,38.5,39.046875,36.5,43.046875,33.5,47.046875,31.5,52.046875,29.5,56.046875,27.5,61.046875,25.5,64.046875,23.5 ],[ 58.046875,46.5,68.046875,45.5,71.046875,44.5,74.046875,43.5,77.046875,41.5,80.046875,38.5,79.046875,35.5,76.046875,33.5,73.046875,32.5,69.046875,33.5,66.046875,36.5,64.046875,40.5,62.046875,43.5,62.046875,48.5,64.046875,51.5,68.046875,51.5,72.046875,50.5,76.046875,50.5,79.046875,49.5,82.046875,47.5,86.046875,44.5 ],[ 102.046875,26.5,93.046875,27.5,89.046875,28.5,85.046875,31.5,83.046875,34.5,87.046875,36.5,93.046875,36.5,99.046875,36.5,103.046875,36.5,104.046875,39.5,104.046875,43.5,101.046875,44.5,96.046875,46.5,93.046875,47.5,90.046875,48.5,86.046875,51.5 ],[ 118.046875,19.5,120.046875,28.5,121.046875,31.5,122.046875,35.5,125.046875,52.5 ],[ 110.046875,33.5,119.046875,30.5,122.046875,29.5,125.046875,28.5,128.046875,27.5,133.046875,24.5,137.046875,23.5 ] ]
};