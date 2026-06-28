export interface WPPost {
  ID: number;
  Title: string;
  Slug: string;
  URL: string;
  "Published Date": string;
  "Modified Date": string;
  Author: string;
  Categories: string[];
  Tags: string[];
  "SEO Title": string;
  "Meta Description": string;
  "Focus Keyword": string;
  "Featured Image": string;
  "Gallery Images": { filename: string; original_url: string }[];
  Content: string;
  Excerpt: string;
  "Word Count": number;
  "Reading Time": string;
  "Custom Fields": Record<string, string>;
  Status: "publish" | "draft" | "pending" | "future";
}

export interface PluginFileNode {
  name: string;
  path: string;
  type: "file" | "directory";
  content?: string;
  children?: PluginFileNode[];
}

export interface PluginSettings {
  zip_compression: number;
  image_quality: number;
  max_execution_time: number;
  chunk_size: number;
  export_comments: boolean;
  export_drafts: boolean;
  export_revisions: boolean;
  export_attachments: boolean;
  aes_encryption: boolean;
  encryption_key: string;
  exclude_extensions: string[];
  exclude_folders: string[];
  schedule_enabled: boolean;
  schedule_interval: "daily" | "weekly" | "monthly";
  schedule_retention_limit: number;
}

export interface SystemLog {
  timestamp: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
}

export interface BackupHistoryEntry {
  timestamp: string;
  zip_name: string;
  posts_count: number;
  images_count: number;
  size: string;
  duration: string;
  status: "success" | "failed";
  blob_url?: string;
}
