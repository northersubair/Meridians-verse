'use client';

import { motion } from 'framer-motion';
import { itemVariants } from '@/lib/animations/variants';
import { CardMetric, CardMetrics } from '@/components/ui/metric-card';
import { DollarSign, Percent } from 'lucide-react';

export function PoolStats() {
  return (
    <motion.div variants={itemVariants} className="pt-4">
      <CardMetrics>
        <CardMetric
          icon={<DollarSign className="h-5 w-5" />}
          label="Total Pool Value"
          value="$5.2M"
          delta="+8% since last week"
          deltaVariant="positive"
          tooltip="The total value locked in MERIDIAN yield pools across all participants."
        />
        <CardMetric
          icon={<Percent className="h-5 w-5" />}
          label="Weekly APY"
          value="24%"
          delta="Stable payout rate"
          tooltip="Average weekly yield earned by pool contributors, updated with new rewards."
        />
      </CardMetrics>
    </motion.div>
  );
}
