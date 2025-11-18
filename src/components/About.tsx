import { Heart, Users, Home } from "lucide-react";
import { Card } from "@/components/ui/card";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Approche personnalisée",
      description: "Chaque patient est unique. Je propose des soins adaptés à vos besoins spécifiques.",
    },
    {
      icon: Users,
      title: "Écoute et bienveillance",
      description: "Un accompagnement professionnel dans un climat de confiance et de respect.",
    },
    {
      icon: Home,
      title: "Confort à domicile",
      description: "Des soins dans le confort de votre domicile pour faciliter votre rééducation.",
    },
  ];

  return (
    <section id="about" className="py-20 px-4 bg-card">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
            À propos
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <p className="text-lg text-foreground leading-relaxed">
              Kinésithérapeute diplômée et passionnée, je mets mon expertise au service de votre santé et de votre bien-être. Mon approche combine techniques modernes et écoute attentive pour vous accompagner dans votre rééducation.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              Que ce soit pour une récupération post-opératoire, des douleurs chroniques ou simplement pour maintenir votre forme, je propose des soins adaptés à chaque situation.
            </p>
          </div>

          <div className="space-y-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow bg-background border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
