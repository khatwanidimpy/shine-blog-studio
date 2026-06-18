
ALTER TABLE public.blogs ADD CONSTRAINT blogs_author_profile_fk
  FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
