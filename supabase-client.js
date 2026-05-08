import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Ganti dengan credentials dari Supabase project Anda
const SUPABASE_URL = 'https://xmtbqkrwfvjumbsukwpg.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdGJxa3J3ZnZqdW1ic3Vrd3BnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMTYwNDAsImV4cCI6MjA5Mzc5MjA0MH0.q-lwmuHnDzMWkKud9Ux5fwdd_Zaq9lTuHsdSWgQQvJE'

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)

// ==============================
// SANITIZE FILENAME
// ==============================

function sanitizeFileName(fileName) {
  return fileName
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '')
}

// ==============================
// PROJECT API
// ==============================

export const projectAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(project) {
    const { error } = await supabase
      .from('projects')
      .insert([project])

    if (error) throw error

    return true
  },

  async update(id, updates) {
    const { error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)

    if (error) throw error

    return true
  },

  async delete(id) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error

    return true
  }
}

// ==============================
// CERTIFICATE API
// ==============================

export const certificateAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return data
  },

  async create(cert) {
    const { error } = await supabase
      .from('certificates')
      .insert([cert])

    if (error) throw error

    return true
  },

  async update(id, updates) {
    const { error } = await supabase
      .from('certificates')
      .update(updates)
      .eq('id', id)

    if (error) throw error

    return true
  },

  async delete(id) {
    const { error } = await supabase
      .from('certificates')
      .delete()
      .eq('id', id)

    if (error) throw error

    return true
  }
}

// ==============================
// CV FILE API
// ==============================

export const cvAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('cv_files')
      .select('*')
      .order('uploaded_at', { ascending: false })

    if (error) throw error

    return data || []
  },

  async create(cvFile) {
    const { error } = await supabase
      .from('cv_files')
      .insert([cvFile])

    if (error) throw error

    return true
  },

  async delete(id) {
    const { error } = await supabase
      .from('cv_files')
      .delete()
      .eq('id', id)

    if (error) throw error

    return true
  }
}

// ==============================
// FILE UPLOAD
// ==============================

export const uploadFile = async (
  bucket,
  file,
  folder = ''
) => {
  const cleanName = sanitizeFileName(file.name)

  const fileName = folder
    ? `${folder}/${Date.now()}_${cleanName}`
    : `${Date.now()}_${cleanName}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file)

  if (error) throw error

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)

  return data.publicUrl
}

// ==============================
// DELETE FILE
// ==============================

export const deleteFile = async (
  bucket,
  fileUrl
) => {
  const urlParts = fileUrl.split('/')

  const bucketIndex =
    urlParts.indexOf(bucket)

  if (bucketIndex === -1) {
    return false
  }

  const filePath = urlParts
    .slice(bucketIndex + 1)
    .join('/')

  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath])

  if (error) throw error

  return true
}