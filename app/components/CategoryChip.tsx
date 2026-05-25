import { CATEGORY_COLORS } from '@/app/lib/categoryMap';

interface Props {
  category: string;
  count?: number;
}

export default function CategoryChip({ category, count }: Props) {
  const colors = CATEGORY_COLORS[category] ?? CATEGORY_COLORS['행정'];
  const label = count && count > 1 ? `${category} ${count}` : category;

  return (
    <span
      className="text-[14px] font-medium leading-[20px] px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: colors.bg, color: colors.text }}
    >
      {label}
    </span>
  );
}
