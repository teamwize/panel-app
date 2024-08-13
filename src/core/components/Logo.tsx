import logo from '../../assets/logo.svg';

type LogoProps = {
  className: string
}

export default function Logo({ className }: LogoProps) {
  return (<img alt="Logo" className={className} src={logo} />);
}