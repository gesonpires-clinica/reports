import { z } from "zod";

export const templateSchema = z.object({
  title: z.string().min(1, "O título é obrigatório").max(100, "O título deve ter no máximo 100 caracteres"),
  content: z.string().min(1, "O conteúdo é obrigatório"),
  category: z.string().min(1, "A categoria é obrigatória"),
  description: z.string().optional(),
});

export type TemplateFormData = z.infer<typeof templateSchema>; 