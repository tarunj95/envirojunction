"use client";

import type { Tender } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag, Building, Loader2, Sparkles, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { getTenderRelevance } from "../actions";
import { useState, useTransition } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type RelevanceResult = {
  isRelevant: boolean | null;
  reason: string;
} | null;

export function TenderCard({ tender }: { tender: Tender }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<RelevanceResult>(null);

  const handleRelevanceCheck = () => {
    startTransition(async () => {
      const tenderDetails = `Title: ${tender.title}. Details: ${tender.details}`;
      const analysisResult = await getTenderRelevance(tenderDetails);
      setResult(analysisResult);
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline text-lg">{tender.title}</CardTitle>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Building className="h-4 w-4" />
            <span>{tender.organization}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Tag className="h-4 w-4" />
            <span className="font-semibold text-primary">{tender.value}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>Deadline: {tender.deadline}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{tender.details}</CardDescription>
      </CardContent>
      <CardFooter className="bg-muted/50 p-4">
        <Collapsible className="w-full space-y-4">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">Use AI to check if this tender matches your profile.</p>
            <CollapsibleTrigger asChild>
              <Button onClick={handleRelevanceCheck} disabled={isPending}>
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Check Relevance
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            {result && (
              <Alert variant={result.isRelevant === null ? "destructive" : result.isRelevant ? "default" : "destructive"} 
                     className={cn(result.isRelevant && "border-green-500/50 bg-green-500/10 dark:border-green-500/30 dark:bg-green-500/10")}>
                {result.isRelevant === true && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                {result.isRelevant === false && <XCircle className="h-4 w-4" />}
                {result.isRelevant === null && <AlertTriangle className="h-4 w-4" />}
                <AlertTitle className={cn("font-headline", result.isRelevant ? "text-green-700 dark:text-green-400" : "")}>
                  {result.isRelevant === true && "Potentially Relevant"}
                  {result.isRelevant === false && "Likely Not Relevant"}
                  {result.isRelevant === null && "Analysis Error"}
                </AlertTitle>
                <AlertDescription className={cn(result.isRelevant ? "text-green-700/80 dark:text-green-400/80" : "")}>
                  {result.reason}
                </AlertDescription>
              </Alert>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardFooter>
    </Card>
  );
}
