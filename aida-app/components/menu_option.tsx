type MenuOptionProps = {
  href: string;
  description: string;
};

export default function MenuOption({ href, description }: MenuOptionProps) {
  return (
    <p>
      <a href={href}>{description}</a>
    </p>
  );
}
