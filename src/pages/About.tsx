
import React from 'react';
import Layout from '@/components/layout/Layout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import CommentSection from '@/components/ui/CommentSection';

const About = () => {
  return (
    <Layout>
      <div className="container py-6">
        <PageHeader 
          title="About"
        />
        
        <div className="space-y-6 max-w-4xl mx-auto">
          <Card className="bg-card p-6">
            <p className="mb-6">
              CSNLCBTT focuses on understanding the patterns and underlying mechanisms of NLCB T&T games.
            </p>
            <p>
              As a result, we have developed a unique set of charts and tables that can aid you with making better playing choices.
            </p>
          </Card>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">DISCLAIMER</h2>
            <Card className="bg-blue-950/30 border-blue-800/50 p-6 mb-6">
              <p className="font-medium text-blue-200">
                Please read this important information carefully
              </p>
            </Card>
            
            <h3 className="text-xl font-semibold mb-3">Purpose and Intent</h3>
            <p className="mb-6">
              CSNLCBTT GAMES ANALYSIS provides NLCB T&T Games draw history and analysis to assist players with making informed decisions. The content within this website is designed for entertainment, educational, and informational purposes.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Risk and Responsibility</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Gambling/gaming is an entertainment vehicle that carries a certain degree of financial risk.</li>
              <li>Players should be aware of this risk and manage themselves accordingly.</li>
              <li>All users of this website should exercise responsibility when playing NLCB T&T games.</li>
              <li>CSNLCBTT GAMES ANALYSIS has undertaken to inform all interested parties about the potential dangers of excess.</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-3">Legal Notice</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Nothing contained herein constitutes a guarantee of winning.</li>
              <li>There is no intention to induce anyone into violating any T&T laws or NLCB T&T rules.</li>
              <li>All information posted is accurate to the best of our knowledge.</li>
              <li>Information may become outdated and is subject to change at any time.</li>
            </ul>
            
            <div className="border-t border-border pt-4 text-center italic text-sm text-muted-foreground">
              By continuing to access or use this website, you acknowledge and accept this Disclaimer.
            </div>
            
            <div className="mt-6">
              <p className="mb-2">
                Any questions regarding the content within the CSNLCBTT GAMES ANALYSIS website are invited via email at{' '}
                <a href="mailto:csnlcbtt@gmail.com" className="text-blue-400 hover:underline">
                  csnlcbtt@gmail.com
                </a>.
              </p>
              <p className="uppercase font-bold text-center mt-6">
                PLEASE NOTE THAT THIS IS NOT THE NLCB's OFFICIAL WEBSITE
              </p>
            </div>
          </div>
          
          <div className="mt-8">
            <CommentSection />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
