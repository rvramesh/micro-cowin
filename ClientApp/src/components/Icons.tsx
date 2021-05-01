import * as Icons from "../icons";

type IconProps = React.SVGProps<SVGSVGElement> & {
  title?: string | undefined;
} & {
  icon: keyof typeof Icons;
};

function Icon({ icon, ...rest }: IconProps) {
  const Icon = Icons[icon];
  return <Icon {...rest} />;
}

export default Icon;
