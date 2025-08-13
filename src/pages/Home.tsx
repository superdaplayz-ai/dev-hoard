import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Share2, History, Search, Star, Zap } from "lucide-react";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Snippet Manager - Organiser og del kodeeksempler</title>
        <meta name="description" content="En kraftig snippet manager for å organisere, søke og dele kodeeksempler. Lag din egen kodeleksikon med versjonskontroll og delingsmuligheter." />
        <meta name="keywords" content="kode, snippets, kodeeksempler, programmering, javascript, html, css, utvikler" />
        <link rel="canonical" href="/" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Header */}
        <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">Snippet Manager</span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" asChild>
                  <Link to="/shared">Delte Snippets</Link>
                </Button>
                <Button asChild>
                  <Link to="/snippets">Kom i gang</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              <Zap className="h-3 w-3 mr-1" />
              Gratis og åpen kildekode
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Din personlige kodeleksikon
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Organiser, søk og del kodeeksempler på en enkel måte. Hold orden på alle dine nyttige code snippets med kraftige søke- og filtreringsfunksjoner.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" asChild className="text-lg px-8">
                <Link to="/snippets">
                  <Code className="h-5 w-5 mr-2" />
                  Start med snippets
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8">
                <Link to="/shared">
                  <Share2 className="h-5 w-5 mr-2" />
                  Se delte eksempler
                </Link>
              </Button>
            </div>
          </div>

          {/* Features */}
          <section className="mt-24 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Code className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle>Organiserte Snippets</CardTitle>
                <CardDescription>
                  Lag og organiser kodeeksempler med tags, beskrivelser og språkstøtte
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Search className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle>Kraftig Søk</CardTitle>
                <CardDescription>
                  Søk gjennom kode, titler og tags for å raskt finne det du trenger
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Share2 className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle>Del med Andre</CardTitle>
                <CardDescription>
                  Merk snippets som "shared" og del kunnskap med teamet ditt
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <History className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle>Versjonskontroll</CardTitle>
                <CardDescription>
                  Hold styr på endringer med automatisk versjonshistorikk
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Star className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle>Favoritter</CardTitle>
                <CardDescription>
                  Merk viktige snippets som favoritter for rask tilgang
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle>Lynrask</CardTitle>
                <CardDescription>
                  Kopier kode til utklippstavlen med ett enkelt klikk
                </CardDescription>
              </CardHeader>
            </Card>
          </section>

          {/* CTA Section */}
          <section className="mt-24 text-center bg-muted/30 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Klar til å organisere koden din?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Begynn å bygge ditt personlige kodeleksikon i dag. Ingen registrering kreves.
            </p>
            <Button size="lg" asChild className="text-lg px-8">
              <Link to="/snippets">
                Start nå - helt gratis
              </Link>
            </Button>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t mt-24 py-8">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>&copy; 2024 Snippet Manager. Laget med ❤️ for utviklere.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;