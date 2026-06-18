
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Storage policies for blog-media (private bucket)
CREATE POLICY "Admins upload blog media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'blog-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update blog media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'blog-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete blog media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'blog-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins list blog media" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'blog-media' AND public.has_role(auth.uid(), 'admin'));
