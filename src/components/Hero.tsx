import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.png";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-background via-secondary to-background">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Image */}
          <div className="relative animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="Virginie Van Laer, Kinésithérapeute"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-8 animate-fade-in-delayed">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground leading-tight">
                Virginie Van Laer
              </h1>
              <p className="text-2xl text-primary font-light uppercase tracking-wider">
                Kinésithérapeute
              </p>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Des soins personnalisés et professionnels pour votre bien-être et votre santé.
            </p>

            <div className="space-y-4">
              <a
                href="mailto:v.vanlaer@hotmail.com"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors group"
              >
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <span className="text-lg">v.vanlaer@hotmail.com</span>
              </a>

              <a
                href="tel:+32494378810"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors group"
              >
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <span className="text-lg">+32 494 37 88 10</span>
              </a>

              <div className="flex items-start gap-3 text-foreground">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-medium">Visites à domicile</p>
                  <p className="text-muted-foreground">Flémalle et ses alentours</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                asChild
              >
                <a href="#contact">Prendre rendez-vous</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
