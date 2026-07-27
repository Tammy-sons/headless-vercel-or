'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { addItem } from 'components/cart/actions';
import LoadingDots from 'components/loading-dots';
import { VercelProductVariant as ProductVariant } from 'lib/bigcommerce/types';
import { useSearchParams } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton({
  availableForSale,
  selectedVariantId
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  const { pending } = useFormStatus();

  const buttonClasses = "relative flex w-full items-center justify-center rounded-full p-4 tracking-wide text-white transition-all hover:shadow-[0_10px_20px_rgba(40,94,44,0.3)] hover:-translate-y-0.5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 font-bold shadow-lg overflow-hidden capitalize";
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';
  const gradientStyle = { backgroundImage: 'linear-gradient(to right, #4e6c25 0%, #254518 51%, #254518 100%)' };

  if (!availableForSale) {
    return (
      <button
        aria-disabled
        className={clsx(buttonClasses, disabledClasses)}
        style={gradientStyle}
      >
        Out of stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        aria-disabled
        className={clsx(buttonClasses, disabledClasses)}
        style={gradientStyle}
      >
        <div className="absolute left-6 flex items-center justify-center">
          <PlusIcon className="h-5 w-5" />
        </div>
        <span>Add to cart</span>
      </button>
    );
  }

  return (
    <button
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
      aria-label="Add to cart"
      aria-disabled={pending}
      className={clsx(buttonClasses, {
        'hover:opacity-90': true,
        [disabledClasses]: pending
      })}
      style={gradientStyle}
    >
      <div className="absolute left-6 flex items-center justify-center">
        {pending ? (
          <LoadingDots className="mb-3 bg-white" />
        ) : (
          <PlusIcon className="h-5 w-5" />
        )}
      </div>
      <span>Add to cart</span>
    </button>
  );
}

export function AddToCart({
  variants,
  availableForSale,
  quantity = 1
}: {
  variants: ProductVariant[];
  availableForSale: boolean;
  quantity?: number;
}) {
  const [message, formAction] = useFormState(addItem, null);
  const searchParams = useSearchParams();

  // Build a map of option name -> distinct values across all variants
  const optionValueMap = variants.reduce<Record<string, Set<string>>>((acc, variant) => {
    variant.selectedOptions.forEach((option) => {
      const key = option.name.toLowerCase();
      if (!acc[key]) acc[key] = new Set();
      acc[key].add(option.value);
    });
    return acc;
  }, {});

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every((option) => {
      const key = option.name.toLowerCase();
      const paramValue = searchParams.get(key);

      // If this option only has one possible value, treat it as auto-selected
      if (optionValueMap[key]?.size === 1) {
        return true;
      }

      return option.value === paramValue;
    })
  );

  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const defaultProductId = variants.length === 1 ? variants[0]?.parentId : undefined;

  const selectedVariantId = variant?.id || defaultVariantId;
  const selectedProductId = variant?.parentId || defaultProductId;
  const actionWithVariant = formAction.bind(null, { selectedProductId, selectedVariantId, quantity });

  return (
    <form action={actionWithVariant}>
      <SubmitButton availableForSale={availableForSale} selectedVariantId={selectedVariantId} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}