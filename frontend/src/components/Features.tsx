
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
              Progettato per i Medici
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">
            Semplifica la comunicazione con i tuoi pazienti
          </h2>
          <p className="text-lg text-slate-600">
            La nostra piattaforma aiuta i medici a raccogliere referti e
            programmare consulenze tramite link sicuri e personalizzati inviati
            direttamente ai pazienti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Link className="h-6 w-6" />}
            title="Invia Link Sicuri"
            description="Genera e invia ai pazienti link protetti per richiedere referti medici specifici o fissare una consulenza."
          />
          <FeatureCard
            icon={<FileText className="h-6 w-6" />}
            title="Gestisci i Referti dei Pazienti"
            description="Visualizza, organizza e scarica i referti inviati dai tuoi pazienti attraverso la tua dashboard personalizzata."
          />
          <FeatureCard
            icon={<Calendar className="h-6 w-6" />}
            title="Videoconsulti Online"
            description="Programma e svolgi consulenze virtuali in base alla tua disponibilità, con notifiche automatiche ai pazienti."
          />
        </div>

        <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in-right order-2 lg:order-1">
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-brand-50 border border-brand-100">
              <span className="text-brand-600 font-medium text-sm">
                Raccolta Referti Immediata
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-slate-900">
              Richiedi e ricevi i referti dei tuoi pazienti
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              Invia link personalizzati per richiedere referti specifici: i
              pazienti possono caricarli in pochi secondi e tu li visualizzi e
              scarichi subito.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Genera link di richiesta referti personalizzati per ogni paziente",
                "Notifiche automatiche ai pazienti con istruzioni chiare",
                "Sistema di upload sicuro e verificato",
                "Organizza i referti per paziente, data o tipologia",
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
              Scopri di più sui Referti{" "}
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
                Videoconsulti Online
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-slate-900">
              Invia link per le tue consulenze virtuali
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              Dopo aver revisionato i referti, condividi facilmente un link con
              i pazienti: potranno prenotare l’appuntamento in base alla tua
              disponibilità.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Imposta la tua disponibilità con un calendario flessibile",
                "I pazienti prenotano in autonomia tramite link sicuri",
                "Promemoria automatici per te e per i pazienti",
                "Piattaforma di videoconsulto integrata e semplice da usare",
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
              Scopri di più sulle Consulenze{" "}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
```

Recommendation: sostituisci il vecchio file `Features.tsx` con questo.
Next step: ricompila il progetto per vedere il frontend con i testi in italiano.
