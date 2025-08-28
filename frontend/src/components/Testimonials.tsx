
import { User } from "lucide-react";

interface TestimonialProps {
  quote: string;
  name: string;
  title: string;
}

const Testimonial = ({ quote, name, title }: TestimonialProps) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm subtle-border hover-scale">
    <div className="mb-6">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className="inline-block w-5 h-5 text-yellow-400 fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
    <p className="text-slate-700 mb-6 italic">"{quote}"</p>
    <div className="flex items-center">
      <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-500 mr-3">
        <User className="h-5 w-5" />
      </div>
      <div>
        <h4 className="font-semibold text-slate-900">{name}</h4>
        <p className="text-sm text-slate-600">{title}</p>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  const testimonials = [
    {
      quote:
      "Questa piattaforma ha rivoluzionato il modo in cui raccolgo i referti dai pazienti. Il sistema di link sicuri è semplicissimo, sia per me sia per loro.", 
      name: "Dr.ssa Benedetta D.",
      title: "Cardiologa",
    },
    {
      quote:
      "Ho ridotto del 40% il mio lavoro amministrativo da quando utilizzo questa piattaforma. La gestione dei referti è esattamente ciò di cui avevo bisogno.",  
      name: "Dr. Giovanni B.",
      title: "Chirurgo Ortopedico",
    },
    {
      quote:
      "La pianificazione dei videoconsulti è fluida e senza intoppi. I miei pazienti apprezzano il processo di prenotazione semplice e io adoro l’integrazione con il calendario.",     
      name: "Dr.ssa Giulia S.",
      title: "Pediatra",
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <div className="inline-block mb-4 px-3 py-1 rounded-full bg-brand-50 border border-brand-100">
            <span className="text-brand-600 font-medium text-sm">
              Success Stories
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">
            What Doctors Are Saying
          </h2>
          <p className="text-lg text-slate-600">
            Healthcare professionals across specialties are streamlining their practice with our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              name={testimonial.name}
              title={testimonial.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
