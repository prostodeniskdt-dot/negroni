import Image from 'next/image';

type BrandLogoProps = {
  tone: 'red' | 'white';
  size: 'header' | 'hero' | 'footer';
  className?: string;
  priority?: boolean;
};

export default function BrandLogo({ tone, size, className = '', priority = false }: BrandLogoProps) {
  const white = tone === 'white';

  return (
    <Image
      src={white ? '/images/logo/logoblack.png' : '/images/logo/logored.png'}
      alt=""
      width={2876}
      height={868}
      priority={priority}
      className={`brand-logo brand-logo--${size} ${white ? 'brand-logo--white' : ''} ${className}`}
    />
  );
}
