import Order from "../model/orderModel.js";
import User from "../model/userModel.js";
import dotenv from 'dotenv'
dotenv.config()
const currency = 'inr'
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// for User
export const placeOrder = async (req,res) => {

     try {
         const {items , amount , address} = req.body;
         const userId = req.userId;
         const orderData = {
            items,
            amount,
            userId,
            address,
            paymentMethod:'COD',
            payment:false,
            date: Date.now()
         }

         const newOrder = new Order(orderData)
         await newOrder.save()

         await User.findByIdAndUpdate(userId,{cartData:{}})

         return res.status(201).json({message:'Order Place'})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Order Place error'})
    }
    
}


// export const placeOrderRazorpay = async (req,res) => {
//     try {
        
//          const {items , amount , address} = req.body;
//          const userId = req.userId;
//          const orderData = {
//             items,
//             amount,
//             userId,
//             address,
//             paymentMethod:'Razorpay',
//             payment:false,
//             date: Date.now()
//          }

//          const newOrder = new Order(orderData)
//          await newOrder.save()

//          const options = {
//             amount:amount * 100,
//             currency: currency.toUpperCase(),
//             receipt : newOrder._id.toString()
//          }
//          await razorpayInstance.orders.create(options, (error,order)=>{
//             if(error) {
//                 console.log(error)
//                 return res.status(500).json(error)
//             }
//             res.status(200).json(order)
//          })
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({message:error.message
//             })
//     }
// }

export const placeOrderStripe = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;

    const orderData = {
      items,
      amount,
      userId,
      address,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // in paise
      currency: "inr",
      metadata: { orderId: newOrder._id.toString(), userId },
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      orderId: newOrder._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};



// export const verifyRazorpay = async (req,res) =>{
//     try {
//         const userId = req.userId
//         const {razorpay_order_id} = req.body
//         const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
//         if(orderInfo.status === 'paid'){
//             await Order.findByIdAndUpdate(orderInfo.receipt,{payment:true});
//             await User.findByIdAndUpdate(userId , {cartData:{}})
//             res.status(200).json({message:'Payment Successful'
//             })
//         }
//         else{
//             res.json({message:'Payment Failed'
//             })
//         }
//     } catch (error) {
//         console.log(error)
//          res.status(500).json({message:error.message
//             })
//     }
// }

export const verifyStripe = async (req, res) => {
  try {
    const { orderId } = req.body;

    await Order.findByIdAndUpdate(orderId, { payment: true });
    await User.findByIdAndUpdate(req.userId, { cartData: {} });

    res.status(200).json({ message: "Payment Successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};







export const userOrders = async (req,res) => {
      try {
        const userId = req.userId;
        const orders = await Order.find({userId})
        return res.status(200).json(orders)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"userOrders error"})
    }
    
}




//for Admin



    
export const allOrders = async (req,res) => {
    try {
        const orders = await Order.find({})
        res.status(200).json(orders)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"adminAllOrders error"})
        
    }
    
}
    
export const updateStatus = async (req,res) => {
    
try {
    const {orderId , status} = req.body

    await Order.findByIdAndUpdate(orderId , { status })
    return res.status(201).json({message:'Status Updated'})
} catch (error) {
     return res.status(500).json({message:error.message
            })
}
}