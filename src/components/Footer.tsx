const Footer = () => {
  return (
    <footer className="py-8 px-4 bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-serif font-bold">Virginie Van Laer</h3>
          <p className="text-primary-foreground/80">Kinésithérapeute</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-primary-foreground/80">
            <a href="mailto:v.vanlaer@hotmail.com" className="hover:text-primary-foreground transition-colors">
              v.vanlaer@hotmail.com
            </a>
            <span>|</span>
            <a href="tel:+32494378810" className="hover:text-primary-foreground transition-colors">
              +32 494 37 88 10
            </a>
          </div>
          <p className="text-sm text-primary-foreground/60 pt-4">
            © {new Date().getFullYear()} Virginie Van Laer. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
