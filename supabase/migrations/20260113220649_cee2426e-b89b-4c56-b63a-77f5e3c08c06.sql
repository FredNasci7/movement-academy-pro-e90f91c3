-- Add admin-only INSERT policy for posts
CREATE POLICY "Admins can insert posts"
ON public.posts
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add admin-only UPDATE policy for posts
CREATE POLICY "Admins can update posts"
ON public.posts
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add admin-only DELETE policy for posts
CREATE POLICY "Admins can delete posts"
ON public.posts
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));