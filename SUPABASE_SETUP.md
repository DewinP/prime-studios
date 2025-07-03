# Supabase Setup for File Upload

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

## 2. Set Up Environment Variables

Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Create Storage Bucket

In your Supabase dashboard:

1. Go to **Storage** in the sidebar
2. Click **Create a new bucket**
3. Name it `tracks` (this matches our configuration)
4. Set it to **Private** for security
5. Click **Create bucket**

## 4. Set Up Storage Policies

In the Supabase dashboard, go to **Storage > Policies** and add these policies:

### For the `tracks` bucket:

**Policy 1: Allow authenticated users to upload**

```sql
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

**Policy 2: Allow users to view their own files**

```sql
CREATE POLICY "Allow users to view own files" ON storage.objects
FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);
```

**Policy 3: Allow users to delete their own files**

```sql
CREATE POLICY "Allow users to delete own files" ON storage.objects
FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);
```

## 5. Update User ID in Upload Service

In `src/components/upload-track-modal.tsx`, replace the hardcoded user ID:

```ts
// Replace this line:
"user-id"; // TODO: Get actual user ID from auth

// With this:
session?.user?.id || "anonymous";
```

## 6. Test the Upload

1. Start your development server
2. Go to the dashboard
3. Click "Add New Track"
4. Fill in the form and upload an audio file
5. Check your Supabase storage bucket to see the uploaded file

## File Structure

Uploaded files will be stored as:

```
tracks/
  ├── user-id-1/
  │   ├── timestamp-randomstring.mp3
  │   └── timestamp-randomstring.wav
  └── user-id-2/
      └── timestamp-randomstring.flac
```

## Security Notes

- Files are stored in user-specific folders for isolation
- Signed URLs expire after 1 hour by default
- Only authenticated users can upload files
- Users can only access their own files
