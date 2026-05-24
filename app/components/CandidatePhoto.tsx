interface Props {
  imgUrl?: string;
  name: string;
  className?: string;
}

export default function CandidatePhoto({ imgUrl, name, className = '' }: Props) {
  if (imgUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imgUrl}
        alt={name}
        className={`object-cover object-top ${className}`}
      />
    );
  }

  return (
    <div className={`bg-canvas-soft flex items-center justify-center ${className}`}>
      <span className="text-[20px] font-bold leading-[28px] text-body select-none">
        {name.charAt(0)}
      </span>
    </div>
  );
}
