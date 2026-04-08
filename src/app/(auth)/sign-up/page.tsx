"use client";

import React from "react";
import Link from "next/link";
import { Mail, Lock, User, CheckCircle2 } from "lucide-react";
import { AuthLayout } from "@/components/modules/auth/layout";
import { AuthInput } from "@/components/modules/auth/input";
import { SignupForm } from "@/components/modules/auth/SignupForm";

export default function SignUpPage() {
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const features = [
    {
      number: "01",
      title: "Easy edit online",
      description: "Search our broad range of homes and book viewings of the homes you like.",
    },
    {
      number: "02",
      title: "Add AI pre-written phrases",
      description: "Get instant suggestions powered by AI to enhance your content effortlessly.",
    },
    {
      number: "03",
      title: "Automatic spell-checker",
      description: "Never miss a typo again with our intelligent spell-checking system.",
    },
    {
      number: "04",
      title: "Export to any format",
      description: "Export your work in any format you need - PDF, Word, CSV, and more.",
    },
  ];

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Enter name and password to get started"
      rightContent={
        <div className="w-full space-y-12 animate-fadeIn">
          {/* Right side visual content */}
          <div className="space-y-8">
            <div className="space-y-6 animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
              {features.map((feature) => (
                <div key={feature.number} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/20 text-primary font-bold text-lg">
                      {feature.number}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mockup card preview */}
          <div className="bg-primary rounded-2xl p-8 text-white space-y-6">
            <h3 className="text-2xl font-bold">Create your job-worthy resume</h3>
            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-sm font-semibold mb-2">Education</p>
                <div className="h-2 bg-white/20 rounded w-3/4 mb-2" />
                <div className="h-2 bg-white/10 rounded w-1/2" />
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-sm font-semibold mb-2">Work Experience</p>
                <div className="h-2 bg-white/20 rounded w-3/4 mb-2" />
                <div className="h-2 bg-white/10 rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <SignupForm/>
    </AuthLayout>
  );
}
