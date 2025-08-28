
import { Button } from "@/components/ui/button";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Create Doctor Account",
      description:
        "Sign up as a healthcare professional and set up your profile with your specialties and practice information.",
    },
    {
      number: "02",
      title: "Send Report Request Links",
      description:
        "Generate and send secure links to patients requesting specific medical reports or test results.",
    },
    {
      number: "03",
      title: "Review Submitted Reports",
      description:
        "Access, view, and download reports submitted by patients directly from your dashboard.",
    },
    {
      number: "04",
      title: "Schedule Online Consultations",
      description:
        "Send consultation links to patients allowing them to book appointments based on your availability.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <div className="inline-block mb-4 px-3 py-1 rounded-full bg-brand-50 border border-brand-100">
            <span className="text-brand-600 font-medium text-sm">
              Simple Process
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">
            How It Works For Doctors
          </h2>
          <p className="text-lg text-slate-600">
            Our platform streamlines the process of collecting patient reports and scheduling consultations. Here's how to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-2xl p-8 subtle-border hover-scale animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-12 w-12 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold mb-6">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">
                {step.title}
              </h3>
              <p className="text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center animate-fade-in">
          <p className="text-lg text-slate-600 mb-8 max-w-3xl mx-auto">
            Join thousands of healthcare professionals who have simplified their patient communication with our secure platform.
          </p>
          <Button
            size="lg"
            className="bg-brand-500 hover:bg-brand-600 transition-colors shadow-lg shadow-brand-100/50"
          >
            Sign Up As A Doctor
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
