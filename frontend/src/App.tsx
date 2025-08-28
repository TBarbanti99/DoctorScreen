
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Reports from "./pages/dashboard/Reports";
import Consultations from "./pages/dashboard/Consultations";
import Messages from "./pages/dashboard/Messages";
import Patients from "./pages/dashboard/Patients";
import Settings from "./pages/dashboard/Settings";
import Payments from "./pages/dashboard/Payments";
import SubmitReport from "./pages/SubmitReport";
import BookingPage from "./pages/BookingPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCanceled from "./pages/PaymentCanceled";
import { CalendlyContext, useCalendly } from "./contexts/CalendlyContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  const calendlyValues = useCalendly();
  
  return (
    <QueryClientProvider client={queryClient}>
      <CalendlyContext.Provider value={calendlyValues}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Public routes - only for non-authenticated users */}
              <Route path="/login" element={
                <ProtectedRoute requiresAuth={false}>
                  <Login />
                </ProtectedRoute>
              } />
              <Route path="/signup" element={
                <ProtectedRoute requiresAuth={false}>
                  <Signup />
                </ProtectedRoute>
              } />
              
              {/* Payment result routes */}
              <Route path="/checkout/payment-success" element={<PaymentSuccess />} />
              <Route path="/checkout/payment-canceled" element={<PaymentCanceled />} />
              
              {/* Booking page - available to public users who have the link */}
              <Route path="/booking/:integrationId/:userId" element={<BookingPage />} />
              
              {/* Protected routes - requires authentication */}
              <Route path="/submit-report" element={
                  <SubmitReport />
              } />
              
              {/* Dashboard Routes - all protected */}
              <Route path="/dashboard" element={
                <ProtectedRoute requiresAuth={true}>
                  <DashboardLayout><Dashboard /></DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/reports" element={
                <ProtectedRoute requiresAuth={true}>
                  <DashboardLayout><Reports /></DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/consultations" element={
                <ProtectedRoute requiresAuth={true}>
                  <DashboardLayout><Consultations /></DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/messages" element={
                <ProtectedRoute requiresAuth={true}>
                  <DashboardLayout><Messages /></DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/patients" element={
                <ProtectedRoute requiresAuth={true}>
                  <DashboardLayout><Patients /></DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/payments" element={
                <ProtectedRoute requiresAuth={true}>
                  <DashboardLayout><Payments /></DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/settings" element={
                <ProtectedRoute requiresAuth={true}>
                  <DashboardLayout><Settings /></DashboardLayout>
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CalendlyContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
