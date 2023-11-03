
import { jsPDF } from 'jspdf';
import { Fee, UserVehicleInfo } from '../types';

export interface InvoiceData extends UserVehicleInfo {
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

    // fees
    const fees = data[ 'fees' ];
    const feeTop = vinStartY + cellHeight + 20;
    const feeFontSize = 16;
    doc.setFontSize(feeFontSize);
    const feeRowHeight = feeFontSize + 10;
    
    if (fees && fees.length > 0) {

        for (let i = 0; i < fees.length; i++) {

            const { label, amount } = fees[ i ];
            doc.text(label, pagePadding, feeTop + i * feeRowHeight, { align: 'left', baseline: 'top' });
            doc.setFont(doc.getFont().fontName, 'bold');
            doc.text(`$${amount.toFixed(2).toString()}`, pageWidth - pagePadding, feeTop + i * feeRowHeight, { align: 'right', baseline: 'top' });
            doc.setFont(doc.getFont().fontName, 'normal');

        }
        
        const feeLineY = feeTop + fees.length * feeRowHeight + 10;
        doc.line(pagePadding, feeLineY, pageWidth - pagePadding, feeLineY);

        // fee total
        let total = 0;
        fees.forEach(({ amount }) => total += amount);

        doc.text('TOTAL', pagePadding, feeLineY + 10, { align: 'left', baseline: 'top' });
        doc.setFont(doc.getFont().fontName, 'bold');
        doc.text(`$${total.toFixed(2).toString()}`, pageWidth - pagePadding, feeLineY + 10, { align: 'right', baseline: 'top' });
        doc.setFont(doc.getFont().fontName, 'normal');
    
    }

    


    // signature
    doc.setFontSize(16);
    const signatureBottom = paddedPageHeight;
    const signatureLabelWidth = doc.getTextWidth('SIGNATURE');
    
    const signatureHeight = 90;
    const signatureScale = .6;
    
    // signature label
    doc.setFont(doc.getFont().fontName, 'bold');
    doc.text('SIGNATURE', ...paddedPos(0, signatureBottom));
    
    // signature X
    doc.setFontSize(20);
    const signatureMarkWidth = doc.getTextWidth('X');
    doc.text('X', ...paddedPos(signatureLabelWidth + 5, signatureBottom), { align: 'left' });

    const signatureStart = signatureLabelWidth + signatureMarkWidth + 10;
    // signature line
    doc.line(...paddedPos(signatureStart, signatureBottom), ...paddedPos(paddedPageWidth, signatureBottom));

    const transformSignaturePos = (x: number, y: number) => {

        return paddedPos(
            x * signatureScale + signatureStart,
            (y - signatureHeight) * signatureScale + signatureBottom + 10
        );
    
    };

    // signature stroke
    if (data[ 'signature' ] !== undefined) {

        for (const stroke of data[ 'signature' ]) {
        
            if (stroke.length === 2) {

                const pos = transformSignaturePos(stroke[ 0 ], stroke[ 1 ]);
                doc.circle(...pos, 1, 'F');
                continue;
            
            }

            for (let i = 0; i < stroke.length; i += 2) {

                const pos = transformSignaturePos(stroke[ i ], stroke[ i + 1 ]);

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
    doc.setFont(doc.getFont().fontName, 'normal');
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
    'fees': [
        {
            'label': 'Smog inspection',
            'amount': 141.75
        },
        {
            'label': 'Smog certificate (this fee goes to the state of California)',
            'amount': 8.25
        }
    ],
    'estimate': 150,
    'signature': [ [ 15,33.5,31,31.5,37,29.5,42,28.5,48,27.5,53,26.5,57,25.5,60,24.5 ],[ 42,29.5,42,39.5,42,44.5,42,49.5,41,52.5,41,56.5,42,60.5 ],[ 58,51.5,67,52.5,70,51.5,73,50.5,76,48.5,77,45.5,78,42.5,75,40.5,71,41.5,68,43.5,65,46.5,63,50.5,62,54.5,64,57.5,68,59.5,72,60.5,77,60.5,83,59.5 ],[ 108,39.5,99,38.5,96,39.5,93,40.5,90,43.5,89,46.5,91,49.5,94,50.5,98,52.5,101,53.5,105,54.5,100,56.5,97,57.5,94,58.5,91,59.5,85,61.5 ],[ 121,32.5,121,41.5,121,46.5,121,50.5,121,54.5,121,58.5 ],[ 113,48.5,122,46.5,125,45.5 ],[ 131,44.5,134,52.5,134,56.5 ],[ 139,37.5 ],[ 139,38 ],[ 155,39.5,156,48.5,156,52.5,155,55.5,154,50.5,155,46.5,157,42.5,161,37.5,166,32.5,169,30.5,173,27.5,176,28.5,177,31.5,179,35.5,180,39.5,181,42.5,181,46.5 ],[ 199,28.5,191,27.5,187,29.5,184,32.5,182,35.5,182,39.5,184,42.5,188,44.5,191,45.5,194,42.5,196,38.5,196,34.5,198,31.5,201,33.5,203,36.5,206,40.5,207,44.5,208,48.5,208,52.5,208,56.5,205,58.5,203,61.5,200,64.5,197,66.5,193,66.5,189,65.5,185,64.5,180,63.5,174,62.5,168,63.5,163,67.5,159,70.5 ],[ 230,35.5 ],[ 230,36 ],[ 245,35.5 ],[ 245,36 ],[ 219,55.5,225,61.5,229,63.5,233,63.5,239,62.5,242,60.5,246,58.5 ] ]
};