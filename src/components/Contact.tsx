import { useState, type FormEvent } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const RECAPTCHA_SITE_KEY = "6LcL9g8sAAAAACs0DoosZu3tofDbJGs0XAYaY7u2";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFormMessage(null);

    try {
      const anyWindow = window as any;
      const enterprise = anyWindow.grecaptcha?.enterprise;
      const grecaptcha = enterprise ?? anyWindow.grecaptcha;

      if (!grecaptcha) {
        setFormMessage("Le captcha n'est pas disponible, veuillez réessayer plus tard.");
        return;
      }

      const token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "submit" });

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          recaptchaToken: token,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 422) {
        setFormMessage("Merci de vérifier les champs puis de réessayer.");
        return;
      }

      if (!response.ok || (data && typeof data === "object" && "error" in data)) {
        setFormMessage("Une erreur est survenue lors de l'envoi. Merci de réessayer.");
        return;
      }

      setName("");
      setEmail("");
      setMessage("");
      setFormMessage("Votre message a été envoyé avec succès.");
    } catch {
      setFormMessage("Une erreur est survenue lors de l'envoi. Merci de réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-4 bg-card">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
            Contact
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-6">
            N'hésitez pas à me contacter pour toute question ou pour prendre rendez-vous
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow bg-background border-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Email</h3>
                  <a
                    href="mailto:v.vanlaer@hotmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    v.vanlaer@hotmail.com
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-background border-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Téléphone</h3>
                  <a
                    href="tel:+32494378810"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    +32 494 37 88 10
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-background border-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Zone d'intervention</h3>
                  <p className="text-muted-foreground">Flémalle et ses alentours</p>
                  <p className="text-sm text-muted-foreground mt-2">Visites à domicile possibles</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-background border-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Horaires</h3>
                  <p className="text-muted-foreground">Sur rendez-vous</p>
                  <p className="text-sm text-muted-foreground mt-2">Du lundi au vendredi</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 max-w-2xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow bg-background border-border">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    type="text"
                    placeholder="Votre nom"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Votre email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
                <Textarea
                  placeholder="Votre message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  required
                  rows={4}
                />
                <Button
                  type="submit"
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                  disabled={submitting}
                >
                  {submitting ? "Envoi en cours..." : "Envoyer un message"}
                </Button>
                {formMessage && (
                  <p className="text-sm text-muted-foreground mt-2">{formMessage}</p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            asChild
          >
            <a href="tel:+32494378810">Prendre rendez-vous</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Contact;
