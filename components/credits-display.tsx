'use client';

import { useCredits } from '@/hooks/use-credits';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Coins } from 'lucide-react';

export function CreditsDisplay({ userId }: { userId: string }) {
  const { credits, loading } = useCredits(userId);

  if (loading) {
    return <div>Loading credits...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
        <Coins className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{credits.available_credits}</div>
        <Progress 
          value={(credits.available_credits / Math.max(credits.lifetime_credits, 1)) * 100} 
          className="mt-2"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Lifetime credits: {credits.lifetime_credits}
        </p>
      </CardContent>
    </Card>
  );
}
