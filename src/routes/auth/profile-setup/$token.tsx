import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { ArrowRight, ArrowLeft, Wallet, PiggyBank, LineChart, Camera, Upload } from "lucide-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Logo from "../../dashboard/-index-components/Logo";
import { useValidation } from "../../../utils/hooks/useValidation/useValidation";
import Validator from "../../../utils/hooks/useValidation/Validator";
import VALIDATIONS from "../../../utils/hooks/useValidation";
import { useUserDetails } from "../../../context/UserDetails";
import CachedSelect from "../../../components/reusable/selects/CachedSelect";
import CustomInput from "../../../components/reusable/inputs/CustomInput";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { setupUserProfile } from "../../../utils/actions/users/profileSetupSessions";
import { toast } from "sonner";

const steps = [
  { id: 1, title: "Personal Info" },
  { id: 2, title: "Details" },
  { id: 3, title: "Preferences" },
];

const fieldGroups: Record<number, string[]> = {
  0: ["username", "firstName", "lastName", "bio"],
  1: ["dateOfBirth", "statusMessage", "avatarUrl"],
  2: ["preferredStartDayOfMonth", "themePreference", "preferredCurrency"],
};

export const Route = createFileRoute("/auth/profile-setup/$token")({
  component: ProfileSetup,
});

