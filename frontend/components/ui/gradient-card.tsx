// components/ui/gradient-card.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { cn } from "../../lib/utils";

const cardVariants = cva(
  "relative flex flex-col justify-between h-full w-full overflow-hidden rounded-2xl p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg border border-slate-800/50",
  {
    variants: {
      gradient: {
        orange: "bg-gradient-to-br from-orange-950/60 via-amber-900/40 to-slate-900",
        gray: "bg-gradient-to-br from-slate-800/80 via-slate-900/60 to-slate-950",
        purple: "bg-gradient-to-br from-purple-950/60 via-indigo-900/40 to-slate-900",
        green: "bg-gradient-to-br from-emerald-950/60 via-teal-900/40 to-slate-900",
      },
    },
    defaultVariants: {
      gradient: "gray",
    },
  }
);

export interface GradientCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  badgeText: string;
  badgeColor: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  imageUrl: string;
  onCtaClick?: () => void;
}

const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
  (
    {
      className,
      gradient,
      badgeText,
      badgeColor,
      title,
      description,
      ctaText,
      ctaHref,
      imageUrl,
      onCtaClick,
      ...props
    },
    ref
  ) => {
    const cardAnimation = {
      rest: { scale: 1, y: 0 },
      hover: { scale: 1.02, y: -4 },
    };

    const imageAnimation = {
      rest: { scale: 1, rotate: 0 },
      hover: { scale: 1.08, rotate: 2 },
    };

    return (
      <motion.div
        variants={cardAnimation}
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="h-full"
        ref={ref}
      >
        <div className={cn(cardVariants({ gradient }), className)} {...props}>
          {/* Decorative background graphic */}
          <motion.img
            src={imageUrl}
            alt={`${title} graphic`}
            variants={imageAnimation}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="absolute -right-8 -bottom-8 w-44 h-44 object-contain opacity-40 pointer-events-none"
          />

          {/* Content Layer */}
          <div className="z-10 flex flex-col h-full justify-between">
            <div>
              {/* Badge */}
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-slate-200 border border-slate-700/50 backdrop-blur-md w-fit">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: badgeColor }}
                />
                {badgeText}
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-white mb-1.5">{title}</h3>
              <p className="text-xs text-slate-300/90 leading-relaxed max-w-xs">
                {description}
              </p>
            </div>

            {/* Action Link */}
            <a
              href={ctaHref}
              onClick={(e) => {
                if (onCtaClick) {
                  e.preventDefault();
                  onCtaClick();
                }
              }}
              className="group mt-5 inline-flex items-center gap-2 text-xs font-bold text-slate-100 hover:text-white transition-colors"
            >
              {ctaText}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 text-slate-300" />
            </a>
          </div>
        </div>
      </motion.div>
    );
  }
);

GradientCard.displayName = "GradientCard";

export { GradientCard, cardVariants };