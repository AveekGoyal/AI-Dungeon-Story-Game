'use client';

import { useStoryStore } from "@/store/story";
import { useEffect } from "react";
import { useParams } from "next/navigation";

export default function ChapterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { chapterNumber } = useParams();
  const setCurrentChapter = useStoryStore(state => state.setCurrentChapter);

  useEffect(() => {
    if (typeof chapterNumber === 'string') {
      setCurrentChapter(parseInt(chapterNumber, 10));
    }
  }, [chapterNumber, setCurrentChapter]);

  return <>{children}</>;
}
