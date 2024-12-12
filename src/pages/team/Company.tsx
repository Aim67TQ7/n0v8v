import { Card } from "@/components/ui/card";
import { CompanyForm } from "@/components/company/CompanyForm";
import { CompanyHeader } from "@/components/company/CompanyHeader";
import { CompanyIntro } from "@/components/company/CompanyIntro";
import { useCompanyDetails } from "@/hooks/use-company-details";

const Company = () => {
  const {
    formData,
    isEditing,
    isLoading,
    setIsEditing,
    handleSubmit,
    handleInputChange,
    handleSwitchChange,
    user
  } = useCompanyDetails();

  if (isLoading && user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CompanyHeader 
        isEditing={isEditing}
        onEditToggle={() => setIsEditing(!isEditing)}
        isAuthenticated={!!user}
      />

      {!user && <CompanyIntro />}

      <Card className="p-6">
        <CompanyForm
          formData={formData}
          isEditing={isEditing}
          onEdit={() => setIsEditing(!isEditing)}
          onSubmit={handleSubmit}
          onChange={handleInputChange}
          onSwitchChange={handleSwitchChange}
        />
      </Card>
    </div>
  );
};

export default Company;