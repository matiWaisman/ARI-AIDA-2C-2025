import MenuOption from "./menu_option";

type MenuProps = {
  options: Map<string, [string, string]>;
};

export default function Menu({ options }: MenuProps) {
  return (
    <div className="text-center">
      <div className="space-y-3 max-w-md mx-auto">
        {Array.from(options.values()).map(([href, desc]) => (
          <MenuOption key={href} href={href} description={desc} />
        ))}
      </div>
    </div>
  );
}
