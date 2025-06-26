'use client'
import Image from 'next/image'
import React from 'react'

export default function OrderDetail() {
    return (
        <div className="bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-2">
                    Order History
                </h1>
                <p className="text-gray-600 mb-6">
                    See your recent orders, download your invoices.
                </p>
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500">
                                Order ID
                            </p>
                            <p className="font-bold">
                                1234
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500">
                                Date of Placement
                            </p>
                            <p className="font-bold">
                                April 3, 2024
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500">
                                Amount
                            </p>
                            <p className="font-bold">
                                $2,570
                            </p>
                        </div>
                        <button className="bg-black text-white px-4 py-2 rounded-lg">
                            VIEW INVOICE
                        </button>
                    </div>
                </div>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Details
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap flex items-center">
                                    <Image
                                        width={50}
                                        height={50}
                                        alt="Image of a Premium Suit" className="w-10 h-10 rounded-full mr-4" src="https://placehold.co/50x50" />
                                    <div className="text-sm font-medium text-gray-900">
                                        Premium Suit
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    $790
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        <i className="fas fa-circle mr-1">
                                        </i>
                                        DELIVERED
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    Apr 6, 2022
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <a className="text-indigo-600 hover:text-indigo-900" href="#">
                                        DOWNLOAD
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap flex items-center">
                                    <Image
                                        width={50}
                                        height={50}
                                        alt="Image of a Linen Suit" className="w-10 h-10 rounded-full mr-4" src="https://placehold.co/50x50" />
                                    <div className="text-sm font-medium text-gray-900">
                                        Linen Suit
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    $790
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        <i className="fas fa-circle mr-1">
                                        </i>
                                        DELIVERED
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    Apr 6, 2022
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <a className="text-indigo-600 hover:text-indigo-900" href="#">
                                        DOWNLOAD
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap flex items-center">
                                    <Image
                                        width={50}
                                        height={50}
                                        alt="Image of a Tweed Suit" className="w-10 h-10 rounded-full mr-4" src="https://placehold.co/50x50" />
                                    <div className="text-sm font-medium text-gray-900">
                                        Tweed Suit
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    $990
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        <i className="fas fa-circle mr-1">
                                        </i>
                                        DELIVERED
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    Apr 6, 2022
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <a className="text-indigo-600 hover:text-indigo-900" href="#">
                                        DOWNLOAD
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