export default function ProfileSetup() {
  const { token } = Route.useParams();
  const { validateProfileSetupSession, user, setUser } = useUserDetails();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isValidatingSession, setIsValidatingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const { values, onChangeInput, handleCheckFormErrors, onChangeValue, errors } =
    useValidation(
      new Validator()
        .forProperty("username", "")
        .check(VALIDATIONS.isRequired, "Username is required.")
        .check(VALIDATIONS.minLength(3), "Username must be at least 3 characters.")
        .check(
          VALIDATIONS.isText,
          "Username can only contain letters, numbers and special characters."
        )
        .forProperty("firstName", "")
        .check(VALIDATIONS.isRequired, "First name is required.")
        .check(VALIDATIONS.minLength(2), "First name must be at least 2 characters.")
        .forProperty("lastName", "")
        .check(VALIDATIONS.isRequired, "Last name is required.")
        .check(VALIDATIONS.minLength(2), "Last name must be at least 2 characters.")
        .forProperty("bio", "")
        .check(VALIDATIONS.isRequired, "Bio is required.")
        .check(VALIDATIONS.maxLength(500), "Bio must be less than 500 characters.")
        .forProperty("dateOfBirth", "")
        .check(VALIDATIONS.isRequired, "Date of birth is required.")
        .forProperty("statusMessage", "")
        .check(
          VALIDATIONS.maxLength(255),
          "Status message must be less than 255 characters."
        )
        .forProperty("avatarUrl", "")
        .forProperty("preferredStartDayOfMonth", "1")
        .check(
          (value: string) => {
            const day = Number(value);
            return !Number.isNaN(day) && day >= 1 && day <= 15;
          },
          "Day must be between 1 and 15."
        )
        .forProperty("themePreference", "system")
        .check(VALIDATIONS.isRequired, "Theme preference is required.")
        .forProperty("preferredCurrency", "")
        .check(VALIDATIONS.isRequired, "Preferred currency is required.")
        
    );

  useEffect(() => {
    let isMounted = true;
    setIsValidatingSession(true);
    validateProfileSetupSession(token)
      .then(() => {
        if (isMounted) {
          setIsValidatingSession(false);
        }
      })
      .catch(() => {
        window.location.href = "/auth/login";
      })
      .finally(() => {
        if (isMounted) {
          setIsValidatingSession(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token, validateProfileSetupSession]);

  useEffect(() => {
    if (values.avatarUrl) {
      setAvatarPreview(values.avatarUrl);
    }
  }, [values.avatarUrl]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", values.themePreference ?? "system");
    return () => {
      root.removeAttribute("data-theme");
    };
  }, [values.themePreference]);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setAvatarPreview(reader.result);
        onChangeValue("avatarUrl", reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const nextStep = async () => {
    const fieldsToCheck = fieldGroups[currentStep] ?? [];
    if (handleCheckFormErrors(fieldsToCheck)) {
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Last step - submit the profile
      setIsSubmitting(true);
      try {
        const { message } = await setupUserProfile(token, {
          username: values.username,
          firstName: values.firstName,
          lastName: values.lastName,
          bio: values.bio,
          dateOfBirth: values.dateOfBirth,
          statusMessage: values.statusMessage || undefined,
          avatarUrl: values.avatarUrl || undefined,
          preferredStartDayOfMonth: Number(values.preferredStartDayOfMonth),
          themePreference: values.themePreference as "light" | "dark" | "system",
          preferredCurrency: values.preferredCurrency,
        });
        
        // Update UserDetails context - set hasProfile to true
        if (user) {
          setUser({
            ...user,
            hasProfile: true,
          });
        }
        
        toast.success(message);
        navigate({ to: "/dashboard" });
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to create profile. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const hasErrorsOnCurrentStep = (fieldGroups[currentStep] ?? []).some((field) => {
    const errorValue = errors[field];
    console.log(errorValue);
    return typeof errorValue === "string" && errorValue.trim().length > 0;
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid grid-cols-2 gap-x-4 space-y-6">
            <div className="space-y-1 col-span-2">
              <Label htmlFor="username" className="text-foreground font-medium">
                Username
              </Label>
              <div className="flex rounded-[12px] border border-border overflow-hidden">
                <span className="inline-flex items-center px-4 bg-muted text-muted-foreground text-sm">
                  finovora/
                </span>
                <Input
                  id="username"
                  name="username"
                  placeholder="janesmith"
                  value={values.username}
                  onChange={onChangeInput}
                  className="rounded-[10px] rounded-l-none bg-background border-0 focus:ring-0 focus-visible:ring-0"
                />
              </div>
              {errors.username && (
                <p className="text-xs text-destructive">{errors.username}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="firstName" className="text-foreground font-medium">
                First Name
              </Label>
              <CustomInput
                errorMessage={errors.firstName}
                id="firstName"
                name="firstName"
                placeholder="Jane"
                value={values.firstName}
                onChange={onChangeInput}
                className="bg-background border-border focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName" className="text-foreground font-medium">
                Last Name
              </Label>
              <CustomInput
                errorMessage={errors.lastName}
                id="lastName"
                name="lastName"
                placeholder="Smith"
                value={values.lastName}
                onChange={onChangeInput}
                className="bg-background border-border focus:border-primary focus:ring-primary"
              />
             
            </div>
            <div className="col-span-2 space-y-1">
              <Label htmlFor="bio" className="text-foreground font-medium">
                Short Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell us a bit about yourself..."
                rows={4}
                maxLength={200}
                value={values.bio}
                onChange={onChangeInput}
                className={`bg-background border-border focus:border-primary focus:ring-primary resize-none ${errors.bio ? "border-error focus-visible:ring-error-600 focus-visible:border-error" : ""}`}
              />
              {errors.bio && (
                <span className="flex items-center gap-1">
                <ExclamationCircleIcon className="w-4 h-4 text-destructive" />
                <p className="text-xs text-destructive">{errors.bio}</p>
                </span>
              )}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label
                  htmlFor="dateOfBirth"
                  className="text-foreground font-medium"
                >
                  Date of Birth
                </Label>
                <CustomInput
                  errorMessage={errors.dateOfBirth}
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={values.dateOfBirth}
                  onChange={onChangeInput}
                  className="bg-background border-border focus:border-primary focus:ring-primary w-full"
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="statusMessage"
                  className="text-foreground font-medium"
                >
                  Status Message
                </Label>
                <Input
                  id="statusMessage"
                  name="statusMessage"
                  placeholder="Feeling optimistic about my finances!"
                  value={values.statusMessage}
                  onChange={onChangeInput}
                  className="bg-background border-border focus:border-primary focus:ring-primary"
                />
                {errors.statusMessage && (
                  <p className="text-xs text-destructive">
                    {errors.statusMessage}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-foreground font-medium">Profile Photo</Label>
              <div className="flex items-start gap-6">
                <div className="relative group">
                  <div className="h-28 w-28 rounded-[16px] bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-border overflow-hidden flex items-center justify-center shadow-sm transition-all duration-200 group-hover:border-primary/50 group-hover:shadow-md">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Uploaded avatar preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Camera className="w-8 h-8 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground font-medium">No photo</span>
                      </div>
                    )}
                  </div>
                  <div
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-[16px] flex items-center justify-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 space-y-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2 hover:bg-primary-200 hover:border-primary/50 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    {avatarPreview ? "Change photo" : "Upload photo"}
                  </Button>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Recommended: Square image, at least 400x400px
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Formats: JPG, JPEG or PNG (max 2MB)
                    </p>
                  </div>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label
                  htmlFor="preferredStartDayOfMonth"
                  className="text-foreground font-medium"
                >
                  Preferred Start Day of Month
                </Label>
                <CustomInput
                errorMessage={errors.preferredStartDayOfMonth}
                  id="preferredStartDayOfMonth"
                  name="preferredStartDayOfMonth"
                  type="number"
                  min={1}
                  max={31}
                  value={values.preferredStartDayOfMonth}
                  onChange={onChangeInput}
                  className="bg-background border-border focus:border-primary focus:ring-primary"
                  
                />
                <p className="text-xs text-muted-foreground">
                  Sets when your monthly budgets and reports reset.
                </p>
               
              </div>
              <div className="space-y-1">
                <Label className="text-foreground font-medium">
                  Theme Preference
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {["light", "dark", "system"].map((option) => (
                    <motion.button
                      key={option}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onChangeValue("themePreference", option)}
                      className={`px-3 py-2.5 rounded-[12px] border text-xs! capitalize ${
                        values.themePreference === option
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-background hover:border-primary/50"
                      }`}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="preferredCurrency"
                className="text-foreground font-medium"
              >
                Preferred Currency
              </Label>
              <CachedSelect
                entityName="currencies"
                placeholder="Select currency"
                name="preferredCurrency"
                onChange={(e: string) => onChangeValue("preferredCurrency", e)}
                defaultValue={values.preferredCurrency}
                errorMessage={errors.preferredCurrency}
                className="w-full"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isValidatingSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-4 py-12 text-center text-muted-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p>Validating your secure profile setup session…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-[10%] text-primary/10"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <LineChart className="w-16 h-16" />
      </motion.div>
      <motion.div
        className="absolute bottom-40 right-[15%] text-accent/10"
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <PiggyBank className="w-20 h-20" />
      </motion.div>
      <motion.div
        className="absolute top-1/3 right-[8%] text-primary/10"
        animate={{ y: [0, -15, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <Wallet className="w-12 h-12" />
      </motion.div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-12">
        <Logo />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-2xl"
        >
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome to Finovora!
            </h1>
            <p className="text-muted-foreground">
              We just need some basic info to get your profile setup.
              <br />
              You'll be able to edit this later.
            </p>
          </div>

          {/* Progress indicator */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3">
              Step {currentStep + 1} of {steps.length}
            </p>
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-1 flex-1 rounded-base transition-colors ${
                    index <= currentStep ? "bg-foreground" : "bg-border"
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1 }}
                />
              ))}
            </div>
          </div>

          {/* Form card */}
          <motion.div
            className="bg-card rounded-base border border-border p-8 shadow-sm"
            layout
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  className="flex-1 h-12"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <Button
                onClick={nextStep}
                disabled={hasErrorsOnCurrentStep || isSubmitting}
                className="flex-1 h-12 bg-foreground text-background hover:bg-foreground/90 disabled:bg-foreground/40 disabled:text-background/70"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                    Creating Profile...
                  </>
                ) : (
                  <>
                    {currentStep === steps.length - 1
                      ? "Complete Setup"
                      : "Next Step"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Skip option */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6 text-sm text-muted-foreground"
          >
            <button
              onClick={() => navigate({ to: "/dashboard" })}
              className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              Skip for now
            </button>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
