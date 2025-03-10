"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// constants
import { getStatusIcon } from "@/constants/statuses";

// types
import { Question } from "@/types/types";

// lib
import fetchSavedQuestions from "@/lib/fetchSavedQuestions";

// components
import QuestionListSkeleton from "@/components/skeletons/QuestionListSkeleton";
import QuestionsHeader from "@/components/shared/QuestionsHeader";
import RemoveQuestionButton from "./RemoveQuestionButton";

// 3rd party
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface SavedQuestionListProps {
  savedQuestionsLoading: boolean;
  savedQuestionsError: boolean;
  savedQuestions: Question[];
}

export default function SavedQuestionListWrapper() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && !userId) router.push("/pages/signin");
  }, [status, userId, router]);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["saved-questions", userId],
    queryFn: () => fetchSavedQuestions(userId),
    enabled: !!userId,
  });

  const savedQuestions = data?.savedQuestions || [];

  if (status === "loading") {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    );
  }

  return (
    <SavedQuestionList
      savedQuestionsLoading={isLoading}
      savedQuestionsError={isError}
      savedQuestions={savedQuestions}
    />
  );
}

function SavedQuestionList({
  savedQuestionsLoading,
  savedQuestionsError,
  savedQuestions,
}: SavedQuestionListProps) {
  if (savedQuestionsLoading) {
    return <QuestionListSkeleton text="Saved Questions" />;
  }

  if (savedQuestionsError) {
    return (
      <p className="mt-8 text-center text-red-600 text-xl">
        Failed to fetch saved questions! Refresh the page or check your internet
        connection.
      </p>
    );
  }

  if (savedQuestions.length === 0) {
    return <p className="text-xl mt-8">No saved questions found!</p>;
  }

  return (
    <div>
      <QuestionsHeader text="Saved Questions" />
      <div>
        {savedQuestions.map(({ id, qNo, status, topicName, difficulty }) => {
          const StatusIcon = getStatusIcon(status);

          // Define colors statically
          let statusIconColor = "";

          if (status === "TODO") {
            statusIconColor = "text-primary";
          } else if (status === "SOLVED") {
            statusIconColor = "text-emerald-700";
          } else if (status === "ATTEMPTED") {
            statusIconColor = "text-orange-600";
          }

          // Define colors statically
          let difficultyTextColor = "";

          if (difficulty === "EASY") {
            difficultyTextColor = "text-teal-700";
          } else if (difficulty === "MEDIUM") {
            difficultyTextColor = "text-yellow-700";
          } else if (difficulty === "HARD") {
            difficultyTextColor = "text-red-600";
          }

          return (
            <div
              key={id}
              className="border-b w-full p-4 sm:p-6 flex flex-row justify-between sm:justify-normal"
            >
              <div className="w-full flex sm:items-center flex-col-reverse sm:flex-row justify-between sm:justify-normal">
                {/* Status */}
                <span className="sm:w-[calc(42.85px+2rem)] flex items-center">
                  {StatusIcon && (
                    <StatusIcon className={`text-xl mr-2 ${statusIconColor}`} />
                  )}
                </span>

                {/* Topic */}
                <div className="sm:w-full">
                  <div className="w-fit flex items-cente">
                    <span className="mr-2">{qNo}.</span>
                    <Link
                      href={`/pages/questions/${id}`}
                      className="text-blue-700 underline"
                    >
                      {topicName}
                    </Link>
                  </div>
                </div>
              </div>

              <div className="sm:mt-0 flex flex-col sm:flex-row items-end sm:items-center justify-between sm:justify-normal">
                {/* Difficulty */}
                <span
                  className={`sm:w-[calc(64.81px+2rem)] flex justify-end ${difficultyTextColor}`}
                >
                  {difficulty.charAt(0) + difficulty.substring(1).toLowerCase()}
                </span>

                <span className="sm:w-[calc(34.55px+2rem)] flex justify-end">
                  <RemoveQuestionButton questionId={id} marginTop="mt-6" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
