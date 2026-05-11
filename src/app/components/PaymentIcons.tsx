import React from 'react';

const VisaIcon = () => (
  <svg viewBox="0 0 48 32" className="h-5 w-auto border border-gray-100 rounded-sm">
    <rect width="48" height="32" rx="4" fill="white"/>
    <text x="24" y="21" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1A1F71">VISA</text>
  </svg>
);

const MastercardIcon = () => (
  <svg viewBox="0 0 48 32" className="h-5 w-auto border border-gray-100 rounded-sm">
    <rect width="48" height="32" rx="4" fill="white"/>
    <circle cx="18" cy="16" r="8" fill="#EB001B" opacity="0.8"/>
    <circle cx="30" cy="16" r="8" fill="#F79E1B" opacity="0.8"/>
  </svg>
);

const AmexIcon = () => (
  <svg viewBox="0 0 48 32" className="h-5 w-auto border border-gray-100 rounded-sm">
    <rect width="48" height="32" rx="4" fill="#016FD0"/>
    <text x="24" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">AMEX</text>
  </svg>
);

const PayPalIcon = () => (
  <svg viewBox="0 0 48 32" className="h-5 w-auto border border-gray-100 rounded-sm">
    <rect width="48" height="32" rx="4" fill="white"/>
    <text x="24" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#003087">PayPal</text>
  </svg>
);

const ApplePayIcon = () => (
  <svg viewBox="0 0 48 32" className="h-5 w-auto border border-gray-100 rounded-sm">
    <rect width="48" height="32" rx="4" fill="black"/>
    <text x="24" y="20" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">Apple Pay</text>
  </svg>
);

const GPayIcon = () => (
  <svg viewBox="0 0 48 32" className="h-5 w-auto border border-gray-100 rounded-sm">
    <rect width="48" height="32" rx="4" fill="white"/>
    <text x="24" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#5F6368">GPay</text>
  </svg>
);

export default function PaymentIcons({ className }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <VisaIcon />
      <MastercardIcon />
      <AmexIcon />
      <ApplePayIcon />
      <GPayIcon />
      <PayPalIcon />
    </div>
  );
}
