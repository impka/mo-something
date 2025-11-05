export interface MoVid {
    id: string; // uuid
    title: string;
    prompt: string; 
    durationSeconds: number;
    resolution: "480p" | "720p" | "1080p";
    generatedPreviewUrl?: string;
    createdAt: string; 
    lastModified?: string;
    tags?: string[];
    status?: "placeholder" | "queued" | "completed" | "failed";
}
  
export interface MoVidFile {
    movids: Movid[];
}
  