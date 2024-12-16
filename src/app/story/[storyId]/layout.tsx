'use client';

import { useStoryStore } from "@/store/story";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { AuthNavbar } from "@/components/layout/auth-navbar";

export default function StoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { storyId } = useParams();
  const setStoryId = useStoryStore(state => state.setStoryId);

  useEffect(() => {
    if (typeof storyId === 'string') {
      setStoryId(storyId);
    }
  }, [storyId, setStoryId]);

  return (
    <div className="min-h-screen bg-background">
      <AuthNavbar />
      {children}
    </div>
  );
}
