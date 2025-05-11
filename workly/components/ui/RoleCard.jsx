import { cn } from "@/lib/utils";

const RoleCard = ({ 
  title, 
  description, 
  icon, 
  isSelected, 
  onClick 
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "border rounded-lg p-6 cursor-pointer transition-all",
        "hover:border-primary hover:bg-primary/5",
        isSelected ? "border-primary bg-primary/5" : "border-gray-200"
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "p-3 rounded-full",
            isSelected ? "bg-primary text-primary-foreground" : "bg-gray-100"
          )}
        >
          {icon}
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default RoleCard;