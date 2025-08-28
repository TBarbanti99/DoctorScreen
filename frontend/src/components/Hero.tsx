
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import DoctorIllustration from "@/assets/illustrations/DoctorIllustration";

const Hero = () => {
  return (
    <section className="pt-32 pb-24 overflow-hidden">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 animate-fade-in-right">
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-brand-50 border border-brand-100">
              <span className="text-brand-600 font-medium text-sm">
                For Healthcare Professionals
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-slate-900">
              Streamline your <span className="text-brand-500">patient reports</span> and consultations
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-lg">
              Send secure links to patients to collect medical reports and schedule online consultations. Manage everything in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-brand-500 hover:bg-brand-600 transition-colors shadow-lg shadow-brand-100/50 group"
              >
                Doctor Sign Up
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-300 hover:bg-slate-100 transition-colors"
              >
                How It Works
              </Button>
            </div>
            <div className="mt-8 flex items-center space-x-4">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs text-slate-600"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">2,000+</span>{" "}
                doctors trust our platform
              </p>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0 animate-fade-in-left">
            <div className="relative animate-float">
              <div className="absolute inset-0 bg-brand-100 rounded-full blur-3xl opacity-30"></div>
              <DoctorIllustration className="relative z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
