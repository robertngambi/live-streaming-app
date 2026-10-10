import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Zap,
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Clock,
  X,
  Building2,
  AlertCircle,
  Smartphone,
  HardDrive,
  Cloud,
} from 'lucide-react';
import { SubscriptionTier } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: SubscriptionTier;
  trialDaysLeft: number;
  onSelectTier: (tier: SubscriptionTier) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentTier,
  trialDaysLeft,
  onSelectTier,
}) => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [view, setView] = useState<'plans' | 'payment' | 'success'>('plans');
  const [targetPlan, setTargetPlan] = useState<'basic' | 'premium'>('premium');

  // Credit Card Form State
  const [cardName, setCardName] = useState('Robert Ngambi');
  const [cardNumber, setCardNumber] = useState('4532 8821 9043 1290');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('382');
  const [cardZip, setCardZip] = useState('90210');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [transactionId, setTransactionId] = useState('');

  if (!isOpen) return null;

  const handleStartCheckout = (plan: 'basic' | 'premium') => {
    setTargetPlan(plan);
    setErrorMessage('');
    setView('payment');
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.join(' ') : digits;
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const getCardType = (num: string) => {
    const clean = num.replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'VISA';
    if (clean.startsWith('5')) return 'MASTERCARD';
    if (clean.startsWith('3')) return 'AMEX';
    return 'CARD';
  };

  const getPlanPrice = (plan: 'basic' | 'premium', period: 'monthly' | 'yearly') => {
    if (plan === 'basic') {
      return period === 'monthly' ? '$3.99' : '$45.99';
    }
    return period === 'monthly' ? '$5.99' : '$67.99';
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (cardNumber.replace(/\s+/g, '').length < 15) {
      setErrorMessage('Please enter a valid 16-digit credit card number.');
      return;
    }
    if (cardExpiry.length < 5) {
      setErrorMessage('Please enter a valid expiry date (MM/YY).');
      return;
    }
    if (cardCvv.length < 3) {
      setErrorMessage('Please enter a valid 3 or 4 digit CVV security code.');
      return;
    }

    setIsProcessing(true);

    // Simulate direct card processing to App Admin Account
    setTimeout(() => {
      setIsProcessing(false);
      const newTxn = `TXN-${Math.floor(100000 + Math.random() * 900000)}-ADM`;
      setTransactionId(newTxn);
      onSelectTier(targetPlan);
      setView('success');
    }, 1200);
  };

  const handleClose = () => {
    setView('plans');
    setIsProcessing(false);
    onClose();
  };

  return (
    <div
      id="subscription-modal-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
    >
      <div
        id="subscription-modal-box"
        className="w-full max-w-2xl bg-[#1c222a] border border-[#374151] rounded-2xl text-slate-100 shadow-2xl animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Header - Simple clean title, NO left icon, exit 'X' button on top-right */}
        <div className="p-4 sm:p-5 bg-[#212732] border-b border-[#303a48] flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
            {view === 'plans'
              ? 'Subscription Packages'
              : view === 'payment'
              ? 'Credit Card Payment'
              : 'Payment Confirmed'}
          </h2>
          <button
            id="close-subscription-modal"
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#2b3340] transition-colors"
            title="Exit"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View 1: Plans Grid */}
        {view === 'plans' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Billing Period Toggle */}
            <div className="flex items-center justify-center py-2.5 bg-[#151921] border-b border-[#2b3340]">
              <div className="flex items-center bg-[#202733] p-1 rounded-xl border border-[#354152]">
                <button
                  id="billing-monthly-btn"
                  type="button"
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    billingPeriod === 'monthly'
                      ? 'bg-sky-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  id="billing-yearly-btn"
                  type="button"
                  onClick={() => setBillingPeriod('yearly')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    billingPeriod === 'yearly'
                      ? 'bg-sky-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Discounted Yearly</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                    SAVE 10%
                  </span>
                </button>
              </div>
            </div>

            {/* Packages Cards Grid */}
            <div className="p-4 sm:p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              {/* Tier 1: Free Trial */}
              <div
                className={`rounded-2xl p-4 border flex flex-col justify-between transition-all relative ${
                  currentTier === 'trial'
                    ? 'bg-emerald-950/20 border-emerald-500/50 ring-2 ring-emerald-500/30'
                    : 'bg-[#151921] border-[#2c3543]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-emerald-400">
                      Free Trial
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {trialDaysLeft} Days Left
                    </span>
                  </div>

                  <div className="text-2xl font-black text-white">$0.00</div>
                  <div className="text-[11px] text-slate-400 mb-3">15-day trial period</div>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        <strong>4 Total Cameras</strong> (2 External + 2 Phone)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Live Audio VU Equalizer</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Local Storage Folders</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-50">
                      <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="text-slate-400">Cloud Storage (Locked)</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-50">
                      <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="text-slate-400">Virtual Frames (Locked)</span>
                    </div>
                  </div>
                </div>

                <button
                  id="select-trial-tier-btn"
                  type="button"
                  onClick={() => {
                    onSelectTier('trial');
                    handleClose();
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold mt-4 transition-all ${
                    currentTier === 'trial'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'bg-[#252e3b] text-slate-300 hover:bg-[#303b4b]'
                  }`}
                >
                  {currentTier === 'trial' ? 'Active Trial Plan' : 'Switch to Trial'}
                </button>
              </div>

              {/* Tier 2: Basic Package (3 External Cameras + 2 Phone = 5 Total) */}
              <div
                className={`rounded-2xl p-4 border flex flex-col justify-between transition-all relative ${
                  currentTier === 'basic'
                    ? 'bg-sky-950/30 border-sky-400 ring-2 ring-sky-400/40 shadow-lg'
                    : 'bg-[#151921] border-[#2c3543]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-sky-400">
                      Basic Package
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300">
                      Standard
                    </span>
                  </div>

                  <div className="text-2xl font-black text-white">
                    {billingPeriod === 'monthly' ? '$3.99' : '$45.99'}
                    <span className="text-xs font-normal text-slate-400">
                      /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mb-3">
                    {billingPeriod === 'yearly' ? 'Yearly Package' : 'Monthly Package'}
                  </div>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>
                        <strong>5 Total Cameras</strong> (3 External + 2 Phone)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Unlimited Live Streaming</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>1080p 60fps Recording</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Audio Equalizer & Gain</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-50">
                      <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="text-slate-400">Cloud Storage (Locked)</span>
                    </div>
                  </div>
                </div>

                <button
                  id="select-basic-tier-btn"
                  type="button"
                  onClick={() => handleStartCheckout('basic')}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold mt-4 transition-all flex items-center justify-center gap-1.5 ${
                    currentTier === 'basic'
                      ? 'bg-sky-500 text-slate-950 shadow-md'
                      : 'bg-sky-600 hover:bg-sky-500 text-white font-bold'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{currentTier === 'basic' ? 'Current Plan (Pay/Renew)' : 'Select Basic Plan'}</span>
                </button>
              </div>

              {/* Tier 3: Premium Package (6 External Cameras + 2 Phone = 8 Total + Cloud Storage) */}
              <div
                className={`rounded-2xl p-4 border flex flex-col justify-between transition-all relative ${
                  currentTier === 'premium'
                    ? 'bg-gradient-to-b from-amber-950/30 to-indigo-950/30 border-amber-400 ring-2 ring-amber-400/50 shadow-xl'
                    : 'bg-[#151921] border-amber-500/30'
                }`}
              >
                {/* Best Value Ribbon */}
                <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-md">
                  ★ VIP Studio
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Premium Package
                    </span>
                  </div>

                  <div className="text-2xl font-black text-amber-300">
                    {billingPeriod === 'monthly' ? '$5.99' : '$67.99'}
                    <span className="text-xs font-normal text-slate-400">
                      /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-400/80 mb-3">
                    {billingPeriod === 'yearly' ? 'Yearly VIP Pass' : 'Monthly VIP Pass'}
                  </div>

                  <div className="space-y-2 text-xs text-slate-200">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>
                        <strong>8 Total Cameras</strong> (6 External + 2 Phone)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-amber-300 font-semibold">
                        <strong>Cloud Storage Sync</strong> (Drive & Dropbox)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>
                        <strong>8 Virtual Video Frames</strong> Overlays
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>4K Ultra-HD 90 FPS Capability</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Multi-Cam ISO Simultaneous Recording</span>
                    </div>
                  </div>
                </div>

                <button
                  id="select-premium-tier-btn"
                  type="button"
                  onClick={() => handleStartCheckout('premium')}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold mt-4 transition-all shadow-md flex items-center justify-center gap-1.5 ${
                    currentTier === 'premium'
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{currentTier === 'premium' ? 'Current Plan (Pay/Renew)' : 'Upgrade to Premium'}</span>
                </button>
              </div>
            </div>

            {/* Footer with security disclaimer only (NO close button on bottom) */}
            <div className="p-3 bg-[#151921] border-t border-[#2d3744] flex items-center justify-center text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>256-bit SSL encrypted billing • Instant plan upgrade • Cancel anytime</span>
              </div>
            </div>
          </div>
        )}

        {/* View 2: Credit Card Payment Form */}
        {view === 'payment' && (
          <form onSubmit={handleProcessPayment} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              {/* Back to plans link */}
              <button
                id="back-to-plans-btn"
                type="button"
                onClick={() => setView('plans')}
                className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Subscription Plans</span>
              </button>

              {/* Secure Checkout Summary (Admin account hidden) */}
              <div className="p-3.5 rounded-xl bg-[#141820] border border-[#2b3340] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                      Secure Checkout
                    </div>
                    <div className="text-xs font-bold text-slate-100">
                      {targetPlan === 'premium' ? 'VIP Premium Package' : 'Basic Studio Package'}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <span>Instant Activation</span>
                      <span>•</span>
                      <span>256-bit Encrypted</span>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-[#2b3340]">
                  <div className="text-[10px] text-slate-400 uppercase">Total Amount Due</div>
                  <div className="text-lg font-black text-emerald-400">
                    {getPlanPrice(targetPlan, billingPeriod)} USD
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold capitalize">
                    {billingPeriod === 'yearly' ? 'Annual Billing (10% Off)' : 'Monthly Billing'}
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Credit Card Input Fields */}
              <div className="space-y-3 p-4 rounded-xl bg-[#151921] border border-[#2b3340]">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-bold uppercase text-slate-300 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-sky-400" />
                    <span>Credit / Debit Card Details</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#202734] font-mono text-slate-300 font-bold border border-[#354152]">
                      {getCardType(cardNumber)}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 font-mono text-emerald-300 font-bold">
                      SECURE
                    </span>
                  </div>
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Cardholder Full Name
                  </label>
                  <input
                    id="card-name-input"
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="e.g. Robert Ngambi"
                    className="w-full px-3 py-2 rounded-lg bg-[#0f1217] border border-[#2e3745] text-slate-100 text-xs focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Card Number (16 Digits)
                  </label>
                  <div className="relative">
                    <input
                      id="card-number-input"
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="4532 •••• •••• ••••"
                      maxLength={19}
                      className="w-full pl-3 pr-10 py-2 rounded-lg bg-[#0f1217] border border-[#2e3745] text-slate-100 font-mono text-xs focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-2.5" />
                  </div>
                </div>

                {/* Expiry, CVV, Zip in 3 columns */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      id="card-expiry-input"
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-3 py-2 rounded-lg bg-[#0f1217] border border-[#2e3745] text-slate-100 font-mono text-xs focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      CVC / CVV
                    </label>
                    <input
                      id="card-cvv-input"
                      type="password"
                      required
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full px-3 py-2 rounded-lg bg-[#0f1217] border border-[#2e3745] text-slate-100 font-mono text-xs focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Postal / ZIP
                    </label>
                    <input
                      id="card-zip-input"
                      type="text"
                      required
                      value={cardZip}
                      onChange={(e) => setCardZip(e.target.value.slice(0, 8))}
                      placeholder="90210"
                      className="w-full px-3 py-2 rounded-lg bg-[#0f1217] border border-[#2e3745] text-slate-100 font-mono text-xs focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pay Button / Footer (NO close button on bottom) */}
            <div className="p-4 bg-[#151921] border-t border-[#2d3744] space-y-2">
              <button
                id="submit-credit-card-payment-btn"
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Authorizing Payment...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-slate-950" />
                    <span>
                      Pay {getPlanPrice(targetPlan, billingPeriod)} USD & Activate Plan
                    </span>
                  </>
                )}
              </button>

              <div className="text-center text-[10px] text-slate-400">
                Payment processed through secure merchant gateway • Instant plan activation
              </div>
            </div>
          </form>
        )}

        {/* View 3: Payment Success Confirmation */}
        {view === 'success' && (
          <div className="flex-1 flex flex-col p-6 items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 animate-in zoom-in-75">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                Payment Successful!
              </h3>
              <p className="text-xs text-slate-300 max-w-md">
                Your payment of{' '}
                <strong className="text-emerald-400">
                  {getPlanPrice(targetPlan, billingPeriod)}
                </strong>{' '}
                has been processed successfully.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141820] border border-[#2b3340] text-xs font-mono text-left w-full max-w-md space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction Ref:</span>
                <span className="font-bold text-sky-400">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Activated Plan:</span>
                <span className="font-bold text-amber-400 uppercase">
                  {targetPlan} Package
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Camera Quota:</span>
                <span className="text-emerald-400">
                  {targetPlan === 'premium' ? '8 Cameras (6 External)' : '5 Cameras (3 External)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cloud Storage:</span>
                <span className="text-emerald-400">
                  {targetPlan === 'premium' ? 'Google Drive & Dropbox Unlocked' : 'Local & External Only'}
                </span>
              </div>
            </div>

            <button
              id="confirm-success-close-btn"
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
            >
              Start Streaming Live Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
