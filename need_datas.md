## AUTOSHOP.ACCDB:
Automobile:
- AutoMake
- AutoModel
- AutoYear
- AutoEngDisp
- AutoCyl
- AutoLicPlate
- AutoVIN
- AutoLastIn
- AutoMilege
- CustID
- AutoID
- Notes
- AveMileage
- State
- RegID

Customer:
- Name
- Address1
- Address2
- City
- State
- ZipCode
- Source -> SourceID
- HomePhone
- WorkPhone
- CustID
- LastIn
- DollarsSpent
- Visits
- Phone1Desc
- Phone2Desc

Employees:
- Name
- Address1
- Address2
- City
- State
- ZipCode
- HomePhone
- OtherPhone
- NickName
- IDNumber
- StartDate
- JobClass
- PayType
- PayRate
- Password

History:
- AutoID
- LastDate
- LastMileage
- DueDate
- DueMileage

Phones: 
- PhoneDesc
- PhoneNum
- CustID

Sources:
- SourceID
- Description
- Status

	
## MGMTDATA.accdb:
Allocations:
- PrntDate
- PayID
- OrderNumber
- Amount
- CustID
- AllocDate

ARBillings:
- WDate
- LDate
- TDate
- SDate
- CustID
- Charges
- Payments
- Balance
- Days30
- Days60
- Days90
- Days120

Orders:
- WDate
- ODate
- OrderNumber
- Desc
- CustID
- AutoID
- EmpID
- Total
- PTaxRate

Payments:
- WDate
- PayDate
- OrderNumber
- CustID
- Amount

Services:
- WDate
- AutoID
- OrderNumber
- ServiceMiles
- LaborCharge
- LaborCost
- PartsCharge
- PartsCost
- EmpID
- ActHours
- EstHours
- Description

Summary:
- all fields

## Premium
Nothing


## SHOPDATA

Tasks:
- all fields


## W_Orders
Orders:
- all fields

Payments
- all fields

Tasks
- all fields

