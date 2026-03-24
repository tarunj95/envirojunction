
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { generateAIFitnessTip } from '@/ai/flows/ai-fitness-tip-generator';
import { Sparkles, Loader2, Dumbbell, Flame, Heart } from 'lucide-react';

export function AITipGenerator() {
  const [tip, setTip] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState<'strength' | 'cardio' | 'mindfulness'>('strength');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateAIFitnessTip({ topic });
      setTip(result.tip);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-coach" className="py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-bold mb-4">
            <Sparkles className="w-4 h-4" />
            AI-POWERED COACHING
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6">Daily Insight Hub</h2>
          <p className="text-muted-foreground text-lg">
            Need a quick spark? Select your focus and let our Axiom AI generate a 
            bespoke tip to optimize your performance today.
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant={topic === 'strength' ? 'default' : 'outline'}
              onClick={() => setTopic('strength')}
              className="gap-2"
            >
              <Dumbbell className="w-4 h-4" /> Strength
            </Button>
            <Button
              variant={topic === 'cardio' ? 'default' : 'outline'}
              onClick={() => setTopic('cardio')}
              className="gap-2"
            >
              <Flame className="w-4 h-4" /> Cardio
            </Button>
            <Button
              variant={topic === 'mindfulness' ? 'default' : 'outline'}
              onClick={() => setTopic('mindfulness')}
              className="gap-2"
            >
              <Heart className="w-4 h-4" /> Mindfulness
            </Button>
          </div>

          <Card className="bg-muted/30 border-white/5 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              {loading ? (
                <div className="flex flex-col items-center gap-4 py-8">
                  <Loader2 className="w-12 h-12 text-accent animate-spin" />
                  <p className="text-accent font-medium animate-pulse">Consulting the Axiom Engine...</p>
                </div>
              ) : tip ? (
                <div className="animate-reveal">
                  <p className="text-2xl md:text-3xl font-headline italic leading-relaxed mb-8">
                    &ldquo;{tip}&rdquo;
                  </p>
                  <Button variant="ghost" className="text-accent hover:text-accent hover:bg-accent/10" onClick={() => setTip(null)}>
                    Try another topic
                  </Button>
                </div>
              ) : (
                <div className="py-8">
                  <Button 
                    size="lg" 
                    onClick={handleGenerate}
                    className="bg-accent text-background hover:bg-primary font-bold px-10 h-14"
                  >
                    Generate AI Tip
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-accent/10 blur-[120px] rounded-full -z-0" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[120px] rounded-full -z-0" />
    </section>
  );
}
