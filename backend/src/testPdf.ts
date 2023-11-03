

import { EXAMPLE_INVOICE_DATA, createInvoice } from './utils/invoiceUtil';


const doc = createInvoice(EXAMPLE_INVOICE_DATA);

doc.save('./temp/test.pdf');