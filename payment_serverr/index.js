const express = require('express');
const cors =require('cors');
const dotenv=require('dotenv');
const app=express();
const Razorpay=require('razorpay')
const crypto=require('crypto');
const { error } = require('console');
const { request } = require('http');

dotenv.config();
app.use(express.json());
app.use(cors());

app.get('/',(request,response)=>{
    response.status(200).send('app is running...')
});

app.post('/api/payment/orders',(request,response)=>{
    try{
        const razprpayInstance=new Razorpay({
                key_id:'rzp_test_2K5EUlmwuZTui7',
                key_secret:'M6rpyRdpl14Mu7ifMvzojjnc'
            })

            const options={
                amount:request.body.amount*100,
                currency:'INR',
                receipt:crypto.randomBytes(10).toString('hex')
            }
            razprpayInstance.orders.create(options,(error,order)=>{
                if(error){
                    response.status(500).send ('order creation failed')
                }
                response.status(200).json({data:order})
            })

    } catch(error){
        response.status(500).send('internal server error')
    }
})

app.post('/api/payment/verify',(request,response)=>{

    try{
        const {razorpay_payment_id,razorpay_order_id,razorpay_signature}=request.body

     const expectedsign=crypto.createHmac('sha256','optjkx1DOhl8aQoJA1tGLQD1' )
     .update(razorpay_order_id + '|'+razorpay_order_id)
     .digest('hex')

     if(expectedsign===razorpay_signature){
        return response.status(200).send('success..')
     }
     else{
        return response.status(400).send('failure..')
     }
    }catch(error){
        console.log(error)
        return response.status(500).send('server error')
    }
    
})

const port=process.env.PORT || 8080;
app.listen(port,()=>console.log(`listening on part ${port}...`))


