
import { FileText, Calendar, Link, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReportIllustration from "@/assets/illustrations/ReportIllustration";
import ScheduleIllustration from "@/assets/illustrations/ScheduleIllustration";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm hover-scale subtle-border">
    <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-500 mb-5">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3 text-slate-900">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

const Features = () => {
  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <div className="inline-block mb-4 px-3 py-1 rounded-full bg-brand-50 border border-brand-100">
            <span className="text-brand-600 font-medium text-sm">
              Designed for Doctors
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">
            Simplify Patient Communication
          </h2>
          <p className="text-lg text-slate-600">
            Our platform helps doctors collect reports and schedule consultations through secure, customized links sent directly to patients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Link className="h-6 w-6" />}
            title="Send Secure Links"
            description="Generate and send secure links to patients to request specific medical reports or schedule consultations."
          />
          <FeatureCard
            icon={<FileText className="h-6 w-6" />}
            title="Manage Patient Reports"
            description="View, organize, and download medical reports submitted by your patients through your personalized dashboard."
          />
          <FeatureCard
            icon={<Calendar className="h-6 w-6" />}
            title="Online Consultations"
            description="Schedule and conduct virtual consultations based on your availability with automatic patient notifications."
          />
        </div>

        <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in-right order-2 lg:order-1">
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-brand-50 border border-brand-100">
              <span className="text-brand-600 font-medium text-sm">
                Easy Report Collection
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-slate-900">
              Request and Receive Patient Reports
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              Send customized links to patients requesting specific reports. Patients can easily upload reports which you can view and download immediately.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Generate custom report request links for each patient",
                "Automatic patient notifications with clear instructions",
                "Secure upload system with verification",
                "Organize reports by patient, date, or type",
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 mr-3 mt-0.5 flex-shrink-0">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
            <Button className="bg-brand-500 hover:bg-brand-600 transition-colors group">
              Learn More About Reports{" "}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          <div className="relative order-1 lg:order-2 animate-float">
            <div className="absolute inset-0 bg-brand-100 rounded-full blur-3xl opacity-30"></div>
            <ReportIllustration className="relative z-10 mx-auto" />
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative animate-float">
            <div className="absolute inset-0 bg-brand-100 rounded-full blur-3xl opacity-30"></div>
            <ScheduleIllustration className="relative z-10 mx-auto" />
          </div>
          <div className="animate-fade-in-left">
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-brand-50 border border-brand-100">
              <span className="text-brand-600 font-medium text-sm">
                Virtual Consultations
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-slate-900">
              Send Links For Online Consultations
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              After reviewing reports, easily send consultation links to patients allowing them to book appointments based on your availability.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Set your availability with flexible scheduling",
                "Patient self-scheduling through secure links",
                "Automatic reminders for both you and patients",
                "Integrated video consultation platform",
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 mr-3 mt-0.5 flex-shrink-0">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
            <Button className="bg-brand-500 hover:bg-brand-600 transition-colors group">
              Learn About Consultations{" "}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
