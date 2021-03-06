require('dotenv').config()

const mailjet = require('node-mailjet')
    .connect(process.env.API_KEY, process.env.API_SECRET_KEY)


const sendAdminEmail = (formDetails, totalCartProducts, inputQuantityValue, totalPrice, currentTime, currentDate) => {
    return new Promise((res, rej) => {
        let orderSummaryInputValues = '';
        let forField = '';
        let emailID = formDetails.filter(formDetail => formDetail.type === 'email' && formDetail.value)[0]
        let name = formDetails.filter(formDetail => formDetail.formName === 'Name' && formDetail.value)[0]
        Object.keys(inputQuantityValue).map(orderProp => {
            orderSummaryInputValues += ` <tr>
                    <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${orderProp}</td>
                    <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${inputQuantityValue[orderProp]}</td>
                    <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${totalCartProducts[orderProp].price}</td></tr>`
        })

        formDetails.map(addressFields => {
            addressFields.value.length > 0 ?
                forField += `<div><span style="display: inline-block"><p>${addressFields.formName}: </p></span><span style="display: inline-block"><p><b>${addressFields.value}</b></p></span></div > ` : null
        })

        const customerHTMLtemplate = `
    <h2>Hi Admin, <h2>
    <h3>Please find the Customer (${name.value}) order details below</h3>
    <h4>Order summary</h4>
    <hr />
    <div> 
        <table style="font - family: arial, sans-serif;border-collapse: collapse;width: 100%;">
            <tr>
                <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Customer Name</th>
                <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Ordered Date</th>
                <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Ordered Time</th>
            </tr>
            <tr>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${name.value}</td>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${currentDate}</td>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${currentTime}</td>
            </tr>
            <tr>
                <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Size</th>
                <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Quantity</th>
                <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Price</th>
            </tr>
            ${orderSummaryInputValues}
            <tr>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Total Price</td>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;"></td>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;"> ${totalPrice}</td>
            </tr>
            <tr>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Ordered ON</td>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;"></td>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${currentDate} at ${currentTime} </td>
            </tr>
            <hr/>
            <h5>Order Details</h5>
            <div className="container">
                <h4 style="text-decoration: underline;text-align: center">Address Details:</h4><hr />
                ${forField}
            </div>
        </table>
    </div>
    <div>
    <br/>
    <br/>
    <br/>
    <hr/>
    Thanks and Regards<br/>from Admin team.
    </div>
     `
        const request = mailjet
            .post("send", { 'version': 'v3.1' })
            .request({
                "Messages": [
                    {
                        "From": {
                            "Email": "itsmh0305@gmail.com",
                            "Name": "Ganesha Eco Store"
                        },
                        "To": [
                            {
                                "Email": `${process.env.ADMIN_EMAIL}`,
                                "Name": 'ADMIN'
                            }
                        ],
                        "Subject": `Hi Admin this is the order from ${name.value} on ${currentDate} at ${currentTime}`,
                        "HTMLPart": `${customerHTMLtemplate} `,
                        "CustomID": "AppGettingStartedTest"
                    }
                ]
            })
        request
            .then((result) => {
                res(result)
            })
            .catch((err) => {
                rej(err)
            })
    })
}


module.exports = sendAdminEmail