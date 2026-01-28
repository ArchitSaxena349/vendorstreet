import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, isCartOpen, setIsCartOpen, clearCart } = useCart()
    const navigate = useNavigate()
    const [isCheckingOut, setIsCheckingOut] = useState(false)

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script')
            script.src = src
            script.onload = () => {
                resolve(true)
            }
            script.onerror = () => {
                resolve(false)
            }
            document.body.appendChild(script)
        })
    }

    const handleCheckout = async () => {
        setIsCheckingOut(true)
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                alert('Please login to place an order')
                navigate('/login')
                setIsCartOpen(false)
                return
            }

            // 1. Load Razorpay SDK
            const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
            if (!res) {
                alert('Razorpay SDK failed to load. Are you online?')
                return
            }

            // 2. Get Razorpay Key
            const keyResponse = await fetch('https://vendorstreet.onrender.com/api/payment/key', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const { key } = await keyResponse.json()

            // 3. Create Order on Backend
            const orderResponse = await fetch('https://vendorstreet.onrender.com/api/payment/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: cartTotal, // Amount in INR
                    currency: 'INR',
                    receipt: 'receipt_' + Date.now()
                })
            })
            const orderResult = await orderResponse.json()

            if (!orderResult.success) {
                alert('Server error. Are you online?')
                return
            }

            // 4. Open Razorpay Options
            const options = {
                key: key,
                amount: orderResult.data.amount,
                currency: orderResult.data.currency,
                name: "VendorStreet",
                description: "Transaction for Order",
                // image: "https://your-logo-url", 
                order_id: orderResult.data.id,
                handler: async function (response) {
                    // 5. Verify Payment
                    try {
                        const verifyResponse = await fetch('https://vendorstreet.onrender.com/api/payment/verify-payment', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        })
                        const verifyResult = await verifyResponse.json()

                        if (verifyResult.success) {
                            // 6. Create Order in Database (as Paid)
                            const finalOrderData = {
                                items: cartItems.map(item => ({
                                    listingId: item.id || item._id,
                                    quantity: item.quantity
                                })),
                                shippingAddress: { // Mock address for MVP
                                    street: '123 Main St',
                                    city: 'Mumbai',
                                    state: 'Maharashtra',
                                    pincode: '400001',
                                    phone: '9876543210'
                                },
                                paymentMethod: 'Online',
                                paymentResult: {
                                    id: response.razorpay_payment_id,
                                    status: 'paid',
                                    update_time: new Date().toISOString(),
                                    email_address: 'user@example.com' // Mock
                                }
                            }

                            const createOrderResponse = await fetch('https://vendorstreet.onrender.com/api/orders', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify(finalOrderData)
                            })
                            const createOrderResult = await createOrderResponse.json()

                            if (createOrderResult.success) {
                                alert('Payment Successful! Order Placed.')
                                clearCart()
                                setIsCartOpen(false)
                                navigate('/orders')
                            } else {
                                alert('Payment verified but Order creation failed: ' + createOrderResult.message)
                            }
                        } else {
                            alert('Payment verification failed')
                        }
                    } catch (error) {
                        console.error('Verification Error:', error)
                        alert('Payment verification failed')
                    }
                },
                prefill: {
                    name: "VendorStreet User", // Should come from User Context
                    email: "user@vendorstreet.com",
                    contact: "9999999999"
                },
                notes: {
                    address: "VendorStreet Corporate Office"
                },
                theme: {
                    color: "#16a34a" // Green-600
                }
            }

            const paymentObject = new window.Razorpay(options)
            paymentObject.open()

        } catch (error) {
            console.error('Checkout error:', error)
            alert('An error occurred during checkout')
        } finally {
            setIsCheckingOut(false)
        }
    }

    return (
        <Transition.Root show={isCartOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={setIsCartOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-lg font-medium text-gray-900">Shopping cart</Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                                                        onClick={() => setIsCartOpen(false)}
                                                    >
                                                        <span className="absolute -inset-0.5" />
                                                        <span className="sr-only">Close panel</span>
                                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-8">
                                                <div className="flow-root">
                                                    {cartItems.length === 0 ? (
                                                        <div className="text-center py-12">
                                                            <p className="text-gray-500">Your cart is empty</p>
                                                        </div>
                                                    ) : (
                                                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                                                            {cartItems.map((product) => (
                                                                <li key={product.id || product._id} className="flex py-6">
                                                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                                        <img
                                                                            src={product.image || (product.imageUrl ? `https://vendorstreet.onrender.com${product.imageUrl}` : 'https://via.placeholder.com/100')}
                                                                            alt={product.name || product.title}
                                                                            className="h-full w-full object-cover object-center"
                                                                        />
                                                                    </div>

                                                                    <div className="ml-4 flex flex-1 flex-col">
                                                                        <div>
                                                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                                                <h3>
                                                                                    <a href={`/products/${product.id || product._id}`}>{product.name || product.title}</a>
                                                                                </h3>
                                                                                <p className="ml-4">₹{product.price * product.quantity}</p>
                                                                            </div>
                                                                            <p className="mt-1 text-sm text-gray-500">{product.unit}</p>
                                                                        </div>
                                                                        <div className="flex flex-1 items-end justify-between text-sm">
                                                                            <div className="flex items-center border rounded">
                                                                                <button onClick={() => updateQuantity(product.id || product._id, product.quantity - 1)} className="px-2 py-1 hover:bg-gray-100">-</button>
                                                                                <span className="px-2">{product.quantity}</span>
                                                                                <button onClick={() => updateQuantity(product.id || product._id, product.quantity + 1)} className="px-2 py-1 hover:bg-gray-100">+</button>
                                                                            </div>

                                                                            <div className="flex">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => removeFromCart(product.id || product._id)}
                                                                                    className="font-medium text-green-600 hover:text-green-500"
                                                                                >
                                                                                    Remove
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {cartItems.length > 0 && (
                                            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <p>Subtotal</p>
                                                    <p>₹{cartTotal}</p>
                                                </div>
                                                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                                                <div className="mt-6">
                                                    <button
                                                        onClick={handleCheckout}
                                                        disabled={isCheckingOut}
                                                        className="flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                    >
                                                        {isCheckingOut ? 'Processing...' : 'Checkout'}
                                                    </button>
                                                </div>
                                                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                                    <p>
                                                        or{' '}
                                                        <button
                                                            type="button"
                                                            className="font-medium text-green-600 hover:text-green-500"
                                                            onClick={() => setIsCartOpen(false)}
                                                        >
                                                            Continue Shopping
                                                            <span aria-hidden="true"> &rarr;</span>
                                                        </button>
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default Cart

