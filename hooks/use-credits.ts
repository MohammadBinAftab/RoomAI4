'use client';

import { useEffect, useState } from 'react';
import { getUserCredits, updateUserCredits } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export function useCredits(userId: string) {
  const [credits, setCredits] = useState({ available_credits: 0, lifetime_credits: 0 });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    const fetchCredits = async () => {
      try {
        const data = await getUserCredits(userId);
        setCredits(data);
      } catch (error) {
        toast({
          title: 'Error fetching credits',
          description: 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, [userId, toast]);

  const useCredits = async (amount: number, description?: string) => {
    try {
      await updateUserCredits(userId, -amount, 'usage', description);
      const newCredits = await getUserCredits(userId);
      setCredits(newCredits);
      return true;
    } catch (error) {
      toast({
        title: 'Error using credits',
        description: 'Please try again later',
        variant: 'destructive',
      });
      return false;
    }
  };

  const addCredits = async (amount: number, type: 'purchase' | 'bonus', description?: string) => {
    try {
      await updateUserCredits(userId, amount, type, description);
      const newCredits = await getUserCredits(userId);
      setCredits(newCredits);
      return true;
    } catch (error) {
      toast({
        title: 'Error adding credits',
        description: 'Please try again later',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    credits,
    loading,
    useCredits,
    addCredits,
  };
}
