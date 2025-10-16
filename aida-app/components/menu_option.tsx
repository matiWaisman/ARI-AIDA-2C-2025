type MenuOptionProps = {
  href: string;
  description: string;
};

export default function MenuOption({ href, description }: MenuOptionProps) {
  return (
    <p>
      <a
        href={href}
        className="block w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-left text-brand hover:bg-gray-50 hover:border-brand transition-colors"
      >
        {description}
      </a>
    </p>
  );
}
