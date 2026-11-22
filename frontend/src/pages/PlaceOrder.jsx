import React, { useContext, useState, useEffect } from 'react'
import Title from '../component/Title'
import CartTotal from '../component/CartTotal'
import razorpayImg from '../assets/Razorpay.jpg'
import { shopDataContext } from '../context/ShopContext'
import { authDataContext } from '../context/Authcontext'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from '../component/Loading'

function PlaceOrder() {
    const location = useLocation()
    const navigate = useNavigate()

    // If user came via Buy Now, state.buyNow is true and state.items holds just that one product
    const buyNowState = location.state || {}

    const { cartItem, setCartItem, getCartAmount, delivery_fee, products } = useContext(shopDataContext)
    let { serverUrl } = useContext(authDataContext)

    // Pre-select razorpay if Buy Now was clicked, otherwise default to 'cod'
    let [method, setMethod] = useState(buyNowState.method || 'cod')
    let [loading, setLoading] = useState(false)

    let [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        pinCode: '',
        country: '',
        phone: ''
    })

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData(data => ({ ...data, [name]: value }))
    }

    // Build order items — from Buy Now state OR from cart
    const buildOrderItems = () => {
        if (buyNowState.buyNow && buyNowState.items) {
            return buyNowState.items
        }
        let orderItems = []
        for (const items in cartItem) {
            for (const item in cartItem[items]) {
                if (cartItem[items][item] > 0) {
                    const itemInfo = structuredClone(products.find(product => product._id === items))
                    if (itemInfo) {
                        itemInfo.size = item
                        itemInfo.quantity = cartItem[items][item]
                        orderItems.push(itemInfo)
                    }
                }
            }
        }
        return orderItems
    }

    // Compute total amount — Buy Now uses product price directly; cart uses getCartAmount()
    const getTotalAmount = () => {
        if (buyNowState.buyNow && buyNowState.items) {
            const subtotal = buyNowState.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
            return subtotal + delivery_fee
        }
        return getCartAmount() + delivery_fee
    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Stitchlyn',
            description: 'Order Payment',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                console.log(response)
                try {
                    const { data } = await axios.post(serverUrl + '/api/order/verifyrazorpay', response, { withCredentials: true })
                    if (data.message === 'Payment Successful') {
                        toast.success('Payment Successful! 🎉')
                        setCartItem({})
                        navigate('/order')
                    } else {
                        toast.error('Payment verification failed')
                    }
                } catch (err) {
                    console.log(err)
                    toast.error('Payment verification error')
                }
            },
            prefill: {
                name: formData.firstName + ' ' + formData.lastName,
                email: formData.email,
                contact: formData.phone
            },
            theme: { color: '#3bcee8' }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const orderItems = buildOrderItems()
            if (orderItems.length === 0) {
                toast.error('No items to order!')
                setLoading(false)
                return
            }

            const orderData = {
                address: formData,
                items: orderItems,
                amount: getTotalAmount()
            }

            switch (method) {
                case 'cod': {
                    const result = await axios.post(serverUrl + '/api/order/placeorder', orderData, { withCredentials: true })
                    if (result.data) {
                        setCartItem({})
                        toast.success('Order Placed Successfully! 🎉')
                        navigate('/order')
                    } else {
                        toast.error('Failed to place order')
                    }
                    break
                }

                case 'razorpay': {
                    const resultRazorpay = await axios.post(serverUrl + '/api/order/razorpay', orderData, { withCredentials: true })
                    if (resultRazorpay.data) {
                        initPay(resultRazorpay.data)
                    } else {
                        toast.error('Failed to initiate payment')
                    }
                    break
                }

                default:
                    break
            }
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong. Please try again.')
        }
        setLoading(false)
    }

    // Show Buy Now banner if in Buy Now mode
    const isBuyNow = buyNowState.buyNow && buyNowState.items

    return (
        <div className='w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex items-start justify-center flex-col md:flex-row gap-[50px] py-[100px] px-[20px] relative'>

            {/* Buy Now banner */}
            {isBuyNow && (
                <div className='absolute top-[70px] left-0 right-0 flex justify-center'>
                    <div className='bg-gradient-to-r from-[#3bcee8] to-[#2f97f1] text-white text-[14px] font-bold px-[25px] py-[8px] rounded-full shadow-lg'>
                        ⚡ Buy Now — Express Checkout
                    </div>
                </div>
            )}

            {/* Left — Delivery Form */}
            <div className='lg:w-[50%] w-[100%] flex items-center justify-center'>
                <form action="" onSubmit={onSubmitHandler} className='lg:w-[70%] w-[95%] lg:h-[70%] h-[100%]'>
                    <div className='py-[10px]'>
                        <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                    </div>
                    <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
                        <input type="text" placeholder='First name' className='w-[48%] h-[50px] rounded-md bg-slate-700 placeholder:text-[white] text-[18px] px-[20px] shadow-sm shadow-[#343434] text-white' required onChange={onChangeHandler} name='firstName' value={formData.firstName} />
                        <input type="text" placeholder='Last name' className='w-[48%] h-[50px] rounded-md shadow-sm shadow-[#343434] bg-slate-700 placeholder:text-[white] text-[18px] px-[20px] text-white' required onChange={onChangeHandler} name='lastName' value={formData.lastName} />
                    </div>
                    <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
                        <input type="email" placeholder='Email address' className='w-[100%] h-[50px] rounded-md shadow-sm shadow-[#343434] bg-slate-700 placeholder:text-[white] text-[18px] px-[20px] text-white' required onChange={onChangeHandler} name='email' value={formData.email} />
                    </div>
                    <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
                        <input type="text" placeholder='Street' className='w-[100%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px] text-white' required onChange={onChangeHandler} name='street' value={formData.street} />
                    </div>
                    <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
                        <input type="text" placeholder='City' className='w-[48%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px] text-white' required onChange={onChangeHandler} name='city' value={formData.city} />
                        <input type="text" placeholder='State' className='w-[48%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px] text-white' required onChange={onChangeHandler} name='state' value={formData.state} />
                    </div>
                    <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
                        <input type="text" placeholder='Pincode' className='w-[48%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px] text-white' required onChange={onChangeHandler} name='pinCode' value={formData.pinCode} />
                        <input type="text" placeholder='Country' className='w-[48%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px] text-white' required onChange={onChangeHandler} name='country' value={formData.country} />
                    </div>
                    <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
                        <input type="text" placeholder='Phone' className='w-[100%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px] text-white' required onChange={onChangeHandler} name='phone' value={formData.phone} />
                    </div>
                    <div className='w-[100%] flex items-center justify-start px-[10px] mt-[20px] pb-[30px]'>
                        <button
                            type='submit'
                            className='text-[18px] active:bg-slate-500 cursor-pointer bg-[#3bcee848] py-[12px] px-[50px] rounded-2xl text-white flex items-center justify-center gap-[15px] border-[1px] border-[#80808049] hover:bg-[#3bcee870] transition-colors'
                        >
                            {loading ? <Loading /> : 'PLACE ORDER'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Right — Order Summary + Payment Method */}
            <div className='lg:w-[50%] w-[100%] min-h-[100%] flex items-center justify-center gap-[30px]'>
                <div className='lg:w-[70%] w-[90%] lg:h-[70%] h-[100%] flex items-center justify-center gap-[10px] flex-col'>

                    {/* Buy Now single item summary OR Cart Total */}
                    {isBuyNow ? (
                        <div className='w-full border-[2px] border-[#4d8890] p-[20px]'>
                            <Title text1={'ORDER'} text2={'SUMMARY'} />
                            {buyNowState.items.map((item, i) => (
                                <div key={i} className='flex items-center gap-[15px] mt-[15px]'>
                                    <img src={item.image1} alt="" className='w-[70px] h-[70px] rounded-md object-cover' />
                                    <div>
                                        <p className='text-white text-[16px] font-semibold'>{item.name}</p>
                                        <p className='text-[#aaf4e7] text-[14px]'>Size: {item.size} &nbsp;|&nbsp; Qty: {item.quantity}</p>
                                        <p className='text-[#9ff9f9] text-[16px] font-bold'>₹ {item.price * item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                            <hr className='border-[#4d8890] my-[15px]' />
                            <div className='flex justify-between text-white text-[16px] px-[5px]'>
                                <span>Shipping Fee</span><span>₹ {delivery_fee}</span>
                            </div>
                            <div className='flex justify-between text-[#9ff9f9] text-[18px] font-bold px-[5px] mt-[8px]'>
                                <span>Total</span><span>₹ {getTotalAmount()}</span>
                            </div>
                        </div>
                    ) : (
                        <CartTotal />
                    )}

                    <div className='py-[10px] w-full'>
                        <Title text1={'PAYMENT'} text2={'METHOD'} />
                    </div>

                    <div className='w-[100%] h-[30vh] lg:h-[100px] flex items-start mt-[20px] lg:mt-[0px] justify-center gap-[50px]'>
                        {/* Razorpay */}
                        <button
                            type='button'
                            onClick={() => setMethod('razorpay')}
                            className={`w-[150px] h-[50px] rounded-sm transition-all ${method === 'razorpay' ? 'border-[5px] border-blue-500 scale-105' : 'border-[2px] border-transparent hover:border-blue-700'}`}
                        >
                            <img src={razorpayImg} className='w-[100%] h-[100%] object-fill rounded-sm' alt="Razorpay" />
                        </button>

                        {/* Cash on Delivery */}
                        <button
                            type='button'
                            onClick={() => setMethod('cod')}
                            className={`w-[200px] h-[50px] bg-gradient-to-t from-[#95b3f8] to-[white] text-[14px] px-[20px] rounded-sm text-[#332f6f] font-bold transition-all ${method === 'cod' ? 'border-[5px] border-blue-500 scale-105' : 'border-[2px] border-transparent hover:border-blue-700'}`}
                        >
                            CASH ON DELIVERY
                        </button>
                    </div>

                    {/* Payment method hint */}
                    <p className='text-[#808080] text-[13px] text-center mt-[5px]'>
                        {method === 'razorpay'
                            ? '💳 You will be redirected to Razorpay secure checkout'
                            : '📦 Pay with cash when your order arrives'}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default PlaceOrder
