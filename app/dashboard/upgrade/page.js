"use client";
import { useUser } from "@clerk/nextjs";
import { PayPalButtons } from "@paypal/react-paypal-js";
import React from "react";
import { toast } from "sonner";

const UpgradePlans = () => {
  const { user } = useUser();

  // Conditionally set up Convex
  let userUpgradePlan = null;

  try {
    if (process.env.NEXT_PUBLIC_CONVEX_URL) {
      const { useMutation } = require("convex/react");
      const { api } = require("@/convex/_generated/api");

      userUpgradePlan = useMutation(api.user.userUpgradePlan);
    }
  } catch (error) {
    console.log("Convex not available for upgrade functionality");
  }

  const onPaymentSuccess = async () => {
    if (!userUpgradePlan) {
      toast("Upgrade service not configured. Please set up Convex.");
      return;
    }

    try {
      const result = await userUpgradePlan({
        useEmail: user?.primaryEmailAddress.emailAddress,
      });
      toast("Plan upgraded successfully !!");
    } catch (error) {
      toast("Upgrade failed. Please try again.");
      console.error("Upgrade error:", error);
    }
  };

  return (
    <div className="ml-20 lg:-ml-20 mt-28 text-[#ECDFCC] md:mx-5 lg:mx-10">
      <div className="mx-5 md:mx-0">
        <h2 className="font-medium text-3xl md:text-2xl">Plans</h2>
        <p className="mt-1 text-sm md:text-base">
          Upgrade your plan to upload more files and take notes
        </p>
      </div>
      <div className="mx-auto max-w-1xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center md:gap-8">
          <div className="rounded-2xl border text-[#ECDFCC] border-gray-200 p-6 shadow-sm sm:px-8 lg:p-12">
            <div className="text-center">
              <h2 className="text-lg font-medium text-[#ECDFCC]">Free<span className="sr-only">Plan</span></h2>
              <p className="mt-2 sm:mt-4">
                <strong className="text-3xl font-bold text-[#ECDFCC] sm:text-4xl">0$</strong>
              </p>
            </div>
            <ul className="mt-6 space-y-2">
              <li className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-indigo-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-[#ECDFCC]">5 PDF uploads</span>
              </li>
              <li className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-indigo-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-[#ECDFCC]">Unlimited note-taking</span>
              </li>
            </ul>
            <div className="mt-8 block rounded-full border border-gray-300 bg-[#181C14] hover:bg-slate-300 hover:text-black px-12 py-3 text-center text-sm font-medium text-[#ECDFCC]">
              Current Plan
            </div>
          </div>
          <div className="rounded-2xl border border-indigo-600 p-6 shadow-sm ring-1 ring-indigo-600 sm:order-last sm:px-8 lg:p-12">
            <div className="text-center">
              <h2 className="text-lg font-medium text-[#ECDFCC]">Unlimited<span className="sr-only">Plan</span></h2>
              <p className="mt-2 sm:mt-4">
                <strong className="text-3xl font-bold text-[#ECDFCC] sm:text-4xl">10$</strong>
                <span className="text-sm font-medium text-[#ECDFCC]">/one-time</span>
              </p>
            </div>
            <ul className="mt-6 space-y-2">
              <li className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-indigo-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-[#ECDFCC]">Unlimited file uploads</span>
              </li>
              <li className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-indigo-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-[#ECDFCC]">Unlimited note-taking</span>
              </li>
            </ul>
            <div className="mt-5 flex justify-center">
              {process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ? (
                <PayPalButtons
                  className="z-10"
                  onApprove={() => onPaymentSuccess()}
                  onCancel={() => console.log("Order Payment Cancelled")}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: 10,
                            currency_code: "USD",
                          },
                        },
                      ],
                    });
                  }}
                />
              ) : (
                <div className="text-center p-4 bg-gray-700 rounded-lg">
                  <p className="text-[#ECDFCC] mb-2">Payment Integration Coming Soon</p>
                  <p className="text-sm text-gray-400">PayPal integration is not configured yet.</p>
                  <button
                    onClick={() => toast.success("Thank you for your interest! Payment will be available soon.")}
                    className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Notify Me When Available
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePlans;
