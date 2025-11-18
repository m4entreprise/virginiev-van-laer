import { Activity, Bone, Zap, HeartPulse, Stethoscope, Users2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Services = () => {
  const services = [
    {
      icon: Bone,
      title: "Rééducation orthopédique",
      description: "Rééducation post-opératoire, traumatismes, entorses, fractures",
    },
    {
      icon: Activity,
      title: "Kinésithérapie générale",
      description: "Douleurs musculaires et articulaires, lombalgies, cervicalgies",
    },
    {
      icon: HeartPulse,
      title: "Rééducation cardiovasculaire",
      description: "Reconditionnement à l'effort, récupération cardiaque",
    },
    {
      icon: Zap,
      title: "Kinésithérapie sportive",
      description: "Prévention et traitement des blessures sportives",
    },
    {
      icon: Stethoscope,
      title: "Kinésithérapie respiratoire",
      description: "Drainage bronchique, exercices respiratoires",
    },
    {
      icon: Users2,
      title: "Gériatrie",
      description: "Maintien de l'autonomie, prévention des chutes",
    },
  ];

  return (
    <section id="services" className="py-20 px-4 bg-gradient-to-br from-background via-secondary to-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
            Services
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-6">
            Un large éventail de soins kinésithérapeutiques pour répondre à tous vos besoins
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card border-border"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-8 bg-primary/5 rounded-2xl border border-primary/20">
          <p className="text-center text-lg text-foreground">
            <strong>Séances remboursées</strong> par la mutuelle sur prescription médicale
          </p>
        </div>
      </div>
    </section>
  );
};

export default Services;
