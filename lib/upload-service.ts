"use server"

import { supabaseAdmin } from "./supabase"
import { createHash } from "crypto"

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
  publicUrl?: string
}

// Generate unique filename
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(7)
  const extension = originalName.split('.').pop()
  const hash = createHash('md5').update(`${timestamp}-${randomString}`).digest('hex').substring(0, 8)
  return `${timestamp}-${hash}.${extension}`
}

// Validate file type and size
function validateFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: '不支持的文件類型。請上傳 JPG, PNG, GIF 或 WebP 圖片。' }
  }

  if (file.size > maxSize) {
    return { valid: false, error: '文件大小不能超過 5MB' }
  }

  return { valid: true }
}

// Upload file to Supabase Storage
export async function uploadFile(file: File, bucket: string = 'quote-photos'): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Generate unique filename
    const filename = generateUniqueFilename(file.name)
    const filePath = `quotes/${new Date().getFullYear()}/${filename}`

    // Convert File to ArrayBuffer then to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      console.error('上傳錯誤:', error)
      return { success: false, error: '文件上傳失敗' }
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return {
      success: true,
      url: data.path,
      publicUrl: urlData.publicUrl
    }
  } catch (error) {
    console.error('文件上傳錯誤:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '文件上傳過程中發生錯誤'
    }
  }
}

// Upload multiple files
export async function uploadMultipleFiles(files: File[], bucket: string = 'quote-photos'): Promise<{
  success: boolean
  urls: string[]
  errors: string[]
}> {
  const urls: string[] = []
  const errors: string[] = []

  const uploadPromises = files.map(async (file) => {
    const result = await uploadFile(file, bucket)
    if (result.success && result.publicUrl) {
      urls.push(result.publicUrl)
    } else {
      errors.push(result.error || '未知錯誤')
    }
  })

  await Promise.all(uploadPromises)

  return {
    success: errors.length === 0,
    urls,
    errors
  }
}

// Delete file from storage
export async function deleteFile(filePath: string, bucket: string = 'quote-photos'): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([filePath])

    if (error) {
      console.error('刪除文件錯誤:', error)
      return { success: false, error: '刪除文件失敗' }
    }

    return { success: true }
  } catch (error) {
    console.error('刪除文件錯誤:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '刪除文件過程中發生錯誤'
    }
  }
}

// Create storage bucket if it doesn't exist (run once during setup)
export async function createStorageBucket(bucketName: string = 'quote-photos'): Promise<{
  success: boolean
  error?: string
}> {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabaseAdmin.storage.listBuckets()
    
    if (buckets?.find(b => b.name === bucketName)) {
      return { success: true }
    }

    // Create bucket
    const { error } = await supabaseAdmin.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    })

    if (error) {
      console.error('創建存儲桶錯誤:', error)
      return { success: false, error: '創建存儲桶失敗' }
    }

    return { success: true }
  } catch (error) {
    console.error('創建存儲桶錯誤:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '創建存儲桶過程中發生錯誤'
    }
  }
}

// Get signed URL for private files (if needed)
export async function getSignedUrl(filePath: string, bucket: string = 'quote-photos', expiresIn: number = 3600): Promise<{
  success: boolean
  signedUrl?: string
  error?: string
}> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn)

    if (error) {
      console.error('獲取簽名URL錯誤:', error)
      return { success: false, error: '獲取簽名URL失敗' }
    }

    return {
      success: true,
      signedUrl: data.signedUrl
    }
  } catch (error) {
    console.error('獲取簽名URL錯誤:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '獲取簽名URL過程中發生錯誤'
    }
  }
} 