'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Zap, 
  Crown, 
  Rocket, 
  ShieldCheck, 
  Coins, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PRICING_PLANS = [
  {
    name: "Starter Spark",
    price: "10",
    credits: "100",
    description: "Perfect for students and early career job seekers.",
    features: [
      "100 AI Generation Credits",
      "Access to 5 Basic Templates",
      "Standard PDF Export",
      "7-Day History Retention",
    ],
    icon: <Zap className="h-6 w-6 text-blue-500" />,
    popular: false,
    color: "blue"
  },
  {
    name: "Blitz Professional",
    price: "25",
    credits: "300",
    description: "Ideal for active job seekers targeting top tech firms.",
    features: [
      "300 AI Generation Credits",
      "Access to All Premium Templates",
      "ATS Optimization Audit",
      "Unlimited PDF & Docx Exports",
      "Priority AI Processing",
    ],
    icon: <Sparkles className="h-6 w-6 text-primary" />,
    popular: true,
    color: "primary"
  },
  {
    name: "Elite Growth",
    price: "50",
    credits: "1000",
    description: "For power users and professional consultants.",
    features: [
      "1000 AI Generation Credits",
      "White-label PDF Branding",
      "Advanced AI Cover Letter Builder",
      "Lifetime Document Storage",
      "Dedicated Support",
    ],
    icon: <Crown className="h-6 w-6 text-amber-500" />,
    popular: false,
    color: "amber"
  }
];

export default function PricingWrapper() {
  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge variant="outline" className="rounded-full px-4 py-1 text-primary border-primary/20 bg-primary/5">
              Pricing & Credits
            </Badge>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tighter"
          >
            Fuel your career with <span className="text-primary italic">Credits</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            One-time purchase, no hidden subscriptions. Credits are deducted only when you use AI or export premium templates.
          </motion.p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {PRICING_PLANS.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex flex-col rounded-3xl border p-8 transition-all hover:shadow-2xl hover:shadow-primary/5 bg-card/50 backdrop-blur-sm ${
                plan.popular ? 'border-primary ring-2 ring-primary/20 shadow-xl' : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-secondary border border-border/50">
                    {plan.icon}
                  </div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight">${plan.price}</span>
                  <span className="text-muted-foreground font-medium">one-time</span>
                </div>
                <div className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg w-fit">
                   <Coins className="h-4 w-4 text-primary" />
                   <span className="text-sm font-bold text-primary">{plan.credits} Credits Included</span>
                </div>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                <p className="text-sm text-muted-foreground font-medium">{plan.description}</p>
                <div className="space-y-3 pt-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                        <Check className="h-3 w-3 text-emerald-500" />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                variant={plan.popular ? "default" : "outline"} 
                className={`w-full h-12 rounded-full font-bold group ${
                  plan.popular ? 'shadow-lg shadow-primary/20' : ''
                }`}
              >
                Get {plan.credits} Credits 
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Trust Footer */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 border-t pt-12">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-muted-foreground" />
            </div>
            <h4 className="font-bold">Secure Checkout</h4>
            <p className="text-xs text-muted-foreground">Encrypted processing via Stripe & SSL.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
              <Rocket className="h-6 w-6 text-muted-foreground" />
            </div>
            <h4 className="font-bold">Instant Activation</h4>
            <p className="text-xs text-muted-foreground">Credits are added to your vault immediately.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
              <Coins className="h-6 w-6 text-muted-foreground" />
            </div>
            <h4 className="font-bold">No Expiry</h4>
            <p className="text-xs text-muted-foreground">Your credits never expire. Use them anytime.</p>
          </div>
        </div>
      </div>
    </div>
  );
}