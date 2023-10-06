
class DummyDataApi extends DataApi 
{
    getPossibleUsers(truncatedName)
    {
        jsonData = 
        {
            'users':
            {
                'name' : 'Joe Schmoe',
                'address1' : '123 Brown St',
                'address2' : '',
                'city' : 'San Francisco',
                'state' : 'CA', 
                'zipcode' : '94131',
                'phone1': '123-456-789',
                'phone1_desc' : 'Company',
                'phone2' : '987-654-321',
                'phone2_desc' : 'Work Phone',
                'custID': 'JO001',
                'credit_limit': 10000,
                'acct_bal' : 160,
                'notes': 'This user had a dirty car',
                'since': '1/13/2015',
                'last_in' : '9/23/2023',
                'dollars_spent' : 67269.91,
                'visits' : 1478,
                'tax' : 2,
                'disc_id' : 0,
                'beg_bal': 1305
            }
        };
        jsonString = JSON.stringify(jsonData);
        return jsonString;
    }
}
