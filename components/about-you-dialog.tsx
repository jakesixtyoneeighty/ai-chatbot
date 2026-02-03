"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserProfile {
  name?: string | null;
  sex?: string | null;
  age?: string | null;
  location?: string | null;
  nudismExperience?: string | null;
  bio?: string | null;
}

const experienceOptions = [
  { value: "none", label: "Brand new to this - just curious! 🌱" },
  { value: "new", label: "Dipped my toes in the waters 🌊" },
  { value: "intermediate", label: "Finding my comfort zone ☀️" },
  { value: "experienced", label: "Seasoned sun-worshipper 🌞" },
  { value: "expert", label: "Lifelong naturist 🏖️" },
];

const sexOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

export function AboutYouDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    sex: "",
    age: "",
    location: "",
    nudismExperience: "",
    bio: "",
  });

  useEffect(() => {
    if (open) {
      fetchProfile();
    }
  }, [open]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile({
          name: data.name || "",
          sex: data.sex || "",
          age: data.age || "",
          location: data.location || "",
          nudismExperience: data.nudismExperience || "",
          bio: data.bio || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        toast.success("Profile saved! Your chat experience is now personalized.");
        setOpen(false);
      } else {
        toast.error("Failed to save profile. Please try again.");
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const bioLength = profile.bio?.length || 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          aria-label="About You"
          className="h-10 w-10"
          size="icon"
          type="button"
          variant="ghost"
        >
          <User className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Tell Us About Yourself!</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Help us personalize your chat experience. Share as much or as little
            as you&apos;d like — everything here is completely optional and only
            used to make conversations feel more natural.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">What should we call you?</Label>
            <Input
              id="name"
              placeholder="Your name or nickname"
              value={profile.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sex">How do you identify?</Label>
            <Select
              value={profile.sex || ""}
              onValueChange={(value) => handleChange("sex", value)}
            >
              <SelectTrigger id="sex">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {sexOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="age">How old are you?</Label>
            <Input
              id="age"
              placeholder="Your age"
              value={profile.age || ""}
              onChange={(e) => handleChange("age", e.target.value)}
              maxLength={10}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Where are you located?</Label>
            <Input
              id="location"
              placeholder="City, state, or region"
              value={profile.location || ""}
              onChange={(e) => handleChange("location", e.target.value)}
              maxLength={200}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="experience">Your journey with naturism</Label>
            <Select
              value={profile.nudismExperience || ""}
              onValueChange={(value) => handleChange("nudismExperience", value)}
            >
              <SelectTrigger id="experience">
                <SelectValue placeholder="Where are you on your journey?" />
              </SelectTrigger>
              <SelectContent>
                {experienceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio">
              Anything else you&apos;d like us to know?
            </Label>
            <Textarea
              id="bio"
              placeholder="Share a bit about yourself, your interests, or why you're here..."
              value={profile.bio || ""}
              onChange={(e) => handleChange("bio", e.target.value)}
              maxLength={500}
              className="min-h-[100px] resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {bioLength}/500 characters
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
          <p>
            🔒 <strong>Privacy Note:</strong> All of this is optional. Your
            information is only used to personalize your chat experience and is
            never shared with third parties.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
