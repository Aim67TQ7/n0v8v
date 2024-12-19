interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => {
  return (
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      {subtitle && (
        <p className="mt-2 text-sm text-gray-600">
          {subtitle}
        </p>
      )}
    </div>
  );
};