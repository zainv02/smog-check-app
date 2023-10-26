Customer comes in
	first they enter their license plate. will be used to check if in database or not

	they enter their license plate number, name, phone number, email address, address(optional)
	if they are a new customer (license plate is not found in database):
		app does an api call to fill in the rest of their information with VIN lookup
		they are sent to a page asking them to either confirm their information or unconfirm it
		if they unconfirm it:
			they are able to edit the text fields that have been filled in with their own information by tapping the fields
			they can then click submit
			they can then click confirm
			
		
		a new entry will be created with the information in database. (new customer, new vehicle, new order)
		
	if they are actually a returning customer (license plate number and phone/email/name already exists):
		a page will show saying that they already have the customer on file. they will show the license plate and owner and ask user to confirm it is them
		if they confirm:
			app will ask if they want to update whatever fields are different
		if they do not confirm:
			a new entry will be created with the information in database. (new customer, new vehicle, new order)
			
	the app calculates how much the servicing will cost by using the date of the car and whatever deals we are having etc
	the app makes an invoice using an invoice template and sends it to the customer via email


## Plan v2:

### Lookup VIN
License plate number is all that needs to be entered. No new and returning. This will do API call.

### Get car info
If license plate is in database, populate user information too. Ask user to verify and let them change user information. 
If license plate isn't in database, make them populate it. They shouldn't be allowed to edit the car stuff.
Email and phone and phone should be mandatory.
Ask how they heard about us (drop down for yelp, google, etc)

Calculate pricing based on car year. Tell them pricing and explanation for why. 
- need formula

### other plan stuff
make a Session system with a session uuid, so that info is stored on the server, without having to make so many big requests with big request bodies nor moving between pages with big search params, only the session uuid

Session id will also work as an authenticator

Session is made after inputing Plate and State, and while getting user info
It will return the user/vehicle info And the session

In user info page, submit the changed user info with the session ID, not the vehicle info since its already in the session
this will call a post and it will update the session data
success -> go to sign page with session in searchParams

Once on the sign page, make a `GET to get-estimate` with session ID as param
this will use the session id to get the vehicle data, then calculate the estimate
it will send the response body with te estimate and the list of fees that it is made of
success -> show estimate
error -> show error and try again maybe?

if the estimate is shown, reveal the signature box for the customer to sign
Once they are happy with it, they can submit, which will send a `POST to create-invoice`
- with the session in the url still as the param
- and a body with the signature data
Then, in `create-invoice`, the invoice data will be retrieved from the session, signature from body, and generate invoice
invoice will be saved as pdf locally somehwere, but also be made into an image dataURL to send back to the user
but for now, it is saved in the session data as well
success -> go to invoice page with session in url still

once in invoice page, make a `GET to get-invoice`, not create-invoice, to get the saved image, with session ID in params of course
- idea: have a another session manager for image dataurls. it might be good to separate session infos
response body will have the image dataURL, and on the invoice page it will show the invoice image

then there will be a button or something tat prompts you to enter an email to send it to, or however it might want to be sent
on submit, make `POST to send-invoice` with session in URL and email or others in req body

in send-invoice, handle the sending of the invoice PDF, not image, to the desired destinations
also, save the emails/destinations to send to in the database