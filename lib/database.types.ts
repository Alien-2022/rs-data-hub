// Supabase 数据库类型定义
// 根据 schema.sql 生成

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      datasets: {
        Row: {
          id: string;
          name: string;
          description: string;
          task_types: string[];
          data_modality: string;
          domain: string;
          image_count: number | null;
          storage_size: string;
          storage_bytes: number | null;
          publisher: string;
          publish_year: number;
          license: string | null;
          download_url: string;
          paper_url: string | null;
          project_url: string | null;
          doi: string | null;
          sensor_name: string | null;
          spatial_resolution: string | null;
          spectral_bands: number | null;
          created_at: string;
          updated_at: string;
          source_platform: string | null;
          external_id: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          task_types: string[];
          data_modality: string;
          domain?: string;
          image_count?: number | null;
          storage_size: string;
          storage_bytes?: number | null;
          publisher: string;
          publish_year: number;
          license?: string | null;
          download_url: string;
          paper_url?: string | null;
          project_url?: string | null;
          doi?: string | null;
          sensor_name?: string | null;
          spatial_resolution?: string | null;
          spectral_bands?: number | null;
          created_at?: string;
          updated_at?: string;
          source_platform?: string | null;
          external_id?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          task_types?: string[];
          data_modality?: string;
          domain?: string;
          image_count?: number | null;
          storage_size?: string;
          storage_bytes?: number | null;
          publisher?: string;
          publish_year?: number;
          license?: string | null;
          download_url?: string;
          paper_url?: string | null;
          project_url?: string | null;
          doi?: string | null;
          sensor_name?: string | null;
          spatial_resolution?: string | null;
          spectral_bands?: number | null;
          created_at?: string;
          updated_at?: string;
          source_platform?: string | null;
          external_id?: string | null;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          created_at?: string;
        };
      };
      dataset_tags: {
        Row: {
          dataset_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          dataset_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: {
          dataset_id?: string;
          tag_id?: string;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
