import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { BarChart, LineChart } from 'lucide-react';
import { AnimatedFadeIn } from '@/components/ui/Animated';

const Index = () => {
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Hero Section */}
          <div className="flex-1">            <AnimatedFadeIn direction="right" delay={100}>
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4 animate-[float_3s_ease-in-out_infinite]">
                  NLCB Trinidad and Tobago <br />
                  Lottery Analysis
                </h1>
                <p className="text-xl text-muted-foreground">Beyond the numbers</p>
              </div>
            </AnimatedFadeIn>

            <AnimatedFadeIn direction="right" delay={300}>
              <p className="mb-8 max-w-2xl text-muted-foreground">
                Unlock your edge with Trinidad & Tobago's smartest NLCB lottery analysis
                platform. Spot patterns, reveal trends, and turn data into winning insights.
              </p>
            </AnimatedFadeIn>
            
            <AnimatedFadeIn direction="right" delay={500}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/results">
                  <Button size="lg" variant="default" className="animate-pulse">View Latest Results →</Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline">Get in Touch →</Button>
                </Link>
              </div>
            </AnimatedFadeIn>
          </div>
          
          {/* Hero Image */}
          <div className="flex-1 flex justify-center">
            <AnimatedFadeIn delay={400} direction="left">
              <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden shadow-lg border border-border mx-auto hover:shadow-xl hover:scale-105 transition-all duration-500">
                <img 
                  src="/img/coverphoto.png" 
                  alt="NLCB Games Analysis" 
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 flex items-end justify-center p-6">
                  <div className="text-center">
                    <p className="text-muted-foreground">Analyzing patterns since 2020</p>
                  </div>
                </div>
              </div>
            </AnimatedFadeIn>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <AnimatedFadeIn delay={0}>
            <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="mb-2 w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center animate-pulse">
                  <BarChart className="w-5 h-5 text-yellow-500" />
                </div>
                <CardTitle>Real-Time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get instant access to up-to-the-minute lottery data analysis
                  and trends across all NLCB games.
                </p>
              </CardContent>
            </Card>
          </AnimatedFadeIn>

          <AnimatedFadeIn delay={150}>
            <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="mb-2 w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center animate-pulse">
                  <LineChart className="w-5 h-5 text-blue-500" />
                </div>
                <CardTitle>Statistical Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Dive deep into comprehensive statistical analysis with
                  historical patterns and frequency distributions.
                </p>
              </CardContent>
            </Card>
          </AnimatedFadeIn>

          <AnimatedFadeIn delay={300}>
            <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="mb-2 w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center animate-pulse">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500" />
                    <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500" />
                    <path d="M12 12L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500" />
                    <path d="M12 12L4 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500" />
                  </svg>
                </div>
                <CardTitle>Smart Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Leverage advanced algorithms to identify potential
                  number combinations and emerging patterns.
                </p>
              </CardContent>
            </Card>
          </AnimatedFadeIn>
        </div>

        {/* Games Section */}
        <div className="mt-16">
          <AnimatedFadeIn delay={200}>
            <PageHeader
              title="Popular Games"
              description="Explore analysis for all NLCB games"
            />
          </AnimatedFadeIn>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { 
                name: "PlayWhe", 
                path: "/playwhe", 
                color: "bg-rose-500", 
                image: "/img/nlcb/Play-Whe.png",
                delay: 0 
              },
              { 
                name: "PICK2", 
                path: "/pick2", 
                color: "bg-amber-500", 
                image: "/img/nlcb/Pick-2.png",
                delay: 100 
              },
              { 
                name: "PICK4", 
                path: "/pick4", 
                color: "bg-emerald-500", 
                image: "/img/nlcb/Pick-4.png",
                delay: 200 
              },
              { 
                name: "Cashpot", 
                path: "/cashpot", 
                color: "bg-blue-500", 
                image: "/img/nlcb/Cashpot.png",
                delay: 300 
              },
              { 
                name: "Lotto Plus", 
                path: "/lotto", 
                color: "bg-violet-500", 
                image: "/img/nlcb/Lotto-Plus.png",
                delay: 400 
              },
              { 
                name: "Win For Life", 
                path: "/winforlife", 
                color: "bg-pink-500", 
                image: "/img/nlcb/Win-For-Life-Logo-header.png",
                delay: 500 
              },
            ].map((game) => (
              <AnimatedFadeIn delay={game.delay} key={game.name}>
                <Link to={game.path}  
                  className="block hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="bg-card rounded-lg border border-border hover:border-primary hover:shadow-lg transition-all p-4 h-full flex flex-col">
                    <div className="h-40 flex items-center justify-center mb-4 overflow-hidden">
                      <img 
                        src={game.image} 
                        alt={game.name} 
                        className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="mt-auto text-center">
                      <h3 className="font-semibold text-lg">{game.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">View Analysis →</p>
                    </div>
                  </div>
                </Link>
              </AnimatedFadeIn>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
