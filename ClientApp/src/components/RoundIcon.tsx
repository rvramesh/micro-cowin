import classNames from 'classnames'

function RoundIcon({
  icon: Icon,
  iconColorClass = "text-purple-600 dark:text-purple-100",
  bgColorClass = "bg-purple-100 dark:bg-purple-600",
  className,
}: {
  icon: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  iconColorClass: string;
  bgColorClass: string;
  className: string;
}) {
  const baseStyle = "p-3 rounded-full";

  const cls = classNames(baseStyle, iconColorClass, bgColorClass, className);
  return (
    <div className={cls}>
      <Icon className="w-5 h-5" />
    </div>
  );
}

export default RoundIcon
