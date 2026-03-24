
import React from 'react';
import { Shield, Zap, Target, Globe } from 'lucide-react';

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "AI Coaching",
    description: "Personalized workout optimization driven by real-time biometric data analysis."
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Elite Protocols",
    description: "Scientifically validated training systems used by professional athletes worldwide."
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Precision Nutrition",
    description: "Custom macronutrient planning tailored to your specific performance goals."
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Global Network",
    description: "Connect with a high-performance community across 60+ countries."
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Master Your Craft</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            AxiomFit combines cutting-edge technology with traditional athletic principles 
            to deliver an unparalleled fitness experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="group p-8 rounded-2xl border border-white/5 bg-background hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
