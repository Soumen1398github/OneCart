import React, { useContext, useState } from "react";
import Title from "../component/Title";
import CartTotal from "../component/CartTotal";
import { shopDataContext } from "../context/ShopContext";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../component/Loading";

// Stripe
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function PlaceOrder() {
  let [method, setMethod] = useState("cod");
  let navigate = useNavigate();
  const { cartItem, setCartItem, getCartAmount, delivery_fee, products } =
    useContext(shopDataContext);
  let { serverUrl } = useContext(authDataContext);
  let [loading, setLoading] = useState(false);

  let [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    phone: "",
  });

  const stripe = useStripe();
  const elements = useElements();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const buildOrderItems = () => {
    let orderItems = [];
    for (const items in cartItem) {
      for (const item in cartItem[items]) {
        if (cartItem[items][item] > 0) {
          const itemInfo = structuredClone(
            products.find((product) => product._id === items)
          );
          if (itemInfo) {
            itemInfo.size = item;
            itemInfo.quantity = cartItem[items][item];
            orderItems.push(itemInfo);
          }
        }
      }
    }
    return orderItems;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        address: formData,
        items: buildOrderItems(),
        amount: getCartAmount() + delivery_fee,
      };

      if (method === "cod") {
        // COD Flow
        const result = await axios.post(
          serverUrl + "/api/order/placeorder",
          orderData,
          { withCredentials: true }
        );

        if (result.data) {
          setCartItem({});
          toast.success("Order Placed");
          navigate("/order");
        } else {
          toast.error("Order Place Error");
        }
        setLoading(false);
      } else if (method === "stripe") {
        // Stripe Flow
        const result = await axios.post(
          serverUrl + "/api/order/placeorderstripe",
          orderData,
          { withCredentials: true }
        );

        const { clientSecret, orderId } = result.data;
        if (!clientSecret) throw new Error("Stripe client secret not received");

        // Confirm card payment
        const cardElement = elements.getElement(CardElement);
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: cardElement,
            },
          }
        );

        if (error) {
          toast.error(error.message);
        } else if (paymentIntent.status === "succeeded") {
          // Verify with backend
          await axios.post(
            serverUrl + "/api/order/verifystripe",
            { orderId },
            { withCredentials: true }
          );

          setCartItem({});
          toast.success("Payment Successful 🎉");
          navigate("/order");
        }
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Order Failed");
      setLoading(false);
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex items-center justify-center flex-col md:flex-row gap-[50px] relative">
        <div className="lg:w-[50%] w-[100%] flex items-center justify-center mt-[90px] lg:mt-0">
          <form onSubmit={onSubmitHandler} className="lg:w-[70%] w-[95%]">
            <div className="py-[10px]">
              <Title text1={"DELIVERY"} text2={"INFORMATION"} />
            </div>

            {/* Form Fields */}
            <div className="flex gap-2 px-[10px] mb-2">
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                required
                value={formData.firstName}
                onChange={onChangeHandler}
                className="w-1/2 p-2 rounded-md bg-slate-700 text-white"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                required
                value={formData.lastName}
                onChange={onChangeHandler}
                className="w-1/2 p-2 rounded-md bg-slate-700 text-white"
              />
            </div>
            <div className="px-[10px] mb-2">
              <input
                type="email"
                name="email"
                placeholder="Email address"
                required
                value={formData.email}
                onChange={onChangeHandler}
                className="w-full p-2 rounded-md bg-slate-700 text-white"
              />
            </div>
            <div className="px-[10px] mb-2">
              <input
                type="text"
                name="street"
                placeholder="Street"
                required
                value={formData.street}
                onChange={onChangeHandler}
                className="w-full p-2 rounded-md bg-slate-700 text-white"
              />
            </div>
            <div className="flex gap-2 px-[10px] mb-2">
              <input
                type="text"
                name="city"
                placeholder="City"
                required
                value={formData.city}
                onChange={onChangeHandler}
                className="w-1/2 p-2 rounded-md bg-slate-700 text-white"
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                required
                value={formData.state}
                onChange={onChangeHandler}
                className="w-1/2 p-2 rounded-md bg-slate-700 text-white"
              />
            </div>
            <div className="flex gap-2 px-[10px] mb-2">
              <input
                type="text"
                name="pinCode"
                placeholder="Pincode"
                required
                value={formData.pinCode}
                onChange={onChangeHandler}
                className="w-1/2 p-2 rounded-md bg-slate-700 text-white"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                required
                value={formData.country}
                onChange={onChangeHandler}
                className="w-1/2 p-2 rounded-md bg-slate-700 text-white"
              />
            </div>
            <div className="px-[10px] mb-2">
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                required
                value={formData.phone}
                onChange={onChangeHandler}
                className="w-full p-2 rounded-md bg-slate-700 text-white"
              />
            </div>

            {/* Stripe Card Input (only show if stripe selected) */}
            {method === "stripe" && (
              <div className="px-[10px] mb-4 bg-white p-3 rounded-md">
                <CardElement />
              </div>
            )}

            <div>
              <button
                type="submit"
                className="text-[18px] active:bg-slate-500 cursor-pointer bg-[#3bcee848] py-[10px] px-[50px] rounded-2xl text-white absolute lg:right-[20%] bottom-[10%] right-[35%] border border-gray-500"
              >
                {loading ? <Loading /> : "PLACE ORDER"}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:w-[50%] w-[100%] flex flex-col items-center justify-center gap-6">
          <CartTotal />
          <div className="py-[10px]">
            <Title text1={"PAYMENT"} text2={"METHOD"} />
          </div>
          <div className="flex gap-6">
            {/* Stripe Button */}
            <button
              onClick={() => setMethod("stripe")}
              className={`w-[200px] h-[50px] bg-gradient-to-t from-[#95b3f8] to-white text-[#332f6f] font-bold rounded-md 
      ${
        method === "stripe"
          ? "border-[4px] border-blue-900"
          : "border border-gray-400"
      }`}
            >
              Pay with Card (Stripe)
            </button>

            {/* COD Button */}
            <button
              onClick={() => setMethod("cod")}
              className={`w-[200px] h-[50px] bg-gradient-to-t from-[#95b3f8] to-white text-[#332f6f] font-bold rounded-md 
      ${
        method === "cod"
          ? "border-[4px] border-blue-900"
          : "border border-gray-400"
      }`}
            >
              Cash on Delivery
            </button>
          </div>
        </div>
      </div>
    </Elements>
  );
}

export default PlaceOrder;
