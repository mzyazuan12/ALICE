import * as z from "zod";

// ============================================================
// USER
// ============================================================
export const SignupValidation = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});

// ============================================================
// POST
// ============================================================
export const PostValidation = z.object({
  caption: z.string().min(5, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 characters" }),
  file: z.custom<File[]>((val) => {
    return Array.isArray(val) && val.length > 0;
  }, "File is required")
    .refine((files: File[]) => {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
      const allowedTypes = [...validImageTypes, ...validVideoTypes];
      
      return files.every((file) => allowedTypes.includes(file.type));
    }, "Only images (.jpg, .jpeg, .png, .gif, .webp) and videos (.mp4, .webm, .mov) are accepted")
    .refine((files: File[]) => {
      const maxSize = 100 * 1024 * 1024; // 100MB
      return files.every((file) => file.size <= maxSize);
    }, "File size should be less than 100MB"),
  location: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 1000 characters." }),
  tags: z.string(),
});